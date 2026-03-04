import * as fs from 'fs';
import * as path from 'path';
import { BaseAgent } from './agents/BaseAgent';
import type {
  GrantAnalysisOutput,
  OrganizationInfo,
  FeasibilityEvaluation,
  AgentResult,
} from '@researcher/shared';
import {
  NANSEN_EDU_SYSTEM_PROMPT,
  createNansenEduWritingPrompt,
} from './agents/prompts/nansen-edu.prompts';

const RESULTS_DIR = path.join(__dirname, '../../../results');

interface NansenEduProposal {
  section1_1_background: string;
  section1_2_alignment: string;
  section2_1_activities: string;
  section2_2_risks: string;
  section3_1_personnel: string;
  section3_2_collaboration: string;
  section4_1_impact: string;
  section4_2_sustainability: string;
  references: string[];
}

class NansenEduWritingAgent extends BaseAgent<
  {
    grantAnalysis: GrantAnalysisOutput;
    organizationInfo: OrganizationInfo;
    feasibilityEvaluation: FeasibilityEvaluation;
    businessContext?: string;
  },
  NansenEduProposal
> {
  constructor() {
    // Using Sonnet as fallback when Opus is overloaded
    super('claude-sonnet-4-5', 32768);
  }

  async execute(input: {
    grantAnalysis: GrantAnalysisOutput;
    organizationInfo: OrganizationInfo;
    feasibilityEvaluation: FeasibilityEvaluation;
    businessContext?: string;
  }): Promise<AgentResult<NansenEduProposal>> {
    const startTime = Date.now();

    try {
      console.log('Starting Nansen EDU proposal generation...');
      console.log('Model: Claude Opus 4.6');
      console.log('Max tokens: 32768\n');

      const userPrompt = createNansenEduWritingPrompt(
        JSON.stringify(input.grantAnalysis, null, 2),
        JSON.stringify(input.organizationInfo, null, 2),
        JSON.stringify(input.feasibilityEvaluation, null, 2),
        'en',
        input.businessContext
      );

      const response = await this.callClaude(
        NANSEN_EDU_SYSTEM_PROMPT,
        userPrompt,
        1.0
      );

      const proposalContent = this.parseJsonResponse<NansenEduProposal>(response);

      const executionTime = Date.now() - startTime;

      await this.logRun({
        agentName: 'NansenEduWritingAgent',
        grantTitle: input.grantAnalysis.grantTitle,
        success: true,
        executionTimeMs: executionTime,
        summary: `Nansen EDU proposal generated successfully`,
      });

      return this.createSuccessResult(proposalContent, {
        executionTime,
        modelUsed: this.model,
        language: 'en',
      });
    } catch (error) {
      const executionTime = Date.now() - startTime;
      await this.logRun({
        agentName: 'NansenEduWritingAgent',
        grantTitle: input.grantAnalysis.grantTitle,
        success: false,
        executionTimeMs: executionTime,
        errorMessage: error instanceof Error ? error.message : String(error),
      });
      return this.createErrorResult(
        error instanceof Error ? error : new Error(String(error)),
        'PROPOSAL_GENERATION_ERROR'
      );
    }
  }
}

