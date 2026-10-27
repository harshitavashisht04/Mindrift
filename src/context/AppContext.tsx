import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ActiveTab,
  NodeData,
  LinkedListObjective,
  VerificationResult,
  ProofRecord,
  DiagnosticSubjectId,
  DiagnosticReport,
  PostTestResult,
  LearnerProfile,
  SubtopicScore,
} from '../types';
import { PRESET_OBJECTIVES, verifyLinkedList } from '../utils/linkedListValidator';
import {
  PROGRAMMING_DIAGNOSTIC_QUESTIONS,
  DSA_DIAGNOSTIC_QUESTIONS,
} from '../data/diagnosticQuestions';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  // Learner profile state & XP
  learnerProfile: LearnerProfile;
  awardXP: (amount: number, reason?: string) => void;
  // Diagnostic state
  diagnosticReports: DiagnosticReport[];
  latestDiagnosticReport: DiagnosticReport | null;
  submitDiagnosticAssessment: (
    subjectId: DiagnosticSubjectId,
    userAnswers: Record<string, number>
  ) => DiagnosticReport;
  resetToDiagnosticTest: () => void;
  // Practice & Post-Test state
  activePracticeSubtopic: string | null;
  setActivePracticeSubtopic: (subtopic: string | null) => void;
  completedPracticeIds: string[];
  completePracticeExercise: (exerciseId: string, xpReward: number) => boolean;
  postTestResults: PostTestResult[];
  submitPostTestAssessment: (
    subtopic: string,
    subjectTitle: string,
    preScorePercent: number,
    correctCount: number,
    totalCount: number
  ) => PostTestResult;
  // Linked list state
  nodes: NodeData[];
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
  selectedObjective: LinkedListObjective;
  setSelectedObjective: (obj: LinkedListObjective) => void;
  verificationResult: VerificationResult | null;
  setVerificationResult: (res: VerificationResult | null) => void;
  isVerifying: boolean;
  verifyCurrentList: () => Promise<VerificationResult>;
  proofRecords: ProofRecord[];
  addProofRecord: (record: ProofRecord) => void;
  completedObjectiveIds: string[];
  markObjectiveCompleted: (id: string) => void;
  // Linked List operations
  insertHead: (val: number) => void;
  insertTail: (val: number) => void;
  insertAtIndex: (index: number, val: number) => boolean;
  deleteHead: () => boolean;
  deleteTail: () => boolean;
  deleteAtIndex: (index: number) => boolean;
  deleteByValue: (val: number) => boolean;
  reverseList: () => void;
  resetToObjective: (obj: LinkedListObjective) => void;
  clearList: () => void;
  generateRandomList: (count?: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

let addressCounter = 160;
function nextHexAddress() {
  addressCounter += 8;
  return `0x00${addressCounter.toString(16).toUpperCase()}`;
}

function calculateLevel(xp: number): { level: number; title: string } {
  if (xp >= 1000) return { level: 4, title: 'Pointer Specialist' };
  if (xp >= 500) return { level: 3, title: 'Code Apprentice' };
  if (xp >= 150) return { level: 2, title: 'Concept Explorer' };
  return { level: 1, title: 'Novice Learner' };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Diagnostic reports history
  const [diagnosticReports, setDiagnosticReports] = useState<DiagnosticReport[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mindrift-diagnostics');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [];
  });

  const latestDiagnosticReport = diagnosticReports.length > 0 ? diagnosticReports[0] : null;

  // Learner profile state
  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mindrift-learner-profile');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    // New learner default: 0 XP, Level 1, hasTakenDiagnostic: false
    return {
      name: 'Harshita',
      level: 1,
      levelTitle: 'Novice Learner',
      xp: 0,
      streakDays: 1,
      hasTakenDiagnostic: false,
    };
  });

  // Active navigation tab
  // If user has not taken diagnostic test yet, we default them to 'diagnostic' onboarding!
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (typeof window !== 'undefined') {
      const savedReports = localStorage.getItem('mindrift-diagnostics');
      if (!savedReports || JSON.parse(savedReports).length === 0) {
        return 'diagnostic';
      }
    }
    return 'dashboard';
  });

  const [activePracticeSubtopic, setActivePracticeSubtopic] = useState<string | null>(null);

  const [completedPracticeIds, setCompletedPracticeIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mindrift-completed-practice');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [];
  });

  const [postTestResults, setPostTestResults] = useState<PostTestResult[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mindrift-post-tests');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [];
  });

  // Linked list visualizer state
  const [selectedObjective, setSelectedObjective] = useState<LinkedListObjective>(PRESET_OBJECTIVES[0]);
  const [nodes, setNodes] = useState<NodeData[]>(() => {
    const initialPreset = PRESET_OBJECTIVES[0].initialPreset || [10, 30, 40];
    return initialPreset.map((val) => ({
      id: Math.random().toString(36).substring(2, 9),
      value: val,
      address: nextHexAddress(),
    }));
  });

  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const [proofRecords, setProofRecords] = useState<ProofRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mindrift-proofs');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [];
  });

  const [completedObjectiveIds, setCompletedObjectiveIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mindrift-completed-objs');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [];
  });

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem('mindrift-diagnostics', JSON.stringify(diagnosticReports));
    } catch {
      // ignore
    }
  }, [diagnosticReports]);

  useEffect(() => {
    try {
      localStorage.setItem('mindrift-learner-profile', JSON.stringify(learnerProfile));
    } catch {
      // ignore
    }
  }, [learnerProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('mindrift-completed-practice', JSON.stringify(completedPracticeIds));
    } catch {
      // ignore
    }
  }, [completedPracticeIds]);

  useEffect(() => {
    try {
      localStorage.setItem('mindrift-post-tests', JSON.stringify(postTestResults));
    } catch {
      // ignore
    }
  }, [postTestResults]);

  useEffect(() => {
    try {
      localStorage.setItem('mindrift-proofs', JSON.stringify(proofRecords));
    } catch {
      // ignore
    }
  }, [proofRecords]);

  useEffect(() => {
    try {
      localStorage.setItem('mindrift-completed-objs', JSON.stringify(completedObjectiveIds));
    } catch {
      // ignore
    }
  }, [completedObjectiveIds]);

  // Award XP helper
  const awardXP = (amount: number) => {
    setLearnerProfile((prev) => {
      const newXP = prev.xp + amount;
      const { level, title } = calculateLevel(newXP);
      return {
        ...prev,
        xp: newXP,
        level,
        levelTitle: title,
      };
    });
  };

  // Submit Diagnostic Assessment (Section 2 & 3 implementation)
  const submitDiagnosticAssessment = (
    subjectId: DiagnosticSubjectId,
    userAnswers: Record<string, number>
  ): DiagnosticReport => {
    const questionPool =
      subjectId === 'programming'
        ? PROGRAMMING_DIAGNOSTIC_QUESTIONS
        : DSA_DIAGNOSTIC_QUESTIONS;

    const subjectTitle =
      subjectId === 'programming'
        ? 'Programming Fundamentals'
        : 'Data Structures & Algorithms';

    // Group questions by subtopic to evaluate granular accuracy
    const subtopicMap: Record<string, { total: number; correct: number }> = {};
    const answersSummary: { questionId: string; selectedIndex: number; isCorrect: boolean }[] = [];
    let correctTotal = 0;

    for (const q of questionPool) {
      if (!subtopicMap[q.subtopic]) {
        subtopicMap[q.subtopic] = { total: 0, correct: 0 };
      }
      subtopicMap[q.subtopic].total += 1;

      const userChoice = userAnswers[q.id];
      const isCorrect = userChoice === q.correctIndex;
      if (isCorrect) {
        subtopicMap[q.subtopic].correct += 1;
        correctTotal += 1;
      }
      answersSummary.push({
        questionId: q.id,
        selectedIndex: userChoice !== undefined ? userChoice : -1,
        isCorrect,
      });
    }

    const subtopicScores: SubtopicScore[] = Object.keys(subtopicMap).map((subtopic) => {
      const data = subtopicMap[subtopic];
      const pct = Math.round((data.correct / data.total) * 100);
      let status: 'Mastered' | 'Competent' | 'Needs more practice' = 'Competent';
      if (pct >= 80) status = 'Mastered';
      else if (pct < 60) status = 'Needs more practice';

      return {
        subtopic,
        total: data.total,
        correct: data.correct,
        percentage: pct,
        status,
      };
    });

    // Identify strongest and weakest subtopics
    // Sort ascending by percentage (lowest first)
    const sortedByScore = [...subtopicScores].sort((a, b) => a.percentage - b.percentage);
    const weakest = sortedByScore[0];
    const strongest = sortedByScore[sortedByScore.length - 1];

    const overallPct = Math.round((correctTotal / questionPool.length) * 100);

    let recommendedTopic = weakest.subtopic;
    let recommendedAction = `Review core fundamentals of ${weakest.subtopic} and complete 3 targeted practice exercises.`;
    let explanation = `Your assessment identified that ${weakest.subtopic} had an accuracy of ${weakest.percentage}%. Reinforcing this concept will significantly boost your overall problem-solving confidence.`;

    if (overallPct < 40) {
      explanation = `You scored ${overallPct}% overall. We recommend starting with foundational principles in ${weakest.subtopic} before proceeding to higher-level concepts.`;
    } else if (overallPct >= 85) {
      explanation = `Outstanding performance (${overallPct}% overall)! While your foundations are solid, brushing up on ${weakest.subtopic} (${weakest.percentage}%) will help you achieve complete mastery.`;
    }

    const report: DiagnosticReport = {
      id: `diag-${Date.now()}`,
      subjectId,
      subjectTitle,
      completedAt: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      totalQuestions: questionPool.length,
      score: correctTotal,
      percentage: overallPct,
      subtopicScores,
      strongestSubtopic: strongest.subtopic,
      weakestSubtopic: weakest.subtopic,
      recommendedTopic,
      recommendedAction,
      explanation,
      answers: answersSummary,
    };

    setDiagnosticReports((prev) => [report, ...prev]);

    // Update learner profile
    setLearnerProfile((prev) => {
      const newXP = prev.xp + 50; // Award 50 XP for completing diagnostic
      const { level, title } = calculateLevel(newXP);
      return {
        ...prev,
        hasTakenDiagnostic: true,
        xp: newXP,
        level,
        levelTitle: title,
      };
    });

    return report;
  };

  const resetToDiagnosticTest = () => {
    setActiveTab('diagnostic');
  };

  // Practice completion (Section 5)
  const completePracticeExercise = (exerciseId: string, xpReward: number): boolean => {
    if (completedPracticeIds.includes(exerciseId)) {
      return false; // Already earned
    }
    setCompletedPracticeIds((prev) => [...prev, exerciseId]);
    awardXP(xpReward);
    return true;
  };

  // Post-test completion (Section 6)
  const submitPostTestAssessment = (
    subtopic: string,
    subjectTitle: string,
    preScorePercent: number,
    correctCount: number,
    totalCount: number
  ): PostTestResult => {
    const postScorePercent = Math.round((correctCount / totalCount) * 100);
    const changePoints = postScorePercent - preScorePercent;
    const earnedXP = 75;

    let recommendation = 'Great improvement! You have strengthened this concept.';
    if (changePoints <= 0) {
      recommendation = 'Concept requires further review. We recommend consulting the AI Mentor or reviewing step-by-step visualizations.';
    }

    const result: PostTestResult = {
      id: `post-${Date.now()}`,
      subtopic,
      subjectTitle,
      completedAt: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      preScorePercent,
      postScorePercent,
      changePoints,
      earnedXP,
      verified: postScorePercent >= 70,
      recommendation,
    };

    setPostTestResults((prev) => [result, ...prev]);
    awardXP(earnedXP);

    // Also register a verified proof token for portfolio!
    addProofRecord({
      id: `proof-${Date.now()}`,
      title: `Verified Progress: ${subtopic}`,
      category: `${subjectTitle} / Post-Assessment`,
      completedAt: 'Just now',
      token: `MND-VERIFY-${subtopic.substring(0, 4).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      details: `Pre-test score: ${preScorePercent}% → Post-test verified: ${postScorePercent}% (+${changePoints}%).`,
      grade: postScorePercent >= 85 ? 'Mastered' : 'Verified',
    });

    return result;
  };

  // Linked list helpers
  const addProofRecord = (record: ProofRecord) => {
    setProofRecords((prev) => [record, ...prev]);
  };

  const markObjectiveCompleted = (id: string) => {
    setCompletedObjectiveIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const insertHead = (val: number) => {
    const newNode: NodeData = {
      id: Math.random().toString(36).substring(2, 9),
      value: val,
      address: nextHexAddress(),
      isHighlighted: true,
    };
    setNodes((prev) => [newNode, ...prev.map((n) => ({ ...n, isHighlighted: false }))]);
    setVerificationResult(null);
  };

  const insertTail = (val: number) => {
    const newNode: NodeData = {
      id: Math.random().toString(36).substring(2, 9),
      value: val,
      address: nextHexAddress(),
      isHighlighted: true,
    };
    setNodes((prev) => [...prev.map((n) => ({ ...n, isHighlighted: false })), newNode]);
    setVerificationResult(null);
  };

  const insertAtIndex = (index: number, val: number): boolean => {
    if (index < 0 || index > nodes.length) return false;
    const newNode: NodeData = {
      id: Math.random().toString(36).substring(2, 9),
      value: val,
      address: nextHexAddress(),
      isHighlighted: true,
    };
    setNodes((prev) => {
      const next: NodeData[] = [...prev.map((n) => ({ ...n, isHighlighted: false }))];
      next.splice(index, 0, newNode);
      return next;
    });
    setVerificationResult(null);
    return true;
  };

  const deleteHead = (): boolean => {
    if (nodes.length === 0) return false;
    setNodes((prev) => prev.slice(1));
    setVerificationResult(null);
    return true;
  };

  const deleteTail = (): boolean => {
    if (nodes.length === 0) return false;
    setNodes((prev) => prev.slice(0, -1));
    setVerificationResult(null);
    return true;
  };

  const deleteAtIndex = (index: number): boolean => {
    if (index < 0 || index >= nodes.length) return false;
    setNodes((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
    setVerificationResult(null);
    return true;
  };

  const deleteByValue = (val: number): boolean => {
    const index = nodes.findIndex((n) => Number(n.value) === val);
    if (index === -1) return false;
    return deleteAtIndex(index);
  };

  const reverseList = () => {
    setNodes((prev) => {
      const copy = [...prev].reverse();
      return copy.map((n) => ({ ...n, isHighlighted: true }));
    });
    setVerificationResult(null);
  };

  const resetToObjective = (obj: LinkedListObjective) => {
    setSelectedObjective(obj);
    const initialValues =
      obj.initialPreset ?? obj.targetList.slice(0, Math.max(1, obj.targetList.length - 1));
    setNodes(
      initialValues.map((val) => ({
        id: Math.random().toString(36).substring(2, 9),
        value: val,
        address: nextHexAddress(),
      }))
    );
    setVerificationResult(null);
  };

  const clearList = () => {
    setNodes([]);
    setVerificationResult(null);
  };

  const generateRandomList = (count: number = 4) => {
    const values: number[] = [];
    while (values.length < count) {
      const r = Math.floor(Math.random() * 80) + 10;
      if (!values.includes(r)) values.push(r);
    }
    values.sort((a, b) => a - b);
    setNodes(
      values.map((val) => ({
        id: Math.random().toString(36).substring(2, 9),
        value: val,
        address: nextHexAddress(),
      }))
    );
    setVerificationResult(null);
  };

  const verifyCurrentList = async (): Promise<VerificationResult> => {
    setIsVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 250));
    const result = verifyLinkedList(nodes, selectedObjective);
    setVerificationResult(result);
    setIsVerifying(false);

    if (result.isValid && result.proofToken) {
      markObjectiveCompleted(selectedObjective.id);
      awardXP(50); // Award XP for verified list objective
      addProofRecord({
        id: `proof-${Date.now()}`,
        title: `Completed: ${selectedObjective.title}`,
        category: 'Data Structures / Singly Linked List',
        completedAt: new Date().toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        token: result.proofToken,
        details: `Successfully matched ${result.scannedCount} nodes to objective '${selectedObjective.title}'.`,
        grade: 'Mastered',
      });
    }

    return result;
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        learnerProfile,
        awardXP,
        diagnosticReports,
        latestDiagnosticReport,
        submitDiagnosticAssessment,
        resetToDiagnosticTest,
        activePracticeSubtopic,
        setActivePracticeSubtopic,
        completedPracticeIds,
        completePracticeExercise,
        postTestResults,
        submitPostTestAssessment,
        nodes,
        setNodes,
        selectedObjective,
        setSelectedObjective,
        verificationResult,
        setVerificationResult,
        isVerifying,
        verifyCurrentList,
        proofRecords,
        addProofRecord,
        completedObjectiveIds,
        markObjectiveCompleted,
        insertHead,
        insertTail,
        insertAtIndex,
        deleteHead,
        deleteTail,
        deleteAtIndex,
        deleteByValue,
        reverseList,
        resetToObjective,
        clearList,
        generateRandomList,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
