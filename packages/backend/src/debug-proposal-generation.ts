import * as fs from 'fs';
import * as path from 'path';
import { ScientificWritingAgent } from './agents';
import type {
  GrantAnalysisOutput,
  OrganizationInfo,
  FeasibilityEvaluation,
} from '@researcher/shared';

const RESULTS_DIR = path.join(__dirname, '../../../results');

async function main() {
  console.log('=== Scientific Proposal Generation Agent Debug ===\n');

  // Load grant analysis
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
    process.exit(1);
  }

  const organizationInfo: OrganizationInfo = JSON.parse(
    fs.readFileSync(orgInfoPath, 'utf-8')
  );
  console.log(`Loaded organization info: ${organizationInfo.name}\n`);

  // Load feasibility evaluation
  const feasibilityPath = path.join(RESULTS_DIR, 'feasibility-evaluation.json');
  if (!fs.existsSync(feasibilityPath)) {
    console.error(`Error: Feasibility evaluation not found at ${feasibilityPath}`);
    console.log('Please run debug-feasibility-agent.ts first.');
    process.exit(1);
  }

  const feasibilityEvaluation: FeasibilityEvaluation = JSON.parse(
    fs.readFileSync(feasibilityPath, 'utf-8')
  );
  console.log(`Loaded feasibility evaluation (${feasibilityEvaluation.overallChance}% success chance)\n`);

  // Optional: Load business context if available
  let businessContext: string | undefined;
  const businessContextPath = path.join(RESULTS_DIR, 'business-context.txt');
  if (fs.existsSync(businessContextPath)) {
    businessContext = fs.readFileSync(businessContextPath, 'utf-8');
    console.log(`Loaded business context (${businessContext.length} characters)\n`);
  }

  // Initialize agent
  const agent = new ScientificWritingAgent();

  // Execute proposal generation
  console.log('Starting scientific proposal generation...');
  console.log('Language: English');
  console.log('Model: Claude Opus 4.6\n');

  const result = await agent.execute({
    grantAnalysis,
    organizationInfo,
    feasibilityEvaluation,
    language: 'en',
    businessContext,
  });

  if (result.success && result.data) {
    console.log('✓ Proposal generation completed successfully\n');

    // Save results
    const outputPath = path.join(RESULTS_DIR, 'scientific-proposal.json');
    fs.writeFileSync(
      outputPath,
      JSON.stringify(result.data, null, 2),
      'utf-8'
    );
    console.log(`Results saved to: ${outputPath}\n`);

    // Save as markdown for readability
    const markdownPath = path.join(RESULTS_DIR, 'scientific-proposal.md');
    const markdown = `# ${grantAnalysis.grantTitle}

## Abstract

${result.data.abstract}

## Introduction

${result.data.introduction}

## State of the Art

${result.data.stateOfTheArt}

## Methodology

${result.data.methodology}

## Work Plan

${result.data.workPlan}

## Expected Results

${result.data.expectedResults}

## Impact

${result.data.impact}

## Bibliography

${result.data.bibliography.map((ref, idx) => `${idx + 1}. ${ref}`).join('\n')}
`;

    fs.writeFileSync(markdownPath, markdown, 'utf-8');
    console.log(`Markdown version saved to: ${markdownPath}\n`);

    // Print statistics
    console.log('=== Proposal Statistics ===');
    console.log(`Abstract: ${result.data.abstract.length} characters`);
    console.log(`Introduction: ${result.data.introduction.length} characters`);
    console.log(`State of the Art: ${result.data.stateOfTheArt.length} characters`);
    console.log(`Methodology: ${result.data.methodology.length} characters`);
    console.log(`Work Plan: ${result.data.workPlan.length} characters`);
    console.log(`Expected Results: ${result.data.expectedResults.length} characters`);
    console.log(`Impact: ${result.data.impact.length} characters`);
    console.log(`Bibliography: ${result.data.bibliography.length} references`);

    const totalWords = Object.values(result.data)
      .filter((v) => typeof v === 'string')
      .join(' ')
      .split(/\s+/).length;
    console.log(`\nTotal Words: ~${totalWords}`);

    if (result.metadata) {
      console.log(`\nExecution Time: ${result.metadata.executionTime}ms`);
      console.log(`Model Used: ${result.metadata.modelUsed}`);
    }
  } else {
    console.error('✗ Proposal generation failed');
    console.error(result.error?.message);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