async function main() {
  console.log('=== Nansen EDU 2025 Proposal Generation ===\n');

  // Load grant analysis
  const analysisPath = path.join(RESULTS_DIR, 'grant-analysis.json');
  const grantAnalysis: GrantAnalysisOutput = JSON.parse(
    fs.readFileSync(analysisPath, 'utf-8')
  );
  console.log(`Loaded grant analysis: ${grantAnalysis.grantTitle}`);

  // Load organization info
  const orgInfoPath = path.join(RESULTS_DIR, 'organization-info.json');
  const organizationInfo: OrganizationInfo = JSON.parse(
    fs.readFileSync(orgInfoPath, 'utf-8')
  );
  console.log(`Loaded organization info: ${organizationInfo.name}`);

  // Load feasibility evaluation
  const feasibilityPath = path.join(RESULTS_DIR, 'feasibility-evaluation.json');
  const feasibilityEvaluation: FeasibilityEvaluation = JSON.parse(
    fs.readFileSync(feasibilityPath, 'utf-8')
  );
  console.log(`Loaded feasibility evaluation (${feasibilityEvaluation.overallChance}% chance)\n`);

  // Optional: business context
  let businessContext: string | undefined;
  const contextPath = path.join(RESULTS_DIR, 'business-context.txt');
  if (fs.existsSync(contextPath)) {
    businessContext = fs.readFileSync(contextPath, 'utf-8');
    console.log(`Loaded business context (${businessContext.length} chars)\n`);
  }

  // Generate proposal
  const agent = new NansenEduWritingAgent();
  const result = await agent.execute({
    grantAnalysis,
    organizationInfo,
    feasibilityEvaluation,
    businessContext,
  });

  if (result.success && result.data) {
    console.log('\n✓ Proposal generation completed successfully\n');

    // Save to nansen-edu-2025-znu directory
    const outputDir = path.join(RESULTS_DIR, 'nansen-edu-2025-znu');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save JSON
    const outputPath = path.join(outputDir, 'project-description.json');
    fs.writeFileSync(outputPath, JSON.stringify(result.data, null, 2), 'utf-8');
    console.log(`JSON saved to: ${outputPath}`);

    // Save as markdown
    const markdown = `# PROJECT DESCRIPTION — NANSEN EDU 2025
# AI-Driven Green Metallurgy Education for Ukraine's Industrial Reconstruction (AI-GreenMet)

**Coordinator:** NTNU (Norwegian University of Science and Technology)
**Ukrainian Partner 1:** Zaporizhzhia National University (ZNU)
**Ukrainian Partner 2:** [To be confirmed]
**Duration:** 3 years (July 2026 – June 2029)
**Budget:** NOK 5,000,000

---

## 1. Relevance of the Project

### 1.1 Background and Needs of the Project

${result.data.section1_1_background}

### 1.2 Alignment with Other Activities and Innovative Elements

${result.data.section1_2_alignment}

---

## 2. Design and Implementation

### 2.1 Activities, Measures and Approaches

${result.data.section2_1_activities}

### 2.2 Risk Factors and Mitigation Measures

${result.data.section2_2_risks}

---

## 3. The Project Group and Collaborative Structures

### 3.1 Key Personnel

${result.data.section3_1_personnel}

### 3.2 Involvement, Interaction and Division of Work

${result.data.section3_2_collaboration}

---

## 4. Project Impact

### 4.1 Impact and Dissemination

${result.data.section4_1_impact}

### 4.2 Duration of Impact and Evaluation

${result.data.section4_2_sustainability}

---

## 5. Reference List

${result.data.references.map((ref, idx) => `[${idx + 1}] ${ref}`).join('\n')}
`;

    const markdownPath = path.join(outputDir, 'project-description.md');
    fs.writeFileSync(markdownPath, markdown, 'utf-8');
    console.log(`Markdown saved to: ${markdownPath}`);

    // Print statistics
    console.log('\n=== Proposal Statistics ===');
    const sections = [
      { name: 'Section 1.1 (Background)', text: result.data.section1_1_background },
      { name: 'Section 1.2 (Alignment)', text: result.data.section1_2_alignment },
      { name: 'Section 2.1 (Activities)', text: result.data.section2_1_activities },
      { name: 'Section 2.2 (Risks)', text: result.data.section2_2_risks },
      { name: 'Section 3.1 (Personnel)', text: result.data.section3_1_personnel },
      { name: 'Section 3.2 (Collaboration)', text: result.data.section3_2_collaboration },
      { name: 'Section 4.1 (Impact)', text: result.data.section4_1_impact },
      { name: 'Section 4.2 (Sustainability)', text: result.data.section4_2_sustainability },
    ];

    let totalWords = 0;
    for (const section of sections) {
      const words = section.text.split(/\s+/).length;
      totalWords += words;
      console.log(`${section.name}: ~${words} words`);
    }
    console.log(`References: ${result.data.references.length}`);
    console.log(`\nTotal Words: ~${totalWords}`);
    console.log(`Estimated Pages: ~${Math.round(totalWords / 400)}`);

    if (result.metadata) {
      console.log(`\nExecution Time: ${result.metadata.executionTime}ms`);
      console.log(`Model: ${result.metadata.modelUsed}`);
    }
  } else {
    console.error('✗ Proposal generation failed');
    console.error(result.error?.message);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
