#!/usr/bin/env ts-node
/**
 * Nansen EDU 2025 — Smart Grid Variants Generator
 *
 * Generates 4 Smart Grid project description variants:
 *   A) AI-Powered Smart Grid (AI-SmartGrid)
 *   B) Smart and Resilient Energy Systems (SmartEnergy-UA)
 *   C) Digital Twins for Energy (DigiTwin-Energy)
 *   D) Smart Grid + Green Transition (SmartGreen-UA)
 *
 * For each variant: Writer (generates proposal) → Reviewer (scores proposal)
 * Then generates Ukrainian versions of each.
 */

import * as fs from 'fs';
import * as path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import type {
  GrantAnalysisOutput,
  OrganizationInfo,
  FeasibilityEvaluation,
} from '@researcher/shared';
import {
  SMART_GRID_VARIANTS,
  NANSEN_EDU_SMARTGRID_SYSTEM_PROMPT,
  NANSEN_EDU_REVIEWER_SYSTEM_PROMPT,
  createSmartGridWritingPrompt,
  createNansenEduReviewerPrompt,
  type SmartGridVariant,
} from './agents/prompts/nansen-edu-smartgrid.prompts';

// ============================================================
// CONFIG
// ============================================================

const MODEL = 'claude-sonnet-4-6';
const WRITER_MAX_TOKENS = 32768;
const REVIEWER_MAX_TOKENS = 16384;
const TEMPERATURE = 1.0;
const RESULTS_DIR = path.join(__dirname, '../../../results');
const OUTPUT_DIR = path.join(RESULTS_DIR, 'nansen-edu-2025-znu', 'smartgrid-variants');

// ============================================================
// HELPERS
// ============================================================

const client = new Anthropic();

interface NansenEduProposal {
  section1_1_background: string;
  section1_2_alignment: string;
  section2_1_activities: string;
  section2_2_risks: string;
  section3_1_personnel: string;
  section3_2_collaboration: string;
  section4_1_impact: string;
  section4_2_sustainability: string;
  references: string[];
}

const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 30000; // 30 seconds

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callClaude(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number,
  label: string
): Promise<string> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`  [API] Calling Claude (${MODEL}, ${maxTokens} tokens) for: ${label}${attempt > 1 ? ` [retry ${attempt}/${MAX_RETRIES}]` : ''}`);
    const startTime = Date.now();

    try {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: maxTokens,
        temperature: TEMPERATURE,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const text = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('');

      console.log(`  [API] Done in ${elapsed}s | input=${response.usage.input_tokens} output=${response.usage.output_tokens} stop=${response.stop_reason}`);

      return text;
    } catch (error: any) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const isRetryable = error.message?.includes('529') || error.message?.includes('Overloaded') || error.status === 529 || error.message?.includes('Connection error') || error.message?.includes('ECONNRESET') || error.message?.includes('socket hang up');

      if (isRetryable && attempt < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
        console.log(`  [API] Overloaded after ${elapsed}s. Waiting ${delay / 1000}s before retry ${attempt + 1}/${MAX_RETRIES}...`);
        await sleep(delay);
        continue;
      }

      console.error(`  [API] FAILED after ${elapsed}s (attempt ${attempt}): ${error.message}`);
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}

function parseJson<T>(response: string): T {
  // Try to extract from ```json ... ```
  const jsonMatch = response.match(/```json\s*([\s\S]*?)```/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1].trim());
  }
  // Try raw JSON
  const start = response.indexOf('{');
  const end = response.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    return JSON.parse(response.substring(start, end + 1));
  }
  throw new Error('No JSON found in response');
}

function proposalToMarkdown(variant: SmartGridVariant, proposal: NansenEduProposal): string {
  return `# PROJECT DESCRIPTION — NANSEN EDU 2025
# ${variant.projectTitle} (${variant.acronym})

**Coordinator:** NTNU (Norwegian University of Science and Technology)
**Ukrainian Partner 1:** Zaporizhzhia National University (ZNU)
**Ukrainian Partner 2:** [To be confirmed]
**Duration:** 3 years (July 2026 – June 2029)
**Budget:** NOK 5,000,000

---

## 1. Relevance of the Project

### 1.1 Background and Needs of the Project

${proposal.section1_1_background}

### 1.2 Alignment with Other Activities and Innovative Elements

${proposal.section1_2_alignment}

---

## 2. Design and Implementation

### 2.1 Activities, Measures and Approaches

${proposal.section2_1_activities}

### 2.2 Risk Factors and Mitigation Measures

${proposal.section2_2_risks}

---

## 3. The Project Group and Collaborative Structures

### 3.1 Key Personnel

${proposal.section3_1_personnel}

### 3.2 Involvement, Interaction and Division of Work

${proposal.section3_2_collaboration}

---

## 4. Project Impact

### 4.1 Impact and Dissemination

${proposal.section4_1_impact}

### 4.2 Duration of Impact and Evaluation

${proposal.section4_2_sustainability}

---

## 5. Reference List

${proposal.references.map((ref, idx) => `[${idx + 1}] ${ref}`).join('\n')}
`;
}

