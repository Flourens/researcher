import * as fs from 'fs';
import * as path from 'path';
import { ApplicationPackageAgent } from './agents';
import type {
  GrantAnalysisOutput,
  OrganizationInfo,
  ScientificContent,
  ReviewOutput,
} from '@researcher/shared';

const RESULTS_DIR = path.join(__dirname, '../../../results');

async function main() {
  console.log('=== Application Package Agent Debug ===\n');

  // Load grant analysis
  const analysisPath = path.join(RESULTS_DIR, 'grant-analysis.json');
  if (!fs.existsSync(analysisPath)) {
    console.error(`Error: Grant analysis not found at ${analysisPath}`);
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

  // Load scientific proposal
  const proposalPath = path.join(RESULTS_DIR, 'scientific-proposal.json');
  if (!fs.existsSync(proposalPath)) {
    console.error(`Error: Scientific proposal not found at ${proposalPath}`);
    process.exit(1);
  }

  const scientificProposal: ScientificContent = JSON.parse(
    fs.readFileSync(proposalPath, 'utf-8')
  );
  console.log('Loaded scientific proposal\n');

  // Load review results
  const reviewPath = path.join(RESULTS_DIR, 'review-results.json');
  if (!fs.existsSync(reviewPath)) {
    console.error(`Error: Review results not found at ${reviewPath}`);
    process.exit(1);
  }

  const reviewResults: ReviewOutput = JSON.parse(
    fs.readFileSync(reviewPath, 'utf-8')
  );
  console.log('Loaded review results\n');

  // Initialize agent
  const agent = new ApplicationPackageAgent();

  // Execute package generation
  console.log('Starting application package generation...\n');

  const result = await agent.execute({
    grantAnalysis,
    organizationInfo,
    scientificProposal,
    reviewResults,
  });

  if (result.success && result.data) {
    console.log('✓ Application package generated successfully\n');

    // Save full results
    const outputPath = path.join(RESULTS_DIR, 'application-package.json');
    fs.writeFileSync(
      outputPath,
      JSON.stringify(result.data, null, 2),
      'utf-8'
    );
    console.log(`Results saved to: ${outputPath}\n`);

    // Create package directory
    const packageDir = path.join(RESULTS_DIR, 'application-package');
    if (!fs.existsSync(packageDir)) {
      fs.mkdirSync(packageDir, { recursive: true });
    }

    // Save each generated document
    console.log('Saving generated documents...');
    result.data.generatedDocuments.forEach((doc) => {
      const docPath = path.join(packageDir, doc.filename);
      fs.writeFileSync(docPath, doc.content, 'utf-8');
      console.log(`  - ${doc.filename}`);
    });

    // Generate checklist document
    const checklistPath = path.join(packageDir, 'submission-checklist.md');
    const checklist = generateChecklistDocument(result.data);
    fs.writeFileSync(checklistPath, checklist, 'utf-8');
    console.log(`  - submission-checklist.md\n`);

    // Print summary
    console.log('=== Package Summary ===');
    console.log(`Package ID: ${result.data.packageId}`);
    console.log(`Created: ${result.data.createdAt}`);
    console.log(`Generated Documents: ${result.data.generatedDocuments.length}`);
    console.log(`Manual Documents: ${result.data.manualDocuments.length}`);
    console.log(`Checklist Items: ${result.data.documentChecklist.length}`);

    console.log('\n=== Generated Documents ===');
    result.data.generatedDocuments.forEach((doc) => {
      console.log(`- ${doc.type}: ${doc.filename} (${doc.status})`);
    });

    console.log('\n=== Manual Documents Required ===');
    const requiredManual = result.data.manualDocuments.filter((d) => d.required);
    if (requiredManual.length > 0) {
      requiredManual.forEach((doc) => {
        console.log(`- ${doc.type}: ${doc.description}`);
      });
    } else {
      console.log('None');
    }

    console.log('\n=== Document Checklist ===');
    const incomplete = result.data.documentChecklist.filter(
      (item) => item.status !== 'complete'
    );
    console.log(`Complete: ${result.data.documentChecklist.length - incomplete.length}`);
    console.log(`Remaining: ${incomplete.length}`);

    console.log('\n=== Quality Checks ===');
    const failedChecks = result.data.qualityChecks.filter(
      (check) => check.status === 'failed'
    );
    if (failedChecks.length > 0) {
      console.log('Failed checks:');
      failedChecks.forEach((check) => {
        console.log(`  ✗ ${check.check}`);
        if (check.notes) console.log(`    ${check.notes}`);
      });
    } else {
      console.log('All checks passed or pending verification');
    }

    console.log('\n=== Next Steps ===');
    result.data.nextSteps.forEach((step, idx) => {
      console.log(`${idx + 1}. ${step}`);
    });

    console.log(`\nPackage saved to: ${packageDir}`);

    if (result.metadata) {
      console.log(`\nExecution Time: ${result.metadata.executionTime}ms`);
    }
  } else {
    console.error('✗ Package generation failed');
    console.error(result.error?.message);
    process.exit(1);
  }
}

function generateChecklistDocument(pkg: any): string {
  return `# Application Submission Checklist
# ${pkg.grantTitle}

**Package ID:** ${pkg.packageId}
**Created:** ${pkg.createdAt}

## Document Checklist

${pkg.documentChecklist
  .map((item: any) => {
    const status = {
      complete: '✓',
      in_progress: '⧗',
      not_started: '☐',
    }[item.status];
    let line = `- [${status}] ${item.item}`;
    if (item.responsible) line += ` (${item.responsible})`;
    if (item.deadline) line += ` - Deadline: ${item.deadline}`;
    if (item.notes) line += `\n  ${item.notes}`;
    return line;
  })
  .join('\n')}

## Generated Documents

${pkg.generatedDocuments
  .map((doc: any) => `- [${doc.status === 'generated' ? '✓' : '☐'}] ${doc.filename} (${doc.type})`)
  .join('\n')}

## Manual Documents Required

${pkg.manualDocuments
  .map((doc: any) => {
    const required = doc.required ? '[REQUIRED]' : '[OPTIONAL]';
    return `### ${required} ${doc.type}

**Description:** ${doc.description}

**Instructions:** ${doc.instructions}`;
  })
  .join('\n\n')}

## Quality Checks

${pkg.qualityChecks
  .map((check: any) => {
    const status = {
      passed: '✓',
      failed: '✗',
      not_checked: '☐',
    }[check.status];
    let line = `- [${status}] ${check.check}`;
    if (check.notes) line += `\n  ${check.notes}`;
    return line;
  })
  .join('\n')}

## Submission Guidelines

${pkg.submissionGuidelines.map((guideline: string, i: number) => `${i + 1}. ${guideline}`).join('\n')}

## Next Steps

${pkg.nextSteps.map((step: string, i: number) => `${i + 1}. ${step}`).join('\n')}
`;
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
