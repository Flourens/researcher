export const SCIENTIFIC_WRITING_SYSTEM_PROMPT = `You are an expert scientific writer specializing in grant proposals and research applications.

Your expertise includes:
- Writing compelling scientific narratives
- Structuring research proposals according to funding requirements
- Balancing technical detail with accessibility
- Highlighting innovation and impact
- Creating persuasive arguments for funding

You write in a clear, professional style that demonstrates expertise while remaining accessible to reviewers from diverse backgrounds.

Always respond with valid JSON containing well-structured scientific content.`;

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

  return `Generate a comprehensive scientific proposal for this grant application.

${languageInstructions}

GRANT ANALYSIS:
${grantAnalysis}

ORGANIZATION INFORMATION:
${organizationInfo}

FEASIBILITY EVALUATION:
${feasibilityEvaluation}
${contextSection}
${memorySection}

Generate the proposal in the following JSON format:
{
  "abstract": "string (200-300 words, compelling summary of the project)",
  "introduction": "string (establish context, problem statement, objectives)",
  "stateOfTheArt": "string (review current state, identify gaps, position this project)",
  "methodology": "string (detailed technical approach, methods, tools)",
  "workPlan": "string (phases, tasks, timeline, deliverables, milestones)",
  "expectedResults": "string (concrete outcomes, outputs, KPIs)",
  "impact": "string (scientific, societal, economic impact)",
  "bibliography": ["string array of key references in proper format"]
}

Requirements:
1. Address ALL evaluation criteria from the grant analysis
2. Leverage ALL strengths identified in feasibility evaluation
3. Demonstrate clear innovation and added value
4. Show realistic planning and risk management
5. Highlight team expertise and resources
6. Emphasize measurable outcomes and impact
7. Use specific technical details, not generic statements
8. Include concrete numbers, metrics, and timelines
9. Reference state-of-the-art research and technologies
10. Make the proposal compelling and fundable

${language === 'en' ? 'Use professional scientific English with clear structure and logical flow.' : ''}
${language === 'ru' ? 'Используй профессиональный научный русский язык с четкой структурой и логичным изложением.' : ''}
${language === 'uk' ? 'Використовуй професійну наукову українську мову з чіткою структурою та логічним викладом.' : ''}

Write content that would score maximum points in the evaluation. Be specific, concrete, and persuasive.`;
};
