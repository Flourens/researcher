import { BaseAgent } from './BaseAgent';
import type {
  GrantAnalysisOutput,
  AgentContext,
  AgentResult,
} from '@researcher/shared';
import {
  GRANT_ANALYSIS_SYSTEM_PROMPT,
  createGrantAnalysisPrompt,
} from './prompts/grant-analysis.prompts';

export interface GrantAnalysisInput {
  grantText: string;
}

export class GrantAnalysisAgent extends BaseAgent<
  GrantAnalysisInput,
  GrantAnalysisOutput
> {
  constructor() {
    super('claude-sonnet-4-5', 8192);
  }

  async execute(
    input: GrantAnalysisInput,
    context?: AgentContext
  ): Promise<AgentResult<GrantAnalysisOutput>> {
    const startTime = Date.now();

    try {
      this.logger.info('Starting grant analysis', {
        grantTextLength: input.grantText.length,
        context,
      });

      const userPrompt = createGrantAnalysisPrompt(input.grantText);

      const response = await this.callClaude(
        GRANT_ANALYSIS_SYSTEM_PROMPT,
        userPrompt,
        1.0
      );

      const analysisResult = this.parseJsonResponse<GrantAnalysisOutput>(response);

      const executionTime = Date.now() - startTime;
      this.logger.info('Grant analysis completed', {
        executionTime,
        grantTitle: analysisResult.grantTitle,
        requirementsCount: analysisResult.requirements.length,
        criteriaCount: analysisResult.evaluationCriteria.length,
      });

      return this.createSuccessResult(analysisResult, {
        executionTime,
        modelUsed: this.model,
      });
    } catch (error) {
      this.logger.error('Grant analysis failed', { error });
      return this.createErrorResult(
        error instanceof Error ? error : new Error(String(error)),
        'GRANT_ANALYSIS_ERROR'
      );
    }
  }
}
