/**
 * Nansen EDU 2025 — Smart Grid Theme Variants
 * 4 project topic variants for ZNU + NTNU partnership
 */

import { NANSEN_EDU_TEMPLATE } from './nansen-edu.prompts';

export interface SmartGridVariant {
  id: string;
  projectTitle: string;
  acronym: string;
  thematicFocus: string;
  description: string;
  znuStrengths: string;
  ntnuStrengths: string;
  thematicPriorities: string[];
}

export const SMART_GRID_VARIANTS: SmartGridVariant[] = [
  {
    id: 'variant-a',
    projectTitle: 'AI-Powered Smart Grid Education for Ukraine\'s Energy Resilience',
    acronym: 'AI-SmartGrid',
    thematicFocus: 'AI/ML for smart grid management, digital twins for energy systems, predictive analytics for load forecasting, integration of distributed renewable energy sources',
    description: `Focus on training engineers to apply AI and machine learning to smart grid management in the context of Ukraine's devastated energy infrastructure. The project develops curricula covering: neural network-based load forecasting, reinforcement learning for grid optimization, anomaly detection for grid fault prediction, AI-driven demand response systems, and digital twin modeling of electrical networks. Students learn to build intelligent energy management systems that can handle the complexity of reconstructed grids with high renewable penetration.`,
    znuStrengths: `ZNU has active research in Smart Grids and Renewable Energy Systems, a Laboratory of Parallel and Distributed Computing (HPC for AI model training), ongoing digital twin research for industrial and energy systems, campus solar power installations providing real-world data, Microsoft Azure cloud infrastructure for scalable computing, and an Engineering Institute with electrical engineering programs.`,
    ntnuStrengths: `NTNU is a global leader in energy systems research through its Department of Electric Energy and SINTEF Energy Research partnership. NTNU operates the National Smart Grid Laboratory (jointly with SINTEF), has extensive experience in AI for power systems, energy markets, and grid optimization. NTNU's Faculty of Information Technology and Electrical Engineering (IE) covers both AI/ML and power engineering.`,
    thematicPriorities: ['Digital transformation', 'Environment and energy', 'STEM', 'Reconstruction'],
  },
  {
    id: 'variant-b',
    projectTitle: 'Smart and Resilient Energy Systems for Ukraine\'s Post-War Reconstruction',
    acronym: 'SmartEnergy-UA',
    thematicFocus: 'Energy system resilience, microgrids, demand response, energy storage, grid reconstruction engineering',
    description: `Focus on preparing engineers for the physical and systemic reconstruction of Ukraine's energy infrastructure. The project develops curricula covering: microgrid design and operation for decentralized energy security, energy storage systems (battery, pumped hydro, hydrogen), demand response mechanisms for grid stability, power system resilience engineering against physical attacks, and renewable energy integration at scale. Less AI-heavy, more focused on practical energy engineering for reconstruction.`,
    znuStrengths: `ZNU has a Hydropower Professional College with expertise in power plant operations and energy system management, active research in renewable energy (solar, wind, hydropower), campus cogeneration and solar power systems demonstrating energy independence, Engineering Institute with power engineering programs, and experience operating educational facilities under wartime conditions with backup power and energy resilience measures.`,
    ntnuStrengths: `NTNU has world-leading expertise in hydropower engineering (Department of Civil and Environmental Engineering), energy storage research, power electronics and power systems (Department of Electric Energy), and extensive experience with Norwegian energy industry (Statkraft, Equinor, Statnett). NTNU operates the Norwegian National Centre for Hydropower.`,
    thematicPriorities: ['Environment and energy', 'Reconstruction and urban planning', 'STEM'],
  },
  {
    id: 'variant-c',
    projectTitle: 'Digital Twins and AI for Flexible Energy Systems Education',
    acronym: 'DigiTwin-Energy',
    thematicFocus: 'Digital twin technology for energy systems, AI-driven simulation and optimization, real-time monitoring and control, cyber-physical energy systems',
    description: `Narrow, deep focus on digital twin technology applied to energy systems. The project develops curricula covering: fundamentals of digital twin architecture (physical model + data model + service model), physics-informed neural networks for energy system modeling, real-time data integration from IoT sensors and SCADA systems, simulation-based optimization of grid operations, predictive maintenance using digital twins, and cybersecurity for digital energy infrastructure. Students learn to build, deploy, and maintain digital twins of power plants, substations, and distribution networks.`,
    znuStrengths: `ZNU has direct expertise in digital twins for industrial and energy systems, a Laboratory of Parallel and Distributed Computing providing HPC resources for simulation, active research combining IoT with industrial process modeling, Azure cloud infrastructure for digital twin deployment, and Engineering Institute researchers working on data-driven simulation and optimization.`,
    ntnuStrengths: `NTNU is a pioneer in digital twin research through its Department of Engineering Cybernetics and NTNU Digital Transformation initiative. NTNU operates the Gemini Center for Digital Twin Technology, has extensive experience in cyber-physical systems, industrial IoT, and model-based engineering. NTNU's SINTEF partnership provides industry-scale digital twin implementations.`,
    thematicPriorities: ['Digital transformation', 'Environment and energy', 'STEM'],
  },
  {
    id: 'variant-d',
    projectTitle: 'Smart Grid and Green Energy Transition Education for Ukraine',
    acronym: 'SmartGreen-UA',
    thematicFocus: 'Comprehensive smart grid education combining grid modernization, renewable energy, energy efficiency, green transition, and digital tools',
    description: `Broadest variant combining smart grids with the full green energy transition agenda. The project develops curricula covering: smart grid fundamentals and advanced metering infrastructure, renewable energy technologies and grid integration, energy efficiency in buildings and industry, power electronics for modern grids, electric vehicle charging infrastructure, energy market design and regulation, climate policy and energy planning, and basic digital tools for energy management. This variant covers the most thematic priorities and has the broadest appeal but less depth in any single area.`,
    znuStrengths: `ZNU brings all energy-related units together: Engineering Institute (electrical and power engineering), Hydropower Professional College (renewable energy and power plant operations), Faculty of Mathematics (computational tools and data analytics), campus solar and cogeneration systems (living lab for green energy), smart grid research group, and broad STEM education experience across multiple levels (college, bachelor, master).`,
    ntnuStrengths: `NTNU covers the full energy spectrum: Department of Electric Energy (power systems, smart grids), Department of Energy and Process Engineering (energy efficiency, thermal systems), Department of Civil and Environmental Engineering (hydropower), NTNU Energy Transition initiative, and extensive industry partnerships with Norwegian energy companies. NTNU's strategic priority is sustainable energy and the green transition.`,
    thematicPriorities: ['Digital transformation', 'Environment and energy', 'STEM', 'Reconstruction'],
  },
];

