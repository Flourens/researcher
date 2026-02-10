import { BaseAgent } from './BaseAgent';
import type {
  GrantAnalysisOutput,
  OrganizationInfo,
  FeasibilityEvaluation,
  ScientificContent,
  Language,
  AgentContext,
  AgentResult,
} from '@researcher/shared';
import {
  SCIENTIFIC_WRITING_SYSTEM_PROMPT,
  createScientificWritingPrompt,
} from './prompts/scientific-writing.prompts';

export interface ScientificWritingInput {
  grantAnalysis: GrantAnalysisOutput;
  organizationInfo: OrganizationInfo;
  feasibilityEvaluation: FeasibilityEvaluation;
  language?: Language;
  businessContext?: string;
}

export class ScientificWritingAgent extends BaseAgent<
  ScientificWritingInput,
  ScientificContent
> {
  constructor() {
    // Use Claude Opus 4.6 with higher token limit for complex proposals
    // Increased to 32K to handle large JSON responses without truncation
    super('claude-opus-4-6', 32768);
  }

  async execute(
    input: ScientificWritingInput,
    context?: AgentContext
  ): Promise<AgentResult<ScientificContent>> {
    const startTime = Date.now();

    try {
      this.logger.info('Starting scientific proposal generation', {
        grantTitle: input.grantAnalysis.grantTitle,
        organizationName: input.organizationInfo.name,
        language: input.language || 'en',
        hasBusinessContext: !!input.businessContext,
        context,
      });

      const userPrompt = createScientificWritingPrompt(
        JSON.stringify(input.grantAnalysis, null, 2),
        JSON.stringify(input.organizationInfo, null, 2),
        JSON.stringify(input.feasibilityEvaluation, null, 2),
        input.language || 'en',
        input.businessContext
      );

      const response = await this.callClaude(
        SCIENTIFIC_WRITING_SYSTEM_PROMPT,
        userPrompt,
        1.0
      );

      const proposalContent = this.parseJsonResponse<ScientificContent>(response);

      const executionTime = Date.now() - startTime;
      this.logger.info('Scientific proposal generation completed', {
        executionTime,
        abstractLength: proposalContent.abstract.length,
        sectionsGenerated: Object.keys(proposalContent).length,
        bibliographyCount: proposalContent.bibliography.length,
      });

      return this.createSuccessResult(proposalContent, {
        executionTime,
        modelUsed: this.model,
        language: input.language || 'en',
      });
    } catch (error) {
      this.logger.error('Scientific proposal generation failed', { error });
      return this.createErrorResult(
        error instanceof Error ? error : new Error(String(error)),
        'PROPOSAL_GENERATION_ERROR'
      );
    }
  }
}
