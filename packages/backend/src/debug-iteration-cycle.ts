import * as fs from 'fs';
import * as path from 'path';
import { ScientificWritingAgent, ReviewerAgent } from './agents';
import type {
  GrantAnalysisOutput,
  OrganizationInfo,
  FeasibilityEvaluation,
  ScientificContent,
} from '@researcher/shared';

const RESULTS_DIR = path.join(__dirname, '../../../results');
const TOTAL_CYCLES = 2;

function loadJson<T>(filename: string): T {
  const filePath = path.join(RESULTS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function saveJson(filename: string, data: any): void {
  const filePath = path.join(RESULTS_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  Saved: ${filePath}`);
}

function saveMarkdown(proposal: ScientificContent, grantTitle: string, cycle: number): void {
  const markdownPath = path.join(RESULTS_DIR, `scientific-proposal-v${cycle}.md`);
  // Support both new (FFplus Part B) and legacy schema
  const summary = proposal.summary || proposal.abstract || '';
  const industrialRelevance = proposal.industrialRelevance || '';
  const workPlan = proposal.workPlan || '';
  const consortiumQuality = proposal.consortiumQuality || '';
  const costJustification = proposal.costJustification || '';

  let markdown: string;
  if (proposal.summary) {
    // New FFplus Part B structure
    markdown = `# ${grantTitle} — CosTERRA Proposal (v${cycle})

## Summary

${summary}

## Industrial Relevance, Potential Impact and Exploitation Plans

${industrialRelevance}

## Description of the Work Plan, Technological/Algorithmic Approach and Software Development Strategy

${workPlan}

## Quality of the Consortium as a Whole and of the Individual Proposers

${consortiumQuality}

## Justification of Costs and Resources

${costJustification}

## References

${proposal.bibliography.map((ref, idx) => `${idx + 1}. ${ref}`).join('\n')}
`;
  } else {
    // Legacy schema
    markdown = `# ${grantTitle} — CosTERRA Proposal (v${cycle})

## Abstract

${proposal.abstract || ''}

## Introduction

${proposal.introduction || ''}

## State of the Art

${proposal.stateOfTheArt || ''}

## Methodology

${proposal.methodology || ''}

## Work Plan

${proposal.workPlan}

## Expected Results

${proposal.expectedResults || ''}

## Impact

${proposal.impact || ''}

## Bibliography

${proposal.bibliography.map((ref, idx) => `${idx + 1}. ${ref}`).join('\n')}
`;
  }
  fs.writeFileSync(markdownPath, markdown, 'utf-8');
  console.log(`  Markdown: ${markdownPath}`);
}

async function runCycle(
  cycle: number,
  writerAgent: ScientificWritingAgent,
  reviewerAgent: ReviewerAgent,
  grantAnalysis: GrantAnalysisOutput,
  organizationInfo: OrganizationInfo,
  feasibilityEvaluation: FeasibilityEvaluation,
  businessContext: string | undefined
): Promise<{ proposal: ScientificContent; review: any }> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  CYCLE ${cycle}/${TOTAL_CYCLES}`);
  console.log(`${'='.repeat(60)}\n`);

  // --- WRITER ---
  console.log(`[Cycle ${cycle}] Running ScientificWritingAgent...`);
  const writerStart = Date.now();

  const writerResult = await writerAgent.execute({
    grantAnalysis,
    organizationInfo,
    feasibilityEvaluation,
    language: 'en',
    businessContext,
  });

  if (!writerResult.success || !writerResult.data) {
    throw new Error(`Writer failed in cycle ${cycle}: ${writerResult.error?.message}`);
  }

  const writerTime = Math.round((Date.now() - writerStart) / 1000);
  console.log(`[Cycle ${cycle}] Writer completed in ${writerTime}s`);

  // Save proposal
  saveJson('scientific-proposal.json', writerResult.data);
  saveJson(`scientific-proposal-v${cycle}.json`, writerResult.data);
  saveMarkdown(writerResult.data, grantAnalysis.grantTitle, cycle);

  // Print stats
  const totalWords = Object.values(writerResult.data)
    .filter((v) => typeof v === 'string')
    .join(' ')
    .split(/\s+/).length;
  console.log(`  Words: ~${totalWords}`);
  console.log(`  Bibliography: ${writerResult.data.bibliography.length} refs`);

  // --- REVIEWER ---
  console.log(`\n[Cycle ${cycle}] Running ReviewerAgent...`);
  const reviewerStart = Date.now();

  const reviewResult = await reviewerAgent.execute({
    grantAnalysis,
    scientificProposal: writerResult.data,
  });

  if (!reviewResult.success || !reviewResult.data) {
    throw new Error(`Reviewer failed in cycle ${cycle}: ${reviewResult.error?.message}`);
  }

  const reviewerTime = Math.round((Date.now() - reviewerStart) / 1000);
  console.log(`[Cycle ${cycle}] Reviewer completed in ${reviewerTime}s`);

  // Save review
  saveJson('review-results.json', reviewResult.data);
  saveJson(`review-results-v${cycle}.json`, reviewResult.data);

  // Print review summary
  const review = reviewResult.data;
  const pct = Math.round((review.overallScore / review.maxScore) * 100);
  console.log(`\n  Score: ${review.overallScore}/${review.maxScore} (${pct}%)`);
  console.log(`  Ready to submit: ${review.readyToSubmit ? 'YES' : 'NO'}`);

  console.log(`  Section scores:`);
  review.sectionScores.forEach((s: any) => {
    console.log(`    ${s.section}: ${s.score}/${s.maxScore} (${Math.round((s.score / s.maxScore) * 100)}%)`);
  });

  const criticalWeaknesses = review.weaknesses.filter((w: any) => w.severity === 'critical');
  if (criticalWeaknesses.length > 0) {
    console.log(`\n  Critical issues (${criticalWeaknesses.length}):`);
    criticalWeaknesses.forEach((w: any, i: number) => {
      console.log(`    ${i + 1}. [${w.section}] ${w.issue}`);
    });
  }

  if (review.missingElements.length > 0) {
    console.log(`\n  Missing elements (${review.missingElements.length}):`);
    review.missingElements.slice(0, 5).forEach((e: string, i: number) => {
      console.log(`    ${i + 1}. ${e}`);
    });
  }

  return { proposal: writerResult.data, review: reviewResult.data };
}

async function main() {
  console.log('=== CosTERRA Proposal Generation — 2-Cycle Iteration ===\n');

  // Load inputs
  console.log('Loading input data...');
  const grantAnalysis = loadJson<GrantAnalysisOutput>('grant-analysis.json');
  const organizationInfo = loadJson<OrganizationInfo>('organization-info.json');
  const feasibilityEvaluation = loadJson<FeasibilityEvaluation>('feasibility-evaluation.json');

  let businessContext: string | undefined;
  const bcPath = path.join(RESULTS_DIR, 'business-context.txt');
  if (fs.existsSync(bcPath)) {
    businessContext = fs.readFileSync(bcPath, 'utf-8');
  }

  console.log(`  Grant: ${grantAnalysis.grantTitle}`);
  console.log(`  Organization: ${organizationInfo.name}`);
  console.log(`  Feasibility: ${feasibilityEvaluation.overallChance}%`);
  console.log(`  Business context: ${businessContext ? `${businessContext.length} chars` : 'none'}`);
  console.log(`  Cycles: ${TOTAL_CYCLES}`);

  // Initialize agents
  const writerAgent = new ScientificWritingAgent();
  const reviewerAgent = new ReviewerAgent();

  const results: Array<{ proposal: ScientificContent; review: any }> = [];

  // Run cycles
  for (let cycle = 1; cycle <= TOTAL_CYCLES; cycle++) {
    const result = await runCycle(
      cycle,
      writerAgent,
      reviewerAgent,
      grantAnalysis,
      organizationInfo,
      feasibilityEvaluation,
      businessContext
    );
    results.push(result);
  }

  // Final summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('  ITERATION SUMMARY');
  console.log(`${'='.repeat(60)}\n`);

  results.forEach((r, idx) => {
    const pct = Math.round((r.review.overallScore / r.review.maxScore) * 100);
    console.log(`Cycle ${idx + 1}: ${r.review.overallScore}/${r.review.maxScore} (${pct}%) — ${r.review.readyToSubmit ? 'READY' : 'NOT READY'}`);
  });

  // Check improvement
  if (results.length >= 2) {
    const first = results[0].review;
    const last = results[results.length - 1].review;
    const firstPct = Math.round((first.overallScore / first.maxScore) * 100);
    const lastPct = Math.round((last.overallScore / last.maxScore) * 100);
    const delta = lastPct - firstPct;
    console.log(`\nImprovement: ${delta > 0 ? '+' : ''}${delta}% (${firstPct}% → ${lastPct}%)`);
  }

  console.log('\nAll results saved to results/ directory.');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