export const NANSEN_EDU_SMARTGRID_SYSTEM_PROMPT = `You are an expert grant proposal writer specializing in Norwegian-Ukrainian educational cooperation programmes, particularly the Nansen Support Programme for Ukraine.

Your expertise includes:
- Writing compelling project descriptions for HK-dir (Norwegian Directorate for Higher Education and Skills)
- Structuring proposals EXACTLY according to the official HK-dir Project Description template
- Addressing cross-cutting issues (anti-corruption, gender equality, climate, SEAH) as required by Norwegian development cooperation
- Building persuasive narratives for educational capacity building in conflict-affected regions
- Expertise in smart grid technologies, renewable energy, digital twins, and AI for energy systems

You write in clear, professional English suitable for academic peer reviewers.

CRITICAL RULES:
- You MUST follow the exact section structure: 5 sections (Relevance, Design, Project Group, Impact, References)
- Content must be dense and substantive — every sentence must add value
- No filler text, no repetition between sections
- You MUST output valid JSON matching the specified schema
- Address ALL cross-cutting issues explicitly (anti-corruption, climate, gender, human rights, SEAH)`;

export const createSmartGridWritingPrompt = (
  variant: SmartGridVariant,
  grantAnalysis: string,
  organizationInfo: string,
  feasibilityEvaluation: string,
  language: string = 'en',
  businessContext?: string,
): string => {
  const languageInstructions = {
    en: 'Write in English',
    uk: 'Пиши українською мовою',
  }[language] || 'Write in English';

  const contextSection = businessContext
    ? `\nPROJECT CONTEXT:\n${businessContext}\n\nUse this context to tailor the proposal to the specific partnership and regional needs.`
    : '';

  return `Generate a Project Description for the Nansen EDU 2025 Call for Applications.

PROJECT TITLE: ${variant.projectTitle} (${variant.acronym})

THEMATIC FOCUS: ${variant.thematicFocus}

PROJECT DESCRIPTION:
${variant.description}

CONSORTIUM:
- Coordinator/Applicant: NTNU (Norwegian University of Science and Technology, Trondheim, Norway)
  Strengths: ${variant.ntnuStrengths}
- Ukrainian Partner 1: Zaporizhzhia National University (ZNU)
  Strengths: ${variant.znuStrengths}
- Ukrainian Partner 2: [To be confirmed by NTNU — placeholder: a Ukrainian technical university with complementary energy/smart grid expertise]

THEMATIC PRIORITIES COVERED: ${variant.thematicPriorities.join(', ')}

${languageInstructions}

${NANSEN_EDU_TEMPLATE}

GRANT ANALYSIS:
${grantAnalysis}

ORGANIZATION INFORMATION:
${organizationInfo}

FEASIBILITY EVALUATION:
${feasibilityEvaluation}
${contextSection}

Generate the Project Description in the following JSON format matching the EXACT HK-dir template structure:
{
  "section1_1_background": "string (~2-3 pages, ~1200 words). Background, needs, target groups, planned results. Must clearly demonstrate: (a) the critical need for ${variant.thematicFocus} skills in Ukrainian energy sector for reconstruction and green transition, (b) war damage to Ukraine's energy infrastructure (70%+ of generation capacity damaged), (c) Zaporizhzhia context — frontline region, nuclear power plant zone, destroyed energy infrastructure, (d) skills gap in Ukrainian HEIs for smart grid / energy technologies, (e) specific target groups with numbers (students, staff, industry), (f) concrete SMART objectives and planned results with baselines.",

  "section1_2_alignment": "string (~1-2 pages, ~800 words). Alignment with other activities, innovation. Must cover: (a) builds on ZNU's existing energy and smart grid research, (b) complements NTNU's energy research excellence, (c) links to Erasmus+, Horizon, DAAD projects, (d) innovative elements specific to ${variant.acronym}, (e) added value beyond existing initiatives.",

  "section2_1_activities": "string (~3-4 pages, ~1800 words). Detailed work plan. Must include: (a) 5 Work Packages with activities, deliverables, timeline — WP1: Joint Curriculum Development, WP2: Staff Training & Exchanges, WP3: Student Training Programme, WP4: Living Lab & Pilot Projects, WP5: Dissemination & Sustainability; (b) timeline (Year 1: Foundation, Year 2: Pilots, Year 3: Scaling); (c) specific numbers: students trained, courses developed, exchanges; (d) teaching methodologies — blended learning, problem-based learning, industry projects.",

  "section2_2_risks": "string (~2-3 pages, ~1200 words). Risk assessment — MUST address ALL cross-cutting issues: (a) Security risks — Zaporizhzhia is frontline region, (b) Corruption — Ukraine CPI ~33/100, (c) Climate/environment, (d) Gender equality, (e) Human rights, (f) SEAH prevention, (g) Data protection and IT security, (h) Cost-effectiveness justification.",

  "section3_1_personnel": "string (~1-2 pages, ~700 words). Key personnel from each partner with relevant qualifications.",

  "section3_2_collaboration": "string (~1-2 pages, ~700 words). Division of work, management structure, communication, stakeholder engagement.",

  "section4_1_impact": "string (~2-3 pages, ~1200 words). Impact on target groups, institutional impact, regional/national impact, dissemination plan.",

  "section4_2_sustainability": "string (~1-2 pages, ~700 words). Sustainability plan, evaluation methodology, documentation.",

  "references": ["string array of 10-15 references in academic format"]
}

CRITICAL REQUIREMENTS:
1. Follow the EXACT 5-section structure from the HK-dir template
2. Address ALL 14 assessment sub-factors across the 4 evaluation criteria
3. ALL cross-cutting issues MUST be explicitly addressed
4. Include concrete numbers, metrics, timelines
5. Project titled "${variant.acronym}" — ${variant.projectTitle}
6. Duration: 3 years (July 2026 – June 2029)
7. Budget: NOK 5,000,000 (max), 30% cap on Norwegian partner personnel costs
8. Zaporizhzhia context is KEY: frontline city, energy infrastructure destroyed, reconstruction priority
9. Ukraine's energy crisis: 70%+ of generation capacity damaged by Russian attacks
10. Show how project contributes to ALL 3 Nansen EDU objectives
11. Thematic priorities: ${variant.thematicPriorities.join(', ')}

${language === 'en' ? 'Use professional English with clear structure and logical flow.' : ''}
${language === 'uk' ? 'Використовуй професійну наукову українську мову з чіткою структурою та логічним викладом.' : ''}

Write content that would score 6-7/7 on each evaluation criterion. Be specific, concrete, and persuasive.`;
};

