import * as fs from 'fs';
import * as path from 'path';
import { GrantAnalysisAgent } from './agents';

const GRANTS_DIR = path.join(__dirname, '../../../results/grants');

async function main() {
  console.log('=== Batch Grant Analysis ===\n');

  // Ensure grants directory exists
  if (!fs.existsSync(GRANTS_DIR)) {
    console.error(`Error: Grants directory not found at ${GRANTS_DIR}`);
    console.log('Run fetch-eu-grants.py first to fetch grant texts.');
    process.exit(1);
  }

  // Find all *-text.txt files
  const textFiles = fs.readdirSync(GRANTS_DIR)
    .filter(f => f.endsWith('-text.txt'))
    .sort();

  if (textFiles.length === 0) {
    console.error('No *-text.txt files found in', GRANTS_DIR);
    console.log('Run fetch-eu-grants.py first, or create text files manually.');
    process.exit(1);
  }

  console.log(`Found ${textFiles.length} grant text file(s):\n`);
  textFiles.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
  console.log();

  const results: Array<{
    file: string;
    title: string;
    deadline: string;
    requirements: number;
    criteria: number;
    themes: string[];
    success: boolean;
    error?: string;
  }> = [];

  // Process each file sequentially
  for (const textFile of textFiles) {
    const baseName = textFile.replace('-text.txt', '');
    const textPath = path.join(GRANTS_DIR, textFile);
    const outputPath = path.join(GRANTS_DIR, `${baseName}-analysis.json`);

    console.log(`\n${'─'.repeat(60)}`);
    console.log(`Processing: ${textFile}`);
    console.log(`${'─'.repeat(60)}`);

    const grantText = fs.readFileSync(textPath, 'utf-8');
    console.log(`  Loaded ${grantText.length} characters`);

    const agent = new GrantAnalysisAgent();

    try {
      const result = await agent.execute({ grantText });

      if (result.success && result.data) {
        // Save analysis
        fs.writeFileSync(outputPath, JSON.stringify(result.data, null, 2), 'utf-8');

        console.log(`  ✓ Analysis saved: ${outputPath}`);
        console.log(`    Title: ${result.data.grantTitle}`);
        console.log(`    Deadline: ${result.data.deadline || 'N/A'}`);
        console.log(`    Requirements: ${result.data.requirements.length}`);
        console.log(`    Criteria: ${result.data.evaluationCriteria.length}`);
        console.log(`    Themes: ${result.data.keyThemes.slice(0, 3).join(', ')}`);

        results.push({
          file: baseName,
          title: result.data.grantTitle,
          deadline: result.data.deadline || 'N/A',
          requirements: result.data.requirements.length,
          criteria: result.data.evaluationCriteria.length,
          themes: result.data.keyThemes,
          success: true,
        });
      } else {
        const errMsg = result.error?.message || 'Unknown error';
        console.log(`  ✗ Failed: ${errMsg}`);
        results.push({
          file: baseName,
          title: 'FAILED',
          deadline: '',
          requirements: 0,
          criteria: 0,
          themes: [],
          success: false,
          error: errMsg,
        });
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.log(`  ✗ Error: ${errMsg}`);
      results.push({
        file: baseName,
        title: 'ERROR',
        deadline: '',
        requirements: 0,
        criteria: 0,
        themes: [],
        success: false,
        error: errMsg,
      });
    }
  }

  // Print summary table
  console.log(`\n${'═'.repeat(60)}`);
  console.log('  SUMMARY');
  console.log(`${'═'.repeat(60)}\n`);

  const succeeded = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  for (const r of results) {
    const status = r.success ? '✓' : '✗';
    console.log(`${status} ${r.file}`);
    if (r.success) {
      console.log(`  Title: ${r.title}`);
      console.log(`  Deadline: ${r.deadline}`);
      console.log(`  Requirements: ${r.requirements}, Criteria: ${r.criteria}`);
    } else {
      console.log(`  Error: ${r.error}`);
    }
    console.log();
  }

  console.log(`Total: ${succeeded} succeeded, ${failed} failed out of ${results.length}`);
  console.log(`Output: ${GRANTS_DIR}`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
