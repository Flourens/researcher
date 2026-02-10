import * as fs from 'fs';
import * as path from 'path';
import { ReviewerAgent } from './agents/ReviewerAgent';
import type { GrantAnalysisOutput, ScientificContent } from '@researcher/shared';

const RESULTS_DIR = path.join(__dirname, '../../../results');

async function main() {
  console.log('=== Iteration 2: Review Proposal v1 ===\n');

  // Load inputs
  const grantAnalysis: GrantAnalysisOutput = JSON.parse(
    fs.readFileSync(path.join(RESULTS_DIR, 'grant-analysis.json'), 'utf-8')
  );

  const proposal: ScientificContent = JSON.parse(
    fs.readFileSync(path.join(RESULTS_DIR, 'proposal-v1-initial.json'), 'utf-8')
  );

  console.log('📊 Loaded:');
  console.log(`   Grant: ${grantAnalysis.grantTitle}`);
  console.log(`   Proposal sections: ${Object.keys(proposal).length}\n`);

  const agent = new ReviewerAgent();

  console.log('🔍 Reviewing proposal (this may take 1-2 minutes)...\n');

  const result = await agent.execute({
    grantAnalysis,
    scientificProposal: proposal,
  });

  if (result.success && result.data) {
    const outputPath = path.join(RESULTS_DIR, 'review-v1.json');
    fs.writeFileSync(outputPath, JSON.stringify(result.data, null, 2), 'utf-8');

    console.log('✅ Review v1 completed!');
    console.log(`   Saved to: ${outputPath}`);
    console.log(`   Overall Score: ${result.data.overallScore}/100`);
    console.log(`   Ready to Submit: ${result.data.readyToSubmit ? 'YES ✅' : 'NO ❌'}`);
    console.log(`   Duration: ${result.executionTime}ms`);
    console.log(`   Tokens: ${result.tokensUsed}`);

    console.log('\n📋 Key Feedback:');
    console.log(`   Strengths: ${result.data.strengths?.length || 0}`);
    console.log(`   Weaknesses: ${result.data.weaknesses?.length || 0}`);
    console.log(`   Missing Elements: ${result.data.missingElements?.length || 0}`);

    if (result.data.improvementPriorities && result.data.improvementPriorities.length > 0) {
      console.log('\n🔥 Top Priority Improvements:');
      result.data.improvementPriorities
        .filter((p: any) => p.priority === 'high')
        .slice(0, 5)
        .forEach((p: any, i: number) => {
          console.log(`   ${i+1}. ${p.issue}`);
        });
    }
  } else {
    console.error('❌ Failed:', result.error?.message);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
