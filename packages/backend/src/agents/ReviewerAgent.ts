import { BaseAgent } from './BaseAgent';
import type {
  GrantAnalysisOutput,
  ScientificContent,
  ReviewOutput,
  AgentContext,
  AgentResult,
} from '@researcher/shared';
import {
  REVIEWER_SYSTEM_PROMPT,
  createReviewerPrompt,
} from './prompts/reviewer.prompts';

export interface ReviewerInput {
  grantAnalysis: GrantAnalysisOutput;
  scientificProposal: ScientificContent;
}

export class ReviewerAgent extends BaseAgent<ReviewerInput, ReviewOutput> {
  constructor() {
    // Use Claude Opus 4.6 with higher token limit for comprehensive review
    super('claude-opus-4-6', 16384);
  }

  async execute(
    input: ReviewerInput,
    context?: AgentContext
  ): Promise<AgentResult<ReviewOutput>> {
    const startTime = Date.now();

    try {
      this.logger.info('Starting proposal review', {
        grantTitle: input.grantAnalysis.grantTitle,
        context,
      });

      const userPrompt = createReviewerPrompt(
        JSON.stringify(input.grantAnalysis, null, 2),
        JSON.stringify(input.scientificProposal, null, 2)
      );

      const response = await this.callClaude(
        REVIEWER_SYSTEM_PROMPT,
        userPrompt,
        1.0
      );

      const reviewResult = this.parseJsonResponse<ReviewOutput>(response);

      const executionTime = Date.now() - startTime;
      this.logger.info('Proposal review completed', {
        executionTime,
        overallScore: reviewResult.overallScore,
        maxScore: reviewResult.maxScore,
        readyToSubmit: reviewResult.readyToSubmit,
        weaknessesCount: reviewResult.weaknesses.length,
        missingElementsCount: reviewResult.missingElements.length,
      });

      return this.createSuccessResult(reviewResult, {
        executionTime,
        modelUsed: this.model,
      });
    } catch (error) {
      this.logger.error('Proposal review failed', { error });
      return this.createErrorResult(
        error instanceof Error ? error : new Error(String(error)),
        'REVIEW_ERROR'
      );
    }
  }
}
