# AI Grant Researcher - Quick Start Guide

## Setup (5 minutes)

### 1. Install Dependencies
```bash
cd /Users/evgeniyareshkin/Desktop/projects/researcher
pnpm install
```

### 2. Configure Environment
```bash
cd packages/backend
cp .env.example .env
nano .env  # Add your ANTHROPIC_API_KEY
```

### 3. Initialize Database
```bash
cd packages/backend
pnpm db:generate
pnpm db:push
```

---

## Create Input Files

### Required Files in `/results/` directory:

#### 1. `grant-text.txt`
Paste the full grant call text here.

#### 2. `organization-info.json`
```json
{
  "name": "Your Organization Name",
  "type": "research_institute",
  "country": "Ukraine",
  "description": "Brief description of your organization",
  "teamInfo": {
    "coreTeam": [
      {
        "name": "John Doe",
        "role": "Principal Investigator",
        "expertise": ["AI", "Machine Learning"],
        "experience": "10 years in AI research"
      }
    ],
    "totalSize": 5,
    "keyCompetencies": ["AI", "Data Science", "Software Development"]
  },
  "resources": {
    "technical": {
      "infrastructure": ["GPU servers", "Computing cluster"],
      "software": ["TensorFlow", "PyTorch"]
    },
    "financial": {
      "annualBudget": "€500,000"
    }
  },
  "trackRecord": {
    "previousProjects": [
      {
        "title": "Previous AI Project",
        "description": "Description of past work",
        "outcome": "Successfully delivered",
        "relevance": "Directly related to this grant"
      }
    ]
  },
  "partnerships": [
    {
      "organizationName": "University Partner",
      "type": "academic",
      "description": "Research collaboration",
      "relevance": "Joint research in AI"
    }
  ]
}
```

#### 3. `business-context.txt` (Optional)
If you want to tailor the proposal to specific business needs:
```
This project will be applied in the construction industry to...
[Your business context here]
```

#### 4. `pipeline-config.json` (Optional)
```json
{
  "language": "en",
  "maxIterations": 2,
  "minScorePercentage": 70
}
```

---

## Run the Pipeline

### Option 1: Full Automated Pipeline (Recommended)
```bash
cd packages/backend
pnpm pipeline
```

This will:
1. Analyze the grant (Step 1/5)
2. Evaluate feasibility (Step 2/5)
3. Generate proposal iteratively (Step 3/5)
4. Review and improve until quality threshold met
5. Generate application package (Step 4/5)
6. Save all results (Step 5/5)

**Output Location**: `/results/` directory

### Option 2: Run Individual Steps

#### Step 1: Analyze Grant
```bash
pnpm debug:grant
```
**Output**: `results/grant-analysis.json`

#### Step 2: Evaluate Feasibility
```bash
pnpm debug:feasibility
```
**Output**: `results/feasibility-evaluation.json`

#### Step 3: Generate Proposal
```bash
pnpm debug:proposal
```
**Output**:
- `results/scientific-proposal.json`
- `results/scientific-proposal.md`

#### Step 4: Review Proposal
```bash
pnpm debug:review
```
**Output**:
- `results/review-results.json`
- `results/review-report.md`

#### Step 5: Generate Application Package
```bash
pnpm debug:package
```
**Output**:
- `results/application-package.json`
- `results/application-package/` (9 documents)

---

## Output Files

After running the pipeline, you'll find:

```
results/
├── grant-analysis.json           # Structured grant information
├── feasibility-evaluation.json   # Feasibility assessment
├── scientific-proposal.json      # Proposal content (JSON)
├── scientific-proposal.md        # Proposal (readable format)
├── review-results.json           # Review scores and feedback
├── review-report.md              # Detailed review report
├── application-package.json      # Complete package metadata
├── pipeline-summary.json         # Overall summary
└── application-package/          # Ready-to-submit documents
    ├── cover-letter.md
    ├── project-summary.md
    ├── budget-justification.md
    ├── team-cv.md
    ├── work-plan.md
    ├── risk-assessment.md
    ├── impact-statement.md
    ├── ethics-statement.md
    ├── data-management-plan.md
    └── submission-checklist.md
```

---

## Understanding the Results

### Feasibility Evaluation
- **Overall Chance**: Probability of winning (0-100%)
- **Recommendation**: highly_recommended | recommended | proceed_with_caution | not_recommended
- **Match Score**: How well you fit the grant (0-100)
- **Strengths**: Your competitive advantages
- **Weaknesses**: Areas that need improvement
- **Gaps**: Missing capabilities
- **Required Actions**: What you must do before applying

### Proposal Quality
- **Score**: Points achieved vs maximum possible
- **Ready to Submit**: Boolean - is it ready?
- **Critical Issues**: Must-fix problems
- **Missing Elements**: Required content not present
- **Improvement Priorities**: What to focus on

### Application Package
- **9 Generated Documents**: Ready-to-use supporting materials
- **Submission Checklist**: Step-by-step guide
- **Quality Checks**: Validation of completeness
- **Next Steps**: Actions before submission

---

## Troubleshooting

### Error: "Grant text file not found"
**Solution**: Create `results/grant-text.txt` with your grant call text

### Error: "Organization info not found"
**Solution**: Create `results/organization-info.json` with your org details

### Error: "ANTHROPIC_API_KEY not set"
**Solution**: Add your API key to `packages/backend/.env`

### Low Quality Score
**Solution**: The pipeline will automatically iterate (max 2 times) to improve quality

### API Rate Limits
**Solution**: The pipeline uses efficient models and reasonable token limits. If you hit limits, wait and retry.

---

## Cost Estimation

Approximate costs per full pipeline run:

- **Grant Analysis**: ~$0.10 (Sonnet 4.5)
- **Feasibility**: ~$0.15 (Sonnet 4.5)
- **Proposal Generation**: ~$1.50 per iteration (Opus 4.6)
- **Review**: ~$1.00 per iteration (Opus 4.6)
- **Package Generation**: ~$0.20 (Sonnet 4.5)

**Total**: ~$5-8 per complete grant application

---

## Tips for Best Results

### 1. Provide Complete Organization Info
- Include all relevant projects and achievements
- List all key team members with expertise
- Mention all resources and facilities
- Document partnerships and collaborations

### 2. Add Business Context
- Explain real-world applications
- Describe target markets or beneficiaries
- Show practical impact

### 3. Review and Customize
- The AI generates excellent drafts
- Review and add specific details
- Customize for your exact situation
- Verify all technical claims

### 4. Iterate if Needed
- The pipeline iterates automatically
- You can also manually regenerate sections
- Use review feedback to improve

---

## Language Support

Set language in `results/pipeline-config.json`:

```json
{
  "language": "en"  // or "ru" or "uk"
}
```

- **en**: Professional scientific English
- **ru**: Профессиональный научный русский
- **uk**: Професійна наукова українська

---

## Support

For issues or questions:
1. Check this guide
2. Review `CODE_RESTORATION_COMPLETE.md` for detailed documentation
3. Check console output for specific errors
4. Review log files in the backend directory

---

## Success Checklist

Before submitting your application:

- [ ] Feasibility evaluation shows >50% chance
- [ ] Review score is >70% of maximum
- [ ] All critical issues resolved
- [ ] No missing elements
- [ ] All required documents generated
- [ ] Quality checks passed
- [ ] Submission checklist completed
- [ ] Manual documents prepared
- [ ] Application reviewed by team
- [ ] All claims verified
- [ ] Budget justified
- [ ] Timeline realistic
- [ ] Impact clearly demonstrated

---

**Ready to create winning grant applications!** 🚀