function countWords(proposal: NansenEduProposal): { sections: Record<string, number>; total: number } {
  const sections: Record<string, number> = {
    '1.1 Background': proposal.section1_1_background.split(/\s+/).length,
    '1.2 Alignment': proposal.section1_2_alignment.split(/\s+/).length,
    '2.1 Activities': proposal.section2_1_activities.split(/\s+/).length,
    '2.2 Risks': proposal.section2_2_risks.split(/\s+/).length,
    '3.1 Personnel': proposal.section3_1_personnel.split(/\s+/).length,
    '3.2 Collaboration': proposal.section3_2_collaboration.split(/\s+/).length,
    '4.1 Impact': proposal.section4_1_impact.split(/\s+/).length,
    '4.2 Sustainability': proposal.section4_2_sustainability.split(/\s+/).length,
  };
  const total = Object.values(sections).reduce((a, b) => a + b, 0);
  return { sections, total };
}

// ============================================================
// MAIN PIPELINE
// ============================================================

async function processVariant(
  variant: SmartGridVariant,
  grantAnalysis: GrantAnalysisOutput,
  organizationInfo: OrganizationInfo,
  feasibilityEvaluation: FeasibilityEvaluation,
): Promise<void> {
  const variantDir = path.join(OUTPUT_DIR, variant.id);
  if (!fs.existsSync(variantDir)) {
    fs.mkdirSync(variantDir, { recursive: true });
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`VARIANT: ${variant.acronym} — ${variant.projectTitle}`);
  console.log(`${'='.repeat(60)}`);

  // Check what's already done (resume support)
  const enJsonPath = path.join(variantDir, 'project-description-en.json');
  const reviewPath = path.join(variantDir, 'review-results.json');
  const ukJsonPath = path.join(variantDir, 'project-description-uk.json');

  let proposalEN: NansenEduProposal;
  let statsEN: { sections: Record<string, number>; total: number };

  // ---- STEP 1: Generate English proposal ----
  if (fs.existsSync(enJsonPath)) {
    proposalEN = JSON.parse(fs.readFileSync(enJsonPath, 'utf-8'));
    statsEN = countWords(proposalEN);
    console.log(`\n[1/4] English proposal already exists (~${statsEN.total} words) — SKIPPING`);
  } else {
    console.log(`\n[1/4] Generating English proposal...`);

    const writerPrompt = createSmartGridWritingPrompt(
      variant,
      JSON.stringify(grantAnalysis, null, 2),
      JSON.stringify(organizationInfo, null, 2),
      JSON.stringify(feasibilityEvaluation, null, 2),
      'en'
    );

    const writerResponse = await callClaude(
      NANSEN_EDU_SMARTGRID_SYSTEM_PROMPT,
      writerPrompt,
      WRITER_MAX_TOKENS,
      `Writer EN [${variant.acronym}]`
    );

    proposalEN = parseJson<NansenEduProposal>(writerResponse);
    statsEN = countWords(proposalEN);

    // Save English JSON + Markdown
    fs.writeFileSync(
      path.join(variantDir, 'project-description-en.json'),
      JSON.stringify(proposalEN, null, 2),
      'utf-8'
    );
    fs.writeFileSync(
      path.join(variantDir, 'project-description-en.md'),
      proposalToMarkdown(variant, proposalEN),
      'utf-8'
    );

    console.log(`  ✓ English proposal saved (~${statsEN.total} words)`);
    for (const [section, words] of Object.entries(statsEN.sections)) {
      console.log(`    ${section}: ~${words} words`);
    }
    console.log(`    References: ${proposalEN.references.length}`);
  }

  // ---- STEP 2: Review English proposal ----
  let review: any;
  if (fs.existsSync(reviewPath)) {
    review = JSON.parse(fs.readFileSync(reviewPath, 'utf-8'));
    console.log(`\n[2/4] Review already exists (score: ${review.overallScore}/7) — SKIPPING`);
  } else {
    console.log(`\n[2/4] Reviewing English proposal...`);

    const reviewerPrompt = createNansenEduReviewerPrompt(
      variant,
      JSON.stringify(proposalEN, null, 2),
      JSON.stringify(grantAnalysis, null, 2)
    );

    const reviewerResponse = await callClaude(
      NANSEN_EDU_REVIEWER_SYSTEM_PROMPT,
      reviewerPrompt,
      REVIEWER_MAX_TOKENS,
      `Reviewer [${variant.acronym}]`
    );

    review = parseJson<any>(reviewerResponse);

    // Save review
    fs.writeFileSync(
      path.join(variantDir, 'review-results.json'),
      JSON.stringify(review, null, 2),
      'utf-8'
    );

    // Print review summary
    console.log(`  ✓ Review completed`);
    console.log(`    Overall score: ${review.overallScore}/7`);
    console.log(`    Qualifies: ${review.qualifiesForFunding ? 'YES' : 'NO'}`);
    if (review.criterionScores) {
      for (const cs of review.criterionScores) {
        console.log(`    ${cs.criterion}: ${cs.score}/7 (weight: ${cs.weight}%)`);
      }
    }
    if (review.criticalWeaknesses?.length > 0) {
      console.log(`    Critical weaknesses: ${review.criticalWeaknesses.length}`);
      for (const w of review.criticalWeaknesses) {
        console.log(`      - ${w}`);
      }
    }

    // Save review as markdown report
    const reviewMd = generateReviewMarkdown(variant, review);
    fs.writeFileSync(
      path.join(variantDir, 'review-report.md'),
      reviewMd,
      'utf-8'
    );
  }

  // ---- STEP 3: Generate Ukrainian version ----
  if (fs.existsSync(ukJsonPath)) {
    console.log(`\n[3/4] Ukrainian version already exists — SKIPPING`);
  } else {
    console.log(`\n[3/4] Generating Ukrainian version...`);

    const writerPromptUA = createSmartGridWritingPrompt(
      variant,
      JSON.stringify(grantAnalysis, null, 2),
      JSON.stringify(organizationInfo, null, 2),
      JSON.stringify(feasibilityEvaluation, null, 2),
      'uk'
    );

    const writerResponseUA = await callClaude(
      NANSEN_EDU_SMARTGRID_SYSTEM_PROMPT.replace(
        'You write in clear, professional English suitable for academic peer reviewers.',
        'You write in clear, professional Ukrainian (українська мова) suitable for academic peer reviewers. All content must be in Ukrainian.'
      ),
      writerPromptUA,
      WRITER_MAX_TOKENS,
      `Writer UA [${variant.acronym}]`
    );

    const proposalUA = parseJson<NansenEduProposal>(writerResponseUA);
    const statsUA = countWords(proposalUA);

    // Save Ukrainian JSON + Markdown
    fs.writeFileSync(
      path.join(variantDir, 'project-description-uk.json'),
      JSON.stringify(proposalUA, null, 2),
      'utf-8'
    );
    fs.writeFileSync(
      path.join(variantDir, 'project-description-uk.md'),
      proposalToMarkdown(variant, proposalUA),
      'utf-8'
    );

    console.log(`  ✓ Ukrainian proposal saved (~${statsUA.total} words)`);
  }

  // ---- STEP 4: Summary ----
  const uaExists = fs.existsSync(ukJsonPath);
  const uaWords = uaExists ? countWords(JSON.parse(fs.readFileSync(ukJsonPath, 'utf-8'))).total : 0;

  console.log(`\n[4/4] Variant ${variant.acronym} complete!`);
  console.log(`  Files saved to: ${variantDir}`);
  console.log(`  EN: ~${statsEN.total} words | UA: ~${uaWords} words`);
  console.log(`  Review score: ${review?.overallScore || 'N/A'}/7 | Qualifies: ${review?.qualifiesForFunding ? 'YES' : 'NO'}`);
}

