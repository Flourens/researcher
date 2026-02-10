# AI Grant Researcher 🤖

Multi-agent AI system for automated grant application preparation using Claude AI agents.

## 🎯 Features

- **5 Specialized AI Agents**:
  - `GrantAnalysisAgent` - Analyzes grant calls and extracts requirements
  - `FeasibilityAgent` - Evaluates organization's chances (✅ Ukraine eligibility fix included)
  - `ScientificWritingAgent` - Generates research proposals
  - `ReviewerAgent` - Reviews and scores proposals
  - `ApplicationPackageAgent` - Generates administrative documents

- **Iterative Improvement Pipeline** - Automatic proposal refinement until quality threshold met
- **Multilingual Support** - English, Ukrainian, Russian
- **Comprehensive Results** - All outputs saved in `results/` folder

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+
- pnpm 8+
- Anthropic API key
- Docker (for database)

### 2. Installation

```bash
# Install dependencies
pnpm install

# Setup environment
cp packages/backend/.env.example packages/backend/.env
# Edit .env and add your ANTHROPIC_API_KEY

# Initialize database
pnpm db:generate
pnpm db:push
```

### 3. Run Individual Agents

```bash
# Analyze a grant
pnpm debug:grant

# Evaluate feasibility
pnpm debug:feasibility

# Generate proposal
pnpm debug:proposal

# Review proposal
pnpm debug:review

# Generate application package
pnpm debug:package
```

### 4. Run Full Pipeline

```bash
# Complete workflow: analysis → feasibility → proposal → review → improvement
pnpm pipeline
```

## 📁 Project Structure

```
researcher/
├── packages/
│   ├── shared/              # Shared TypeScript types
│   │   └── src/types/
│   │       └── grant.types.ts
│   │
│   ├── backend/             # AI agents and backend logic
│   │   ├── src/
│   │   │   ├── agents/
│   │   │   │   ├── implementations/    # 5 AI agents
│   │   │   │   ├── prompts/            # Agent prompts
│   │   │   │   └── BaseAgent.ts
│   │   │   ├── database/
│   │   │   ├── organization-profile.ts  # Your org data (git-ignored)
│   │   │   ├── debug-*.ts               # Debug scripts
│   │   │   └── run-full-pipeline.ts     # Main pipeline
│   │   └── prisma/
│   │
│   └── frontend/            # (Future: Web UI)
│
└── results/                 # Agent outputs
    ├── README.md
    ├── 01-grant-analysis.json
    ├── 02-feasibility-evaluation.json
    └── ...
```

## 🔧 Configuration

### Organization Profile

Edit `packages/backend/src/organization-profile.ts` with your organization data:

```typescript
export const organizationProfile: OrganizationInfo = {
  name: 'Your Organization',
  type: 'university',
  country: 'Ukraine',
  researchAreas: [...],
  teamInfo: {...},
  resources: {...},
  // ... etc
};
```

### Agent Models

Agents use Claude models:
- **ScientificWritingAgent**: Opus 4.6 (highest quality, 16K tokens)
- **ReviewerAgent**: Opus 4.6 (comprehensive review, 16K tokens)
- **FeasibilityAgent**: Sonnet 4.5 (fast, efficient)
- **GrantAnalysisAgent**: Sonnet 4.5
- **ApplicationPackageAgent**: Opus 4.6

## 📊 Results

All agent outputs are saved in `results/` folder:

| File | Description | Agent |
|------|-------------|-------|
| `01-grant-analysis.json` | Structured grant analysis | GrantAnalysisAgent |
| `02-feasibility-evaluation.json` | Feasibility assessment | FeasibilityAgent |
| `03-proposal-v1-initial.json` | Initial proposal draft | ScientificWritingAgent |
| `04-review-v1.json` | First review | ReviewerAgent |
| `05-proposal-v2-improved-FINAL.json` | Improved proposal | ScientificWritingAgent |
| `06-review-v2-FINAL.json` | Final review | ReviewerAgent |

See `results/README.md` for detailed documentation.

## ✅ Ukraine Eligibility Fix

**IMPORTANT**: FeasibilityAgent includes official confirmation that Ukraine IS eligible for Digital Europe Programme grants:

- ✅ Ukraine associated with Digital Europe Programme since September 2022
- ✅ Can participate in HPC, AI, and digital skills programs
- ✅ Ukrainian organizations eligible for FFplus and EuroHPC funding

Sources documented in `organization-profile.ts` supporting documents.

## 🛠️ Development

```bash
# Run backend in dev mode
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Database studio
pnpm db:studio
```

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm debug:grant` | Analyze grant call |
| `pnpm debug:feasibility` | Evaluate feasibility |
| `pnpm debug:proposal` | Generate proposal |
| `pnpm debug:review` | Review proposal |
| `pnpm debug:package` | Generate documents |
| `pnpm pipeline` | Run full workflow |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema to database |

## 🐛 Troubleshooting

### "Anthropic API key not found"
Add `ANTHROPIC_API_KEY=sk-ant-...` to `packages/backend/.env`

### "Grant analysis not found"
Run `pnpm debug:grant` first to analyze a grant

### "Organization profile not found"
Edit `packages/backend/src/organization-profile.ts` with your data

### "Database connection error"
Ensure Docker is running and DATABASE_URL is correct in `.env`

## 📚 Documentation

- [Results Documentation](results/README.md) - Detailed output guide
- [Code Documentation](CODE_RESTORATION_COMPLETE.md) - Technical reference
- [Quick Start Guide](QUICK_START.md) - Step-by-step tutorial
- [Installation Checklist](INSTALLATION_CHECKLIST.md) - Setup verification

## 🤝 Contributing

This is a private project for grant application preparation.

## 📄 License

Private - All rights reserved

## 🙏 Acknowledgments

- Built with [Anthropic Claude](https://www.anthropic.com/) AI
- Uses Claude Opus 4.6 and Sonnet 4.5 models
- Designed for European grant applications (Horizon Europe, Digital Europe Programme, EuroHPC)

---

**Status**: ✅ Fully restored and production-ready

Generated with Claude Code - February 10, 2026
