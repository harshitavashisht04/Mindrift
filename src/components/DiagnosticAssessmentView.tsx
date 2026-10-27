import React, { useState } from 'react';
import {
  Brain,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Target,
  Sparkles,
  Zap,
  Award,
  Layers,
  Code,
  HelpCircle,
  AlertCircle,
  RotateCcw,
  ShieldCheck,
  Check,
  TrendingUp,
  Clock,
  Play,
  Lightbulb,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  LEARNING_DOMAINS,
  PROGRAMMING_DIAGNOSTIC_QUESTIONS,
  DSA_DIAGNOSTIC_QUESTIONS,
  PRACTICE_EXERCISES_BY_SUBTOPIC,
  POST_TEST_QUESTIONS_BY_SUBTOPIC,
} from '../data/diagnosticQuestions';
import { DiagnosticSubjectId, DiagnosticReport, PostTestResult } from '../types';

type AssessmentPhase =
  | 'onboarding'
  | 'testing'
  | 'report'
  | 'action-plan'
  | 'practice'
  | 'post-test'
  | 'verified-results';

export const DiagnosticAssessmentView: React.FC = () => {
  const {
    setActiveTab,
    submitDiagnosticAssessment,
    latestDiagnosticReport,
    completePracticeExercise,
    completedPracticeIds,
    submitPostTestAssessment,
  } = useApp();

  const [phase, setPhase] = useState<AssessmentPhase>('onboarding');
  const [selectedSubject, setSelectedSubject] = useState<DiagnosticSubjectId>('programming');

  // Diagnostic Test session state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [activeReport, setActiveReport] = useState<DiagnosticReport | null>(latestDiagnosticReport);

  // Practice state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [selectedPracticeOption, setSelectedPracticeOption] = useState<number | null>(null);
  const [practiceAnswerChecked, setPracticeAnswerChecked] = useState<boolean>(false);

  // Post-test state
  const [postTestIndex, setPostTestIndex] = useState<number>(0);
  const [postTestAnswers, setPostTestAnswers] = useState<Record<string, number>>({});
  const [postTestResult, setPostTestResult] = useState<PostTestResult | null>(null);

  const activeQuestions =
    selectedSubject === 'programming'
      ? PROGRAMMING_DIAGNOSTIC_QUESTIONS
      : DSA_DIAGNOSTIC_QUESTIONS;

  const currentQuestion = activeQuestions[currentQuestionIndex];

  // Practice exercises for the identified weak subtopic
  const targetSubtopic = activeReport?.recommendedTopic || 'Loops & Iteration';
  const practiceExercises =
    PRACTICE_EXERCISES_BY_SUBTOPIC[targetSubtopic] ||
    PRACTICE_EXERCISES_BY_SUBTOPIC['Loops & Iteration'] ||
    [];

  const currentExercise = practiceExercises[currentExerciseIndex] || practiceExercises[0];

  // Post test questions for the identified subtopic
  const postTestQuestions =
    POST_TEST_QUESTIONS_BY_SUBTOPIC[targetSubtopic] ||
    POST_TEST_QUESTIONS_BY_SUBTOPIC['Loops & Iteration'] ||
    [];

  const currentPostTestQuestion = postTestQuestions[postTestIndex];

  // Handlers for Diagnostic Test
  const handleSelectAnswer = (optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitDiagnostic = () => {
    const report = submitDiagnosticAssessment(selectedSubject, answers);
    setActiveReport(report);
    setPhase('report');
  };

  // Handlers for Practice Exercises
  const handleCheckPracticeAnswer = () => {
    if (selectedPracticeOption === null) return;
    setPracticeAnswerChecked(true);
    if (selectedPracticeOption === currentExercise.correctIndex) {
      completePracticeExercise(currentExercise.id, currentExercise.xpReward);
    }
  };

  const handleNextExercise = () => {
    setSelectedPracticeOption(null);
    setPracticeAnswerChecked(false);
    setShowHint(false);
    if (currentExerciseIndex < practiceExercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    } else {
      // Completed all practice exercises for this subtopic! Proceed to post-test
      setPhase('post-test');
      setPostTestIndex(0);
      setPostTestAnswers({});
    }
  };

  // Handlers for Post-Test
  const handleSelectPostTestAnswer = (optIndex: number) => {
    setPostTestAnswers((prev) => ({
      ...prev,
      [currentPostTestQuestion.id]: optIndex,
    }));
  };

  const handleSubmitPostTest = () => {
    let correct = 0;
    for (const q of postTestQuestions) {
      if (postTestAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    }
    const preScore = activeReport?.subtopicScores.find((s) => s.subtopic === targetSubtopic)?.percentage ?? 40;
    const res = submitPostTestAssessment(
      targetSubtopic,
      activeReport?.subjectTitle ?? 'Programming Fundamentals',
      preScore,
      correct,
      postTestQuestions.length
    );
    setPostTestResult(res);
    setPhase('verified-results');
  };

  // Count answered questions
  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = answeredCount === activeQuestions.length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 4-Step Philosophy Progress Banner */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23]">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { step: '1. Diagnose', desc: 'Baseline Assessment', active: phase === 'onboarding' || phase === 'testing' },
            { step: '2. Identify', desc: 'Gap Diagnostics', active: phase === 'report' || phase === 'action-plan' },
            { step: '3. Practice & Earn', desc: 'Targeted Exercises', active: phase === 'practice' },
            { step: '4. Verify', desc: 'Proof of Improvement', active: phase === 'post-test' || phase === 'verified-results' },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`rounded-lg p-2 transition-all ${
                item.active
                  ? 'bg-violet-50 text-violet-900 font-semibold border border-violet-200 dark:bg-violet-950/50 dark:text-violet-200 dark:border-violet-900/60'
                  : 'text-zinc-500 dark:text-zinc-400'
              }`}
            >
              <div className="font-bold text-[11px] sm:text-xs">{item.step}</div>
              <div className="text-[10px] hidden sm:block opacity-80">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          PHASE 1: ONBOARDING & SUBJECT SELECTION
         ========================================================================= */}
      {phase === 'onboarding' && (
        <div className="space-y-6">
          {/* Welcome Hero */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23] text-center max-w-3xl mx-auto">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
              <Brain className="h-6 w-6" />
            </div>

            <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Let's Discover How You Learn
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto leading-relaxed">
              Take a quick diagnostic test to identify your strengths, discover learning gaps, and get a personalized learning path.
            </p>

            {/* 4 Pillars Explanation */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-850/50">
                <span className="font-bold text-xs text-violet-700 dark:text-violet-400">1. Diagnose</span>
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                  8-question adaptive baseline to gauge conceptual accuracy.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-850/50">
                <span className="font-bold text-xs text-blue-600 dark:text-blue-400">2. Identify</span>
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                  Granular subtopic breakdown revealing weak invariants.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-850/50">
                <span className="font-bold text-xs text-amber-600 dark:text-amber-400">3. Practice & Earn</span>
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                  Interactive targeted exercises awarding real XP on completion.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-850/50">
                <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">4. Verify</span>
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                  Post-assessment validating score gains & proof credentials.
                </p>
              </div>
            </div>
          </div>

          {/* Subject Selection Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Select Assessment Category
              </h2>
              <span className="text-xs text-zinc-500">Pick a domain to begin</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {LEARNING_DOMAINS.map((domain) => {
                const isSelected = selectedSubject === domain.id;
                const isAvailable = domain.status === 'Available';

                return (
                  <div
                    key={domain.id}
                    onClick={() => {
                      if (isAvailable) setSelectedSubject(domain.id);
                    }}
                    className={`rounded-xl border p-4 transition-all flex flex-col justify-between ${
                      !isAvailable
                        ? 'opacity-60 cursor-not-allowed border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-850/20'
                        : isSelected
                        ? 'cursor-pointer border-violet-600 ring-2 ring-violet-500/20 bg-violet-50/30 dark:border-violet-500 dark:bg-violet-950/20'
                        : 'cursor-pointer border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-[#1a1c23] dark:hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                            isAvailable
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-zinc-200/60 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                          }`}
                        >
                          {domain.status}
                        </span>
                        {isAvailable && (
                          <span className="text-[11px] text-zinc-400 font-medium">
                            {domain.questionCount} Questions
                          </span>
                        )}
                      </div>

                      <h3 className="mt-2.5 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {domain.title}
                      </h3>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {domain.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                      {isAvailable ? (
                        <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">
                          {isSelected ? 'Selected ✓' : 'Click to Select'}
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400 italic">Coming Soon</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
            >
              Skip to Dashboard
            </button>

            <button
              onClick={() => {
                setPhase('testing');
                setCurrentQuestionIndex(0);
                setAnswers({});
              }}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-violet-700 active:scale-98 dark:bg-violet-600 dark:hover:bg-violet-500"
            >
              <span>Start Diagnostic Test</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          PHASE 2: INTERACTIVE DIAGNOSTIC TEST (1 question at a time)
         ========================================================================= */}
      {phase === 'testing' && currentQuestion && (
        <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23]">
          {/* Header & Progress */}
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <div>
              <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                {selectedSubject === 'programming' ? 'Programming Fundamentals' : 'Data Structures & Algorithms'}
              </span>
              <div className="text-xs text-zinc-400">
                Subtopic: <strong className="text-zinc-700 dark:text-zinc-300">{currentQuestion.subtopic}</strong>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                Question {currentQuestionIndex + 1} of {activeQuestions.length}
              </span>
              <div className="text-[10px] text-zinc-400">
                {answeredCount} of {activeQuestions.length} Answered
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-violet-600 transition-all duration-200"
              style={{ width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Prompt */}
          <div className="py-2 space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-50 leading-relaxed">
              {currentQuestion.prompt}
            </h3>

            {currentQuestion.codeSnippet && (
              <pre className="rounded-lg bg-zinc-900 p-3 font-mono text-xs text-zinc-100 overflow-x-auto dark:bg-zinc-950">
                <code>{currentQuestion.codeSnippet}</code>
              </pre>
            )}
          </div>

          {/* Options List */}
          <div className="space-y-2 pt-1">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = answers[currentQuestion.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(idx)}
                  className={`w-full text-left rounded-xl border p-3.5 text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-violet-600 bg-violet-50 text-violet-950 font-semibold shadow-2xs dark:border-violet-500 dark:bg-violet-950/60 dark:text-violet-100'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-850 dark:text-zinc-200 dark:hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                        isSelected
                          ? 'bg-violet-600 text-white'
                          : 'border border-zinc-300 text-zinc-500 dark:border-zinc-600'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-violet-600 dark:text-violet-400" />}
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-2">
              {currentQuestionIndex < activeQuestions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
                >
                  <span>Next Question</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitDiagnostic}
                  disabled={!isAllAnswered}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-40 shadow-xs"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Submit Diagnostic Assessment</span>
                </button>
              )}
            </div>
          </div>

          {!isAllAnswered && currentQuestionIndex === activeQuestions.length - 1 && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 text-right">
              Please answer all questions before submitting ({answeredCount}/{activeQuestions.length} completed).
            </p>
          )}
        </div>
      )}

      {/* =========================================================================
          PHASE 3: DIAGNOSTIC REPORT (IDENTIFY)
         ========================================================================= */}
      {phase === 'report' && activeReport && (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 pb-4 dark:border-zinc-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Diagnostic Assessment Complete</span>
                </div>
                <h1 className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Diagnostic Report: {activeReport.subjectTitle}
                </h1>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Completed on {activeReport.completedAt} · Earned +50 XP
                </p>
              </div>

              {/* Overall Score Badge */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-2.5 text-center dark:border-zinc-700 dark:bg-zinc-850">
                <span className="text-[10px] uppercase font-semibold text-zinc-400">Overall Accuracy</span>
                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                  {activeReport.percentage}%
                </div>
                <span className="text-[10px] text-zinc-500">
                  {activeReport.score} of {activeReport.totalQuestions} Correct
                </span>
              </div>
            </div>

            {/* Performance Overview Highlights */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                <div className="text-[10px] font-semibold uppercase text-emerald-800 dark:text-emerald-300">
                  Strongest Subtopic
                </div>
                <h3 className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {activeReport.strongestSubtopic}
                </h3>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                  Demonstrated solid grasp of principles in this area.
                </p>
              </div>

              <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-4 dark:border-amber-900/60 dark:bg-amber-950/20">
                <div className="text-[10px] font-semibold uppercase text-amber-800 dark:text-amber-300">
                  Needs More Practice
                </div>
                <h3 className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {activeReport.weakestSubtopic}
                </h3>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                  Recommended for targeted reinforcement and practice exercises.
                </p>
              </div>
            </div>

            {/* Subtopic Performance Breakdown */}
            <div className="mt-6 space-y-3">
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Subtopic Performance Breakdown
              </h3>

              <div className="space-y-2.5">
                {activeReport.subtopicScores.map((sub, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-850/40"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">{sub.subtopic}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono tabular-nums text-zinc-700 dark:text-zinc-300">
                          {sub.correct}/{sub.total} ({sub.percentage}%)
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                            sub.status === 'Mastered'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : sub.status === 'Competent'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          sub.percentage >= 80
                            ? 'bg-emerald-500'
                            : sub.percentage >= 50
                            ? 'bg-blue-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${sub.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation & Action CTA */}
            <div className="mt-6 rounded-xl bg-violet-50/60 p-4 border border-violet-100 dark:bg-violet-950/20 dark:border-violet-900/40 space-y-3">
              <div className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                <strong>Why this recommendation?</strong> {activeReport.explanation}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    setPhase('onboarding');
                    setCurrentQuestionIndex(0);
                    setAnswers({});
                  }}
                  className="text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
                >
                  Retake Diagnostic Test
                </button>

                <button
                  onClick={() => setPhase('action-plan')}
                  className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-5 py-2 text-xs font-semibold text-white hover:bg-violet-700 shadow-xs"
                >
                  <span>View Personalized Action Plan</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PHASE 4: PERSONALIZED ACTION PLAN
         ========================================================================= */}
      {phase === 'action-plan' && activeReport && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23] space-y-6">
          <div className="border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
              Step 2 → Step 3
            </span>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Personalized Learning Plan
            </h1>
            <p className="mt-0.5 text-xs text-zinc-500">
              Generated from your diagnostic assessment results.
            </p>
          </div>

          {/* Action Plan Specifics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-850/50">
              <span className="text-[10px] uppercase font-semibold text-zinc-400">Identified Focus Area</span>
              <h3 className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {activeReport.weakestSubtopic}
              </h3>
              <p className="mt-1 text-xs text-zinc-500">
                Current accuracy:{' '}
                <strong className="text-amber-600">
                  {activeReport.subtopicScores.find((s) => s.subtopic === activeReport.weakestSubtopic)?.percentage ?? 40}%
                </strong>
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-850/50">
              <span className="text-[10px] uppercase font-semibold text-zinc-400">Targeted Action</span>
              <h3 className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Complete {practiceExercises.length} Practice Tasks
              </h3>
              <p className="mt-1 text-xs text-zinc-500">
                Earn up to +{practiceExercises.reduce((acc, e) => acc + e.xpReward, 0)} XP on completion.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-850/50">
              <span className="text-[10px] uppercase font-semibold text-zinc-400">Target Outcome</span>
              <h3 className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                ≥ 75% Post-Test Score
              </h3>
              <p className="mt-1 text-xs text-zinc-500">
                Verified badge & portfolio proof certificate.
              </p>
            </div>
          </div>

          {/* What to practice */}
          <div className="rounded-xl border border-violet-100 bg-violet-50/30 p-4 dark:border-violet-950/40 dark:bg-violet-950/10 space-y-2 text-xs">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Target className="h-4 w-4 text-violet-600" />
              <span>Recommended Curriculum Path</span>
            </h4>
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {activeReport.recommendedAction}
            </p>
            {activeReport.weakestSubtopic.includes('Linked List') && (
              <div className="mt-2 pt-2 border-t border-violet-100 dark:border-violet-900/40 flex items-center justify-between">
                <span>Also practice hands-on in the Linked List Visualizer:</span>
                <button
                  onClick={() => setActiveTab('visualizer')}
                  className="rounded bg-violet-600 px-2.5 py-1 text-white font-medium hover:bg-violet-700"
                >
                  Open Visualizer Sandbox
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
            >
              Back to Dashboard
            </button>

            <button
              onClick={() => {
                setPhase('practice');
                setCurrentExerciseIndex(0);
                setSelectedPracticeOption(null);
                setPracticeAnswerChecked(false);
              }}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-violet-700 shadow-xs"
            >
              <span>Start My Practice</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          PHASE 5: PRACTICE & EARN (Interactive Exercises tailored to subtopic)
         ========================================================================= */}
      {phase === 'practice' && currentExercise && (
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <div>
              <span className="text-[10px] uppercase font-semibold text-violet-600 dark:text-violet-400 tracking-wider">
                Practice & Earn · {targetSubtopic}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-50">
                {currentExercise.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                <span>+{currentExercise.xpReward} XP</span>
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {currentExerciseIndex + 1}/{practiceExercises.length}
              </span>
            </div>
          </div>

          {/* Concept Summary Note */}
          <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-3.5 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-850/50 dark:text-zinc-300">
            <span className="font-semibold text-zinc-800 dark:text-zinc-100">Key Concept: </span>
            {currentExercise.conceptSummary}
          </div>

          {/* Exercise Prompt */}
          <div className="space-y-2.5">
            <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {currentExercise.exercisePrompt}
            </h3>

            {currentExercise.codeSnippet && (
              <pre className="rounded-lg bg-zinc-900 p-3 font-mono text-xs text-zinc-100 overflow-x-auto dark:bg-zinc-950">
                <code>{currentExercise.codeSnippet}</code>
              </pre>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2 pt-1">
            {currentExercise.options.map((opt, idx) => {
              const isSelected = selectedPracticeOption === idx;
              const isCorrect = idx === currentExercise.correctIndex;

              let style = 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-850';
              if (practiceAnswerChecked) {
                if (isCorrect) style = 'border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-100';
                else if (isSelected) style = 'border-rose-400 bg-rose-50 text-rose-950 dark:bg-rose-950/60 dark:text-rose-100';
              } else if (isSelected) {
                style = 'border-violet-600 bg-violet-50 text-violet-950 font-semibold dark:border-violet-500 dark:bg-violet-950/60 dark:text-violet-100';
              }

              return (
                <button
                  key={idx}
                  onClick={() => !practiceAnswerChecked && setSelectedPracticeOption(idx)}
                  disabled={practiceAnswerChecked}
                  className={`w-full text-left rounded-xl border p-3 text-xs transition-colors flex items-center justify-between ${style}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-zinc-400 font-semibold">{String.fromCharCode(65 + idx)}.</span>
                    <span>{opt}</span>
                  </div>
                  {practiceAnswerChecked && isCorrect && <Check className="h-4 w-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>

          {/* Hint Toggle */}
          <div className="pt-1">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1 hover:underline"
            >
              <Lightbulb className="h-3.5 w-3.5" />
              <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
            </button>
            {showHint && (
              <p className="mt-1 text-[11px] text-zinc-500 bg-amber-50/50 p-2 rounded-lg border border-amber-100 dark:border-amber-900/40 dark:bg-amber-950/20">
                {currentExercise.hint}
              </p>
            )}
          </div>

          {/* Explanation upon checking */}
          {practiceAnswerChecked && (
            <div
              className={`rounded-xl p-3 text-xs ${
                selectedPracticeOption === currentExercise.correctIndex
                  ? 'bg-emerald-50 text-emerald-950 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200'
                  : 'bg-rose-50 text-rose-950 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-200'
              }`}
            >
              <span className="font-bold">
                {selectedPracticeOption === currentExercise.correctIndex ? '✓ Correct! Earned XP. ' : '✕ Not quite. '}
              </span>
              <span>{currentExercise.explanation}</span>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => setPhase('action-plan')}
              className="text-xs text-zinc-500 hover:text-zinc-800"
            >
              Back to Plan
            </button>

            {!practiceAnswerChecked ? (
              <button
                onClick={handleCheckPracticeAnswer}
                disabled={selectedPracticeOption === null}
                className="rounded-xl bg-violet-600 px-5 py-2 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNextExercise}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                <span>
                  {currentExerciseIndex < practiceExercises.length - 1
                    ? 'Continue Next Exercise'
                    : 'Proceed to Post-Assessment Verification'}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          PHASE 6: POST-ASSESSMENT VERIFICATION (VERIFY)
         ========================================================================= */}
      {phase === 'post-test' && currentPostTestQuestion && (
        <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23]">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                <span>Verification Post-Assessment</span>
              </div>
              <div className="text-xs text-zinc-400">
                Verifying mastery on: <strong className="text-zinc-700 dark:text-zinc-300">{targetSubtopic}</strong>
              </div>
            </div>

            <span className="text-xs font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
              Question {postTestIndex + 1} of {postTestQuestions.length}
            </span>
          </div>

          <div className="py-2 space-y-3">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
              {currentPostTestQuestion.prompt}
            </h3>

            {currentPostTestQuestion.codeSnippet && (
              <pre className="rounded-lg bg-zinc-900 p-3 font-mono text-xs text-zinc-100 overflow-x-auto dark:bg-zinc-950">
                <code>{currentPostTestQuestion.codeSnippet}</code>
              </pre>
            )}
          </div>

          <div className="space-y-2">
            {currentPostTestQuestion.options.map((opt, idx) => {
              const isSelected = postTestAnswers[currentPostTestQuestion.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectPostTestAnswer(idx)}
                  className={`w-full text-left rounded-xl border p-3 text-xs transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'border-violet-600 bg-violet-50 font-semibold text-violet-950 dark:border-violet-500 dark:bg-violet-950/60 dark:text-violet-100'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-850'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-zinc-400">{String.fromCharCode(65 + idx)}.</span>
                    <span>{opt}</span>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-violet-600" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => {
                if (postTestIndex > 0) setPostTestIndex((prev) => prev - 1);
              }}
              disabled={postTestIndex === 0}
              className="text-xs text-zinc-500 disabled:opacity-40"
            >
              Previous
            </button>

            {postTestIndex < postTestQuestions.length - 1 ? (
              <button
                onClick={() => setPostTestIndex((prev) => prev + 1)}
                disabled={postTestAnswers[currentPostTestQuestion.id] === undefined}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmitPostTest}
                disabled={Object.keys(postTestAnswers).length < postTestQuestions.length}
                className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-40"
              >
                Submit & Verify Improvement
              </button>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          PHASE 7: VERIFIED PROGRESS REPORT (Before vs After Comparison)
         ========================================================================= */}
      {phase === 'verified-results' && postTestResult && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23] space-y-6">
          <div className="border-b border-zinc-100 pb-3 dark:border-zinc-800 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h1 className="mt-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Verified Learning Improvement Report
            </h1>
            <p className="mt-0.5 text-xs text-zinc-500">
              Subtopic: {postTestResult.subtopic} · Verified on {postTestResult.completedAt}
            </p>
          </div>

          {/* Before vs After Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 text-center dark:border-zinc-800 dark:bg-zinc-850/50">
              <span className="text-[10px] uppercase font-semibold text-zinc-400">Diagnostic Pre-Test</span>
              <div className="mt-1 text-2xl font-bold text-zinc-700 dark:text-zinc-300 tabular-nums">
                {postTestResult.preScorePercent}%
              </div>
              <span className="text-[10px] text-zinc-400">Baseline accuracy</span>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-center dark:border-emerald-900 dark:bg-emerald-950/20">
              <span className="text-[10px] uppercase font-semibold text-emerald-800 dark:text-emerald-300">
                Post-Practice Verification
              </span>
              <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {postTestResult.postScorePercent}%
              </div>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400">Demonstrated mastery</span>
            </div>

            <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-4 text-center dark:border-violet-900 dark:bg-violet-950/20">
              <span className="text-[10px] uppercase font-semibold text-violet-800 dark:text-violet-300">
                Net Score Change
              </span>
              <div className="mt-1 text-2xl font-bold text-violet-700 dark:text-violet-300 tabular-nums">
                {postTestResult.changePoints >= 0 ? `+${postTestResult.changePoints}%` : `${postTestResult.changePoints}%`}
              </div>
              <span className="text-[10px] text-violet-600 dark:text-violet-400">
                Earned +{postTestResult.earnedXP} XP
              </span>
            </div>
          </div>

          {/* Outcome Note */}
          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-4 text-xs dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <span className="font-bold text-emerald-900 dark:text-emerald-200">Verifier Verdict: </span>
            <span className="text-zinc-700 dark:text-zinc-300">{postTestResult.recommendation}</span>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => {
                setPhase('onboarding');
                setCurrentQuestionIndex(0);
                setAnswers({});
              }}
              className="rounded-lg border border-zinc-200 px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
            >
              Take Another Diagnostic Test
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('portfolio')}
                className="rounded-lg border border-violet-200 bg-violet-50 px-3.5 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-100 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-300"
              >
                View in Portfolio
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