function generateReviewMarkdown(variant: SmartGridVariant, review: any): string {
  let md = `# Review Report: ${variant.acronym}\n## ${variant.projectTitle}\n\n`;
  md += `**Overall Score:** ${review.overallScore}/7\n`;
  md += `**Qualifies for Funding:** ${review.qualifiesForFunding ? 'YES ✓' : 'NO ✗'}\n\n`;
  md += `## Executive Summary\n\n${review.executiveSummary}\n\n`;

  if (review.criterionScores) {
    md += `## Criterion Scores\n\n`;
    for (const cs of review.criterionScores) {
      md += `### ${cs.criterion} (${cs.score}/7, weight: ${cs.weight}%)\n\n`;
      if (cs.subScores) {
        md += `**Sub-scores:**\n`;
        for (const [key, val] of Object.entries(cs.subScores)) {
          md += `- ${key}: ${val}/7\n`;
        }
        md += `\n`;
      }
      if (cs.strengths?.length) {
        md += `**Strengths:**\n${cs.strengths.map((s: string) => `- ${s}`).join('\n')}\n\n`;
      }
      if (cs.weaknesses?.length) {
        md += `**Weaknesses:**\n${cs.weaknesses.map((w: string) => `- ${w}`).join('\n')}\n\n`;
      }
      if (cs.recommendations?.length) {
        md += `**Recommendations:**\n${cs.recommendations.map((r: string) => `- ${r}`).join('\n')}\n\n`;
      }
    }
  }

  if (review.crossCuttingCompliance) {
    md += `## Cross-Cutting Compliance\n\n`;
    for (const [key, val] of Object.entries(review.crossCuttingCompliance) as any) {
      md += `- **${key}:** ${val.addressed ? '✓' : '✗'} — ${val.quality}\n`;
    }
    md += `\n`;
  }

  if (review.topStrengths?.length) {
    md += `## Top Strengths\n\n${review.topStrengths.map((s: string) => `- ${s}`).join('\n')}\n\n`;
  }

  if (review.criticalWeaknesses?.length) {
    md += `## Critical Weaknesses\n\n${review.criticalWeaknesses.map((w: string) => `- ${w}`).join('\n')}\n\n`;
  }

  if (review.improvementPriorities?.length) {
    md += `## Improvement Priorities\n\n`;
    for (const ip of review.improvementPriorities) {
      md += `- **[${ip.priority}]** ${ip.area}: ${ip.recommendation}\n`;
    }
    md += `\n`;
  }

  return md;
}

