#!/usr/bin/env ts-node
/**
 * Rewrite Variant A (AI-SmartGrid) with strong cybersecurity emphasis.
 * Management requirement: highlight cybersecurity for smart grids.
 *
 * Pipeline: Writer (EN) → Reviewer → Writer (UA) → Fill DOCX
 */

import * as fs from 'fs';
import * as path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import type { GrantAnalysisOutput, OrganizationInfo, FeasibilityEvaluation } from '@researcher/shared';
import {
  SMART_GRID_VARIANTS,
  NANSEN_EDU_SMARTGRID_SYSTEM_PROMPT,
  NANSEN_EDU_REVIEWER_SYSTEM_PROMPT,
  createNansenEduReviewerPrompt,
} from './agents/prompts/nansen-edu-smartgrid.prompts';
import { NANSEN_EDU_TEMPLATE } from './agents/prompts/nansen-edu.prompts';

const MODEL = 'claude-sonnet-4-6';
const WRITER_MAX_TOKENS = 32768;
const REVIEWER_MAX_TOKENS = 16384;
const RESULTS_DIR = path.join(__dirname, '../../../results');
const VARIANT_DIR = path.join(RESULTS_DIR, 'nansen-edu-2025-znu', 'smartgrid-variants', 'variant-a');

const client = new Anthropic();

