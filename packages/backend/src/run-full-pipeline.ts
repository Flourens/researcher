import * as fs from 'fs';
import * as path from 'path';
import {
  GrantAnalysisAgent,
  FeasibilityAgent,
  ScientificWritingAgent,
  ReviewerAgent,
  ApplicationPackageAgent,
} from './agents';
import type {
  GrantAnalysisOutput,
  OrganizationInfo,
  FeasibilityEvaluation,
  ScientificContent,
  ReviewOutput,
  ApplicationPackageOutput,
  Language,
} from '@researcher/shared';

const RESULTS_DIR = path.join(__dirname, '../../../results');
const MAX_ITERATIONS = 2;
const MIN_SCORE_PERCENTAGE = 70;

interface PipelineConfig {
  language?: Language;
  businessContext?: string;
  maxIterations?: number;
  minScorePercentage?: number;
}

interface PipelineResults {
  grantAnalysis: GrantAnalysisOutput;
  feasibilityEvaluation: FeasibilityEvaluation;
  scientificProposal: ScientificContent;
  reviewResults: ReviewOutput;
  applicationPackage: ApplicationPackageOutput;
  iterations: number;
  finalScore: number;
}

async function main() {
  console.log('=== AI Grant Researcher - Full Pipeline ===\n');

  // Ensure results directory exists
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }

  // Load configuration
  const config = loadConfig();
  console.log('Configuration:');
  console.log(`  Language: ${config.language || 'en'}`);
  console.log(`  Max Iterations: ${config.maxIterations || MAX_ITERATIONS}`);
  console.log(`  Min Score: ${config.minScorePercentage || MIN_SCORE_PERCENTAGE}%`);
  console.log(`  Business Context: ${config.businessContext ? 'Yes' : 'No'}\n`);

  // Load inputs
  const grantText = loadGrantText();
  const organizationInfo = loadOrganizationInfo();

  console.log('Starting pipeline execution...\n');

  try {
    const results = await runPipeline(
      grantText,
      organizationInfo,
      config
    );

    // Save all results
    saveResults(results);

    // Print final summary
    printSummary(results);

    console.log('\n✓ Pipeline completed successfully');
    console.log(`\nResults saved to: ${RESULTS_DIR}`);
  } catch (error) {
    console.error('\n✗ Pipeline failed:', error);
    process.exit(1);
  }
}

