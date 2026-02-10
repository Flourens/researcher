export const APPLICATION_PACKAGE_SYSTEM_PROMPT = `You are an expert in grant application preparation and documentation.

Your expertise includes:
- Creating comprehensive application packages
- Generating supporting documents (cover letters, summaries, etc.)
- Developing checklists and guidelines
- Ensuring compliance with submission requirements
- Quality assurance and document review

You help applicants prepare complete, professional application packages ready for submission.

Always respond with valid JSON matching the specified schema.`;

export const createApplicationPackagePrompt = (
  grantAnalysis: string,
  organizationInfo: string,
  scientificProposal: string,
  reviewResults: string
): string => {
  return `Generate a complete application package with all necessary documents and guidelines.

GRANT ANALYSIS:
${grantAnalysis}

ORGANIZATION INFORMATION:
${organizationInfo}

SCIENTIFIC PROPOSAL:
${scientificProposal}

REVIEW RESULTS:
${reviewResults}

Generate the application package in the following JSON format:
{
  "packageId": "string (unique identifier)",
  "grantTitle": "string",
  "createdAt": "string (ISO datetime)",
  "documentChecklist": [
    {
      "item": "string",
      "status": "complete|in_progress|not_started",
      "responsible": "string (optional)",
      "deadline": "string (optional)",
      "notes": "string (optional)"
    }
  ],
  "generatedDocuments": [
    {
      "type": "cover_letter|project_summary|budget_justification|team_cv|work_plan|risk_assessment|impact_statement|ethics_statement|data_management_plan",
      "filename": "string",
      "content": "string (full document content)",
      "format": "markdown",
      "status": "generated"
    }
  ],
  "manualDocuments": [
    {
      "type": "string",
      "description": "string",
      "required": boolean,
      "instructions": "string (what the applicant needs to prepare)"
    }
  ],
  "submissionGuidelines": ["string array of step-by-step submission instructions"],
  "qualityChecks": [
    {
      "check": "string (what to verify)",
      "status": "passed|failed|not_checked",
      "notes": "string (optional)"
    }
  ],
  "nextSteps": ["string array of actions to complete before submission"]
}

Generate the following documents with full content:
1. COVER LETTER: Professional introduction, summarize project, highlight fit
2. PROJECT SUMMARY: Executive summary (1-2 pages) of the proposal
3. BUDGET JUSTIFICATION: Detailed explanation of budget categories and costs
4. TEAM CV: Consolidated team member CVs highlighting relevant expertise
5. WORK PLAN: Detailed Gantt chart or timeline with tasks and milestones
6. RISK ASSESSMENT: Identified risks and mitigation strategies
7. IMPACT STATEMENT: Detailed analysis of expected impact
8. ETHICS STATEMENT: Ethical considerations and compliance (if applicable)
9. DATA MANAGEMENT PLAN: How data will be handled, stored, shared (if applicable)

For each document:
- Use professional formatting
- Include all relevant details from the proposal
- Ensure consistency across documents
- Address grant requirements
- Use clear, professional language

Create comprehensive checklist covering:
- All required documents
- Administrative requirements
- Submission procedures
- Deadlines and milestones

Provide quality checks for:
- Completeness
- Consistency
- Formatting
- Compliance with requirements
- Professional presentation`;
};