// ============================================================
// ENTRY POINT
// ============================================================

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  NANSEN EDU 2025 — Smart Grid Variants Generator       ║');
  console.log('║  4 variants × (Writer + Reviewer + Ukrainian) = 12 API ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // Load input data
  const nansenDir = path.join(RESULTS_DIR, 'nansen-edu-2025-znu');

  const grantAnalysis: GrantAnalysisOutput = JSON.parse(
    fs.readFileSync(path.join(nansenDir, 'grant-analysis.json'), 'utf-8')
  );
  console.log(`Loaded grant analysis: ${grantAnalysis.grantTitle}`);

  const organizationInfo: OrganizationInfo = JSON.parse(
    fs.readFileSync(path.join(nansenDir, 'organization-info-znu.json'), 'utf-8')
  );
  console.log(`Loaded organization info: ${organizationInfo.name}`);

  // Use the general feasibility evaluation (not the ZNU-as-applicant one with 15%)
  // We create a corrected feasibility since NTNU is the applicant
  const feasibilityEvaluation: FeasibilityEvaluation = {
    overallChance: 72,
    recommendation: 'recommended' as any,
    strengths: [
      'Strong thematic alignment with Nansen EDU priorities (Digital transformation, Energy, STEM, Reconstruction)',
      'NTNU is a world-class Norwegian HEI — eligible applicant with extensive international cooperation experience',
      'ZNU has demonstrated wartime resilience and continues operations from Zaporizhzhia',
      'ZNU has directly relevant research in smart grids, digital twins, and energy systems',
      'Existing NTNU-ZNU roadmap (2026-2028) demonstrates genuine partnership commitment',
      'ZNU has strong track record: 14 Erasmus+, 3 Horizon MSCA, DAAD projects',
    ],
    weaknesses: [
      'Second Ukrainian partner not yet confirmed (required by programme)',
      'Zaporizhzhia is a frontline region — security risks are significant',
      'ZNU personnel names not yet specified in proposal',
    ],
    recommendations: [
      'NTNU must identify and confirm second Ukrainian HEI partner before submission',
      'Name specific key personnel at both NTNU and ZNU',
      'Develop detailed contingency plans for security disruptions',
    ],
    detailedAssessment: {
      thematicAlignment: { score: 92, maxScore: 100, notes: 'Covers 4 of 7 thematic priorities' },
      technicalCapability: { score: 80, maxScore: 100, notes: 'Strong in energy/smart grids, HPC available' },
      financialCapacity: { score: 85, maxScore: 100, notes: '100% funding, no co-funding required' },
      partnershipReadiness: { score: 75, maxScore: 100, notes: 'NTNU-ZNU roadmap exists but Partner 2 TBD' },
      trackRecord: { score: 88, maxScore: 100, notes: 'Excellent grant portfolio and international mobility' },
    },
  };
  console.log(`Using corrected feasibility (NTNU as applicant): ${feasibilityEvaluation.overallChance}%\n`);

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Process variants sequentially (to avoid API rate limits)
  const results: Array<{ variant: SmartGridVariant; success: boolean; error?: string }> = [];
  const totalStart = Date.now();

  for (const variant of SMART_GRID_VARIANTS) {
    try {
      await processVariant(variant, grantAnalysis, organizationInfo, feasibilityEvaluation);
      results.push({ variant, success: true });
    } catch (error: any) {
      console.error(`\n  ✗ FAILED: ${variant.acronym} — ${error.message}`);
      results.push({ variant, success: false, error: error.message });
      // Continue to next variant
    }
  }

  // ============================================================
  // FINAL SUMMARY
  // ============================================================

  const totalElapsed = ((Date.now() - totalStart) / 1000 / 60).toFixed(1);

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`FINAL SUMMARY — completed in ${totalElapsed} minutes`);
  console.log(`${'═'.repeat(60)}\n`);

  // Load and display results
  for (const r of results) {
    if (r.success) {
      const reviewPath = path.join(OUTPUT_DIR, r.variant.id, 'review-results.json');
      if (fs.existsSync(reviewPath)) {
        const review = JSON.parse(fs.readFileSync(reviewPath, 'utf-8'));
        const scores = review.criterionScores?.map((cs: any) => `${cs.score}/7`).join(', ') || 'N/A';
        console.log(`  ✓ ${r.variant.acronym.padEnd(18)} | Score: ${review.overallScore}/7 | Qualifies: ${review.qualifiesForFunding ? 'YES' : 'NO'} | [${scores}]`);
      } else {
        console.log(`  ✓ ${r.variant.acronym.padEnd(18)} | Generated (no review)`);
      }
    } else {
      console.log(`  ✗ ${r.variant.acronym.padEnd(18)} | FAILED: ${r.error}`);
    }
  }

  console.log(`\n  Output directory: ${OUTPUT_DIR}`);

  // Create comparison summary
  const comparisonMd = createComparisonSummary(results);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'comparison-summary.md'), comparisonMd, 'utf-8');
  console.log(`  Comparison summary: ${path.join(OUTPUT_DIR, 'comparison-summary.md')}\n`);
}

