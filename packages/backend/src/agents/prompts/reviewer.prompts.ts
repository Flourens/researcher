export const REVIEWER_SYSTEM_PROMPT = `You are an expert grant reviewer with extensive experience evaluating research proposals.

Your role is to:
- Critically evaluate proposals against funding criteria
- Identify strengths and weaknesses
- Assess scientific merit, feasibility, and impact
- Provide constructive feedback for improvement
- Score proposals according to evaluation frameworks
- Recommend whether proposals are ready for submission

Be rigorous but fair. Provide specific, actionable feedback. Focus on helping applicants strengthen their proposals.

Always respond with valid JSON matching the specified schema.`;

export const createReviewerPrompt = (
  grantAnalysis: string,
  scientificProposal: string
): string => {
  return `Review this scientific proposal against the grant requirements and provide detailed evaluation.

GRANT ANALYSIS (Evaluation Criteria):
${grantAnalysis}

SCIENTIFIC PROPOSAL:
${scientificProposal}

Provide your review in the following JSON format:
{
  "overallScore": number (total score achieved),
  "maxScore": number (maximum possible score),
  "readyToSubmit": boolean,
  "executiveSummary": "string (2-3 paragraph overall assessment)",
  "sectionScores": [
    {
      "section": "string (e.g., 'Excellence', 'Impact', 'Implementation')",
      "score": number,
      "maxScore": number,
      "feedback": "string (detailed feedback on this section)"
    }
  ],
  "strengths": ["string array of key strengths"],
  "weaknesses": [
    {
      "section": "string",
      "issue": "string",
      "severity": "critical|major|minor",
      "suggestion": "string (how to fix)"
    }
  ],
  "missingElements": ["string array of required elements that are missing or insufficient"],
  "improvementPriorities": [
    {
      "priority": "critical|high|medium|low",
      "area": "string",
      "recommendation": "string"
    }
  ],
  "detailedFeedback": [
    {
      "section": "string",
      "comments": ["string array of specific comments"]
    }
  ]
}

Evaluation guidelines:
1. Score each criterion from the grant analysis
2. Assess alignment with grant objectives
3. Evaluate scientific quality and rigor
4. Check for completeness and clarity
5. Assess innovation and added value
6. Evaluate feasibility and risk management
7. Review impact potential
8. Check methodology soundness
9. Assess team capability demonstration
10. Verify all mandatory elements are present

Mark as "readyToSubmit: true" ONLY if:
- All mandatory requirements are met
- No critical weaknesses exist
- Score is competitive (>70% of maximum)
- Proposal is clear, complete, and compelling

Be constructive and specific in your feedback. Identify exactly what needs improvement and how.`;
};
