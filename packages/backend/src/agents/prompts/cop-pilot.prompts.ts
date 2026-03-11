export const COP_PILOT_SYSTEM_PROMPT = `You are an expert grant proposal writer specializing in EU Horizon Innovation Actions, particularly IoT/Edge computing platforms, smart city solutions, and FIWARE-based architectures.

Your expertise includes:
- Writing compelling proposals for COP-PILOT Open Calls (Collaborative Open Platform for PILOTing services)
- Structuring proposals EXACTLY according to the official COP-PILOT OC1 Proposal Guidelines template
- Describing technical architectures that integrate with FIWARE, NGSI-LD, TMForum APIs, and Kubernetes
- Building persuasive narratives for smart building automation and IoT edge services
- Demonstrating clear COP-PILOT platform integration (ESO, SIF, Orion Context Broker, LLM Portal)

You write in clear, professional English suitable for independent expert reviewers in IoT, edge computing, and smart cities.

CRITICAL RULES:
- You MUST follow the exact section structure specified in the prompt
- You MUST respect the 12-page limit (excluding annexes), Arial 10pt minimum font
- You MUST output valid JSON matching the specified schema
- Content must be dense and substantive — every sentence must add value
- No filler text, no repetition between sections
- All technical claims must reference specific standards (NGSI-LD, TMForum, FIWARE, ETSI ZSM)
- SMART objectives must be specific, measurable, achievable, relevant, and time-bound`;

