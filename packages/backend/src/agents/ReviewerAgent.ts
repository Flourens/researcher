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

      const memory = await this.getMemory(input.grantAnalysis.grantTitle);
      if (memory) {
        this.logger.info('Loaded memory context', { memoryLength: memory.length });
      }

      const userPrompt = createReviewerPrompt(
        JSON.stringify(input.grantAnalysis, null, 2),
        JSON.stringify(input.scientificProposal, null, 2),
        memory || undefined
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

      // Extract key feedback for memory
      const keyFeedback = [
        ...reviewResult.weaknesses
          .filter(w => w.severity === 'critical' || w.severity === 'major')
          .map(w => `[${w.section}] ${w.issue}`),
        ...reviewResult.missingElements.slice(0, 5),
      ];

      await this.logRun({
        agentName: this.constructor.name,
        grantTitle: input.grantAnalysis.grantTitle,
        success: true,
        executionTimeMs: executionTime,
        score: reviewResult.overallScore,
        maxScore: reviewResult.maxScore,
        summary: `Review: ${reviewResult.overallScore}/${reviewResult.maxScore}, readyToSubmit: ${reviewResult.readyToSubmit}`,
        feedback: keyFeedback,
      });

      return this.createSuccessResult(reviewResult, {
        executionTime,
        modelUsed: this.model,
      });
    } catch (error) {
      const executionTime = Date.now() - startTime;
      await this.logRun({
        agentName: this.constructor.name,
        grantTitle: input.grantAnalysis.grantTitle,
        success: false,
        executionTimeMs: executionTime,
        errorMessage: error instanceof Error ? error.message : String(error),
      });
      this.logger.error('Proposal review failed', { error });
      return this.createErrorResult(
        error instanceof Error ? error : new Error(String(error)),
        'REVIEW_ERROR'
      );
    }
  }
}