const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 30000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callClaude(systemPrompt: string, userPrompt: string, maxTokens: number, label: string): Promise<string> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`  [API] ${label}${attempt > 1 ? ` [retry ${attempt}]` : ''}`);
    const start = Date.now();
    try {
      const response = await client.messages.create({
        model: MODEL, max_tokens: maxTokens, temperature: 1.0,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      const text = response.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map(b => b.text).join('');
      console.log(`  [API] Done in ${elapsed}s | in=${response.usage.input_tokens} out=${response.usage.output_tokens}`);
      return text;
    } catch (error: any) {
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      const retryable = error.message?.includes('529') || error.message?.includes('Overloaded') || error.message?.includes('Connection error') || error.status === 529;
      if (retryable && attempt < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
        console.log(`  [API] Retryable error after ${elapsed}s. Waiting ${delay/1000}s...`);
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries');
}

function parseJson<T>(response: string): T {
  const m = response.match(/```json\s*([\s\S]*?)```/);
  if (m) return JSON.parse(m[1].trim());
  const s = response.indexOf('{'), e = response.lastIndexOf('}');
  if (s !== -1 && e !== -1) return JSON.parse(response.substring(s, e + 1));
  throw new Error('No JSON found');
}

// ============================================================
// CYBERSECURITY-ENHANCED WRITING PROMPT
// ============================================================

const CYBER_SMARTGRID_SYSTEM_PROMPT = `You are an expert grant proposal writer specializing in Norwegian-Ukrainian educational cooperation programmes, particularly the Nansen Support Programme for Ukraine.

Your expertise includes:
- Writing compelling project descriptions for HK-dir (Norwegian Directorate for Higher Education and Skills)
- Structuring proposals EXACTLY according to the official HK-dir Project Description template
- Addressing cross-cutting issues (anti-corruption, gender equality, climate, SEAH) as required by Norwegian development cooperation
- Building persuasive narratives for educational capacity building in conflict-affected regions
- Deep expertise in SMART GRID CYBERSECURITY: grid resilience against cyber attacks, SCADA/ICS security, cybersecurity for critical energy infrastructure, AI-driven threat detection for power systems

You write in clear, professional English suitable for academic peer reviewers.

CRITICAL RULES:
- You MUST follow the exact section structure: 5 sections (Relevance, Design, Project Group, Impact, References)
- Content must be dense and substantive — every sentence must add value
- No filler text, no repetition between sections
- You MUST output valid JSON matching the specified schema
- Address ALL cross-cutting issues explicitly (anti-corruption, climate, gender, human rights, SEAH)
- CYBERSECURITY must be a MAJOR THEME throughout all sections — not just mentioned in passing`;

function createCyberSmartGridPrompt(grantAnalysis: string, orgInfo: string, feasibility: string, lang: string = 'en'): string {
  const langInstr = lang === 'uk'
    ? 'Пиши українською мовою. Використовуй професійну наукову українську мову.'
    : 'Write in English.';

  return `Generate a Project Description for the Nansen EDU 2025 Call for Applications.

PROJECT TITLE: AI-Powered Smart Grid Cybersecurity and Resilience Education for Ukraine's Energy Reconstruction (AI-SmartGrid)

=== CRITICAL MANAGEMENT REQUIREMENT ===
CYBERSECURITY FOR SMART GRIDS must be a CENTRAL THEME of this proposal — not a side topic.
Ukraine's energy infrastructure has been systematically targeted by Russian cyberattacks since 2015 (BlackEnergy, Industroyer/CrashOverride, Industroyer2). The 2022-2024 combined kinetic and cyber attacks have demonstrated that physical reconstruction without cybersecurity is futile. Smart grids introduce new attack surfaces (IoT sensors, SCADA systems, communication networks, AMI meters) that require trained cybersecurity professionals.

Key cybersecurity themes to weave throughout ALL sections:
1. SCADA/ICS security for power grid control systems
2. AI-driven anomaly detection and intrusion detection for grid networks
3. Cyber-physical security — protecting smart grid from combined kinetic+cyber threats
4. Critical infrastructure protection (CIP) frameworks (NERC CIP, IEC 62351, NIS2 Directive)
5. Cybersecurity training using digital twins of grid infrastructure (safe attack simulation)
6. Data protection for smart meter data and grid topology information
7. Supply chain security for grid equipment and software
8. Incident response and recovery for energy sector cyber incidents
9. Norway's expertise in energy sector cybersecurity (NVE, NSM, NTNU CCIS)
10. Ukraine's real-world experience surviving state-sponsored cyber attacks on energy infrastructure

This must appear in:
- Section 1.1: Cybersecurity threat landscape as a KEY NEED alongside physical destruction
- Section 1.2: Innovation — first cybersecurity-focused smart grid education in Ukraine
- Section 2.1: Dedicated WP or major activities on cybersecurity training, cyber range, CTF exercises
- Section 2.2: Cybersecurity risks AND cybersecurity as mitigation measure
- Section 3.1: Cybersecurity expertise in personnel
- Section 4.1: Impact on national critical infrastructure protection capability
=== END MANAGEMENT REQUIREMENT ===

THEMATIC FOCUS: AI/ML for smart grid management AND CYBERSECURITY, digital twins for energy systems with cyber attack simulation, predictive analytics for load forecasting, anomaly detection for grid fault AND intrusion detection, integration of distributed renewable energy sources with secure communication protocols.

CONSORTIUM:
- Coordinator/Applicant: NTNU (Norwegian University of Science and Technology, Trondheim, Norway)
  Strengths: NTNU is a global leader in energy systems research through its Department of Electric Energy and SINTEF Energy Research partnership. NTNU operates the National Smart Grid Laboratory (jointly with SINTEF). NTNU has strong cybersecurity research through the Centre for Cyber and Information Security (CCIS) and Department of Information Security and Communication Technology (IIK). Norway has extensive experience protecting critical energy infrastructure (NVE, Statnett, NSM collaboration).
- Ukrainian Partner 1: Zaporizhzhia National University (ZNU)
  Strengths: ZNU has active research in Smart Grids and Renewable Energy Systems, a Laboratory of Parallel and Distributed Computing (HPC for AI model training), ongoing digital twin research for industrial and energy systems, campus solar power installations providing real-world data, Microsoft Azure cloud infrastructure for scalable computing, Engineering Institute with electrical engineering programs. ZNU operates in a frontline city — first-hand experience with energy infrastructure attacks.
- Ukrainian Partner 2: [To be confirmed by NTNU]

THEMATIC PRIORITIES COVERED: Digital transformation, Environment and energy, STEM, Reconstruction

${langInstr}

${NANSEN_EDU_TEMPLATE}

GRANT ANALYSIS:
${grantAnalysis}

ORGANIZATION INFORMATION:
${orgInfo}

FEASIBILITY EVALUATION:
${feasibility}

Generate the Project Description in the following JSON format:
{
  "section1_1_background": "string (~1200-1500 words). Background, needs, target groups, planned results. MUST include: (a) Ukraine energy crisis — 70%+ generation capacity damaged, (b) CYBERSECURITY THREAT: Ukraine has been targeted by world's first grid-disabling cyberattacks (BlackEnergy 2015, Industroyer 2016, Industroyer2 2022) — reconstruction without cybersecurity is futile, (c) smart grids introduce NEW attack surfaces requiring trained professionals, (d) skills gap — no Ukrainian HEI offers combined AI + smart grid + cybersecurity curriculum, (e) Zaporizhzhia frontline context, (f) target groups with numbers, (g) SMART objectives including cybersecurity competencies.",

  "section1_2_alignment": "string (~800-1000 words). MUST cover: (a) builds on ZNU smart grid + NTNU energy + NTNU cybersecurity (CCIS) expertise, (b) aligns with NIS2 Directive requirements for critical infrastructure, (c) complements EU Cybersecurity Act and Ukraine's cybersecurity strategy, (d) INNOVATION: first programme combining AI + smart grid + cybersecurity education in Ukraine, (e) Living Lab with cyber range capability.",

  "section2_1_activities": "string (~1500-1800 words). 5 Work Packages. MUST include cybersecurity-specific activities: (a) WP1: curriculum with dedicated cybersecurity modules (SCADA security, AI for threat detection, cyber-physical security), (b) WP2: staff training including cybersecurity workshops, (c) WP3: student cybersecurity exercises (CTF, red team/blue team on grid digital twin), (d) WP4: Living Lab with CYBER RANGE — digital twin of grid for safe attack/defense simulation, (e) WP5: dissemination to national CERT-UA and critical infrastructure operators.",

  "section2_2_risks": "string (~1200-1500 words). All cross-cutting issues + cybersecurity-specific risks: data protection for grid topology data, export control for cybersecurity tools, responsible disclosure policies, dual-use considerations for offensive security training.",

  "section3_1_personnel": "string (~700 words). MUST include cybersecurity expertise at NTNU (CCIS/IIK department) and at ZNU (IT security, Azure cloud security).",

  "section3_2_collaboration": "string (~700 words). Division of work, management, stakeholder engagement including CERT-UA, NVE, energy sector CERTs.",

  "section4_1_impact": "string (~1200 words). Impact MUST include: building Ukraine's first cohort of smart grid cybersecurity professionals, contribution to national critical infrastructure protection, impact on energy sector resilience beyond the academic setting.",

  "section4_2_sustainability": "string (~700 words). Sustainability, evaluation methodology.",

  "references": ["string array of 12-15 references — MUST include cybersecurity references: Industroyer papers, NERC CIP, IEC 62351, NIS2 Directive, ENISA smart grid security reports"]
}

CRITICAL: Cybersecurity should appear substantively in EVERY section — not just mentioned but deeply integrated as a core project theme alongside AI and smart grids. Target: cybersecurity-related content should constitute ~30-40% of the total proposal.

Write content that would score 6-7/7 on each evaluation criterion.`;
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║  VARIANT A REWRITE: AI-SmartGrid + CYBERSECURITY     ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  const nansenDir = path.join(RESULTS_DIR, 'nansen-edu-2025-znu');
  const grantAnalysis = JSON.parse(fs.readFileSync(path.join(nansenDir, 'grant-analysis.json'), 'utf-8'));
  const orgInfo = JSON.parse(fs.readFileSync(path.join(nansenDir, 'organization-info-znu.json'), 'utf-8'));

  const feasibility = {
    overallChance: 72,
    recommendation: 'recommended',
    strengths: [
      'Strong thematic alignment with Nansen EDU priorities (Digital transformation, Energy, STEM, Reconstruction)',
      'NTNU is a world-class Norwegian HEI with both energy AND cybersecurity research centres',
      'ZNU has demonstrated wartime resilience — first-hand experience with energy infrastructure attacks',
      'ZNU has directly relevant research in smart grids, digital twins, and energy systems',
      'Cybersecurity for energy is a critical need recognized by EU (NIS2) and Norwegian authorities',
      'Existing NTNU-ZNU roadmap (2026-2028) demonstrates genuine partnership commitment',
    ],
    weaknesses: [
      'Second Ukrainian partner not yet confirmed',
      'ZNU personnel names not yet specified',
      'Cybersecurity curriculum is new territory for ZNU — requires significant NTNU support',
    ],
    recommendations: [
      'NTNU must confirm second Ukrainian HEI partner (ideally one with cybersecurity faculty)',
      'Name specific personnel including cybersecurity experts',
      'Ensure cybersecurity training uses only open-source, non-export-controlled tools',
    ],
    detailedAssessment: {
      thematicAlignment: { score: 95, maxScore: 100, notes: 'Covers Digital transformation + Energy + STEM + Reconstruction + Cybersecurity' },
      technicalCapability: { score: 80, maxScore: 100, notes: 'Strong in energy/smart grids, HPC available, cybersecurity is growth area' },
      financialCapacity: { score: 85, maxScore: 100, notes: '100% funding, no co-funding required' },
      partnershipReadiness: { score: 75, maxScore: 100, notes: 'NTNU-ZNU roadmap exists but Partner 2 TBD' },
      trackRecord: { score: 88, maxScore: 100, notes: 'Excellent grant portfolio and international mobility' },
    },
  };

  const variant = SMART_GRID_VARIANTS[0]; // variant-a

  // Remove old files so resume logic doesn't skip
  for (const f of ['project-description-en.json', 'review-results.json', 'project-description-uk.json']) {
    const fp = path.join(VARIANT_DIR, f);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  }

  const totalStart = Date.now();

  // ---- STEP 1: Generate English with cybersecurity emphasis ----
  console.log('[1/3] Generating English proposal with cybersecurity emphasis...');
  const enPrompt = createCyberSmartGridPrompt(
    JSON.stringify(grantAnalysis, null, 2),
    JSON.stringify(orgInfo, null, 2),
    JSON.stringify(feasibility, null, 2),
    'en'
  );

  const enResponse = await callClaude(CYBER_SMARTGRID_SYSTEM_PROMPT, enPrompt, WRITER_MAX_TOKENS, 'Writer EN [AI-SmartGrid+Cyber]');
  const proposalEN = parseJson<any>(enResponse);

  fs.writeFileSync(path.join(VARIANT_DIR, 'project-description-en.json'), JSON.stringify(proposalEN, null, 2));

  // Count cybersecurity mentions
  let cyberCount = 0;
  for (const [k, v] of Object.entries(proposalEN)) {
    if (typeof v === 'string') cyberCount += (v.toLowerCase().match(/cyber/g) || []).length;
  }

  const totalWords = Object.entries(proposalEN)
    .filter(([k, v]) => k !== 'references' && typeof v === 'string')
    .reduce((sum, [, v]) => sum + (v as string).split(/\s+/).length, 0);

  console.log(`  ✓ EN saved (~${totalWords} words, ${cyberCount} cyber* mentions)\n`);

  // ---- STEP 2: Review ----
  console.log('[2/3] Reviewing...');
  const reviewPrompt = createNansenEduReviewerPrompt(variant, JSON.stringify(proposalEN, null, 2), JSON.stringify(grantAnalysis, null, 2));
  const reviewResponse = await callClaude(NANSEN_EDU_REVIEWER_SYSTEM_PROMPT, reviewPrompt, REVIEWER_MAX_TOKENS, 'Reviewer [AI-SmartGrid+Cyber]');
  const review = parseJson<any>(reviewResponse);

  fs.writeFileSync(path.join(VARIANT_DIR, 'review-results.json'), JSON.stringify(review, null, 2));
  console.log(`  ✓ Review: ${review.overallScore}/7 | Qualifies: ${review.qualifiesForFunding ? 'YES' : 'NO'}`);
  if (review.criterionScores) {
    for (const cs of review.criterionScores) console.log(`    ${cs.criterion}: ${cs.score}/7`);
  }
  console.log();

  // ---- STEP 3: Ukrainian version ----
  console.log('[3/3] Generating Ukrainian version...');
  const uaPrompt = createCyberSmartGridPrompt(
    JSON.stringify(grantAnalysis, null, 2),
    JSON.stringify(orgInfo, null, 2),
    JSON.stringify(feasibility, null, 2),
    'uk'
  );
  const uaResponse = await callClaude(
    CYBER_SMARTGRID_SYSTEM_PROMPT.replace(
      'You write in clear, professional English suitable for academic peer reviewers.',
      'You write in clear, professional Ukrainian (українська мова) suitable for academic peer reviewers. All content must be in Ukrainian.'
    ),
    uaPrompt, WRITER_MAX_TOKENS, 'Writer UA [AI-SmartGrid+Cyber]'
  );
  const proposalUA = parseJson<any>(uaResponse);
  fs.writeFileSync(path.join(VARIANT_DIR, 'project-description-uk.json'), JSON.stringify(proposalUA, null, 2));
  console.log(`  ✓ UA saved\n`);

  // ---- DONE ----
  const elapsed = ((Date.now() - totalStart) / 1000 / 60).toFixed(1);
  console.log(`${'='.repeat(50)}`);
  console.log(`DONE in ${elapsed} min`);
  console.log(`  EN: ~${totalWords} words, ${cyberCount} cyber* mentions`);
  console.log(`  Review: ${review.overallScore}/7`);
  console.log(`  Files: ${VARIANT_DIR}/`);
  console.log(`\nRun fill-all-variants.py to generate DOCX files.`);
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