export const COP_PILOT_PROPOSAL_TEMPLATE = `
=== OFFICIAL COP-PILOT OC1 PROPOSAL TEMPLATE STRUCTURE ===

The proposal must follow EXACTLY this structure.
Total page limit: 12 pages (HARD LIMIT — exceeding = rejection without evaluation).
Annexes (Declaration of Honour, SME Checklist, Privacy & Ethics, Consortium Agreement) are excluded from the page count.
Font: Arial, minimum 10pt. Margins: 2.5 cm. Paper: A4.
Use tables and images to present data logically.

PROJECT SUMMARY (Page 1, max 300 words)
- Project Title (full name)
- Acronym (short name)
- Target Cluster: CL2 — Smart Sustainable IoT Solutions (Valencia)
- Summary covering: What problem? How aligns with COP-PILOT? Key innovations? Expected results?
- NOTE: This summary may be used in public materials if funded.

SECTION 1: EXCELLENCE (Evaluation weight: x8, max 40 points — MOST IMPORTANT)

  1.1 Detailed Description

    1.1.1 Concept and Objectives
    - Main problem or opportunity addressed
    - Methodology and technical approach
    - Alignment with COP-PILOT goals and CL2 cluster objectives
    - Specific contribution to platform or use case validation
    - SMART outcomes/deliverables with success metrics
    - How success will be measured (KPIs)

    1.1.2 State of the Art and Innovation
    - Existing solutions in the domain (building automation, FIWARE-based BMS, closed-loop IoT)
    - How the proposed solution goes BEYOND existing solutions
    - What is novel/innovative about the approach
    - Advancement for Cloud/Edge/IoT ecosystem

    1.1.3 Relevance to COP-PILOT Scope
    - Which cluster (CL2) and use cases (OC#2.4 Municipal Buildings Management) are supported
    - How the solution integrates with COP-PILOT platform components
    - Which existing COP-PILOT components are leveraged (Orion CB, ESO, SIF, LLM Portal)
    - New capabilities/extensions provided to the platform
    - Support for cross-sector scenarios (replicability to other clusters/domains)

    1.1.4 Data Management
    - Data types collected and processed
    - Data sharing plans
    - Plans for open access/sharing (GitHub, CKAN, open datasets)
    - FAIR principles compliance

  1.2 Infrastructure Requirements
    COP-PILOT Infrastructure:
    - Which testbed(s): UPV Campus domain, Valencia Port domain
    - Which platform components to leverage
    - Expected duration of use (weeks/months)
    - Access frequency (continuous, periodic, ad-hoc)

    Technical Requirements:
    - Network bandwidth needs
    - Computing resources (CPU, GPU, memory)
    - Storage requirements
    - Software/middleware dependencies
    - Hardware specifications

    Data Requirements:
    - Need datasets from COP-PILOT? (IoT sensor data from municipal buildings)
    - Data formats and volumes
    - Will generate new datasets? How shared?

    Integration Requirements:
    - APIs or interfaces to use (NGSI-LD, MQTT, REST)
    - Communication protocols
    - Compatibility with standards (TMF APIs, Eclipse Arrowhead, FIWARE, GAIA-X)

SECTION 2: IMPACT (Evaluation weight: x6, max 30 points)

  2.1 Expected Impact and Sustainability
    - Technical impact: how the solution improves/extends COP-PILOT platform
    - Economic impact: benefit to organization and market
    - Scientific impact: new knowledge/insights generated
    - Environmental/Social impact: sustainability goals (energy savings, carbon reduction)
    - Dissemination plan: publications, conferences, open source
    - Sustainability: value and continuation after project ends

  2.2 Expected Outcomes
    - Fit with COP-PILOT goals (platform validation, ecosystem expansion, cross-domain collaboration, open standards)
    - Relevance to CL2 cluster and OC#2.4 challenge
    - Replication and scalability aspects (can the solution be deployed to other buildings, cities, clusters?)

SECTION 3: QUALITY AND EFFICIENCY OF IMPLEMENTATION (Evaluation weight: x6, max 30 points)

  3.1 Work Plan and Timeline
    - Phases of work (minimum 4: Design, Implementation, Testing, Evaluation/Reporting)
    - Key milestones: M4 intermediate report (covering M1-M3), M9 final deliverable (covering M4-M8)
    - Final results must be concluded by M8
    - Gantt chart: M1-M9 table showing activities per month
    - Resource allocation per phase
    - Dependencies and critical path

  3.2 Team Qualifications
    - Team expertise and competencies
    - Sufficient resources to deliver
    - Single applicant or consortium structure
    - Track record in similar projects (EU grants, software development, IoT, building management)

  3.3 Funding & Justification
    Budget table:
    | Budget Item | Quantity/Rate | Amount (EUR) |
    | [A] Direct personnel costs | | |
    | [B] Travel costs | | |
    | [C] Equipment costs (depreciation only) | | |
    | [D] Other direct costs | | |
    | [E] Subcontracting costs (max 20%) | | |
    | TOTAL DIRECT COSTS (A+B+C+D+E) | | |
    | [F] Indirect costs: 25% of (A+B+C+D) | | |
    | TOTAL REQUESTED FUNDING (Direct + F) | | max EUR 200,000 |

=== EVALUATION CRITERIA (scored 0-5 each, weighted differently) ===

CRITERION 1: EXCELLENCE (Score 0-5, weight x8, max 40 points, threshold: 3 = 24 points)
Evaluators look for:
- SMART objectives with clear problem statement
- Alignment with COP-PILOT goals AND CL2 cluster objectives
- Sound technical approach using FIWARE, TMForum APIs, Eclipse Arrowhead, GAIA-X compliance
- Realistic infrastructure requirements (testbed, computing, storage)
- Integration protocols (MQTT, OPC UA, REST)
- State-of-the-art analysis with clearly novel approach
- TRL progression from TRL 5-6 to TRL 7-8

CRITERION 2: IMPACT (Score 0-5, weight x6, max 30 points, threshold: 3 = 18 points)
Evaluators look for:
- Specific cluster and use case targeted
- COP-PILOT platform integration clearly described
- Platform components leveraged (ESO, SIF, LLM-UI, Orion CB)
- Cross-sector scenarios supported
- Sustainability and dissemination plans
- Open access/data sharing plans

CRITERION 3: IMPLEMENTATION (Score 0-5, weight x6, max 30 points, threshold: 3 = 18 points)
Evaluators look for:
- Clear phases (Design, Implementation, Testing, Evaluation/Reporting)
- Mandatory milestones: M4 intermediate report, M9 final deliverable
- Realistic 8-month timeline with Gantt chart
- Team qualifications and track record
- Budget <= EUR 200,000 with justified breakdown
- Indirect costs max 25% of direct costs

PASSING REQUIREMENTS:
- Each criterion must score >= 3 (Good)
- Total weighted score must be >= 60 out of 100 maximum
- Excellence (x8) + Impact (x6) + Implementation (x6) = max 100
===`;