async function runPipeline(
  grantText: string,
  organizationInfo: OrganizationInfo,
  config: PipelineConfig
): Promise<PipelineResults> {
  const maxIterations = config.maxIterations || MAX_ITERATIONS;
  const minScorePercentage = config.minScorePercentage || MIN_SCORE_PERCENTAGE;

  // Step 1: Grant Analysis
  console.log('Step 1/5: Analyzing grant requirements...');
  const grantAnalysisAgent = new GrantAnalysisAgent();
  const analysisResult = await grantAnalysisAgent.execute({ grantText });

  if (!analysisResult.success || !analysisResult.data) {
    throw new Error(`Grant analysis failed: ${analysisResult.error?.message}`);
  }

  const grantAnalysis = analysisResult.data;
  console.log(`  ✓ Grant: ${grantAnalysis.grantTitle}`);
  console.log(`  ✓ Requirements: ${grantAnalysis.requirements.length}`);
  console.log(`  ✓ Criteria: ${grantAnalysis.evaluationCriteria.length}\n`);

  // Step 2: Feasibility Evaluation
  console.log('Step 2/5: Evaluating feasibility...');
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

  // Step 3: Iterative Proposal Generation and Review
  console.log('Step 3/5: Generating and reviewing proposal (iterative)...');

  let scientificProposal: ScientificContent | null = null;
  let reviewResults: ReviewOutput | null = null;
  let iteration = 0;
  let scorePercentage = 0;

  const writingAgent = new ScientificWritingAgent();
  const reviewerAgent = new ReviewerAgent();

  while (iteration < maxIterations) {
    iteration++;
    console.log(`\n  Iteration ${iteration}/${maxIterations}:`);

    // Generate proposal
    console.log('    Generating proposal...');
    const proposalResult = await writingAgent.execute({
      grantAnalysis,
      organizationInfo,
      feasibilityEvaluation,
      language: config.language,
      businessContext: config.businessContext,
    });

    if (!proposalResult.success || !proposalResult.data) {
      throw new Error(`Proposal generation failed: ${proposalResult.error?.message}`);
    }

    scientificProposal = proposalResult.data;
    console.log(`    ✓ Proposal generated`);

    // Review proposal
    console.log('    Reviewing proposal...');
    const reviewResult = await reviewerAgent.execute({
      grantAnalysis,
      scientificProposal,
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

    // Check if score is acceptable
    if (scorePercentage >= minScorePercentage && reviewResults.readyToSubmit) {
      console.log(`\n  ✓ Proposal meets quality threshold (${minScorePercentage}%)`);
      break;
    }

    if (iteration < maxIterations) {
      console.log(`\n  ⚠ Score below threshold or not ready. Improving...`);
      console.log(`    Critical Issues: ${reviewResults.weaknesses.filter((w) => w.severity === 'critical').length}`);
      console.log(`    Missing Elements: ${reviewResults.missingElements.length}`);

      // In a real implementation, we would modify the prompt based on review feedback
      // For now, we just regenerate with the same inputs
    }
  }

  if (!scientificProposal || !reviewResults) {
    throw new Error('Failed to generate proposal and review');
  }

  console.log(`\n  Final score after ${iteration} iteration(s): ${scorePercentage}%\n`);

  // Step 4: Application Package Generation
  console.log('Step 4/5: Generating application package...');
  const packageAgent = new ApplicationPackageAgent();
  const packageResult = await packageAgent.execute({
    grantAnalysis,
    organizationInfo,
    scientificProposal,
    reviewResults,
  });

  if (!packageResult.success || !packageResult.data) {
    throw new Error(`Package generation failed: ${packageResult.error?.message}`);
  }

  const applicationPackage = packageResult.data;
  console.log(`  ✓ Generated Documents: ${applicationPackage.generatedDocuments.length}`);
  console.log(`  ✓ Manual Documents: ${applicationPackage.manualDocuments.length}`);
  console.log(`  ✓ Checklist Items: ${applicationPackage.documentChecklist.length}\n`);

  console.log('Step 5/5: Saving results...');

  return {
    grantAnalysis,
    feasibilityEvaluation,
    scientificProposal,
    reviewResults,
    applicationPackage,
    iterations: iteration,
    finalScore: scorePercentage,
  };
}

function loadConfig(): PipelineConfig {
  const configPath = path.join(RESULTS_DIR, 'pipeline-config.json');

  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }

  // Default config
  return {
    language: 'en',
    maxIterations: MAX_ITERATIONS,
    minScorePercentage: MIN_SCORE_PERCENTAGE,
  };
}

function loadGrantText(): string {
  const grantTextPath = path.join(RESULTS_DIR, 'grant-text.txt');

  if (!fs.existsSync(grantTextPath)) {
    console.error(`Error: Grant text file not found at ${grantTextPath}`);
    console.log('\nPlease create this file with the grant call text.');
    process.exit(1);
  }

  return fs.readFileSync(grantTextPath, 'utf-8');
}

function loadOrganizationInfo(): OrganizationInfo {
  const orgInfoPath = path.join(RESULTS_DIR, 'organization-info.json');

  if (!fs.existsSync(orgInfoPath)) {
    console.error(`Error: Organization info not found at ${orgInfoPath}`);
    console.log('\nPlease create this file with your organization information.');
    process.exit(1);
  }

  return JSON.parse(fs.readFileSync(orgInfoPath, 'utf-8'));
}

function saveResults(results: PipelineResults): void {
  // Save individual results
  fs.writeFileSync(
    path.join(RESULTS_DIR, 'grant-analysis.json'),
    JSON.stringify(results.grantAnalysis, null, 2),
    'utf-8'
  );

  fs.writeFileSync(
    path.join(RESULTS_DIR, 'feasibility-evaluation.json'),
    JSON.stringify(results.feasibilityEvaluation, null, 2),
    'utf-8'
  );

  fs.writeFileSync(
    path.join(RESULTS_DIR, 'scientific-proposal.json'),
    JSON.stringify(results.scientificProposal, null, 2),
    'utf-8'
  );

  fs.writeFileSync(
    path.join(RESULTS_DIR, 'review-results.json'),
    JSON.stringify(results.reviewResults, null, 2),
    'utf-8'
  );

  fs.writeFileSync(
    path.join(RESULTS_DIR, 'application-package.json'),
    JSON.stringify(results.applicationPackage, null, 2),
    'utf-8'
  );

  // Save proposal as markdown
  const markdown = generateProposalMarkdown(
    results.grantAnalysis.grantTitle,
    results.scientificProposal
  );
  fs.writeFileSync(
    path.join(RESULTS_DIR, 'scientific-proposal.md'),
    markdown,
    'utf-8'
  );

  // Save application documents
  const packageDir = path.join(RESULTS_DIR, 'application-package');
  if (!fs.existsSync(packageDir)) {
    fs.mkdirSync(packageDir, { recursive: true });
  }

  results.applicationPackage.generatedDocuments.forEach((doc) => {
    fs.writeFileSync(
      path.join(packageDir, doc.filename),
      doc.content,
      'utf-8'
    );
  });

  // Save pipeline summary
  const summary = {
    executedAt: new Date().toISOString(),
    grantTitle: results.grantAnalysis.grantTitle,
    organization: results.grantAnalysis.grantingOrganization,
    iterations: results.iterations,
    finalScore: results.finalScore,
    readyToSubmit: results.reviewResults.readyToSubmit,
    feasibilityChance: results.feasibilityEvaluation.overallChance,
  };

  fs.writeFileSync(
    path.join(RESULTS_DIR, 'pipeline-summary.json'),
    JSON.stringify(summary, null, 2),
    'utf-8'
  );
}

function generateProposalMarkdown(
  title: string,
  proposal: ScientificContent
): string {
  return `# ${title}

## Abstract

${proposal.abstract}

## Introduction

${proposal.introduction}

## State of the Art

${proposal.stateOfTheArt}

## Methodology

${proposal.methodology}

## Work Plan

${proposal.workPlan}

## Expected Results

${proposal.expectedResults}

## Impact

${proposal.impact}

## Bibliography

${proposal.bibliography.map((ref, idx) => `${idx + 1}. ${ref}`).join('\n')}
`;
}

function printSummary(results: PipelineResults): void {
  console.log('\n=== PIPELINE SUMMARY ===\n');

  console.log('Grant Information:');
  console.log(`  Title: ${results.grantAnalysis.grantTitle}`);
  console.log(`  Organization: ${results.grantAnalysis.grantingOrganization}`);
  if (results.grantAnalysis.deadline) {
    console.log(`  Deadline: ${results.grantAnalysis.deadline}`);
  }

  console.log('\nFeasibility Assessment:');
  console.log(`  Success Chance: ${results.feasibilityEvaluation.overallChance}%`);
  console.log(`  Recommendation: ${results.feasibilityEvaluation.recommendation}`);
  console.log(`  Match Score: ${results.feasibilityEvaluation.matchScore.overall}/100`);

  console.log('\nProposal Quality:');
  console.log(`  Iterations: ${results.iterations}`);
  console.log(`  Final Score: ${results.reviewResults.overallScore}/${results.reviewResults.maxScore} (${results.finalScore}%)`);
  console.log(`  Ready to Submit: ${results.reviewResults.readyToSubmit ? 'YES ✓' : 'NO ✗'}`);

  console.log('\nApplication Package:');
  console.log(`  Generated Documents: ${results.applicationPackage.generatedDocuments.length}`);
  console.log(`  Manual Documents Required: ${results.applicationPackage.manualDocuments.filter((d) => d.required).length}`);

  if (!results.reviewResults.readyToSubmit) {
    console.log('\n⚠ ATTENTION REQUIRED:');
    const criticalIssues = results.reviewResults.weaknesses.filter(
      (w) => w.severity === 'critical'
    );
    if (criticalIssues.length > 0) {
      console.log(`  Critical Issues: ${criticalIssues.length}`);
      criticalIssues.slice(0, 3).forEach((issue) => {
        console.log(`    - [${issue.section}] ${issue.issue}`);
      });
    }
    if (results.reviewResults.missingElements.length > 0) {
      console.log(`  Missing Elements: ${results.reviewResults.missingElements.length}`);
      results.reviewResults.missingElements.slice(0, 3).forEach((element) => {
        console.log(`    - ${element}`);
      });
    }
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
