export const SCIENTIFIC_WRITING_SYSTEM_PROMPT = `You are an expert scientific writer specializing in EU grant proposals, particularly EuroHPC and Digital Europe Programme applications.

Your expertise includes:
- Writing compelling proposals for EU innovation studies
- Structuring proposals EXACTLY according to official templates and page limits
- Balancing technical depth with clarity for expert evaluators
- Highlighting innovation, business impact, and HPC justification
- Creating persuasive arguments for generative AI + HPC funding

You write in a clear, professional style suitable for independent expert reviewers in AI/ML and HPC.

CRITICAL RULES:
- You MUST follow the exact section structure specified in the prompt
- You MUST respect page length recommendations (total 13 pages max excluding cover)
- You MUST output valid JSON matching the specified schema
- Content must be dense and substantive — every sentence must add value
- No filler text, no repetition between sections`;

export const FFPLUS_PART_B_TEMPLATE = `
=== OFFICIAL PART B TEMPLATE STRUCTURE (FFplus Call-2-Type-2) ===

The proposal Part B must contain EXACTLY these 5 sections plus references.
Total page limit: 13 pages (HARD LIMIT — exceeding = rejection without evaluation).
The cover page is excluded from the page count.
Font: 11-point Arial minimum.

SECTION 1: Summary (recommended ~0.5 pages)
- Concise overview of the proposed innovation study

SECTION 2: Industrial relevance, potential impact and exploitation plans (recommended ~3.5 pages)
Template instructions:
- Specify if the SME (main participant) has an existing business model that significantly benefits from the development of generative AI models, HPC awareness or experience
- Clearly define the business problem at hand and explain how generative AI serves as a solution to the business problem or business prospect, if and why the development of a new model is imperative and why this could not be addressed sooner
- Explain the expected business impact and potential value propositions and the process of value creation
- Include: innovation prospects, commercial viability, societal relevance, vision of success, alignment with call objectives

SECTION 3: Description of the work plan, technological/algorithmic approach and software development strategy (recommended ~5 pages)
Template instructions:
- Define specific objectives that must be achieved to successfully address the business problem and the accompanying action plan described in terms of an ML lifecycle
- Provide a detailed description and demonstrate the availability of a suitable training data set
- Detail the characteristics of the models to be developed and outline their repercussions to training and exploitation
- Explain performance metrics, describe benchmarks to establish baselines and specify methods to ensure experiment reproducibility
- Identify potential risks considering EU guidelines for trustworthy AI and present means to address and mitigate them
- Include delivery of a pre-final results and potential impact report by end of Month 7
- Present a data management plan (FAIR principles, data access/usage/sharing/retention/disposal, protection of sensitive data)
- Include a Work Plan Table with tasks (name, duration, participants, effort, deliverables, technical description, computational resources per task)
- Include general information about computational resources (total gpu node hours, EuroHPC access plans, software requirements)
- Include Impact and Outputs section (concrete results + business impact)
- Include a Participants and Effort table (participant names + person-months)

SECTION 4: Quality of the consortium as a whole and of the individual proposers (recommended ~2 pages)
Template instructions:
- Main participant = SME or Start-up; up to 2 supporting participants (well-justified)
- Explain each proposer's capability — both as an organisation and in terms of key staff assigned to the innovation study
- Show consortium has necessary and sufficient complementary capabilities (no unnecessary overlap, no missing capabilities)
- Confirm SME has qualified staff with expertise in generative AI, software development, technical project management, and data processing
- For supporting participants: only technical/engineering activities eligible for funding
- Each consortium partner needs a clearly defined role

SECTION 5: Justification of costs and resources (recommended ~1 page)
Template instructions:
- Explain HPC resources (hardware, software, frameworks, compute volumes) needed
- Reference EuroHPC JU resources / AI Factories Access Modes
- Demonstrate how allocated resources fill current gaps
- Include cost breakdown table (Personnel, Other Direct Costs, Total, Requested Funding per participant)
- All other direct costs must be clearly explained and justified
- Indirect costs are NOT eligible (participants are Third Parties to FFplus)
- Computing costs from workplan should appear in "other direct costs"

REFERENCES: Include at end, counted within the 13-page limit.

=== EVALUATION CRITERIA (scored 0-5 each, equally weighted, max 15) ===
1. IMPACT: Innovation prospects, commercial viability, societal relevance, vision of success, value creation, alignment with call objectives
2. EXCELLENCE: Conceptual soundness + Technical excellence (requirements, technology choices, performance metrics, baselines, reproducibility)
3. IMPLEMENTATION: Workplan quality, data management plan, resource distribution, applicant capacity, computation resource justification
Threshold: total >= 10, each criterion >= 3. Tie-breaking: Impact > Excellence > Implementation > lower funding.
===`;

