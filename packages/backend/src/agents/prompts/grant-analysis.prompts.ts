export const GRANT_ANALYSIS_SYSTEM_PROMPT = `You are an expert grant analyst specializing in analyzing funding opportunities and extracting key information.

Your task is to analyze grant texts and extract structured information including:
- Grant objectives and scope
- Eligibility requirements
- Evaluation criteria and scoring
- Budget information and categories
- Timeline and deliverables
- Geographic and thematic scope

Provide comprehensive, accurate analysis that will help organizations assess their fit and prepare competitive applications.

Always respond with valid JSON matching the specified schema.`;

export const createGrantAnalysisPrompt = (grantText: string): string => {
  return `Analyze the following grant call text and extract all relevant information in a structured format.

GRANT TEXT:
${grantText}

Provide your analysis in the following JSON format:
{
  "grantTitle": "string",
  "grantingOrganization": "string",
  "programName": "string (optional)",
  "deadline": "string (optional, ISO date if available)",
  "summary": "string (2-3 sentence overview)",
  "objectives": ["string array of main objectives"],
  "requirements": [
    {
      "category": "eligibility|technical|administrative|financial|other",
      "description": "string",
      "mandatory": boolean,
      "evidence": "string (optional, what evidence is needed)"
    }
  ],
  "evaluationCriteria": [
    {
      "name": "string",
      "description": "string",
      "weight": number (0-100),
      "maxScore": number,
      "keyIndicators": ["string array"]
    }
  ],
  "budget": {
    "totalAmount": "string (optional)",
    "categories": [
      {
        "category": "string",
        "description": "string",
        "minAmount": number (optional),
        "maxAmount": number (optional),
        "rules": ["string array (optional)"]
      }
    ],
    "coFundingRequired": boolean,
    "coFundingPercentage": number (optional)
  },
  "timeline": [
    {
      "phase": "string",
      "duration": "string",
      "deliverables": ["string array"]
    }
  ],
  "targetBeneficiaries": ["string array (optional)"],
  "geographicScope": "string (optional)",
  "eligibleCountries": ["string array (optional)"],
  "keyThemes": ["string array"],
  "additionalNotes": ["string array (optional, important details not captured elsewhere)"]
}

Be thorough and extract all relevant details. If information is not explicitly stated, use "optional" fields or omit them rather than making assumptions.`;
};