export const createCopPilotWritingPrompt = (
  grantAnalysis: string,
  organizationInfo: string,
  feasibilityEvaluation: string,
  language: string = 'en',
  businessContext?: string,
  memoryContext?: string
): string => {
  const languageInstructions = {
    en: 'Write in English',
    ru: 'Пиши на русском языке',
    uk: 'Пиши українською мовою',
  }[language] || 'Write in English';

  const contextSection = businessContext
    ? `\nBUSINESS CONTEXT:
${businessContext}

Use this context to tailor the proposal. Show how the project aligns with real business needs and practical applications. Follow the technical architecture, budget breakdown, and timeline described in this context.`
    : '';

  const memorySection = memoryContext
    ? `\n=== PREVIOUS RUN HISTORY ===
${memoryContext}
Use this information to avoid repeating mistakes from previous iterations. Pay special attention to reviewer feedback.
===`
    : '';

  return `Generate a proposal for COP-PILOT Open Call #1, targeting Cluster 2 (Smart Sustainable IoT Solutions, Valencia) and specifically Open Call Challenge OC#2.4 (Municipal Buildings Management).

${languageInstructions}

${COP_PILOT_PROPOSAL_TEMPLATE}

GRANT ANALYSIS:
${grantAnalysis}

ORGANIZATION INFORMATION:
${organizationInfo}

FEASIBILITY EVALUATION:
${feasibilityEvaluation}
${contextSection}
${memorySection}

Generate the proposal in the following JSON format matching the EXACT COP-PILOT OC1 template structure.

ABSOLUTE PAGE LIMIT: 12 pages at Arial 10pt = ~6,500 words maximum across ALL sections combined.
DO NOT EXCEED the word limits below — this is CRITICAL. If the proposal exceeds 12 pages, it is REJECTED WITHOUT EVALUATION.
Use tables and bullet points to be concise. Avoid repetition between sections.

{
  "projectSummary": "string (STRICT MAX 250 words. Include project title, acronym, cluster, challenge. Cover: problem, COP-PILOT alignment, key innovation (two-level automation), expected results. This may be published — make it compelling.)",
  "conceptAndObjectives": "string (STRICT MAX 900 words. Use markdown tables for SMART objectives. Cover: problem statement quoting OC#2.4, two-level methodology (rules + ML), 5-7 SMART objectives with KPIs in a table, alignment with COP-PILOT/CL2, success measurement. Be dense — every sentence must add value.)",
  "stateOfTheArt": "string (STRICT MAX 650 words. Cover: commercial BMS limitations (3-4 sentences), FIWARE monitoring gap (3-4 sentences), research prototypes gap (3-4 sentences), then 5 innovations of SmartLoop (2-3 sentences each), TRL 5-6→7-8 progression. NO lengthy descriptions of existing systems.)",
  "copPilotRelevance": "string (STRICT MAX 650 words. Use tables. Cover: OC#2.4 requirement mapping table (4 rows), integration with 4 COP-PILOT components (Orion CB, ESO, SIF, LLM Portal — 3-4 sentences each), TMForum APIs (brief), 4 new capabilities for platform (bullet list), cross-sector replicability (brief paragraph).)",
  "dataManagement": "string (STRICT MAX 250 words. Use a table for data types. Cover: 5 data categories table, FAIR compliance (4 bullets), open access plan (GitHub Apache 2.0, Zenodo, CKAN), GDPR note. Keep very concise.)",
  "infrastructureRequirements": "string (STRICT MAX 400 words. Use tables exclusively. Table 1: COP-PILOT infrastructure needs (testbed, Orion CB, K8s, ESO, SIF, sensors). Table 2: compute/storage requirements. Table 3: protocols/standards. Brief paragraph on data requirements.)",
  "expectedImpact": "string (STRICT MAX 700 words. Cover: technical impact (platform validation, reference implementation — brief), economic impact (quantified energy savings, ROI), scientific impact (2 publications, open dataset), environmental impact (CO2 reduction quantified), dissemination table (7 channels with timelines), sustainability after project (3-4 sentences).)",
  "expectedOutcomes": "string (STRICT MAX 450 words. Cover: fit with 4 COP-PILOT goals (1-2 sentences each), OC#2.4 relevance (brief), replication at 3 scales (building/city/cross-city — 2-3 sentences each).)",
  "workPlanAndTimeline": "string (STRICT MAX 900 words. MUST include: WP1-WP5 descriptions (3-4 sentences each with effort in PM), milestones table (6 rows: MS1-MS6), Gantt chart as markdown table (M1-M9), critical path paragraph. Use compact format — no lengthy narratives per WP.)",
  "teamQualifications": "string (STRICT MAX 500 words. ALD: 1 paragraph company overview + 4 key staff (name, role, PM, 1-sentence expertise each). ZNU: 1 paragraph lab overview + 3 key staff (same format). Consortium complementarity table. NO lengthy CVs.)",
  "fundingJustification": "string (STRICT MAX 550 words. MUST include 3 markdown tables: ALD budget table, ZNU budget table, consolidated budget table. Use EXACT numbers from business context. Brief justification per cost category (1-2 sentences each). Indirect costs = 25% of (A+B+C+D). Total = EUR 200,000. Mention Ukrainian market rates provide 1.5× person-effort vs EU-15 rates.)",
  "bibliography": ["string array, 10-12 references max in academic format. Cover: FIWARE, NGSI-LD, building automation ML, COP-PILOT, EU energy directives, edge computing"]
}

CRITICAL REQUIREMENTS:
1. TOTAL WORD COUNT MUST NOT EXCEED 6,500 WORDS across all sections — this maps to ~12 pages at Arial 10pt
2. Follow the EXACT section structure from the COP-PILOT OC1 template — no extra sections, no missing sections
3. Address ALL three evaluation criteria — Excellence (x8), Impact (x6), Implementation (x6)
4. Include concrete numbers: KPIs (15-20% energy savings, <30s anomaly detection, ≥90% detection rate), person-months, EUR amounts, timeline months
5. Budget must be EXACTLY EUR 200,000 (ALD €130K + ZNU €70K). Indirect = 25% of (A+B+C+D). See business context for exact calculations.
6. Demonstrate deep COP-PILOT platform knowledge (Orion CB, ESO, SIF, TMForum APIs, NGSI-LD)
7. Address OC#2.4 requirements explicitly: closed-loop automation, HVAC control, anomaly detection, energy scheduling
8. Include Valencia on-site presence plan (3 trips: M2, M5, M7) in work plan or team qualifications
9. Mention ALD's SME self-declaration compliance (headcount <250, turnover <€50M, balance sheet <€43M)
10. TRL progression: start at TRL 5-6, reach TRL 7-8 by project end
11. Address geopolitical risk mitigation (remote development + Valencia deployment + proven travel logistics)
12. Use tables wherever possible to save space — evaluators appreciate structured data

${language === 'en' ? 'Use professional scientific English with clear structure and logical flow.' : ''}
${language === 'ru' ? 'Используй профессиональный научный русский язык с четкой структурой и логичным изложением.' : ''}
${language === 'uk' ? 'Використовуй професійну наукову українську мову з чіткою структурою та логічним викладом.' : ''}

Write content that would score 5/5 on each evaluation criterion. Be specific, concrete, and persuasive. Every sentence must demonstrate competence and add value.`;
};