// ============================================================
// NANSEN EDU REVIEWER PROMPT
// ============================================================

export const NANSEN_EDU_REVIEWER_SYSTEM_PROMPT = `You are an independent expert reviewer evaluating project proposals for the Nansen EDU 2025 programme (Norwegian Directorate for Higher Education and Skills — HK-dir).

You evaluate proposals with rigorous academic standards, scoring each criterion on a 1-7 scale.

CRITICAL RULES:
- Score STRICTLY according to the grading scale (1-7)
- Identify ALL missing required elements
- Be specific in criticism — cite exact sections and missing content
- You MUST output valid JSON matching the specified schema
- Never inflate scores — a score of 5+ requires genuinely strong content`;

export const NANSEN_EDU_EVALUATION_FRAMEWORK = `
=== NANSEN EDU 2025 EVALUATION FRAMEWORK ===

GRADING SCALE (1-7):
7 - Exceptional: Meets assessment factors in exceptional manner, no or only minor potential for improvement
6 - Excellent: Meets factors in excellent manner, very few or only minor potential for improvement
5 - Very good: Meets factors in very good manner, some clear potential for improvement, no significant shortcomings
4 - Good: Meets factors in good manner, some clear potential for improvement or significant shortcomings
3 - Fair: Meets factors in fair manner, substantial potential for improvement or significant shortcomings
2 - Poor: Meets factors in inadequate manner, decisive potential for improvement and/or shortcomings
1 - Very poor: Meets factors in clearly inadequate manner, very poorly described and justified

QUALIFICATION THRESHOLD: All sub-grades ≥ 4; at least two sub-grades ≥ 5

=== EVALUATION CRITERIA ===

CRITERION 1: RELEVANCE OF THE PROJECT (weight: 30%)
Sub-factors:
1.1) Need for the project and significance for target groups clearly demonstrated
1.2) Planned results are concrete and suitable to achieve call objectives
1.3) Level of ambition of results
1.4) Innovation and/or complementarity to other measures/activities
1.5) Knowledge of existing initiatives; added value beyond what exists

CRITERION 2: QUALITY OF PROJECT DESIGN AND IMPLEMENTATION (weight: 20%)
Sub-factors:
2.1) Concrete, comprehensive and realistic implementation plan
2.2) Quality of risk assessments, including cross-cutting issues and SEAH
2.3) Cost-effectiveness and sufficient resource allocation

CRITERION 3: QUALITY OF THE PROJECT GROUP AND COLLABORATIVE STRUCTURES (weight: 20%)
Sub-factors:
3.1) Complementarity of institutions/actors and overall expertise
3.2) Division of tasks shows commitment and active contribution from all partners
3.3) Clear and comprehensive plan for interaction between partners and stakeholders

CRITERION 4: PROJECT IMPACT (weight: 30%)
Sub-factors:
4.1) Potential impact for target groups, institutions, and actors in and outside the project
4.2) Quality of measures to ensure impacts are maintained after project end
4.3) Quality of measures to evaluate and document project impact

=== CROSS-CUTTING ISSUES (ALL MANDATORY) ===
1. Anti-corruption measures (Ukraine CPI < 69)
2. Climate and environment (carbon footprint reduction)
3. Gender equality in project design
4. Human rights assessment
5. SEAH (Sexual Exploitation, Abuse and Harassment) prevention
6. Data protection and IT security
7. Academic freedom and export control

=== KEY PROGRAMME REQUIREMENTS ===
- Applicant: Norwegian HEI (NOKUT accredited)
- Partners: Minimum 2 Ukrainian HEIs
- Budget: Max NOK 5,000,000 per project
- Duration: Up to 3 years
- Norwegian personnel: Max 30% of budget
- Must contribute to all 3 programme objectives:
  1. Strengthen Ukrainian HEI capacity
  2. Improve access to qualified professionals
  3. Establish long-term Norway-Ukraine cooperation
===`;

