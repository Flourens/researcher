import * as fs from 'fs';
import * as path from 'path';
import { ScientificWritingAgent } from './agents/ScientificWritingAgent';
import type { GrantAnalysisOutput, FeasibilityEvaluation, ReviewOutput, ScientificContent } from '@researcher/shared';
import { organizationProfile } from './organization-profile';

const RESULTS_DIR = path.join(__dirname, '../../../results');

async function main() {
  console.log('=== Iteration 3: Improve Proposal based on Review ===\n');

  // Load inputs
  const grantAnalysis: GrantAnalysisOutput = JSON.parse(
    fs.readFileSync(path.join(RESULTS_DIR, 'grant-analysis.json'), 'utf-8')
  );

  const feasibilityEvaluation: FeasibilityEvaluation = JSON.parse(
    fs.readFileSync(path.join(RESULTS_DIR, 'feasibility-evaluation.json'), 'utf-8')
  );

  const previousProposal: ScientificContent = JSON.parse(
    fs.readFileSync(path.join(RESULTS_DIR, 'proposal-v1-initial.json'), 'utf-8')
  );

  const review: ReviewOutput = JSON.parse(
    fs.readFileSync(path.join(RESULTS_DIR, 'review-v1.json'), 'utf-8')
  );

  console.log('📊 Loaded:');
  console.log(`   Previous score: ${review.overallScore}/100`);
  console.log(`   Weaknesses to address: ${review.weaknesses?.length || 0}`);
  console.log(`   Missing elements: ${review.missingElements?.length || 0}\n`);

  // Build improvement instructions
  let improvementInstructions = `IMPROVEMENT INSTRUCTIONS BASED ON REVIEW FEEDBACK:

PREVIOUS SCORE: ${review.overallScore}/100 (NOT ready to submit)

HIGH PRIORITY ISSUES TO FIX:
`;

  if (review.improvementPriorities) {
    const highPriority = review.improvementPriorities.filter((p: any) => p.priority === 'high');
    highPriority.forEach((p: any, i: number) => {
      improvementInstructions += `\n${i+1}. ${p.issue}
   Suggestion: ${p.suggestion}
   Expected Impact: ${p.expectedImpact}`;
    });
  }

  improvementInstructions += `\n\nKEY WEAKNESSES:
`;
  if (review.weaknesses) {
    review.weaknesses.slice(0, 5).forEach((w: any) => {
      improvementInstructions += `\n- ${w.area}: ${w.description}`;
    });
  }

  improvementInstructions += `\n\nMISSING ELEMENTS TO ADD:
`;
  if (review.missingElements) {
    review.missingElements.forEach((m: any) => {
      improvementInstructions += `\n- ${m.element}: ${m.importance}`;
    });
  }

  const businessContext = `
SECTOR: Construction business in Zaporizhzhia region, Ukraine
REAL PROBLEM: Automated Cost Estimation with LLM + RAG
IMPROVEMENTS NEEDED: ${improvementInstructions}`;

  const agent = new ScientificWritingAgent();

  console.log('🤖 Generating improved proposal v2 (this may take 2-3 minutes)...\n');

  const result = await agent.execute({
    grantAnalysis,
    organizationInfo: organizationProfile,
    feasibilityEvaluation,
    language: 'en',
    businessContext,
  });

  if (result.success && result.data) {
    const outputPath = path.join(RESULTS_DIR, 'proposal-v2-improved.json');
    fs.writeFileSync(outputPath, JSON.stringify(result.data, null, 2), 'utf-8');

    console.log('✅ Improved Proposal v2 generated!');
    console.log(`   Saved to: ${outputPath}`);
    console.log(`   Duration: ${result.executionTime}ms`);
    console.log('\n🎉 All 3 iterations completed!');
    console.log('\n📁 Results:');
    console.log(`   - proposal-v1-initial.json (initial version)`);
    console.log(`   - review-v1.json (feedback)`);
    console.log(`   - proposal-v2-improved.json (final version)`);
  } else {
    console.error('❌ Failed:', result.error?.message);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
