import Anthropic from '@anthropic-ai/sdk';
import winston from 'winston';
import type { AgentContext, AgentResult } from '@researcher/shared';
import { RunLogger, type RunLogEntry } from '../database/RunLogger';

export abstract class BaseAgent<TInput, TOutput> {
  protected client: Anthropic;
  protected logger: winston.Logger;
  protected model: string;
  protected maxTokens: number;

  // Last API call metrics (populated by callClaude)
  protected lastInputTokens?: number;
  protected lastOutputTokens?: number;
  protected lastStopReason?: string;

  constructor(
    model: string = 'claude-sonnet-4-5',
    maxTokens: number = 8192
  ) {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    this.model = model;
    this.maxTokens = maxTokens;

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { agent: this.constructor.name },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
      ],
    });
  }

  abstract execute(
    input: TInput,
    context?: AgentContext
  ): Promise<AgentResult<TOutput>>;

  protected async callClaude(
    systemPrompt: string,
    userPrompt: string,
    temperature: number = 1.0
  ): Promise<string> {
    const startTime = Date.now();

    try {
      this.logger.info('Calling Claude API', {
        model: this.model,
        maxTokens: this.maxTokens,
        temperature,
      });

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        temperature,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });

      const executionTime = Date.now() - startTime;
      this.lastInputTokens = response.usage.input_tokens;
      this.lastOutputTokens = response.usage.output_tokens;
      this.lastStopReason = response.stop_reason;

      this.logger.info('Claude API call successful', {
        executionTime,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        stopReason: response.stop_reason,
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return content.text;
      }

      throw new Error('Unexpected response type from Claude');
    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.logger.error('Claude API call failed', {
        error,
        executionTime,
      });
      throw error;
    }
  }

  protected parseJsonResponse<T>(response: string): T {
    try {
      // Try to find JSON in markdown code blocks
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }

      // Try to parse the entire response as JSON
      return JSON.parse(response);
    } catch (error) {
      this.logger.error('Failed to parse JSON response', {
        error,
        response: response.substring(0, 500),
      });
      throw new Error('Failed to parse JSON response from Claude');
    }
  }

  protected async logRun(entry: RunLogEntry): Promise<void> {
    await RunLogger.log({
      ...entry,
      inputTokens: entry.inputTokens ?? this.lastInputTokens,
      outputTokens: entry.outputTokens ?? this.lastOutputTokens,
      model: entry.model ?? this.model,
      stopReason: entry.stopReason ?? this.lastStopReason,
    });
  }

  protected async getMemory(grantTitle?: string): Promise<string> {
    return RunLogger.getMemoryContext(this.constructor.name, grantTitle);
  }

  protected createSuccessResult<T>(
    data: T,
    metadata?: Record<string, any>
  ): AgentResult<T> {
    return {
      success: true,
      data,
      metadata,
    };
  }

  protected createErrorResult<T>(
    error: Error | string,
    code?: string
  ): AgentResult<T> {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorDetails = typeof error === 'string' ? undefined : error;

    return {
      success: false,
      error: {
        message: errorMessage,
        code,
        details: errorDetails,
      },
    };
  }
}
