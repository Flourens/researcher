import { prisma } from './client';

export interface RunLogEntry {
  agentName: string;
  grantTitle?: string;
  iteration?: number;
  success: boolean;
  score?: number;
  maxScore?: number;
  inputTokens?: number;
  outputTokens?: number;
  executionTimeMs?: number;
  model?: string;
  stopReason?: string;
  errorMessage?: string;
  summary?: string;
  feedback?: string[];
}

export class RunLogger {
  static async log(entry: RunLogEntry): Promise<void> {
    try {
      await prisma.agentRun.create({
        data: {
          agentName: entry.agentName,
          grantTitle: entry.grantTitle,
          iteration: entry.iteration ?? 1,
          success: entry.success,
          score: entry.score,
          maxScore: entry.maxScore,
          inputTokens: entry.inputTokens,
          outputTokens: entry.outputTokens,
          executionTimeMs: entry.executionTimeMs,
          model: entry.model,
          stopReason: entry.stopReason,
          errorMessage: entry.errorMessage,
          summary: entry.summary,
          feedback: entry.feedback ? JSON.stringify(entry.feedback) : null,
        },
      });
    } catch (error) {
      // Don't let logging failures break agent execution
      console.error('[RunLogger] Failed to log run:', error);
    }
  }

  static async getHistory(agentName: string, limit: number = 10) {
    return prisma.agentRun.findMany({
      where: { agentName },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  static async getLastRun(agentName: string) {
    return prisma.agentRun.findFirst({
      where: { agentName },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getReviewHistory(grantTitle: string) {
    return prisma.agentRun.findMany({
      where: {
        agentName: 'ReviewerAgent',
        grantTitle,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getMemoryContext(agentName: string, grantTitle?: string): Promise<string> {
    const where: Record<string, unknown> = {};
    if (grantTitle) {
      where.grantTitle = grantTitle;
    }

    const runs = await prisma.agentRun.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      take: 20,
    });

    if (runs.length === 0) {
      return '';
    }

    const lines = runs.map((run, idx) => {
      const date = run.createdAt.toISOString().split('T')[0];
      const time = run.executionTimeMs ? `${Math.round(run.executionTimeMs / 1000)}s` : '?s';
      const tokens = run.outputTokens ? `${run.outputTokens} tokens` : '';
      const status = run.success ? 'SUCCESS' : `FAILED${run.stopReason ? ` (${run.stopReason})` : ''}`;

      let line = `Run ${idx + 1} (${date}): ${run.agentName} — ${status}, ${time}${tokens ? ', ' + tokens : ''}`;

      if (run.score != null && run.maxScore != null) {
        const pct = Math.round((run.score / run.maxScore) * 100);
        line += `, score: ${run.score}/${run.maxScore} (${pct}%)`;
      }

      if (run.errorMessage) {
        line += `\n  Error: ${run.errorMessage}`;
      }

      if (run.feedback) {
        try {
          const feedbackItems = JSON.parse(run.feedback) as string[];
          if (feedbackItems.length > 0) {
            line += `\n  Key feedback: ${feedbackItems.slice(0, 5).join('; ')}`;
          }
        } catch {
          // ignore parse errors
        }
      }

      if (run.summary) {
        line += `\n  Summary: ${run.summary}`;
      }

      return line;
    });

    return `=== MEMORY: Previous runs ===\n${lines.join('\n')}\n===`;
  }
}
