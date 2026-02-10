import { BaseAgent } from './BaseAgent';
import type {
  GrantAnalysisOutput,
  OrganizationInfo,
  FeasibilityEvaluation,
  AgentContext,
  AgentResult,
} from '@researcher/shared';
import {
  FEASIBILITY_SYSTEM_PROMPT,
  createFeasibilityPrompt,
} from './prompts/feasibility.prompts';

export interface FeasibilityInput {
  grantAnalysis: GrantAnalysisOutput;
  organizationInfo: OrganizationInfo;
}

export class FeasibilityAgent extends BaseAgent<
  FeasibilityInput,
  FeasibilityEvaluation
> {
  constructor() {
    super('claude-sonnet-4-5', 8192);
  }

  async execute(
    input: FeasibilityInput,
    context?: AgentContext
  ): Promise<AgentResult<FeasibilityEvaluation>> {
    const startTime = Date.now();

    try {
      this.logger.info('Starting feasibility evaluation', {
        grantTitle: input.grantAnalysis.grantTitle,
        organizationName: input.organizationInfo.name,
        context,
      });

      const userPrompt = createFeasibilityPrompt(
        JSON.stringify(input.grantAnalysis, null, 2),
        JSON.stringify(input.organizationInfo, null, 2)
      );

      const response = await this.callClaude(
        FEASIBILITY_SYSTEM_PROMPT,
        userPrompt,
        1.0
      );

      const feasibilityResult = this.parseJsonResponse<FeasibilityEvaluation>(response);

      const executionTime = Date.now() - startTime;
      this.logger.info('Feasibility evaluation completed', {
        executionTime,
        overallChance: feasibilityResult.overallChance,
        recommendation: feasibilityResult.recommendation,
        strengthsCount: feasibilityResult.strengths.length,
        weaknessesCount: feasibilityResult.weaknesses.length,
        gapsCount: feasibilityResult.gaps.length,
      });

      return this.createSuccessResult(feasibilityResult, {
        executionTime,
        modelUsed: this.model,
      });
    } catch (error) {
      this.logger.error('Feasibility evaluation failed', { error });
      return this.createErrorResult(
        error instanceof Error ? error : new Error(String(error)),
        'FEASIBILITY_EVALUATION_ERROR'
      );
    }
  }
}