export const createNansenEduReviewerPrompt = (
  variant: SmartGridVariant,
  proposal: string,
  grantAnalysis: string,
): string => {
  return `Review the following Nansen EDU 2025 project proposal.

PROJECT: ${variant.projectTitle} (${variant.acronym})

${NANSEN_EDU_EVALUATION_FRAMEWORK}

GRANT ANALYSIS:
${grantAnalysis}

PROPOSAL TO REVIEW:
${proposal}

Evaluate the proposal and output your review in the following JSON format:
{
  "overallScore": number (weighted average: Relevance×0.3 + Design×0.2 + Group×0.2 + Impact×0.3, scale 1-7),
  "qualifiesForFunding": boolean (true only if ALL sub-grades ≥ 4 AND at least 2 sub-grades ≥ 5),
  "executiveSummary": "string (2-3 paragraph overall assessment)",
  "criterionScores": [
    {
      "criterion": "Relevance of the project",
      "weight": 30,
      "score": number (1-7),
      "subScores": {
        "1.1_need": number,
        "1.2_results": number,
        "1.3_ambition": number,
        "1.4_innovation": number,
        "1.5_added_value": number
      },
      "strengths": ["string"],
      "weaknesses": ["string"],
      "recommendations": ["string"]
    },
    {
      "criterion": "Quality of design and implementation",
      "weight": 20,
      "score": number (1-7),
      "subScores": {
        "2.1_implementation_plan": number,
        "2.2_risk_assessment": number,
        "2.3_cost_effectiveness": number
      },
      "strengths": ["string"],
      "weaknesses": ["string"],
      "recommendations": ["string"]
    },
    {
      "criterion": "Quality of project group",
      "weight": 20,
      "score": number (1-7),
      "subScores": {
        "3.1_complementarity": number,
        "3.2_task_division": number,
        "3.3_interaction_plan": number
      },
      "strengths": ["string"],
      "weaknesses": ["string"],
      "recommendations": ["string"]
    },
    {
      "criterion": "Project impact",
      "weight": 30,
      "score": number (1-7),
      "subScores": {
        "4.1_impact": number,
        "4.2_sustainability": number,
        "4.3_evaluation": number
      },
      "strengths": ["string"],
      "weaknesses": ["string"],
      "recommendations": ["string"]
    }
  ],
  "crossCuttingCompliance": {
    "antiCorruption": { "addressed": boolean, "quality": "string" },
    "climate": { "addressed": boolean, "quality": "string" },
    "gender": { "addressed": boolean, "quality": "string" },
    "humanRights": { "addressed": boolean, "quality": "string" },
    "seah": { "addressed": boolean, "quality": "string" },
    "dataProtection": { "addressed": boolean, "quality": "string" }
  },
  "topStrengths": ["string (top 3-5 overall strengths)"],
  "criticalWeaknesses": ["string (issues that must be fixed before submission)"],
  "improvementPriorities": [
    {
      "priority": "critical|high|medium|low",
      "area": "string",
      "recommendation": "string"
    }
  ]
}

REVIEW GUIDELINES:
1. Score STRICTLY — a 5 means "very good with some room for improvement", not average
2. Check that ALL 14 sub-factors are adequately addressed
3. Verify ALL cross-cutting issues are explicitly covered
4. Check for concrete numbers, timelines, SMART objectives
5. Assess whether the project genuinely contributes to Ukraine's reconstruction
6. Evaluate the credibility of the partnership (NTNU + ZNU)
7. Check budget references (NOK 5M, 30% cap for Norwegian personnel)
8. Assess sustainability — will results persist after funding ends?
9. Compare against the qualification threshold: all sub-grades ≥ 4, at least 2 ≥ 5
10. Be constructive — provide specific, actionable recommendations`;
};
