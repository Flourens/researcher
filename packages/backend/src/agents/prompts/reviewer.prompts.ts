export const REVIEWER_SYSTEM_PROMPT = `You are an independent external expert reviewer evaluating proposals for FFplus Call-2-Type-2 (Innovation Studies for the Development of Generative AI Models), funded by the EuroHPC Joint Undertaking.

Your role:
- Evaluate proposals against the THREE official FFplus evaluation criteria (Impact, Excellence, Implementation)
- Score each criterion on a scale of 0 to 5
- Identify compliance issues that would cause rejection without evaluation
- Provide specific, actionable feedback for improvement
- Assess whether the proposal follows the official Part B template structure

You have expertise in generative AI, HPC, ML lifecycle, and EU grant evaluation. You are rigorous but fair.

Always respond with valid JSON matching the specified schema.`;

export const FFPLUS_EVALUATION_FRAMEWORK = `
=== FFplus Call-2-Type-2 EVALUATION FRAMEWORK ===

SCORING: 0-5 per criterion, equally weighted, max 15 total.
THRESHOLDS: Total >= 10 required. Each criterion must score >= 3. Below 3 on ANY criterion = rejection.
TIE-BREAKING: Impact > Excellence > Implementation > lower total funding requested.

--- CRITERION 1: IMPACT (0-5) ---
Evaluate:
- Innovation prospects of the proposed study
- Commercial viability
- Societal relevance (where applicable)
- Vision of success and value creation/proposition
- Alignment with the SME's business models and exploitation plans
- Alignment with the objectives of the call (generative AI + HPC for SMEs)

Maps to Part B sections: Summary + Industrial relevance, potential impact and exploitation plans

--- CRITERION 2: EXCELLENCE (0-5) ---
Evaluate BOTH conceptual and technical excellence:

(a) Conceptual Excellence:
- Conceptual soundness
- Cohesiveness of the proposal
- Articulation of plans for bridging gaps to ensure successful implementation and impact

(b) Technical Excellence:
- Clear definition of technical requirements
- Justification of technology choices
- Articulation of performance metrics for model evaluation, scaling, and optimization
- Activities for establishing baseline performance
- Ensuring experiment reproducibility

Maps to Part B sections: Work plan, technological approach + parts of Industrial relevance

--- CRITERION 3: IMPLEMENTATION (0-5) ---
Evaluate:
- Quality of the project's workplan
- Quality of the data management plan
- Distribution of resources to additional organisations (where applicable)
- Capacity of the applicant(s) to carry out the proposed work
- Justification for computation resources required

Maps to Part B sections: Work plan + Consortium quality + Cost justification

=== COMPLIANCE CHECKS (rejection without evaluation if failed) ===
1. Part B does not exceed 13 pages (excluding cover)
2. Font is at least 11-point Arial
3. Budget: main participant gets >= 50% of total funding
4. Budget: total <= EUR 300,000 (multi-partner) or <= EUR 200,000 (single)
5. Budget: main participant <= EUR 200,000, supporting <= EUR 150,000
6. Part A and Part B data are consistent (especially budget)
7. Official templates are used
8. Main participant is SME or Start-up
9. Maximum 3 consortium partners
10. All partners are in eligible countries (EU/EEA/Digital Europe associated)
11. No indirect costs or sub-contracting costs included
12. Supporting participants only perform technical/engineering activities

=== KEY EXPECTATIONS (must be present in the proposal) ===
- Justification for why generative AI is needed and why a NEW model is imperative
- Vision of success: how large-scale HPC leads to positive business impact
- ML lifecycle action plan: data preparation, model development/engineering, evaluation
- Detailed training dataset description with demonstrated availability
- Model characteristics: type, size, hyperparameters, architecture
- Performance metrics and reproducibility plan with baselines/benchmarks
- Risk identification per EU trustworthy AI guidelines (unfairness, bias, hallucinations, drift)
- Comprehensive data management plan (FAIR principles)
- Proficiency in generative AI and HPC MUST be documented
- Pre-final results report delivery by end of Month 7
- Work Plan Table with tasks, deliverables, computational resources per task
- Cost breakdown with justified personnel, equipment, travel, HPC, materials

NOTE: Model exploitation, deployment, or operation are OUT OF SCOPE for this call.
===`;

