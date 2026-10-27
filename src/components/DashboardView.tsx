import React from 'react';
import {
  Brain,
  Play,
  CheckCircle2,
  BookOpen,
  Award,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Flame,
  Zap,
  TrendingUp,
  AlertTriangle,
  Layers,
  ChevronRight,
  Target,
  Code,
  Calculator,
  Cpu,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LEARNING_DOMAINS } from '../data/diagnosticQuestions';

export const DashboardView: React.FC = () => {
  const {
    setActiveTab,
    learnerProfile,
    latestDiagnosticReport,
    postTestResults,
    nodes,
    selectedObjective,
    proofRecords,
  } = useApp();

  const hasTakenDiagnostic = learnerProfile.hasTakenDiagnostic && latestDiagnosticReport !== null;

  return (
    <div className="space-y-6">
      {/* Top Welcome / Diagnostic Callout Banner */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xs transition-colors dark:border-zinc-800 dark:bg-[#1a1c23]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Personalized Learning Architecture</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Welcome, {learnerProfile.name}!
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {hasTakenDiagnostic ? (
                <>
                  Your personalized focus area is{' '}
                  <strong className="text-violet-700 dark:text-violet-300">
                    {latestDiagnosticReport.weakestSubtopic}
                  </strong>{' '}
                  ({latestDiagnosticReport.subtopicScores.find((s) => s.subtopic === latestDiagnosticReport.weakestSubtopic)?.percentage ?? 40}% accuracy). Continue targeted practice to verify improvement.
                </>
              ) : (
                'Discover how you learn. Take a quick diagnostic assessment to pinpoint conceptual gaps and unlock your custom practice pathway.'
              )}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {hasTakenDiagnostic ? (
              <button
                onClick={() => setActiveTab('diagnostic')}
                className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-violet-700 active:scale-98 dark:bg-violet-600 dark:hover:bg-violet-500 whitespace-nowrap"
              >
                <Brain className="h-3.5 w-3.5" />
                <span>Continue Learning Path</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('diagnostic')}
                className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-violet-700 active:scale-98 dark:bg-violet-600 dark:hover:bg-violet-500 whitespace-nowrap"
              >
                <Brain className="h-3.5 w-3.5" />
                <span>Take Diagnostic Test</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Real Learner Metrics Strip (No fabricated fake data) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: Level */}
        <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23]">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Learner Level</span>
            <Award className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
          </div>
          <div className="mt-1 font-bold text-lg text-zinc-900 dark:text-zinc-100">
            Level {learnerProfile.level}
          </div>
          <div className="text-[10px] text-zinc-500 dark:text-zinc-400">{learnerProfile.levelTitle}</div>
        </div>

        {/* Metric 2: Earned XP */}
        <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23]">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Earned XP</span>
            <Zap className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="mt-1 font-bold text-lg text-zinc-900 dark:text-zinc-100 tabular-nums">
            {learnerProfile.xp} XP
          </div>
          <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
            {learnerProfile.xp === 0 ? 'Complete tasks to earn XP' : 'Genuine verified tasks'}
          </div>
        </div>

        {/* Metric 3: Assessment Baseline */}
        <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23]">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Diagnostic Score</span>
            <Brain className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <div className="mt-1 font-bold text-lg text-zinc-900 dark:text-zinc-100 tabular-nums">
            {hasTakenDiagnostic ? `${latestDiagnosticReport.percentage}%` : 'Not Taken'}
          </div>
          <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
            {hasTakenDiagnostic ? `${latestDiagnosticReport.subjectTitle}` : 'Baseline pending'}
          </div>
        </div>

        {/* Metric 4: Verified Proofs */}
        <div className="col-span-2 sm:col-span-1 rounded-xl border border-zinc-200 bg-white p-3.5 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23]">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Verified Proofs</span>
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <div className="mt-1 font-bold text-lg text-zinc-900 dark:text-zinc-100 tabular-nums">
            {proofRecords.length}
          </div>
          <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
            {postTestResults.length} post-test verifications
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Learning Domains & Current Action Plan (Left) + Weak Invariants & Verification Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section: Learning Domains (Broadened beyond DSA) */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23]">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <div>
                <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Learning Domains
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Explore available diagnostic tracks and future subject modules.
                </p>
              </div>
              <span className="text-[11px] text-violet-600 dark:text-violet-400 font-medium">
                2 Available Tracks
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LEARNING_DOMAINS.map((domain) => {
                const isAvailable = domain.status === 'Available';

                return (
                  <div
                    key={domain.id}
                    onClick={() => {
                      if (isAvailable) {
                        if (domain.id === 'dsa') setActiveTab('visualizer');
                        else setActiveTab('diagnostic');
                      }
                    }}
                    className={`rounded-xl border p-3.5 transition-all flex flex-col justify-between ${
                      isAvailable
                        ? 'cursor-pointer border-zinc-200 bg-zinc-50/50 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700/80 dark:bg-zinc-850/40 dark:hover:border-zinc-600'
                        : 'opacity-60 cursor-not-allowed border-zinc-100 bg-zinc-50/30 dark:border-zinc-800 dark:bg-zinc-900/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={`rounded px-1.5 py-0.2 text-[9px] font-semibold ${
                            isAvailable
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-zinc-200/60 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                          }`}
                        >
                          {domain.status}
                        </span>
                        {isAvailable ? (
                          <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
                        ) : (
                          <Lock className="h-3 w-3 text-zinc-400" />
                        )}
                      </div>

                      <h3 className="mt-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {domain.title}
                      </h3>
                      <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                        {domain.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[10px] font-semibold text-violet-600 dark:text-violet-400">
                      {isAvailable ? 'Launch Domain →' : 'In Development'}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-center text-xs text-zinc-400 dark:text-zinc-500">
              More learning domains are on the way.
            </div>
          </div>

          {/* Section: Current Personalized Recommendation */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23]">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Personalized Learning Recommendation
              </span>
              <span className="text-[10px] font-mono text-zinc-400">Deterministic Engine</span>
            </div>

            {hasTakenDiagnostic ? (
              <div className="mt-3.5 space-y-3">
                <div className="rounded-lg bg-violet-50/60 p-3.5 border border-violet-100 dark:bg-violet-950/20 dark:border-violet-900/40 text-xs">
                  <div className="font-semibold text-violet-950 dark:text-violet-200">
                    Recommended Topic: {latestDiagnosticReport.recommendedTopic}
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {latestDiagnosticReport.recommendedAction}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      onClick={() => setActiveTab('diagnostic')}
                      className="rounded-md bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700"
                    >
                      Open Targeted Practice
                    </button>
                    {latestDiagnosticReport.weakestSubtopic.includes('Linked List') && (
                      <button
                        onClick={() => setActiveTab('visualizer')}
                        className="text-xs text-violet-600 hover:text-violet-700 font-medium"
                      >
                        Practice in Visualizer ({nodes.length} nodes) →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Empty state for new learner */
              <div className="mt-4 py-6 text-center space-y-2">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
                  <Brain className="h-5 w-5" />
                </div>
                <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  You haven't taken your diagnostic test yet.
                </h3>
                <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
                  Discover your learning gaps and get a personalized plan tailored to your actual strengths.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('diagnostic')}
                    className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-700"
                  >
                    Start Diagnostic Test
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Weak Invariants & Verified Improvement History */}
        <div className="lg:col-span-4 space-y-6">
          {/* Section: Weak Concepts genuinely needing practice */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23]">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                <span>Identified Learning Gaps</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">Diagnosis</span>
            </div>

            {hasTakenDiagnostic ? (
              <div className="mt-3 space-y-2">
                {latestDiagnosticReport.subtopicScores
                  .filter((s) => s.status === 'Needs more practice' || s.percentage < 70)
                  .map((sub, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-amber-200/70 bg-amber-50/40 p-3 text-xs dark:border-amber-900/40 dark:bg-amber-950/20"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-amber-900 dark:text-amber-200">
                          {sub.subtopic}
                        </span>
                        <span className="font-mono text-[10px] text-amber-700 dark:text-amber-300">
                          {sub.percentage}%
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-300">
                        Accuracy below threshold. Practice recommended before post-assessment.
                      </p>
                      <button
                        onClick={() => setActiveTab('diagnostic')}
                        className="mt-2 text-[10px] font-semibold text-amber-800 dark:text-amber-300 hover:underline"
                      >
                        Start Practice →
                      </button>
                    </div>
                  ))}

                {latestDiagnosticReport.subtopicScores.filter((s) => s.percentage < 70).length === 0 && (
                  <div className="p-3 text-xs text-emerald-700 bg-emerald-50 rounded-lg dark:bg-emerald-950/40 dark:text-emerald-300">
                    ✓ All assessed subtopics demonstrated solid competence (≥ 70%).
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-3 py-4 text-center text-xs text-zinc-400">
                Take the diagnostic test to detect concept gaps.
              </div>
            )}
          </div>

          {/* Section: Verified Improvement History (Pre vs Post test results) */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23]">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Verified Improvement</span>
              </span>
              <button
                onClick={() => setActiveTab('portfolio')}
                className="text-[11px] text-violet-600 hover:text-violet-700"
              >
                Portfolio →
              </button>
            </div>

            {postTestResults.length > 0 ? (
              <div className="mt-3 space-y-2.5">
                {postTestResults.map((res) => (
                  <div
                    key={res.id}
                    className="rounded-lg bg-zinc-50 p-3 text-xs dark:bg-zinc-850/60 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                        {res.subtopic}
                      </span>
                      <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {res.changePoints >= 0 ? `+${res.changePoints}%` : `${res.changePoints}%`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-500">
                      <span>Pre: {res.preScorePercent}% → Post: {res.postScorePercent}%</span>
                      <span>+{res.earnedXP} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 py-4 text-center text-xs text-zinc-400">
                No verified improvement records yet. Complete targeted practice and take the post-test to record verified gains.
              </div>
            )}
          </div>

          {/* Section: Interactive Visualizer Shortcut */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Linked List Sandbox
              </span>
              <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-800 dark:bg-violet-950 dark:text-violet-300">
                {selectedObjective.difficulty}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
              Interactive pointer manipulation sandbox with real-time invariant verifier.
            </p>
            <button
              onClick={() => setActiveTab('visualizer')}
              className="mt-3 w-full rounded-lg bg-zinc-900 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
            >
              Open Visualizer ({nodes.length} nodes)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