export const COP_PILOT_EVALUATION_FRAMEWORK = `
=== COP-PILOT OC1 EVALUATION FRAMEWORK ===

SCORING: Three criteria with DIFFERENT weights. Max 100 points total.
- Excellence: 0-5 raw score × weight 8 = max 40 points
- Impact: 0-5 raw score × weight 6 = max 30 points
- Implementation: 0-5 raw score × weight 6 = max 30 points

THRESHOLDS:
- Each criterion must score >= 3 (Good) — i.e., Excellence >= 24, Impact >= 18, Implementation >= 18
- Total weighted score must be >= 60 out of 100

--- CRITERION 1: EXCELLENCE (0-5, weight x8, max 40 points) ---
This is the MOST IMPORTANT criterion (40% of total score).
Evaluate:
- SMART objectives with clear, measurable goals
- Alignment with COP-PILOT platform goals and CL2 cluster objectives
- Sound technical approach using required standards (FIWARE, TMForum APIs, NGSI-LD, GAIA-X)
- Realistic infrastructure requirements (testbed, compute, storage)
- Integration protocols properly specified (MQTT, OPC UA, REST)
- State-of-the-art analysis with clearly novel approach beyond existing solutions
- TRL progression demonstrated (typically TRL 5-6 → TRL 7-8)
- Data management plan with open access commitment

Maps to proposal sections: Concept & Objectives, State of the Art, COP-PILOT Relevance, Data Management, Infrastructure Requirements

--- CRITERION 2: IMPACT (0-5, weight x6, max 30 points) ---
Evaluate:
- Specific cluster (CL2) and use case (OC#2.4) targeted and addressed
- COP-PILOT platform integration clearly described with specific components
- Platform components leveraged (ESO, SIF, LLM-UI, Orion Context Broker)
- Cross-sector scenarios supported (replicability beyond CL2)
- Sustainability plan (what happens after the project ends)
- Dissemination plan (publications, open source, community engagement)
- Open access and data sharing plans
- Environmental, economic, and technological impact analysis

Maps to proposal sections: Expected Impact & Sustainability, Expected Outcomes

--- CRITERION 3: IMPLEMENTATION (0-5, weight x6, max 30 points) ---
Evaluate:
- Clear phases (minimum: Design, Implementation, Testing, Evaluation/Reporting)
- Mandatory milestones present: M4 intermediate report, M9 final deliverable
- Realistic 8-month execution timeline with Gantt chart
- Team qualifications and demonstrated track record
- Budget <= EUR 200,000 with fully justified breakdown
- Indirect costs max 25% of direct costs (excluding subcontracting)
- Subcontracting max 20% with justification

Maps to proposal sections: Work Plan & Timeline, Team Qualifications, Funding & Justification

=== COMPLIANCE CHECKS (rejection without evaluation if failed) ===
1. Proposal does not exceed 12 pages (excluding annexes)
2. Font is at least 10-point Arial
3. Lead partner is an SME
4. Organization registered in EU Member State or Horizon Europe Associated Country
5. Budget does not exceed EUR 200,000
6. Indirect costs do not exceed 25% of direct costs
7. Subcontracting does not exceed 20% of total
8. English language only
9. All mandatory sections present
10. Target cluster clearly identified (one cluster only)
11. Travel costs do not exceed EUR 1,000/person/month
12. Equipment costs cover depreciation only, not full purchase price

=== SPECIFIC REQUIREMENTS FOR CL2/OC#2.4 ===
- Must address municipal buildings management in Valencia
- Must describe closed-loop automation capability (not just monitoring/analytics)
- Must integrate with existing FIWARE infrastructure (Orion Context Broker, IoT Agents)
- Must use NGSI-LD for data exchange
- Must be containerized and deployable on Kubernetes
- Must expose performance metrics (Prometheus/Grafana compatible)
- Must demonstrate replication and scalability aspects
- Must analyse environmental, economic, and technological impact
===`;

