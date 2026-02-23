---
name: researcher
description: Manage the AI Grant Researcher project — run agents, check results, iterate proposals, view memory. Use when the user asks to run agents, check grant analysis status, generate proposals, or manage the research pipeline.
---

# AI Grant Researcher — Project Management

You are managing a multi-agent system for grant proposal generation. The project is at `/Users/evgeniyareshkin/Desktop/projects/researcher`.

## Architecture

5 specialized agents form a pipeline:

```
grant-text.txt + organization-info.json + business-context.txt
    ↓
GrantAnalysisAgent (Sonnet 4.5, 8K) → grant-analysis.json
    ↓
FeasibilityAgent (Sonnet 4.5, 16K) → feasibility-evaluation.json
    ↓
ScientificWritingAgent (Opus 4.6, 32K) → scientific-proposal.json
    ↓
ReviewerAgent (Opus 4.6, 16K) → review-results.json
    ↓ (iterate if score < 70%)
ApplicationPackageAgent (Sonnet 4.5, 8K) → application-package/
```

## Commands

Run from project root. All agents read/write to `results/` directory.

| Task | Command |
|------|---------|
| Full pipeline | `cd packages/backend && npx tsx src/run-full-pipeline.ts` |
| Grant analysis only | `cd packages/backend && npx tsx src/debug-grant-analysis.ts` |
| Feasibility check | `cd packages/backend && npx tsx src/debug-feasibility-agent.ts` |
| Generate proposal | `cd packages/backend && npx tsx src/debug-proposal-generation.ts` |
| Review proposal | `cd packages/backend && npx tsx src/debug-reviewer-agent.ts` |
| Application package | `cd packages/backend && npx tsx src/debug-application-package-agent.ts` |
| 2-cycle iteration | `cd packages/backend && npx tsx src/debug-iteration-cycle.ts` |
| View DB (Prisma Studio) | `cd packages/backend && npx prisma studio` |

## Input Files (results/)

| File | Purpose | Required |
|------|---------|----------|
| `grant-text.txt` | Full grant call text | Yes (for GrantAnalysis) |
| `organization-info.json` | Main participant + supporting partners | Yes |
| `business-context.txt` | Project description, dataset, model architecture | Optional but strongly recommended |

## Output Files (results/)

| File | Agent | Content |
|------|-------|---------|
| `grant-analysis.json` | GrantAnalysis | Requirements, criteria, budget, timeline |
| `feasibility-evaluation.json` | Feasibility | Chance %, strengths, weaknesses, gaps |
| `scientific-proposal.json` | ScientificWriting | Abstract, intro, methodology, work plan... |
| `scientific-proposal-vN.json` | ScientificWriting | Versioned copies per iteration |
| `review-results.json` | Reviewer | Score, section scores, weaknesses, feedback |
| `review-results-vN.json` | Reviewer | Versioned copies per iteration |
| `application-package.json` | ApplicationPackage | Full submission package |
| `application-package/*.md` | ApplicationPackage | 9 generated documents |

## Memory System

Agents use SQLite (Prisma) to remember previous runs:
- **RunLogger** records every execution (agent name, score, tokens, feedback)
- **ScientificWritingAgent** loads previous review feedback before generating
- **ReviewerAgent** loads previous review scores to track improvement
- Memory is per-grant (filtered by `grantTitle`)

Check memory: `cd packages/backend && npx prisma studio` → AgentRun table

## Current Project

**Grant**: FFplus Call-2-Type-2 — Innovation Studies for Generative AI Models (EuroHPC JU)
**Deadline**: February 25, 2026 (or when 250 proposals received)
**Max funding**: €300K per consortium, 10 months

**Consortium**:
- **Main participant (SME)**: ALD Engineering & Construction LLC (Ukraine, 219 employees)
- **Supporting participant**: ZNU Lab of Parallel and Distributed Computing (Dr. Halyna Shylo)

**Project**: CosTERRA — Cognitive System for Technical Engineering, Research & Architectural documentation
- Domain-specific generative AI model for construction cost estimation documents
- Training data: 6 years of proprietary procurement data from ALD's ERP
- HPC: EuroHPC AI Factories pre-exascale systems

## Workflow Tips

1. **New grant**: Put grant PDF/text in `results/grant-text.txt`, run GrantAnalysis first
2. **New organization**: Update `results/organization-info.json` and `results/business-context.txt`
3. **Iterate proposal**: Run `debug-iteration-cycle.ts` — it handles writer→reviewer→writer→reviewer with memory
4. **Check quality**: After reviewer scores ≥ 70% and `readyToSubmit: true`, run ApplicationPackage
5. **Prompt tuning**: Edit files in `packages/backend/src/agents/prompts/` to adjust agent behavior
6. **Reset memory**: Delete records in AgentRun table via Prisma Studio, or delete `dev.db` and re-push schema

## Environment

```bash
# .env location: packages/backend/.env
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL="file:./dev.db"
LOG_LEVEL=info
```

## Troubleshooting

- **JSON truncation**: If writer output is cut off, increase `maxTokens` in `ScientificWritingAgent.ts` constructor (currently 32768)
- **stopReason: max_tokens**: Response was truncated. Check BaseAgent logs for token usage
- **Prisma errors**: Run `cd packages/backend && npx prisma db push` to sync schema
- **TypeScript errors**: Pre-existing (shared/dist not built). Agents run fine via `npx tsx`
