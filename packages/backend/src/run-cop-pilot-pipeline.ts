import * as fs from 'fs';
import * as path from 'path';
import {
  GrantAnalysisAgent,
  FeasibilityAgent,
  ScientificWritingAgent,
  ReviewerAgent,
} from './agents';
import type {
  GrantAnalysisOutput,
  OrganizationInfo,
  FeasibilityEvaluation,
  ScientificContent,
  ReviewOutput,
  Language,
} from '@researcher/shared';
import {
  COP_PILOT_SYSTEM_PROMPT,
  createCopPilotWritingPrompt,
  createCopPilotReviewerPrompt,
} from './agents/prompts/cop-pilot.prompts';

const RESULTS_DIR = path.join(__dirname, '../../../results');
const OUTPUT_DIR = path.join(RESULTS_DIR, 'cop-pilot');
const MAX_ITERATIONS = 2;
const MIN_SCORE_PERCENTAGE = 60; // COP-PILOT threshold: 60/100

interface PipelineResults {
  grantAnalysis: GrantAnalysisOutput;
  feasibilityEvaluation: FeasibilityEvaluation;
  scientificProposal: ScientificContent;
  reviewResults: ReviewOutput;
  iterations: number;
  finalScore: number;
}

async function main() {
  console.log('=== COP-PILOT OC1 — SmartLoop Proposal Pipeline ===\n');
  console.log('Target: CL2 / OC#2.4 — Municipal Buildings Management (Valencia)\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Load inputs
  const grantText = loadFile(path.join(RESULTS_DIR, 'grant-text.txt'), 'Grant text');
  const organizationInfo = loadJson<OrganizationInfo>(
    path.join(RESULTS_DIR, 'organization-info-ald.json'),
    'Organization info (ALD)'
  );
  const businessContext = loadFile(path.join(RESULTS_DIR, 'business-context.txt'), 'Business context');

  console.log(`Organization: ${organizationInfo.name}`);
  console.log(`Business Context: ${businessContext.length} chars`);
  console.log(`Grant Text: ${grantText.length} chars\n`);

  try {
    const results = await runPipeline(grantText, organizationInfo, businessContext);
    saveResults(results);
    printSummary(results);
    console.log(`\n✓ Pipeline completed. Results saved to: ${OUTPUT_DIR}`);
  } catch (error) {
    console.error('\n✗ Pipeline failed:', error);
    process.exit(1);
  }
}

async function runPipeline(
  grantText: string,
  organizationInfo: OrganizationInfo,
  businessContext: string
): Promise<PipelineResults> {
  // Step 1: Grant Analysis
  console.log('Step 1/4: Analyzing COP-PILOT OC1 grant requirements...');
  const grantAnalysisAgent = new GrantAnalysisAgent();
  const analysisResult = await grantAnalysisAgent.execute({ grantText });

  if (!analysisResult.success || !analysisResult.data) {
    throw new Error(`Grant analysis failed: ${analysisResult.error?.message}`);
  }

  const grantAnalysis = analysisResult.data;
  console.log(`  ✓ Grant: ${grantAnalysis.grantTitle}`);
  console.log(`  ✓ Requirements: ${grantAnalysis.requirements.length}`);
  console.log(`  ✓ Criteria: ${grantAnalysis.evaluationCriteria.length}\n`);

  // Save intermediate result
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'grant-analysis.json'),
    JSON.stringify(grantAnalysis, null, 2),
    'utf-8'
  );

  // Step 2: Feasibility Evaluation
  console.log('Step 2/4: Evaluating feasibility for ALD + ZNU consortium...');
  const feasibilityAgent = new FeasibilityAgent();
  const feasibilityResult = await feasibilityAgent.execute({
    grantAnalysis,
    organizationInfo,
  });

  if (!feasibilityResult.success || !feasibilityResult.data) {
    throw new Error(`Feasibility evaluation failed: ${feasibilityResult.error?.message}`);
  }

  const feasibilityEvaluation = feasibilityResult.data;
  console.log(`  ✓ Success Chance: ${feasibilityEvaluation.overallChance}%`);
  console.log(`  ✓ Recommendation: ${feasibilityEvaluation.recommendation}\n`);

  // Save intermediate result
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'feasibility-evaluation.json'),
    JSON.stringify(feasibilityEvaluation, null, 2),
    'utf-8'
  );

  // Step 3: Iterative Proposal Generation and Review
  console.log('Step 3/4: Generating SmartLoop proposal (iterative)...');

  let scientificProposal: ScientificContent | null = null;
  let reviewResults: ReviewOutput | null = null;
  let iteration = 0;
  let scorePercentage = 0;

  const writingAgent = new ScientificWritingAgent();
  const reviewerAgent = new ReviewerAgent();

  while (iteration < MAX_ITERATIONS) {
    iteration++;
    console.log(`\n  Iteration ${iteration}/${MAX_ITERATIONS}:`);

    // Generate proposal with COP-PILOT prompts
    console.log('    Generating proposal...');
    const proposalResult = await writingAgent.execute({
      grantAnalysis,
      organizationInfo,
      feasibilityEvaluation,
      language: 'en',
      businessContext,
      systemPrompt: COP_PILOT_SYSTEM_PROMPT,
      promptFactory: createCopPilotWritingPrompt,
    });

    if (!proposalResult.success || !proposalResult.data) {
      throw new Error(`Proposal generation failed: ${proposalResult.error?.message}`);
    }

    scientificProposal = proposalResult.data;
    console.log('    ✓ Proposal generated');

    // Save proposal after each iteration
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `scientific-proposal-iter${iteration}.json`),
      JSON.stringify(scientificProposal, null, 2),
      'utf-8'
    );

    // Review proposal with COP-PILOT evaluation framework
    console.log('    Reviewing proposal...');
    const reviewResult = await reviewerAgent.execute({
      grantAnalysis,
      scientificProposal,
      systemPrompt: `You are an independent external expert reviewer evaluating proposals for COP-PILOT Open Call #1, targeting Cluster 2 (Smart Sustainable IoT Solutions, Valencia). You evaluate proposals against the three official criteria: Excellence (weight x8), Impact (weight x6), Implementation (weight x6). You have expertise in IoT, FIWARE, smart buildings, edge computing, and EU grant evaluation. Always respond with valid JSON.`,
      promptFactory: createCopPilotReviewerPrompt,
    });

    if (!reviewResult.success || !reviewResult.data) {
      throw new Error(`Proposal review failed: ${reviewResult.error?.message}`);
    }

    reviewResults = reviewResult.data;
    scorePercentage = Math.round(
      (reviewResults.overallScore / reviewResults.maxScore) * 100
    );

    console.log(`    ✓ Score: ${reviewResults.overallScore}/${reviewResults.maxScore} (${scorePercentage}%)`);
    console.log(`    ✓ Ready to Submit: ${reviewResults.readyToSubmit ? 'YES' : 'NO'}`);

    // Save review after each iteration
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `review-results-iter${iteration}.json`),
      JSON.stringify(reviewResults, null, 2),
      'utf-8'
    );

    // Check if score is acceptable
    if (scorePercentage >= MIN_SCORE_PERCENTAGE && reviewResults.readyToSubmit) {
      console.log(`\n  ✓ Proposal meets quality threshold (${MIN_SCORE_PERCENTAGE}%)`);
      break;
    }

    if (iteration < MAX_ITERATIONS) {
      console.log(`\n  ⚠ Score below threshold or not ready. Improving...`);
      const criticalIssues = reviewResults.weaknesses.filter(w => w.severity === 'critical');
      console.log(`    Critical Issues: ${criticalIssues.length}`);
      console.log(`    Missing Elements: ${reviewResults.missingElements.length}`);
    }
  }

  if (!scientificProposal || !reviewResults) {
    throw new Error('Failed to generate proposal and review');
  }

  console.log(`\n  Final score after ${iteration} iteration(s): ${scorePercentage}%\n`);

  return {
    grantAnalysis,
    feasibilityEvaluation,
    scientificProposal,
    reviewResults,
    iterations: iteration,
    finalScore: scorePercentage,
  };
}

