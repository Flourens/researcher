import * as fs from 'fs';
import * as path from 'path';
import { FeasibilityAgent } from './agents';
import type { GrantAnalysisOutput, OrganizationInfo } from '@researcher/shared';

const RESULTS_DIR = path.join(__dirname, '../../../results');
const GRANTS_DIR = path.join(RESULTS_DIR, 'grants');

async function main() {
  // Support --org flag: e.g. --org znu loads organization-info-znu.json
  const orgFlag = process.argv.find(a => a.startsWith('--org='));
  const orgSuffix = orgFlag ? orgFlag.split('=')[1] : '';
  const orgFileName = orgSuffix ? `organization-info-${orgSuffix}.json` : 'organization-info.json';
  const outputSuffix = orgSuffix ? `-${orgSuffix}` : '';

  console.log('=== Batch Feasibility Evaluation ===\n');

  // Load shared organization info
  const orgInfoPath = path.join(RESULTS_DIR, orgFileName);
  if (!fs.existsSync(orgInfoPath)) {
    console.error(`Error: Organization info not found at ${orgInfoPath}`);
    process.exit(1);
  }
  const organizationInfo: OrganizationInfo = JSON.parse(
    fs.readFileSync(orgInfoPath, 'utf-8')
  );
  console.log(`Organization: ${organizationInfo.name}\n`);

  // Find all *-analysis.json files in grants/
  const analysisFiles = fs.readdirSync(GRANTS_DIR)
    .filter(f => f.endsWith('-analysis.json'))
    .sort();

  if (analysisFiles.length === 0) {
    console.error('No *-analysis.json files found in', GRANTS_DIR);
    console.log('Run debug-grant-analysis-batch.ts first.');
    process.exit(1);
  }

  console.log(`Found ${analysisFiles.length} grant analysis file(s):\n`);
  analysisFiles.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
  console.log();

  const results: Array<{
    name: string;
    title: string;
    chance: number;
    recommendation: string;
    matchScore: number;
    success: boolean;
    error?: string;
  }> = [];

  for (const analysisFile of analysisFiles) {
    const baseName = analysisFile.replace('-analysis.json', '');
    const grantDir = path.join(RESULTS_DIR, baseName + outputSuffix);

    console.log(`\n${'─'.repeat(60)}`);
    console.log(`Processing: ${baseName}`);
    console.log(`${'─'.repeat(60)}`);

    // Load grant analysis
    const analysisPath = path.join(GRANTS_DIR, analysisFile);
    const grantAnalysis: GrantAnalysisOutput = JSON.parse(
      fs.readFileSync(analysisPath, 'utf-8')
    );
    console.log(`  Grant: ${grantAnalysis.grantTitle}`);

    // Create per-grant folder
    if (!fs.existsSync(grantDir)) {
      fs.mkdirSync(grantDir, { recursive: true });
    }

    // Copy analysis and text files into the grant folder
    const textFile = path.join(GRANTS_DIR, `${baseName}-text.txt`);
    if (fs.existsSync(textFile)) {
      fs.copyFileSync(textFile, path.join(grantDir, 'grant-text.txt'));
    }
    fs.copyFileSync(analysisPath, path.join(grantDir, 'grant-analysis.json'));

    // Run feasibility
    const agent = new FeasibilityAgent();
    try {
      const result = await agent.execute({ grantAnalysis, organizationInfo });

      if (result.success && result.data) {
        const outputPath = path.join(grantDir, 'feasibility-evaluation.json');
        fs.writeFileSync(outputPath, JSON.stringify(result.data, null, 2), 'utf-8');

        console.log(`  ✓ Chance: ${result.data.overallChance}%`);
        console.log(`  ✓ Recommendation: ${result.data.recommendation}`);
        console.log(`  ✓ Match Score: ${result.data.matchScore.overall}/100`);
        console.log(`  ✓ Strengths: ${result.data.strengths.length}, Weaknesses: ${result.data.weaknesses.length}, Gaps: ${result.data.gaps.length}`);
        console.log(`  Saved: ${outputPath}`);

        results.push({
          name: baseName,
          title: grantAnalysis.grantTitle,
          chance: result.data.overallChance,
          recommendation: result.data.recommendation,
          matchScore: result.data.matchScore.overall,
          success: true,
        });
      } else {
        const errMsg = result.error?.message || 'Unknown error';
        console.log(`  ✗ Failed: ${errMsg}`);
        results.push({
          name: baseName,
          title: grantAnalysis.grantTitle,
          chance: 0,
          recommendation: 'FAILED',
          matchScore: 0,
          success: false,
          error: errMsg,
        });
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.log(`  ✗ Error: ${errMsg}`);
      results.push({
        name: baseName,
        title: grantAnalysis.grantTitle,
        chance: 0,
        recommendation: 'ERROR',
        matchScore: 0,
        success: false,
        error: errMsg,
      });
    }
  }

  // Print summary table
  console.log(`\n${'═'.repeat(60)}`);
  console.log('  FEASIBILITY SUMMARY');
  console.log(`${'═'.repeat(60)}\n`);

  // Sort by chance descending
  const sorted = [...results].sort((a, b) => b.chance - a.chance);

  for (const r of sorted) {
    const status = r.success ? '✓' : '✗';
    const bar = r.success ? '█'.repeat(Math.round(r.chance / 5)) + '░'.repeat(20 - Math.round(r.chance / 5)) : '─'.repeat(20);
    console.log(`${status} [${bar}] ${r.chance}% — ${r.name}`);
    console.log(`  ${r.title}`);
    if (r.success) {
      console.log(`  Recommendation: ${r.recommendation} | Match: ${r.matchScore}/100`);
    } else {
      console.log(`  Error: ${r.error}`);
    }
    console.log();
  }

  const succeeded = results.filter(r => r.success).length;
  console.log(`Total: ${succeeded}/${results.length} evaluated`);
  console.log(`Output folders: results/<grant-name>/feasibility-evaluation.json`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
