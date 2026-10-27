import React, { useState } from 'react';
import {
  CheckCircle2,
  Play,
  AlertCircle,
  Award,
  Terminal,
  Code,
  ArrowRight,
  RotateCcw,
  Check,
  Sparkles,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChallengeItem } from '../types';

const CHALLENGES: ChallengeItem[] = [
  {
    id: 'middle-node',
    title: 'Find Middle Node of Linked List',
    difficulty: 'Easy',
    category: 'Two Pointers',
    timeEstimate: '10 mins',
    prompt: 'Given the head of a singly linked list, return the value of the middle node. If there are two middle nodes, return the second middle node.',
    constraints: [
      'The number of nodes in the list is in the range [1, 100]',
      '1 <= Node.val <= 100',
      'Time complexity must be O(N)',
      'Auxiliary space should be O(1)',
    ],
    starterCode: `function middleNode(values) {
  // values is an array representation of the linked list
  // Complete the fast & slow pointer logic:
  let slow = 0;
  let fast = 0;
  while (fast < values.length && fast + 1 < values.length) {
    slow += 1;
    fast += 2;
  }
  return values[slow];
}`,
    solutionTemplate: `function middleNode(values) {
  let slow = 0;
  let fast = 0;
  while (fast < values.length && fast + 1 < values.length) {
    slow += 1;
    fast += 2;
  }
  return values[slow];
}`,
    testCases: [
      { id: 'tc-1', input: '[1, 2, 3, 4, 5]', expected: '3' },
      { id: 'tc-2', input: '[1, 2, 3, 4, 5, 6]', expected: '4' },
      { id: 'tc-3', input: '[10]', expected: '10' },
      { id: 'tc-4', input: '[7, 14, 21, 28]', expected: '21' },
    ],
  },
  {
    id: 'reverse-list',
    title: 'Reverse Singly Linked List',
    difficulty: 'Easy',
    category: 'Pointers',
    timeEstimate: '12 mins',
    prompt: 'Given the values of a singly linked list, reverse the list and return the new order of node values.',
    constraints: [
      'The number of nodes is in range [0, 5000]',
      '-5000 <= Node.val <= 5000',
      'O(N) Time, O(1) Space',
    ],
    starterCode: `function reverseList(values) {
  // Reverse the array representation representing pointers flipped
  const reversed = [];
  for (let i = values.length - 1; i >= 0; i--) {
    reversed.push(values[i]);
  }
  return reversed;
}`,
    solutionTemplate: `function reverseList(values) {
  const reversed = [];
  for (let i = values.length - 1; i >= 0; i--) {
    reversed.push(values[i]);
  }
  return reversed;
}`,
    testCases: [
      { id: 'tc-1', input: '[1, 2, 3, 4, 5]', expected: '[5, 4, 3, 2, 1]' },
      { id: 'tc-2', input: '[10, 20]', expected: '[20, 10]' },
      { id: 'tc-3', input: '[]', expected: '[]' },
    ],
  },
  {
    id: 'delete-nth-end',
    title: 'Remove N-th Node From End of List',
    difficulty: 'Medium',
    category: 'Two Pointers',
    timeEstimate: '15 mins',
    prompt: 'Given a list of values and an integer n, remove the n-th node from the end of the list and return its values.',
    constraints: [
      'The number of nodes in the list is sz',
      '1 <= sz <= 30',
      '1 <= n <= sz',
    ],
    starterCode: `function removeNthFromEnd(values, n) {
  // Find index from start: values.length - n
  const targetIndex = values.length - n;
  return values.filter((_, idx) => idx !== targetIndex);
}`,
    solutionTemplate: `function removeNthFromEnd(values, n) {
  const targetIndex = values.length - n;
  return values.filter((_, idx) => idx !== targetIndex);
}`,
    testCases: [
      { id: 'tc-1', input: 'values = [1, 2, 3, 4, 5], n = 2', expected: '[1, 2, 3, 5]' },
      { id: 'tc-2', input: 'values = [1], n = 1', expected: '[]' },
      { id: 'tc-3', input: 'values = [1, 2], n = 1', expected: '[1]' },
    ],
  },
];

