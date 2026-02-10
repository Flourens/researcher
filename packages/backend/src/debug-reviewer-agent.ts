import * as fs from 'fs';
import * as path from 'path';
import { ReviewerAgent } from './agents';
import type {
  GrantAnalysisOutput,
  ScientificContent,
} from '@researcher/shared';

const RESULTS_DIR = path.join(__dirname, '../../../results');

async function main() {
  console.log('=== Reviewer Agent Debug ===\n');

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

  // Load scientific proposal
  const proposalPath = path.join(RESULTS_DIR, 'scientific-proposal.json');
  if (!fs.existsSync(proposalPath)) {
    console.error(`Error: Scientific proposal not found at ${proposalPath}`);
    console.log('Please run debug-proposal-generation.ts first.');
    process.exit(1);
  }

  const scientificProposal: ScientificContent = JSON.parse(
    fs.readFileSync(proposalPath, 'utf-8')
  );
  console.log('Loaded scientific proposal\n');

  // Initialize agent
  const agent = new ReviewerAgent();

  // Execute review
  console.log('Starting proposal review...');
  console.log('Model: Claude Opus 4.6\n');

  const result = await agent.execute({
    grantAnalysis,
    scientificProposal,
  });

  if (result.success && result.data) {
    console.log('✓ Review completed successfully\n');

    // Save results
    const outputPath = path.join(RESULTS_DIR, 'review-results.json');
    fs.writeFileSync(
      outputPath,
      JSON.stringify(result.data, null, 2),
      'utf-8'
    );
    console.log(`Results saved to: ${outputPath}\n`);

    // Generate review report
    const reportPath = path.join(RESULTS_DIR, 'review-report.md');
    const report = generateReviewReport(result.data, grantAnalysis.grantTitle);
    fs.writeFileSync(reportPath, report, 'utf-8');
    console.log(`Review report saved to: ${reportPath}\n`);

    // Print summary
    console.log('=== Review Summary ===');
    console.log(`Overall Score: ${result.data.overallScore}/${result.data.maxScore} (${Math.round((result.data.overallScore / result.data.maxScore) * 100)}%)`);
    console.log(`Ready to Submit: ${result.data.readyToSubmit ? '✓ YES' : '✗ NO'}\n`);

    console.log('=== Section Scores ===');
    result.data.sectionScores.forEach((section) => {
      const percentage = Math.round((section.score / section.maxScore) * 100);
      console.log(`${section.section}: ${section.score}/${section.maxScore} (${percentage}%)`);
    });

    console.log('\n=== Critical Issues ===');
    const criticalIssues = result.data.weaknesses.filter(
      (w) => w.severity === 'critical'
    );
    if (criticalIssues.length > 0) {
      criticalIssues.forEach((issue, idx) => {
        console.log(`${idx + 1}. [${issue.section}] ${issue.issue}`);
        console.log(`   Suggestion: ${issue.suggestion}`);
      });
    } else {
      console.log('None found');
    }

    console.log('\n=== Missing Elements ===');
    if (result.data.missingElements.length > 0) {
      result.data.missingElements.forEach((element, idx) => {
        console.log(`${idx + 1}. ${element}`);
      });
    } else {
      console.log('None found');
    }

    console.log('\n=== Top Improvement Priorities ===');
    const topPriorities = result.data.improvementPriorities
      .filter((p) => p.priority === 'critical' || p.priority === 'high')
      .slice(0, 5);
    topPriorities.forEach((priority, idx) => {
      console.log(`${idx + 1}. [${priority.priority.toUpperCase()}] ${priority.area}`);
      console.log(`   ${priority.recommendation}`);
    });

    console.log('\n=== Executive Summary ===');
    console.log(result.data.executiveSummary);

    if (result.metadata) {
      console.log(`\nExecution Time: ${result.metadata.executionTime}ms`);
    }
  } else {
    console.error('✗ Review failed');
    console.error(result.error?.message);
    process.exit(1);
  }
}

function generateReviewReport(review: any, grantTitle: string): string {
  return `# Proposal Review Report
# ${grantTitle}

## Overall Assessment

**Score:** ${review.overallScore}/${review.maxScore} (${Math.round((review.overallScore / review.maxScore) * 100)}%)
**Ready to Submit:** ${review.readyToSubmit ? 'YES ✓' : 'NO ✗'}

## Executive Summary

${review.executiveSummary}

## Section Scores

${review.sectionScores
  .map((s: any) => {
    const pct = Math.round((s.score / s.maxScore) * 100);
    return `### ${s.section}: ${s.score}/${s.maxScore} (${pct}%)

${s.feedback}`;
  })
  .join('\n\n')}

## Strengths

${review.strengths.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}

## Weaknesses

${review.weaknesses
  .map((w: any) => `### [${w.severity.toUpperCase()}] ${w.section}

**Issue:** ${w.issue}

**Suggestion:** ${w.suggestion}`)
  .join('\n\n')}

## Missing Elements

${review.missingElements.length > 0 ? review.missingElements.map((e: string, i: number) => `${i + 1}. ${e}`).join('\n') : 'None'}

## Improvement Priorities

${review.improvementPriorities
  .map((p: any) => `### [${p.priority.toUpperCase()}] ${p.area}

${p.recommendation}`)
  .join('\n\n')}

## Detailed Feedback by Section

${review.detailedFeedback
  .map((df: any) => `### ${df.section}

${df.comments.map((c: string, i: number) => `${i + 1}. ${c}`).join('\n')}`)
  .join('\n\n')}
`;
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
