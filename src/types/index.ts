export type Theme = 'light' | 'dark';

export type ActiveTab =
  | 'dashboard'
  | 'diagnostic'
  | 'subjects'
  | 'challenges'
  | 'visualizer'
  | 'mentor'
  | 'portfolio';

export type DiagnosticSubjectId =
  | 'programming'
  | 'dsa'
  | 'math'
  | 'logical'
  | 'cs-fundamentals'
  | 'aptitude';

export interface NodeData {
  id: string;
  value: number;
  address: string;
  isHighlighted?: boolean;
  isComparing?: boolean;
  isMatch?: boolean;
  isError?: boolean;
}

export interface LinkedListObjective {
  id: string;
  title: string;
  badge: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  requirements: string[];
  targetList: number[];
  allowDuplicates: boolean;
  exactLength?: number;
  minLength?: number;
  maxLength?: number;
  mustContain?: number[];
  mustNotContain?: number[];
  mustBeSorted?: 'asc' | 'desc' | 'none';
  initialPreset?: number[];
  hint: string;
}

export interface VerificationMismatch {
  index: number;
  expected: number | string | null;
  actual: number | string | null;
  message: string;
}

export interface VerificationResult {
  isValid: boolean;
  verifiedAt: string;
  mode: 'local';
  objectiveId: string;
  objectiveTitle: string;
  scannedCount: number;
  expectedCount: number;
  mismatches: VerificationMismatch[];
  missingItems: number[];
  unexpectedItems: number[];
  errors: string[];
  recommendations: string[];
  proofToken?: string;
}

export interface ChallengeTestCase {
  id: string;
  input: string;
  expected: string;
}

export interface ChallengeItem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  timeEstimate: string;
  prompt: string;
  constraints: string[];
  starterCode: string;
  solutionTemplate: string;
  testCases: ChallengeTestCase[];
}

export interface ProofRecord {
  id: string;
  title: string;
  category: string;
  completedAt: string;
  token: string;
  details: string;
  grade: 'Verified' | 'Mastered';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  timestamp: string;
  codeSnippet?: string;
  suggestionPrompt?: string;
}

// DIAGNOSTIC ASSESSMENT TYPES
export interface DiagnosticQuestion {
  id: string;
  subject: DiagnosticSubjectId;
  subtopic: string;
  prompt: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SubtopicScore {
  subtopic: string;
  total: number;
  correct: number;
  percentage: number;
  status: 'Mastered' | 'Competent' | 'Needs more practice';
}

export interface DiagnosticReport {
  id: string;
  subjectId: DiagnosticSubjectId;
  subjectTitle: string;
  completedAt: string;
  totalQuestions: number;
  score: number;
  percentage: number;
  subtopicScores: SubtopicScore[];
  strongestSubtopic: string;
  weakestSubtopic: string;
  recommendedTopic: string;
  recommendedAction: string;
  explanation: string;
  answers: { questionId: string; selectedIndex: number; isCorrect: boolean }[];
}

export interface PracticeExercise {
  id: string;
  subtopic: string;
  title: string;
  conceptSummary: string;
  exercisePrompt: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
  xpReward: number;
}

export interface PostTestResult {
  id: string;
  subtopic: string;
  subjectTitle: string;
  completedAt: string;
  preScorePercent: number;
  postScorePercent: number;
  changePoints: number;
  earnedXP: number;
  verified: boolean;
  recommendation: string;
}

export interface LearnerProfile {
  name: string;
  level: number;
  levelTitle: string;
  xp: number;
  streakDays: number;
  hasTakenDiagnostic: boolean;
}