export const createScientificWritingPrompt = (
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

Use this context to tailor the proposal. Show how the project aligns with real business needs and practical applications.`
    : '';

  const memorySection = memoryContext
    ? `\n=== PREVIOUS RUN HISTORY ===
${memoryContext}
Use this information to avoid repeating mistakes from previous iterations. Pay special attention to reviewer feedback.
===`
    : '';

  return `Generate a proposal for FFplus Call-2-Type-2 (Innovation Studies for the Development of Generative AI Models).

${languageInstructions}

${FFPLUS_PART_B_TEMPLATE}

GRANT ANALYSIS:
${grantAnalysis}

ORGANIZATION INFORMATION:
${organizationInfo}

FEASIBILITY EVALUATION:
${feasibilityEvaluation}
${contextSection}
${memorySection}

Generate the proposal in the following JSON format matching the EXACT Part B template structure:
{
  "summary": "string (~0.5 pages, ~250 words. Concise overview of the innovation study: what, why, how, expected outcomes)",
  "industrialRelevance": "string (~3.5 pages, ~1800 words. Use markdown ## for subsections. Cover: existing business model and HPC awareness; business problem definition; why generative AI is the solution; why a NEW model is imperative (not solvable by existing models/few-shot); expected business impact and value propositions; vision of success; societal relevance; alignment with FFplus call objectives)",
  "workPlan": "string (~5 pages, ~2500 words. Use markdown ## for subsections. Cover: specific objectives as ML lifecycle action plan; training dataset description and availability; model characteristics (type, size, architecture, hyperparameters); performance metrics with benchmarks and baselines; experiment reproducibility methods; trustworthy AI risk assessment and mitigation; data management plan (FAIR); Month 7 intermediate report commitment. MUST include a markdown Work Plan Table with 3-5 tasks (each with: name, duration, participants+effort, deliverable+due month, technical description, computational resources). MUST include total GPU node hours, EuroHPC access plans, and an Impact/Outputs subsection. MUST include a Participants and Effort table.)",
  "consortiumQuality": "string (~2 pages, ~1000 words. Cover: main participant (SME) capabilities — organisation + key staff; supporting participant capabilities — organisation + key staff; complementarity and non-overlap; SME's qualified staff in GenAI, software dev, project management, data processing; clearly defined roles for each partner; track record and relevant experience)",
  "costJustification": "string (~1 page, ~500 words. Cover: HPC resource requirements and justification; EuroHPC JU / AI Factories access plans; cost breakdown narrative explaining Personnel, Equipment, Travel, HPC Compute, Materials per participant; why each cost is necessary; note that indirect costs are not eligible. MUST include a markdown cost breakdown table: | Participant | Funding Rate | Effort (PM) | Personnel Costs | Other Direct Costs | Total Costs | Requested Funding |)",
  "bibliography": ["string array of references in academic format, max 15-20 references"]
}

CRITICAL REQUIREMENTS:
1. Follow the EXACT 5-section structure from the Part B template — no extra sections, no missing sections
2. Total content must fit within 13 pages at 11pt Arial font (~6000-6500 words total across all sections)
3. Address ALL three evaluation criteria (Impact, Excellence, Implementation) — each must score >= 3/5
4. The "industrialRelevance" section maps to the IMPACT criterion
5. The "workPlan" section maps to the EXCELLENCE criterion (technical) + IMPLEMENTATION criterion (workplan/DMP)
6. The "consortiumQuality" section maps to the IMPLEMENTATION criterion (applicant capacity)
7. The "costJustification" section maps to the IMPLEMENTATION criterion (resource justification)
8. Include concrete numbers, metrics, timelines, GPU-hours, person-months, EUR amounts
9. Work Plan Table must have specific tasks with month ranges, named deliverables, and computational resource details
10. Budget figures in costJustification MUST be consistent with the work plan
11. Main participant (SME) must receive >= 50% of total funding
12. Maximum total funding: EUR 300,000 for multi-partner consortium
13. Maximum per main participant: EUR 200,000
14. Maximum per supporting participant: EUR 150,000
15. Reference state-of-the-art research with numbered citations [1], [2], etc.

${language === 'en' ? 'Use professional scientific English with clear structure and logical flow.' : ''}
${language === 'ru' ? 'Используй профессиональный научный русский язык с четкой структурой и логичным изложением.' : ''}
${language === 'uk' ? 'Використовуй професійну наукову українську мову з чіткою структурою та логічним викладом.' : ''}

Write content that would score 5/5 on each evaluation criterion. Be specific, concrete, and persuasive. Every sentence must demonstrate competence and add value.`;
};
