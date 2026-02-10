// ============================================================================
// ORGANIZATION INFO TYPES
// ============================================================================

export interface TeamMember {
  name: string;
  role: string;
  expertise: string[];
  experience: string;
  relevantProjects?: string[];
}

export interface TeamInfo {
  coreTeam: TeamMember[];
  advisors?: TeamMember[];
  externalExperts?: TeamMember[];
  totalSize: number;
  keyCompetencies: string[];
}

export interface ResourceInfo {
  technical: {
    infrastructure?: string[];
    equipment?: string[];
    software?: string[];
    computingResources?: string[];
  };
  financial: {
    annualBudget?: string;
    fundingSources?: string[];
    availableFunding?: string;
  };
  facilities?: string[];
  partnerships?: string[];
}

export interface ProjectReference {
  title: string;
  description: string;
  year?: string;
  outcome?: string;
  relevance: string;
}

export interface TrackRecord {
  previousProjects: ProjectReference[];
  publications?: string[];
  awards?: string[];
  patents?: string[];
  successMetrics?: {
    metric: string;
    value: string;
  }[];
}

export interface Partnership {
  organizationName: string;
  type: 'academic' | 'industry' | 'government' | 'ngo' | 'other';
  description: string;
  relevance: string;
}

export interface SupportingDocument {
  type: string;
  filename: string;
  description: string;
  content?: string;
}

export interface OrganizationInfo {
  name: string;
  type: 'university' | 'research_institute' | 'company' | 'ngo' | 'other';
  country: string;
  description: string;
  teamInfo: TeamInfo;
  resources: ResourceInfo;
  trackRecord: TrackRecord;
  partnerships: Partnership[];
  supportingDocuments?: SupportingDocument[];
}

// ============================================================================
// GRANT ANALYSIS TYPES
// ============================================================================

export interface Requirement {
  category: 'eligibility' | 'technical' | 'administrative' | 'financial' | 'other';
  description: string;
  mandatory: boolean;
  evidence?: string;
}

export interface EvaluationCriterion {
  name: string;
  description: string;
  weight: number;
  maxScore: number;
  keyIndicators: string[];
}

export interface BudgetCategory {
  category: string;
  description: string;
  minAmount?: number;
  maxAmount?: number;
  rules?: string[];
}

export interface Timeline {
  phase: string;
  duration: string;
  deliverables: string[];
}

export interface GrantAnalysisOutput {
  grantTitle: string;
  grantingOrganization: string;
  programName?: string;
  deadline?: string;
  summary: string;
  objectives: string[];
  requirements: Requirement[];
  evaluationCriteria: EvaluationCriterion[];
  budget: {
    totalAmount?: string;
    categories: BudgetCategory[];
    coFundingRequired?: boolean;
    coFundingPercentage?: number;
  };
  timeline: Timeline[];
  targetBeneficiaries?: string[];
  geographicScope?: string;
  eligibleCountries?: string[];
  keyThemes: string[];
  additionalNotes?: string[];
}

// ============================================================================
// FEASIBILITY EVALUATION TYPES
// ============================================================================

export interface MatchScore {
  category: string;
  score: number;
  maxScore: number;
  explanation: string;
}

export interface Strength {
  area: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export interface Weakness {
  area: string;
  description: string;
  severity: 'critical' | 'major' | 'minor';
  mitigation?: string;
}

export interface Gap {
  type: 'team' | 'resources' | 'experience' | 'technical' | 'administrative';
  description: string;
  severity: 'critical' | 'major' | 'minor';
  recommendation: string;
}

export interface Risk {
  category: string;
  description: string;
  probability: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  mitigation: string;
}

export interface FeasibilityEvaluation {
  overallChance: number;
  recommendation: 'highly_recommended' | 'recommended' | 'proceed_with_caution' | 'not_recommended';
  executiveSummary: string;
  matchScore: {
    overall: number;
    breakdown: MatchScore[];
  };
  strengths: Strength[];
  weaknesses: Weakness[];
  gaps: Gap[];
  risks: Risk[];
  requiredActions: {
    priority: 'critical' | 'high' | 'medium' | 'low';
    action: string;
    timeline: string;
  }[];
  strategicRecommendations: string[];
}

// ============================================================================
// SCIENTIFIC CONTENT TYPES
// ============================================================================

export interface ScientificContent {
  abstract: string;
  introduction: string;
  stateOfTheArt: string;
  methodology: string;
  workPlan: string;
  expectedResults: string;
  impact: string;
  bibliography: string[];
}

// ============================================================================
// REVIEW OUTPUT TYPES
// ============================================================================

export interface SectionScore {
  section: string;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface ReviewIssue {
  section: string;
  issue: string;
  severity: 'critical' | 'major' | 'minor';
  suggestion: string;
}

export interface ReviewOutput {
  overallScore: number;
  maxScore: number;
  readyToSubmit: boolean;
  executiveSummary: string;
  sectionScores: SectionScore[];
  strengths: string[];
  weaknesses: ReviewIssue[];
  missingElements: string[];
  improvementPriorities: {
    priority: 'critical' | 'high' | 'medium' | 'low';
    area: string;
    recommendation: string;
  }[];
  detailedFeedback: {
    section: string;
    comments: string[];
  }[];
}

// ============================================================================
// APPLICATION PACKAGE TYPES
// ============================================================================

export interface GeneratedDocument {
  type: 'cover_letter' | 'project_summary' | 'budget_justification' |
        'team_cv' | 'work_plan' | 'risk_assessment' | 'impact_statement' |
        'ethics_statement' | 'data_management_plan';
  filename: string;
  content: string;
  format: 'markdown' | 'pdf' | 'docx';
  status: 'generated' | 'needs_review' | 'approved';
}

export interface ManualDocument {
  type: string;
  description: string;
  required: boolean;
  instructions: string;
}

export interface DocumentChecklist {
  item: string;
  status: 'complete' | 'in_progress' | 'not_started';
  responsible?: string;
  deadline?: string;
  notes?: string;
}

export interface ApplicationPackageOutput {
  packageId: string;
  grantTitle: string;
  createdAt: string;
  documentChecklist: DocumentChecklist[];
  generatedDocuments: GeneratedDocument[];
  manualDocuments: ManualDocument[];
  submissionGuidelines: string[];
  qualityChecks: {
    check: string;
    status: 'passed' | 'failed' | 'not_checked';
    notes?: string;
  }[];
  nextSteps: string[];
}

// ============================================================================
// AGENT CONTEXT & RESULT TYPES
// ============================================================================

export interface AgentContext {
  userId?: string;
  sessionId?: string;
  grantId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AgentResult<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  metadata?: {
    executionTime?: number;
    tokensUsed?: number;
    modelUsed?: string;
    [key: string]: any;
  };
}

// ============================================================================
// LANGUAGE & CONFIGURATION TYPES
// ============================================================================

export type Language = 'en' | 'ru' | 'uk';

export interface GenerationConfig {
  language?: Language;
  maxLength?: number;
  tone?: 'formal' | 'semi-formal' | 'technical';
  includeReferences?: boolean;
}
