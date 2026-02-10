import * as fs from 'fs';
import * as path from 'path';
import { GrantAnalysisAgent } from './agents';

const RESULTS_DIR = path.join(__dirname, '../../../results');

async function main() {
  console.log('=== Grant Analysis Agent Debug ===\n');

  // Ensure results directory exists
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }

  // Read grant text
  const grantTextPath = path.join(RESULTS_DIR, 'grant-text.txt');

  if (!fs.existsSync(grantTextPath)) {
    console.error(`Error: Grant text file not found at ${grantTextPath}`);
    console.log('\nPlease create a file at:');
    console.log(grantTextPath);
    console.log('\nWith the grant call text you want to analyze.');
    process.exit(1);
  }

  const grantText = fs.readFileSync(grantTextPath, 'utf-8');
  console.log(`Loaded grant text (${grantText.length} characters)\n`);

  // Initialize agent
  const agent = new GrantAnalysisAgent();

  // Execute analysis
  console.log('Starting grant analysis...\n');
  const result = await agent.execute({ grantText });

  if (result.success && result.data) {
    console.log('✓ Analysis completed successfully\n');

    // Save results
    const outputPath = path.join(RESULTS_DIR, 'grant-analysis.json');
    fs.writeFileSync(
      outputPath,
      JSON.stringify(result.data, null, 2),
      'utf-8'
    );
    console.log(`Results saved to: ${outputPath}\n`);

    // Print summary
    console.log('=== Analysis Summary ===');
    console.log(`Grant Title: ${result.data.grantTitle}`);
    console.log(`Organization: ${result.data.grantingOrganization}`);
    console.log(`Requirements: ${result.data.requirements.length}`);
    console.log(`Evaluation Criteria: ${result.data.evaluationCriteria.length}`);
    console.log(`Key Themes: ${result.data.keyThemes.join(', ')}`);

    if (result.data.deadline) {
      console.log(`Deadline: ${result.data.deadline}`);
    }

    console.log('\n=== Requirements Breakdown ===');
    const reqByCategory = result.data.requirements.reduce((acc, req) => {
      acc[req.category] = (acc[req.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(reqByCategory).forEach(([category, count]) => {
      console.log(`${category}: ${count}`);
    });

    console.log('\n=== Evaluation Criteria ===');
    result.data.evaluationCriteria.forEach((criterion) => {
      console.log(`${criterion.name}: ${criterion.maxScore} points (weight: ${criterion.weight}%)`);
    });
  } else {
    console.error('✗ Analysis failed');
    console.error(result.error?.message);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