function loadFile(filePath: string, label: string): string {
  if (!fs.existsSync(filePath)) {
    console.error(`Error: ${label} not found at ${filePath}`);
    process.exit(1);
  }
  return fs.readFileSync(filePath, 'utf-8');
}

function loadJson<T>(filePath: string, label: string): T {
  return JSON.parse(loadFile(filePath, label));
}

function saveResults(results: PipelineResults): void {
  // Save final results
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'scientific-proposal.json'),
    JSON.stringify(results.scientificProposal, null, 2),
    'utf-8'
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'review-results.json'),
    JSON.stringify(results.reviewResults, null, 2),
    'utf-8'
  );

  // Save proposal as markdown
  const markdown = generateCopPilotMarkdown(results.scientificProposal);
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'scientific-proposal.md'),
    markdown,
    'utf-8'
  );

  // Save pipeline summary
  const summary = {
    executedAt: new Date().toISOString(),
    pipeline: 'COP-PILOT OC1 — SmartLoop (CL2/OC#2.4)',
    grantTitle: results.grantAnalysis.grantTitle,
    organization: 'ALD Engineering & Construction LLC + ZNU',
    cluster: 'CL2 — Smart Sustainable IoT Solutions (Valencia)',
    challenge: 'OC#2.4 — Municipal Buildings Management',
    iterations: results.iterations,
    finalScore: results.finalScore,
    maxScore: results.reviewResults.maxScore,
    readyToSubmit: results.reviewResults.readyToSubmit,
    feasibilityChance: results.feasibilityEvaluation.overallChance,
    sectionScores: results.reviewResults.sectionScores,
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'pipeline-summary.json'),
    JSON.stringify(summary, null, 2),
    'utf-8'
  );
}

