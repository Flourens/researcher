import * as fs from 'fs';
import * as path from 'path';
import { ScientificWritingAgent } from './agents/ScientificWritingAgent';
import type { GrantAnalysisOutput, FeasibilityEvaluation } from '@researcher/shared';
import { organizationProfile } from './organization-profile';

const RESULTS_DIR = path.join(__dirname, '../../../results');

async function main() {
  console.log('=== Iteration 1: Generate Initial Proposal ===\n');

  // Load inputs
  const grantAnalysis: GrantAnalysisOutput = JSON.parse(
    fs.readFileSync(path.join(RESULTS_DIR, 'grant-analysis.json'), 'utf-8')
  );

  const feasibilityEvaluation: FeasibilityEvaluation = JSON.parse(
    fs.readFileSync(path.join(RESULTS_DIR, 'feasibility-evaluation.json'), 'utf-8')
  );

  console.log('📊 Loaded inputs:');
  console.log(`   Grant: ${grantAnalysis.grantTitle}`);
  console.log(`   Organization: ${organizationProfile.name}`);
  console.log(`   Feasibility: ${feasibilityEvaluation.overallChance}%\n`);

  // Business context for construction
  const businessContext = `
SECTOR: Construction business in Zaporizhzhia region, Ukraine
REAL PROBLEM: Automated Cost Estimation with LLM + RAG
- Problem: Cost estimation is time-consuming (60-70% time could be saved)
- Data: Historical estimates, price lists, project documentation
- Solution: LLM + RAG for automatic cost document generation
- Benefit: Measurable ROI, practical for SMEs, regional specificity`;

  const agent = new ScientificWritingAgent();

  console.log('🤖 Generating proposal (this may take 2-3 minutes)...\n');

  const result = await agent.execute({
    grantAnalysis,
    organizationInfo: organizationProfile,
    feasibilityEvaluation,
    language: 'en',
    businessContext,
  });

  if (result.success && result.data) {
    const outputPath = path.join(RESULTS_DIR, 'proposal-v1-initial.json');
    fs.writeFileSync(outputPath, JSON.stringify(result.data, null, 2), 'utf-8');

    console.log('✅ Proposal v1 generated!');
    console.log(`   Saved to: ${outputPath}`);
    console.log(`   Sections: ${Object.keys(result.data).length}`);
    console.log(`   Duration: ${result.executionTime}ms`);
    console.log(`   Tokens: ${result.tokensUsed}`);
  } else {
    console.error('❌ Failed:', result.error?.message);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
