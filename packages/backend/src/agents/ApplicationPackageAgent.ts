import { BaseAgent } from './BaseAgent';
import type {
  GrantAnalysisOutput,
  OrganizationInfo,
  ScientificContent,
  ReviewOutput,
  ApplicationPackageOutput,
  AgentContext,
  AgentResult,
} from '@researcher/shared';
import {
  APPLICATION_PACKAGE_SYSTEM_PROMPT,
  createApplicationPackagePrompt,
} from './prompts/application-package.prompts';

export interface ApplicationPackageInput {
  grantAnalysis: GrantAnalysisOutput;
  organizationInfo: OrganizationInfo;
  scientificProposal: ScientificContent;
  reviewResults: ReviewOutput;
}

export class ApplicationPackageAgent extends BaseAgent<
  ApplicationPackageInput,
  ApplicationPackageOutput
> {
  constructor() {
    super('claude-sonnet-4-5', 8192);
  }

  async execute(
    input: ApplicationPackageInput,
    context?: AgentContext
  ): Promise<AgentResult<ApplicationPackageOutput>> {
    const startTime = Date.now();

    try {
      this.logger.info('Starting application package generation', {
        grantTitle: input.grantAnalysis.grantTitle,
        organizationName: input.organizationInfo.name,
        context,
      });

      const userPrompt = createApplicationPackagePrompt(
        JSON.stringify(input.grantAnalysis, null, 2),
        JSON.stringify(input.organizationInfo, null, 2),
        JSON.stringify(input.scientificProposal, null, 2),
        JSON.stringify(input.reviewResults, null, 2)
      );

      const response = await this.callClaude(
        APPLICATION_PACKAGE_SYSTEM_PROMPT,
        userPrompt,
        1.0
      );

      const packageResult = this.parseJsonResponse<ApplicationPackageOutput>(response);

      const executionTime = Date.now() - startTime;
      this.logger.info('Application package generation completed', {
        executionTime,
        generatedDocumentsCount: packageResult.generatedDocuments.length,
        manualDocumentsCount: packageResult.manualDocuments.length,
        checklistItemsCount: packageResult.documentChecklist.length,
      });

      return this.createSuccessResult(packageResult, {
        executionTime,
        modelUsed: this.model,
      });
    } catch (error) {
      this.logger.error('Application package generation failed', { error });
      return this.createErrorResult(
        error instanceof Error ? error : new Error(String(error)),
        'APPLICATION_PACKAGE_ERROR'
      );
    }
  }
}
