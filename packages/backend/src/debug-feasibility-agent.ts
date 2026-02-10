import * as fs from 'fs';
import * as path from 'path';
import { FeasibilityAgent } from './agents';
import type { GrantAnalysisOutput, OrganizationInfo } from '@researcher/shared';

const RESULTS_DIR = path.join(__dirname, '../../../results');

async function main() {
  console.log('=== Feasibility Evaluation Agent Debug ===\n');

  // Load grant analysis results
  const analysisPath = path.join(RESULTS_DIR, 'grant-analysis.json');
  if (!fs.existsSync(analysisPath)) {
    console.error(`Error: Grant analysis not found at ${analysisPath}`);
    console.log('Please run debug-grant-analysis.ts first.');
    process.exit(1);
  }

  const grantAnalysis: GrantAnalysisOutput = JSON.parse(
    fs.readFileSync(analysisPath, 'utf-8')
  );
  console.log(`Loaded grant analysis: ${grantAnalysis.grantTitle}\n`);

  // Load organization info
  const orgInfoPath = path.join(RESULTS_DIR, 'organization-info.json');
  if (!fs.existsSync(orgInfoPath)) {
    console.error(`Error: Organization info not found at ${orgInfoPath}`);
    console.log('\nPlease create a file with your organization information.');
    process.exit(1);
  }

  const organizationInfo: OrganizationInfo = JSON.parse(
    fs.readFileSync(orgInfoPath, 'utf-8')
  );
  console.log(`Loaded organization info: ${organizationInfo.name}\n`);

  // Initialize agent
  const agent = new FeasibilityAgent();

  // Execute evaluation
  console.log('Starting feasibility evaluation...\n');
  const result = await agent.execute({
    grantAnalysis,
    organizationInfo,
  });

  if (result.success && result.data) {
    console.log('✓ Evaluation completed successfully\n');

    // Save results
    const outputPath = path.join(RESULTS_DIR, 'feasibility-evaluation.json');
    fs.writeFileSync(
      outputPath,
      JSON.stringify(result.data, null, 2),
      'utf-8'
    );
    console.log(`Results saved to: ${outputPath}\n`);

    // Print summary
    console.log('=== Feasibility Summary ===');
    console.log(`Overall Success Chance: ${result.data.overallChance}%`);
    console.log(`Recommendation: ${result.data.recommendation}`);
    console.log(`Match Score: ${result.data.matchScore.overall}/100\n`);

    console.log('=== Score Breakdown ===');
    result.data.matchScore.breakdown.forEach((item) => {
      console.log(`${item.category}: ${item.score}/${item.maxScore}`);
    });

    console.log('\n=== Strengths ===');
    result.data.strengths.forEach((strength, idx) => {
      console.log(`${idx + 1}. [${strength.impact.toUpperCase()}] ${strength.area}`);
      console.log(`   ${strength.description}`);
    });

    console.log('\n=== Weaknesses ===');
    result.data.weaknesses.forEach((weakness, idx) => {
      console.log(`${idx + 1}. [${weakness.severity.toUpperCase()}] ${weakness.area}`);
      console.log(`   ${weakness.description}`);
      if (weakness.mitigation) {
        console.log(`   Mitigation: ${weakness.mitigation}`);
      }
    });

    console.log('\n=== Gaps ===');
    result.data.gaps.forEach((gap, idx) => {
      console.log(`${idx + 1}. [${gap.severity.toUpperCase()}] ${gap.type}`);
      console.log(`   ${gap.description}`);
      console.log(`   Recommendation: ${gap.recommendation}`);
    });

    console.log('\n=== Required Actions ===');
    const criticalActions = result.data.requiredActions.filter(
      (a) => a.priority === 'critical' || a.priority === 'high'
    );
    criticalActions.forEach((action, idx) => {
      console.log(`${idx + 1}. [${action.priority.toUpperCase()}] ${action.action}`);
      console.log(`   Timeline: ${action.timeline}`);
    });

    console.log('\n=== Executive Summary ===');
    console.log(result.data.executiveSummary);
  } else {
    console.error('✗ Evaluation failed');
    console.error(result.error?.message);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