function generateCopPilotMarkdown(proposal: ScientificContent): string {
  const p = proposal;

  return `# SmartLoop — Closed-Loop Building Automation Service for Municipal Facility Management

**Cluster**: CL2 — Smart Sustainable IoT Solutions (Valencia)
**Challenge**: OC#2.4 — Municipal Buildings Management
**Consortium**: ALD Engineering & Construction LLC (Lead SME) + Zaporizhzhia National University (Research Partner)
**Duration**: 8 months + 2 months reporting | **Budget**: EUR 200,000

---

## Project Summary

${p.projectSummary || p.summary || ''}

---

## 1. Excellence

### 1.1.1 Concept and Objectives

${p.conceptAndObjectives || ''}

### 1.1.2 State of the Art and Innovation

${p.stateOfTheArt || ''}

### 1.1.3 Relevance to COP-PILOT Scope

${p.copPilotRelevance || ''}

### 1.1.4 Data Management

${p.dataManagement || ''}

### 1.2 Infrastructure Requirements

${p.infrastructureRequirements || ''}

---

## 2. Impact

### 2.1 Expected Impact and Sustainability

${p.expectedImpact || p.impact || ''}

### 2.2 Expected Outcomes

${p.expectedOutcomes || p.expectedResults || ''}

---

## 3. Quality and Efficiency of Implementation

### 3.1 Work Plan and Timeline

${p.workPlanAndTimeline || p.workPlan || ''}

### 3.2 Team Qualifications

${p.teamQualifications || p.consortiumQuality || ''}

### 3.3 Funding & Justification

${p.fundingJustification || p.costJustification || ''}

---

## References

${(p.bibliography || []).map((ref, idx) => `${idx + 1}. ${ref}`).join('\n')}
`;
}

function printSummary(results: PipelineResults): void {
  console.log('\n=== COP-PILOT PIPELINE SUMMARY ===\n');

  console.log('Grant: COP-PILOT Open Call #1');
  console.log('Cluster: CL2 — Smart Sustainable IoT Solutions (Valencia)');
  console.log('Challenge: OC#2.4 — Municipal Buildings Management');
  console.log('Consortium: ALD Engineering & Construction LLC + ZNU');

  console.log('\nFeasibility:');
  console.log(`  Success Chance: ${results.feasibilityEvaluation.overallChance}%`);
  console.log(`  Recommendation: ${results.feasibilityEvaluation.recommendation}`);

  console.log('\nProposal Quality:');
  console.log(`  Iterations: ${results.iterations}`);
  console.log(`  Final Score: ${results.reviewResults.overallScore}/${results.reviewResults.maxScore} (${results.finalScore}%)`);
  console.log(`  Ready to Submit: ${results.reviewResults.readyToSubmit ? 'YES ✓' : 'NO ✗'}`);

  if (results.reviewResults.sectionScores) {
    console.log('\n  Section Scores:');
    results.reviewResults.sectionScores.forEach(s => {
      const weight = s.section === 'Excellence' ? 8 : 6;
      console.log(`    ${s.section}: ${s.score}/${s.maxScore} (weighted: ${s.score * weight}/${s.maxScore * weight})`);
    });
  }

  if (!results.reviewResults.readyToSubmit) {
    console.log('\n⚠ ATTENTION REQUIRED:');
    const criticalIssues = results.reviewResults.weaknesses.filter(w => w.severity === 'critical');
    if (criticalIssues.length > 0) {
      console.log(`  Critical Issues:`);
      criticalIssues.forEach(issue => {
        console.log(`    - [${issue.section}] ${issue.issue}`);
      });
    }
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
