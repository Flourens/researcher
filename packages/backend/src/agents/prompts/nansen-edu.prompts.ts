export const NANSEN_EDU_SYSTEM_PROMPT = `You are an expert grant proposal writer specializing in Norwegian-Ukrainian educational cooperation programmes, particularly the Nansen Support Programme for Ukraine.

Your expertise includes:
- Writing compelling project descriptions for HK-dir (Norwegian Directorate for Higher Education and Skills)
- Structuring proposals EXACTLY according to the official HK-dir Project Description template
- Addressing cross-cutting issues (anti-corruption, gender equality, climate, SEAH) as required by Norwegian development cooperation
- Building persuasive narratives for educational capacity building in conflict-affected regions
- Connecting technical education needs with reconstruction and green transition priorities

You write in clear, professional English suitable for academic peer reviewers.

CRITICAL RULES:
- You MUST follow the exact section structure: 5 sections (Relevance, Design, Project Group, Impact, References)
- Content must be dense and substantive — every sentence must add value
- No filler text, no repetition between sections
- You MUST output valid JSON matching the specified schema
- Address ALL cross-cutting issues explicitly (anti-corruption, climate, gender, human rights, SEAH)`;

export const NANSEN_EDU_TEMPLATE = `
=== OFFICIAL PROJECT DESCRIPTION TEMPLATE (NANSEN EDU 2025) ===

The Project Description must follow EXACTLY this structure.
Use professional English. Be concrete, specific, and evidence-based.

SECTION 1: RELEVANCE OF THE PROJECT (evaluation weight: 30%)

  1.1 Background and needs of the project
  Assessment factors:
  - 1.1) Need for the project and significance for target groups clearly demonstrated
  - 1.2) Planned results are concrete and suitable to achieve call objectives
  - 1.3) Level of ambition of the results

  Content should cover:
  - Clear description of the problem/need this project addresses
  - Why this project is needed NOW for Ukraine's educational sector
  - Specific target groups and their needs (students, academic staff, industry)
  - Connection to Ukraine's reconstruction and recovery priorities
  - Concrete, measurable planned results (SMART goals)
  - Baseline data on current state (statistics, evidence)

  1.2 The project's alignment with other activities/measures and any innovative elements
  Assessment factors:
  - 1.4) Innovation and/or complementarity to other measures/activities
  - 1.5) Knowledge of existing initiatives; added value beyond what exists

  Content should cover:
  - How this project builds on partners' existing activities and research
  - What makes this project innovative (new approaches, methods, technologies)
  - Knowledge of similar/related programmes (Erasmus+, Horizon, DAAD, etc.)
  - How this project adds value beyond what already exists
  - Synergies with other ongoing initiatives

SECTION 2: DESIGN AND IMPLEMENTATION (evaluation weight: 20%)

  2.1 Activities, measures and approaches to achieve the project results
  Assessment factor 2.1: Concrete, comprehensive and realistic implementation plan

  Content should cover:
  - Detailed work packages with clear activities, deliverables, and timeline
  - Gantt chart or timeline overview (Year 1, Year 2, Year 3)
  - Concrete milestones and deliverables with dates
  - Teaching/training methodologies and curriculum design approach
  - Student and staff exchange plans with numbers and durations
  - Resource allocation per activity

  2.2 Risk factors in the project and measures to reduce them
  Assessment factors:
  - 2.2) Quality of risk assessments, including cross-cutting issues and SEAH
  - 2.3) Cost-effectiveness and sufficient resource allocation

  Content MUST cover ALL of the following:
  - Security risks (Ukraine is a conflict zone, especially Zaporizhzhia region)
  - Corruption risk (Ukraine CPI < 69) with specific mitigation measures
  - Environmental/climate risks and measures to reduce carbon footprint
  - Gender equality considerations in project design
  - Human rights impact assessment
  - SEAH (Sexual Exploitation, Abuse and Harassment) prevention measures
  - Data protection and IT security risks
  - Academic freedom and national security considerations
  - Cost-effectiveness justification

SECTION 3: THE PROJECT GROUP AND COLLABORATIVE STRUCTURES (evaluation weight: 20%)

  3.1 Key personnel for the implementation of the project
  Assessment factor 3.1: Complementarity of institutions/actors and overall expertise

  Content should cover:
  - Key staff from each partner with relevant qualifications and experience
  - How their expertise directly supports project objectives
  - Complementarity of skills across the consortium

  3.2 Involvement, interaction and division of work between the project partners
  Assessment factors:
  - 3.2) Division of tasks shows commitment and active contribution from all partners
  - 3.3) Clear plan for interaction between partners and stakeholders

  Content should cover:
  - Clear role and responsibilities for each partner
  - Division of budget and activities
  - Management structure (steering committee, work package leads)
  - Communication and coordination mechanisms
  - Stakeholder engagement plan (industry, regional authorities, other HEIs)

SECTION 4: PROJECT IMPACT (evaluation weight: 30%)

  4.1 The project impact and possible measures to promote dissemination
  Assessment factor 4.1: Potential impact for target groups, institutions, and actors

  Content should cover:
  - Direct impact on target groups (number of students, staff, courses)
  - Institutional impact (new curricula, structures, policies)
  - Regional/national impact (workforce development, industry connections)
  - Dissemination plan (publications, conferences, open educational resources)
  - Impact beyond the consortium (replicability, scalability)

  4.2 Duration of the impact and evaluation of the project's impact
  Assessment factors:
  - 4.2) Quality of measures to ensure impacts maintained after project end
  - 4.3) Quality of measures to evaluate and document project impact

  Content should cover:
  - Sustainability plan: how results will continue after funding ends
  - Integration of new curricula into regular degree programs
  - Plans for follow-up proposals and long-term cooperation
  - Evaluation methodology: pre/post assessments, surveys, tracking
  - Documentation and reporting approach

SECTION 5: REFERENCE LIST
- Academic references supporting the project's approach and methodology
- References to policy documents, strategies, and standards
- Numbered references [1], [2], etc.

=== GRADING SCALE (1-7) ===
7 - Exceptional; 6 - Excellent; 5 - Very good; 4 - Good; 3 - Fair; 2 - Poor; 1 - Very poor
THRESHOLD: All sub-grades >= 4, at least two sub-grades >= 5
===`;

