export const FEASIBILITY_SYSTEM_PROMPT = `You are an expert grant consultant specializing in feasibility analysis and strategic assessment.

КРИТИЧЕСКИ ВАЖНАЯ ИНФОРМАЦИЯ О ГЕОГРАФИЧЕСКОЙ ПРИЕМЛЕМОСТИ:
🇺🇦 УКРАИНА - АССОЦИИРОВАННАЯ СТРАНА DIGITAL EUROPE PROGRAMME (с сентября 2022):
- Украина ИМЕЕТ ПРАВО участвовать в конкурсах HPC, AI, digital skills
- FFplus - украинские организации ELIGIBLE
НЕ считай географическое расположение в Украине критическим минусом!

Your task is to evaluate the feasibility of an organization applying for a specific grant by:
- Assessing alignment between grant requirements and organizational capabilities
- Identifying strengths and competitive advantages
- Highlighting gaps, weaknesses, and risks
- Providing actionable recommendations
- Calculating realistic success probability

Be honest, thorough, and strategic. Focus on both compliance (can they apply?) and competitiveness (can they win?).

Always respond with valid JSON matching the specified schema.`;

export const createFeasibilityPrompt = (
  grantAnalysis: string,
  organizationInfo: string
): string => {
  return `Evaluate the feasibility of this organization applying for the analyzed grant.

GRANT ANALYSIS:
${grantAnalysis}

ORGANIZATION INFORMATION:
${organizationInfo}

Provide your feasibility evaluation in the following JSON format:
{
  "overallChance": number (0-100, realistic probability of winning),
  "recommendation": "highly_recommended|recommended|proceed_with_caution|not_recommended",
  "executiveSummary": "string (2-3 paragraph overview)",
  "matchScore": {
    "overall": number (0-100),
    "breakdown": [
      {
        "category": "string (e.g., 'Technical Capability', 'Team Expertise')",
        "score": number (0-100),
        "maxScore": 100,
        "explanation": "string"
      }
    ]
  },
  "strengths": [
    {
      "area": "string",
      "description": "string",
      "impact": "high|medium|low"
    }
  ],
  "weaknesses": [
    {
      "area": "string",
      "description": "string",
      "severity": "critical|major|minor",
      "mitigation": "string (optional, how to address)"
    }
  ],
  "gaps": [
    {
      "type": "team|resources|experience|technical|administrative",
      "description": "string",
      "severity": "critical|major|minor",
      "recommendation": "string (how to fill the gap)"
    }
  ],
  "risks": [
    {
      "category": "string",
      "description": "string",
      "probability": "high|medium|low",
      "impact": "high|medium|low",
      "mitigation": "string"
    }
  ],
  "requiredActions": [
    {
      "priority": "critical|high|medium|low",
      "action": "string",
      "timeline": "string"
    }
  ],
  "strategicRecommendations": ["string array of strategic advice"]
}

Be realistic and data-driven. Consider:
1. Geographic eligibility (remember Ukraine is eligible for Digital Europe!)
2. Technical and scientific capability match
3. Team expertise and track record
4. Resource availability
5. Compliance with all mandatory requirements
6. Competitive positioning vs likely applicants
7. Risk factors and mitigation strategies`;
};
