---
name: researcher
description: Manage the AI Grant Researcher project — run agents, check results, iterate proposals, view memory. Use when the user asks to run agents, check grant analysis status, generate proposals, or manage the research pipeline.
---

# AI Grant Researcher — Project Management

You are managing a multi-agent system for grant proposal generation. The project is at `/Users/evgeniyareshkin/Desktop/projects/researcher`.

## Grant Research Workflow

When the user says **"research this grant"** (or similar), follow this procedure:

### Step 1: Collect Resources
- The user will provide URLs to grant documents (PDFs, web pages)
- Use **WebFetch** to download all PDFs/pages in parallel
- If WebFetch returns binary PDFs, use the **Read** tool with `pages` parameter to read them visually
- Also check if the user provided any EU portal links — if so, use the `eu-grant-fetcher` skill to get structured call data

### Step 2: Analyze & Extract
From all documents, extract and organize:
1. **Deadlines & Timeline** — submission period, evaluation dates, project duration, key milestones
2. **Funding** — total budget, max per project, funding rate, payment schedule, eligible/ineligible costs
3. **Eligibility** — who can apply, organization types, country requirements, restrictions
4. **How to Apply** — step-by-step actions, portal registration, online form, what to upload
5. **Required Documents** — list every document needed, format requirements, who should prepare each one
6. **Evaluation Criteria** — scoring system, weights, thresholds, what evaluators look for
7. **Research Areas / Topics** — specific clusters, sectors, focus areas, use cases
8. **Technical Requirements** — platform specs, standards compliance, integration requirements
9. **Obligations if Funded** — reporting, IP, open access, financial records
10. **Contact & Support** — email, webinars, advisory reviews

### Step 3: Save Research
- Create a directory: `grants/[grant-short-name]/`
- Write a comprehensive `RESEARCH.md` file with all findings organized by the categories above
- Calculate days remaining until deadline
- Highlight critical constraints (page limits, language, file naming, etc.)

### Step 4: Present Summary
Give the user a concise summary covering:
- **Time remaining** to apply
- **Key actions** they need to take
- **Documents needed** and who prepares them
- **Possible research areas** to target
- **Key financial numbers**

### Research Output Template
Save to `grants/[grant-name]/RESEARCH.md` with these sections:
```
# [Grant Name] - Grant Research
## Overview (program, call, type, funding)
## 1. Time to Apply (deadline table + days remaining)
## 2. Actions to Apply (step-by-step)
## 3. Required Documents & Responsibility (table)
## 4. Possible Areas of Research (clusters/topics)
## 5. Evaluation Criteria (scoring table + what evaluators check)
## 6. Financial Conditions (eligible costs, payment schedule)
## 7. Eligibility Requirements
## 8. Technical Requirements (if applicable)
## 9. Obligations if Funded
## 10. Contact & Support
## 11. Key Risks & Tips
```

---

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