export const createCopPilotReviewerPrompt = (
  grantAnalysis: string,
  scientificProposal: string,
  memoryContext?: string
): string => {
  const memorySection = memoryContext
    ? `\n=== PREVIOUS REVIEW HISTORY ===
${memoryContext}
Consider how the proposal has evolved since previous reviews. Note improvements and remaining issues.
===\n`
    : '';

  return `Review this COP-PILOT Open Call #1 proposal (targeting CL2/OC#2.4 Municipal Buildings Management) against the official evaluation framework.
${memorySection}
${COP_PILOT_EVALUATION_FRAMEWORK}

GRANT ANALYSIS (Additional Context):
${grantAnalysis}

SCIENTIFIC PROPOSAL TO REVIEW:
${scientificProposal}

Provide your review in the following JSON format:
{
  "overallScore": number (weighted sum: Excellence*8 + Impact*6 + Implementation*6, max 100),
  "maxScore": 100,
  "readyToSubmit": boolean,
  "executiveSummary": "string (2-3 paragraph overall assessment as a COP-PILOT expert reviewer)",
  "complianceCheck": {
    "passed": boolean,
    "issues": ["string array of compliance failures that would cause rejection"]
  },
  "sectionScores": [
    {
      "section": "Excellence",
      "score": number (0-5, raw score before weighting),
      "maxScore": 5,
      "feedback": "string (detailed feedback covering: SMART objectives, COP-PILOT alignment, technical approach, standards compliance, state-of-the-art, TRL progression, data management)"
    },
    {
      "section": "Impact",
      "score": number (0-5),
      "maxScore": 5,
      "feedback": "string (detailed feedback covering: cluster targeting, platform integration, cross-sector scenarios, sustainability, dissemination, open access)"
    },
    {
      "section": "Implementation",
      "score": number (0-5),
      "maxScore": 5,
      "feedback": "string (detailed feedback covering: work plan quality, milestones, Gantt chart, team qualifications, budget justification)"
    }
  ],
  "strengths": ["string array of key strengths"],
  "weaknesses": [
    {
      "section": "string (Excellence|Impact|Implementation|Compliance)",
      "issue": "string",
      "severity": "critical|major|minor",
      "suggestion": "string (specific fix)"
    }
  ],
  "missingElements": ["string array of required elements that are missing or insufficient"],
  "structureCompliance": {
    "hasProjectSummary": boolean,
    "hasConceptObjectives": boolean,
    "hasStateOfTheArt": boolean,
    "hasCopPilotRelevance": boolean,
    "hasDataManagement": boolean,
    "hasInfrastructureRequirements": boolean,
    "hasExpectedImpact": boolean,
    "hasExpectedOutcomes": boolean,
    "hasWorkPlan": boolean,
    "hasGanttChart": boolean,
    "hasTeamQualifications": boolean,
    "hasBudgetTable": boolean,
    "hasReferences": boolean,
    "estimatedPageCount": number,
    "withinPageLimit": boolean
  },
  "improvementPriorities": [
    {
      "priority": "critical|high|medium|low",
      "area": "string",
      "recommendation": "string"
    }
  ],
  "detailedFeedback": [
    {
      "section": "string (ProjectSummary|ConceptObjectives|StateOfTheArt|CopPilotRelevance|DataManagement|InfrastructureRequirements|ExpectedImpact|ExpectedOutcomes|WorkPlan|TeamQualifications|FundingJustification|Bibliography)",
      "comments": ["string array of specific comments"]
    }
  ]
}

Evaluation guidelines:
1. Score EXACTLY on the three COP-PILOT criteria with correct weights: Excellence (x8), Impact (x6), Implementation (x6)
2. Calculate overall score as weighted sum: Excellence_raw*8 + Impact_raw*6 + Implementation_raw*6 (max 100)
3. Check structural compliance with COP-PILOT OC1 template (all sections present)
4. Verify COP-PILOT platform integration is specific and detailed (not generic claims)
5. Check that NGSI-LD, FIWARE, and TMForum APIs are properly referenced and used
6. Verify the solution addresses OC#2.4 explicitly (closed-loop automation for municipal buildings)
7. Check budget compliance (max EUR 200K, indirect max 25%, subcontracting max 20%)
8. Verify Gantt chart covers M1-M9 with milestones at M4 and M9
9. Assess replication and scalability aspects (required for CL2)
10. Estimate page count and flag if likely to exceed 12 pages
11. Verify SME is the lead partner with justified budget allocation
12. Check that TRL progression (5-6 → 7-8) is demonstrated

Mark as "readyToSubmit: true" ONLY if:
- All compliance checks pass
- All three criterion raw scores >= 3 (Good)
- Total weighted score >= 60
- No critical weaknesses exist
- All mandatory structural elements are present
- Estimated page count <= 12 (excluding annexes)

Be rigorous but constructive. Provide specific, actionable feedback that would help score 5/5 on each criterion.`;
};