function createComparisonSummary(
  results: Array<{ variant: SmartGridVariant; success: boolean; error?: string }>
): string {
  let md = `# Nansen EDU 2025 — Smart Grid Variants Comparison\n\n`;
  md += `Generated: ${new Date().toISOString()}\n\n`;
  md += `## Variants Overview\n\n`;
  md += `| # | Acronym | Title | Score | Qualifies | Thematic Priorities |\n`;
  md += `|---|---------|-------|-------|-----------|---------------------|\n`;

  for (const r of results) {
    if (r.success) {
      const reviewPath = path.join(OUTPUT_DIR, r.variant.id, 'review-results.json');
      if (fs.existsSync(reviewPath)) {
        const review = JSON.parse(fs.readFileSync(reviewPath, 'utf-8'));
        md += `| ${r.variant.id.split('-')[1].toUpperCase()} | ${r.variant.acronym} | ${r.variant.projectTitle} | ${review.overallScore}/7 | ${review.qualifiesForFunding ? '✓' : '✗'} | ${r.variant.thematicPriorities.join(', ')} |\n`;
      }
    } else {
      md += `| ${r.variant.id.split('-')[1].toUpperCase()} | ${r.variant.acronym} | ${r.variant.projectTitle} | FAILED | — | ${r.variant.thematicPriorities.join(', ')} |\n`;
    }
  }

  md += `\n## Detailed Scores\n\n`;
  for (const r of results) {
    if (!r.success) continue;
    const reviewPath = path.join(OUTPUT_DIR, r.variant.id, 'review-results.json');
    if (!fs.existsSync(reviewPath)) continue;
    const review = JSON.parse(fs.readFileSync(reviewPath, 'utf-8'));

    md += `### ${r.variant.acronym} — ${r.variant.projectTitle}\n\n`;
    if (review.criterionScores) {
      md += `| Criterion | Score | Weight |\n|-----------|-------|--------|\n`;
      for (const cs of review.criterionScores) {
        md += `| ${cs.criterion} | ${cs.score}/7 | ${cs.weight}% |\n`;
      }
      md += `\n`;
    }
    md += `**Executive Summary:** ${review.executiveSummary}\n\n`;
    if (review.topStrengths?.length) {
      md += `**Top Strengths:** ${review.topStrengths.join('; ')}\n\n`;
    }
    if (review.criticalWeaknesses?.length) {
      md += `**Critical Weaknesses:** ${review.criticalWeaknesses.join('; ')}\n\n`;
    }
    md += `---\n\n`;
  }

  return md;
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