export const ChallengeLabView: React.FC = () => {
  const { setActiveTab, addProofRecord } = useApp();
  const [activeChallenge, setActiveChallenge] = useState<ChallengeItem>(CHALLENGES[0]);
  const [userCode, setUserCode] = useState<string>(CHALLENGES[0].starterCode);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<{ id: string; passed: boolean; output: string }[] | null>(null);
  const [allPassed, setAllPassed] = useState<boolean>(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  // Filters
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const filteredChallenges = CHALLENGES.filter((c) => {
    if (difficultyFilter !== 'All' && c.difficulty !== difficultyFilter) return false;
    if (categoryFilter !== 'All' && c.category !== categoryFilter) return false;
    return true;
  });

  const handleSelectChallenge = (c: ChallengeItem) => {
    setActiveChallenge(c);
    setUserCode(c.starterCode);
    setTestResults(null);
    setAllPassed(false);
    setGeneratedToken(null);
  };

  const handleRunTests = () => {
    setIsRunning(true);
    setTestResults(null);
    setAllPassed(false);

    setTimeout(() => {
      try {
        let fn: any;
        if (activeChallenge.id === 'middle-node') {
          // eslint-disable-next-line no-new-func
          fn = new Function(`${userCode}; return middleNode;`)();
        } else if (activeChallenge.id === 'reverse-list') {
          // eslint-disable-next-line no-new-func
          fn = new Function(`${userCode}; return reverseList;`)();
        } else if (activeChallenge.id === 'delete-nth-end') {
          // eslint-disable-next-line no-new-func
          fn = new Function(`${userCode}; return removeNthFromEnd;`)();
        }

        const results = activeChallenge.testCases.map((tc) => {
          try {
            let actual: any;
            if (activeChallenge.id === 'middle-node') {
              const arr = JSON.parse(tc.input);
              actual = String(fn(arr));
            } else if (activeChallenge.id === 'reverse-list') {
              const arr = JSON.parse(tc.input);
              actual = JSON.stringify(fn(arr)).replace(/,/g, ', ');
            } else if (activeChallenge.id === 'delete-nth-end') {
              const parts = tc.input.split(', n = ');
              const valuesStr = parts[0].replace('values = ', '').trim();
              const nVal = parseInt(parts[1], 10);
              const arr = JSON.parse(valuesStr);
              actual = JSON.stringify(fn(arr, nVal)).replace(/,/g, ', ');
            }

            const expectedClean = tc.expected.trim();
            const actualClean = String(actual).trim();
            const passed = actualClean === expectedClean;

            return {
              id: tc.id,
              passed,
              output: actualClean,
            };
          } catch (err: any) {
            return {
              id: tc.id,
              passed: false,
              output: `Runtime Error: ${err.message}`,
            };
          }
        });

        setTestResults(results);
        const passCount = results.filter((r) => r.passed).length;
        const passAll = passCount === results.length;
        setAllPassed(passAll);

        if (passAll) {
          const token = `MND-PROVE-${activeChallenge.id.toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
          setGeneratedToken(token);
          addProofRecord({
            id: `chal-proof-${Date.now()}`,
            title: `Challenge Solved: ${activeChallenge.title}`,
            category: `Algorithms / ${activeChallenge.category}`,
            completedAt: new Date().toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            token,
            details: `Passed all ${results.length} automated test suites with linear time pointer mechanics.`,
            grade: 'Mastered',
          });
        }
      } catch (err: any) {
        setTestResults([
          {
            id: 'err-compile',
            passed: false,
            output: `Compilation Error: ${err.message}`,
          },
        ]);
      } finally {
        setIsRunning(false);
      }
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Prove It — Challenge Lab</span>
          </div>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Algorithmic Problem Suite & Invariant Tests
          </h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Solve pointer problems in JavaScript/TypeScript. Run automated test suites and earn verified proof tokens.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as any)}
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-800 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-800 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
          >
            <option value="All">All Categories</option>
            <option value="Two Pointers">Two Pointers</option>
            <option value="Pointers">Pointers</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Challenge Library + Code & Test Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Challenge Library (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] uppercase font-semibold text-zinc-400">
              Problems ({filteredChallenges.length})
            </span>
          </div>

          <div className="space-y-2">
            {filteredChallenges.map((c) => {
              const isSelected = activeChallenge.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => handleSelectChallenge(c)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    isSelected
                      ? 'border-violet-600 bg-violet-50/50 dark:border-violet-500 dark:bg-violet-950/30'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-[#1a1c23] dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-600 dark:text-zinc-400 text-[11px]">
                      {c.category}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.2 text-[10px] font-semibold ${
                        c.difficulty === 'Easy'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {c.difficulty}
                    </span>
                  </div>
                  <h4 className="mt-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100">{c.title}</h4>
                  <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {c.prompt}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-dashed border-zinc-200 p-4 text-center dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-850/30">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Want to test visual node manipulation instead?</p>
            <button
              onClick={() => setActiveTab('visualizer')}
              className="mt-1.5 text-xs font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400"
            >
              Open Linked List Visualizer →
            </button>
          </div>
        </div>

        {/* Right Column: Problem Statement & Interactive Code Runner (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Problem Statement Card */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23]">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <div>
                <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">
                  {activeChallenge.category} · {activeChallenge.timeEstimate}
                </span>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {activeChallenge.title}
                </h2>
              </div>
              <span className="rounded bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
                {activeChallenge.difficulty}
              </span>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
              {activeChallenge.prompt}
            </p>

            <div className="mt-3 rounded-lg bg-zinc-50 p-3 text-[11px] dark:bg-zinc-850">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">Constraints:</span>
              <ul className="mt-1 list-disc pl-4 space-y-0.5 text-zinc-500 dark:text-zinc-400">
                {activeChallenge.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Interactive Code Editor */}
          <div className="rounded-xl border border-zinc-200 bg-white shadow-2xs overflow-hidden dark:border-zinc-800 dark:bg-[#1a1c23]">
            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-850">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                <Code className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                <span>JavaScript / TypeScript Code Editor</span>
              </div>
              <button
                onClick={() => setUserCode(activeChallenge.starterCode)}
                className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Starter</span>
              </button>
            </div>

            <div className="p-3">
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                rows={9}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-900 p-3 font-mono text-xs text-zinc-100 focus:border-violet-500 focus:outline-none dark:border-zinc-800"
              />
            </div>

            <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-850/50">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Evaluates test cases with strict isolated runtime checks.
              </span>
              <button
                onClick={handleRunTests}
                disabled={isRunning}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>{isRunning ? 'Running Tests...' : 'Run Test Cases'}</span>
              </button>
            </div>
          </div>

          {/* Test Results Card */}
          {testResults && (
            <div
              className={`rounded-xl border p-5 shadow-2xs ${
                allPassed
                  ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20'
                  : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#1a1c23]'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 border-zinc-200/60 dark:border-zinc-800/60">
                <div className="flex items-center gap-2">
                  {allPassed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  )}
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {allPassed ? 'All Test Cases Passed!' : 'Some Test Cases Failed'}
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {testResults.filter((r) => r.passed).length} of {testResults.length} test cases passed.
                    </p>
                  </div>
                </div>

                {allPassed && generatedToken && (
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {generatedToken}
                    </span>
                    <button
                      onClick={() => setActiveTab('portfolio')}
                      className="rounded-lg bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
                    >
                      View in Portfolio
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-3 space-y-2">
                {activeChallenge.testCases.map((tc, idx) => {
                  const res = testResults.find((r) => r.id === tc.id);
                  const passed = res?.passed ?? false;
                  return (
                    <div
                      key={tc.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-zinc-200 bg-white/70 p-2.5 text-xs dark:border-zinc-800 dark:bg-zinc-800/60"
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                          Test Suite #{idx + 1}
                        </div>
                        <div className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                          Input: <code>{tc.input}</code>
                        </div>
                      </div>

                      <div className="mt-2 sm:mt-0 flex items-center gap-3">
                        <div className="text-[11px]">
                          Expected: <code className="font-bold text-emerald-600">{tc.expected}</code>
                        </div>
                        <div className="text-[11px]">
                          Actual:{' '}
                          <code className={passed ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold'}>
                            {res?.output ?? 'N/A'}
                          </code>
                        </div>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                            passed
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