export const createNansenEduWritingPrompt = (
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
    ? `\nPROJECT CONTEXT:
${businessContext}

Use this context to tailor the proposal to the specific partnership and regional needs.`
    : '';

  const memorySection = memoryContext
    ? `\n=== PREVIOUS RUN HISTORY ===
${memoryContext}
Use this information to avoid repeating mistakes from previous iterations. Pay special attention to reviewer feedback.
===`
    : '';

  return `Generate a Project Description for the Nansen EDU 2025 Call for Applications.

PROJECT TITLE: AI-Driven Green Metallurgy Education for Ukraine's Industrial Reconstruction (AI-GreenMet)

CONSORTIUM:
- Coordinator/Applicant: NTNU (Norwegian University of Science and Technology, Trondheim, Norway) — world leader in metallurgy, materials science, and AI for industry
- Ukrainian Partner 1: Zaporizhzhia National University (ZNU) — lead Ukrainian partner with Engineering Institute, Faculty of Mathematics, and Metallurgical Professional College
- Ukrainian Partner 2: [To be confirmed by NTNU — placeholder: a Ukrainian technical university with complementary metallurgical or AI expertise]

${languageInstructions}

${NANSEN_EDU_TEMPLATE}

GRANT ANALYSIS:
${grantAnalysis}

ORGANIZATION INFORMATION:
${organizationInfo}

FEASIBILITY EVALUATION:
${feasibilityEvaluation}
${contextSection}
${memorySection}

Generate the Project Description in the following JSON format matching the EXACT HK-dir template structure:
{
  "section1_1_background": "string (~2-3 pages, ~1200 words. Background, needs, target groups, planned results. Must clearly demonstrate: (a) the critical need for AI/ML skills in Ukrainian metallurgy for green transition and reconstruction, (b) war damage to Zaporizhzhia's industrial/educational infrastructure, (c) skills gap — no existing programs combining AI + metallurgy in Ukraine, (d) specific target groups with numbers, (e) concrete SMART objectives and planned results with baselines)",

  "section1_2_alignment": "string (~1-2 pages, ~800 words. Alignment with other activities, innovation. Must cover: (a) builds on ZNU's existing metal industry research (alloys, electrolysis, catalysis, digital twins, smart grids), (b) complements NTNU's SFI programmes in metals, (c) links to Erasmus+, Horizon MSCA, DAAD projects, (d) innovative elements: first AI-metallurgy curriculum in Ukraine, Living Labs approach, digital twin pedagogy, (e) added value beyond existing initiatives)",

  "section2_1_activities": "string (~3-4 pages, ~1800 words. Detailed work plan. Must include: (a) 5 Work Packages with activities, deliverables, timeline — WP1: Joint Curriculum Development, WP2: Staff Training & Exchanges, WP3: Student Training Programme, WP4: Living Lab & Digital Twin Pilots, WP5: Dissemination & Sustainability; (b) timeline table (Year 1: Foundation, Year 2: Pilots, Year 3: Scaling); (c) specific numbers: students trained, courses developed, exchanges conducted; (d) teaching methodologies — blended learning, problem-based learning, industry projects)",

  "section2_2_risks": "string (~2-3 pages, ~1200 words. Risk assessment — MUST address ALL cross-cutting issues: (a) Security risks — Zaporizhzhia is frontline region: hybrid online/in-person format, backup delivery locations, emergency protocols; (b) Corruption — Ukraine CPI ~33/100: transparent procurement, dual-signature financial controls, anti-corruption as fixed meeting agenda item, regular audits; (c) Climate/environment — digital-first approach, climate-friendly travel, carbon footprint reduction measures; (d) Gender equality — gender balance targets in recruitment, gender-sensitive pedagogy, women in STEM initiatives; (e) Human rights — non-discrimination, inclusive access, attention to vulnerable groups; (f) SEAH — ethical guidelines, reporting mechanisms, training on prevention; (g) Data protection and IT security; (h) Cost-effectiveness justification)",

  "section3_1_personnel": "string (~1-2 pages, ~700 words. Key personnel from each partner: (a) NTNU: project coordinator [name TBD], professors in metallurgy/materials science and AI/ML; (b) ZNU Engineering Institute: metallurgy researchers (high-entropy alloys, electrolyzers, catalysis); (c) ZNU Faculty of Mathematics: AI/ML and HPC specialists (Lab of Parallel and Distributed Computing); (d) ZNU Metallurgical College: applied training expertise; (e) Partner 2: [TBD]. Show complementarity and no unnecessary overlap.)",

  "section3_2_collaboration": "string (~1-2 pages, ~700 words. Division of work and interaction: (a) NTNU role: coordination, curriculum standards, advanced AI/metallurgy expertise, host exchanges, quality assurance; (b) ZNU role: local implementation, student recruitment, industry connections, Living Lab operation, Ukrainian curriculum integration; (c) Partner 2 role: [placeholder — expanded student base, complementary expertise]; (d) management structure: steering committee (quarterly), project management team (monthly), WP leaders; (e) communication: online platforms, annual in-person workshops, shared document systems; (f) stakeholder engagement: regional metallurgical industry, Ukrainian Ministry of Education, Norwegian-Ukrainian cooperation frameworks)",

  "section4_1_impact": "string (~2-3 pages, ~1200 words. Impact and dissemination: (a) Direct: 100+ engineering students trained in AI for metallurgy, 20+ academic staff with new competencies, 3+ new/updated courses; (b) Institutional: new AI-metallurgy curriculum module permanently embedded in ZNU engineering programs, strengthened research capacity; (c) Regional: qualified workforce for Zaporizhzhia metallurgical industry reconstruction (Zaporizhstal, Motor Sich and regional employers); (d) National: replicable model for other Ukrainian technical universities; (e) Dissemination: joint publications, open educational resources, conference presentations, policy briefs; (f) Impact beyond consortium: model curriculum shared via Ukrainian Ministry of Education networks)",

  "section4_2_sustainability": "string (~1-2 pages, ~700 words. Sustainability and evaluation: (a) Curriculum integrated into ZNU degree programs — no additional funding needed to maintain; (b) NTNU-ZNU partnership continues via agreed roadmap (2028+: co-supervised PhD, large-scale Horizon proposals); (c) Living Lab becomes permanent research infrastructure; (d) Evaluation: pre/post competency assessments of students and staff, graduate employment tracking, industry satisfaction surveys, annual external review; (e) Documentation: project reports, evaluation data integrated into institutional management information systems; (f) Knowledge transfer to Partner 2 and other Ukrainian HEIs)",

  "references": ["string array of 10-15 references in academic format, including: relevant Ukrainian education/industry reports, NTNU research in metallurgy/AI, green metallurgy publications, Norwegian-Ukrainian cooperation documents, EU Green Deal/reconstruction references"]
}

CRITICAL REQUIREMENTS:
1. Follow the EXACT 5-section structure from the HK-dir template
2. Address ALL 14 assessment sub-factors across the 4 evaluation criteria
3. ALL cross-cutting issues MUST be explicitly addressed (anti-corruption, gender, climate, SEAH, human rights)
4. Include concrete numbers, metrics, timelines, and budgets where relevant
5. The project is titled "AI-GreenMet" — AI-Driven Green Metallurgy Education for Ukraine's Industrial Reconstruction
6. Duration: 3 years (July 2026 – June 2029), aligned with ZNU-NTNU roadmap
7. Budget: NOK 5,000,000 (max), with 30% cap on Norwegian partner personnel costs
8. Zaporizhzhia context is KEY: frontline city, major metallurgical region, reconstruction priority
9. Use [Partner 2 — TBD] as placeholder for the second Ukrainian partner
10. Reference state-of-the-art with numbered citations [1], [2], etc.
11. Show how the project contributes to ALL Nansen EDU objectives: (1) strengthen Ukrainian HEI capacity, (2) improve access to qualified professionals, (3) establish long-term Norway-Ukraine cooperation
12. Thematic priorities covered: STEM, Digital transformation, Environment and energy, Reconstruction

${language === 'en' ? 'Use professional English with clear structure and logical flow.' : ''}
${language === 'ru' ? 'Используй профессиональный научный русский язык с четкой структурой и логичным изложением.' : ''}
${language === 'uk' ? 'Використовуй професійну наукову українську мову з чіткою структурою та логічним викладом.' : ''}

Write content that would score 6-7/7 on each evaluation criterion. Be specific, concrete, and persuasive. Every sentence must demonstrate competence and add value.`;
};