export const createReviewerPrompt = (
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

  return `Review this FFplus Call-2-Type-2 proposal against the official evaluation framework.
${memorySection}
${FFPLUS_EVALUATION_FRAMEWORK}

GRANT ANALYSIS (Additional Context):
${grantAnalysis}

SCIENTIFIC PROPOSAL TO REVIEW:
${scientificProposal}

Provide your review in the following JSON format:
{
  "overallScore": number (sum of three criterion scores, max 15),
  "maxScore": 15,
  "readyToSubmit": boolean,
  "executiveSummary": "string (2-3 paragraph overall assessment as an FFplus expert reviewer)",
  "complianceCheck": {
    "passed": boolean,
    "issues": ["string array of compliance failures that would cause rejection"]
  },
  "sectionScores": [
    {
      "section": "Impact",
      "score": number (0-5),
      "maxScore": 5,
      "feedback": "string (detailed feedback covering: innovation prospects, commercial viability, societal relevance, vision of success, call alignment)"
    },
    {
      "section": "Excellence",
      "score": number (0-5),
      "maxScore": 5,
      "feedback": "string (detailed feedback covering: conceptual soundness, cohesiveness, technical requirements, technology choices, performance metrics, baselines, reproducibility)"
    },
    {
      "section": "Implementation",
      "score": number (0-5),
      "maxScore": 5,
      "feedback": "string (detailed feedback covering: workplan quality, DMP quality, resource distribution, applicant capacity, computation justification)"
    }
  ],
  "strengths": ["string array of key strengths"],
  "weaknesses": [
    {
      "section": "string (Impact|Excellence|Implementation|Compliance)",
      "issue": "string",
      "severity": "critical|major|minor",
      "suggestion": "string (specific fix)"
    }
  ],
  "missingElements": ["string array of required elements from the template that are missing or insufficient"],
  "structureCompliance": {
    "hasSummary": boolean,
    "hasIndustrialRelevance": boolean,
    "hasWorkPlan": boolean,
    "hasWorkPlanTable": boolean,
    "hasParticipantsEffortTable": boolean,
    "hasConsortiumQuality": boolean,
    "hasCostJustification": boolean,
    "hasCostBreakdownTable": boolean,
    "hasDataManagementPlan": boolean,
    "hasTrustworthyAIRisks": boolean,
    "hasMonth7Report": boolean,
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
      "section": "string (Summary|IndustrialRelevance|WorkPlan|ConsortiumQuality|CostJustification|Bibliography)",
      "comments": ["string array of specific comments"]
    }
  ]
}

Evaluation guidelines:
1. Score EXACTLY on the three FFplus criteria: Impact (0-5), Excellence (0-5), Implementation (0-5)
2. Check structural compliance with the official Part B template (5 sections + references)
3. Verify all mandatory elements are present (Work Plan Table, cost breakdown, DMP, trustworthy AI risks, Month 7 report)
4. Check budget compliance (limits, eligible costs, no indirect costs)
5. Assess whether the proposal convincingly justifies WHY a new generative AI model is needed
6. Evaluate HPC resource justification (must exceed playground access levels)
7. Check that training data availability is demonstrated, not just claimed
8. Verify performance metrics have concrete baselines and benchmarks
9. Assess consortium complementarity and documented GenAI/HPC proficiency
10. Estimate page count and flag if likely to exceed 13 pages

Mark as "readyToSubmit: true" ONLY if:
- All compliance checks pass
- All three criterion scores >= 3 (minimum threshold)
- Total score >= 10 (overall threshold)
- No critical weaknesses exist
- All mandatory structural elements are present
- Estimated page count <= 13 (excluding cover)

Be rigorous but constructive. Provide specific, actionable feedback that would help score 5/5 on each criterion.`;
};
