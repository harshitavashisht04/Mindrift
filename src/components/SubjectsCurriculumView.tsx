import React, { useState } from 'react';
import {
  BookOpen,
  Play,
  CheckCircle2,
  HelpCircle,
  Check,
  ChevronRight,
  Clock,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CurriculumModule {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  progress: number;
  description: string;
  topics: string[];
  lessonContent: string[];
  keyInvariants: string[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

const MODULES: CurriculumModule[] = [
  {
    id: 'singly-linked-lists',
    title: 'Singly Linked Lists & Node Chains',
    level: 'Beginner',
    duration: '15 mins',
    progress: 80,
    description: 'Learn dynamic heap allocation, node structure, HEAD references, and sequential traversal.',
    topics: ['Heap memory vs Arrays', 'Node anatomy (DATA + NEXT)', 'HEAD pointer & NULL terminator', 'O(1) Head Operations'],
    lessonContent: [
      'Unlike arrays which require contiguous RAM blocks, linked lists allocate memory dynamically per node on the heap.',
      'Each node contains a data payload and a pointer holding the memory address of the next node.',
      'Constant-time O(1) insertions at the head make linked lists powerful for stream buffers and stacks.'
    ],
    keyInvariants: [
      'Nodes must never lose reference to the HEAD pointer.',
      'Termination is strictly marked by a NEXT pointer with address NULL (0x000000).',
      'Traversal requires O(N) operations because elements lack random indexing.'
    ],
    quiz: {
      question: 'Why does inserting a node at the HEAD take O(1) constant time?',
      options: [
        'Because the CPU caches the entire linked list in registers.',
        'Because we maintain an immediate direct reference to the HEAD pointer.',
        'Because linked lists do not store memory addresses.',
        'Because elements are sorted in ascending contiguous order.'
      ],
      correctIndex: 1,
      explanation: 'We directly update new_node.next = HEAD and HEAD = new_node without needing to traverse the remaining N nodes.'
    }
  },
  {
    id: 'pointer-rewiring',
    title: 'Middle Insertion & Pointer Rewiring',
    level: 'Intermediate',
    duration: '20 mins',
    progress: 50,
    description: 'Master the two-step pointer handshake to splice or remove nodes in the middle without memory leaks.',
    topics: ['Two-step splice handshake', 'Predecessor tracking', 'Orphan prevention', 'Deleting by value'],
    lessonContent: [
      'Inserting between nodes A and B requires executing `new_node.next = A.next` first.',
      'Only after the forward connection is preserved can `A.next = new_node` be assigned.',
      'Reversing this order immediately severs the chain and causes memory leaks.'
    ],
    keyInvariants: [
      'Connect the new node to the forward chain BEFORE severing the predecessor pointer.',
      'Finding the insertion index requires traversing (k - 1) steps from HEAD.',
      'Index 0 requires updating the HEAD pointer itself.'
    ],
    quiz: {
      question: 'Which sequence prevents memory leaks when inserting node X after node P?',
      options: [
        'P.next = X; X.next = P.next;',
        'X.next = P.next; P.next = X;',
        'P = X; X.next = P;',
        'X = P.next; P.next = X;'
      ],
      correctIndex: 1,
      explanation: 'X.next must first preserve the pointer to P.next before P.next is overwritten.'
    }
  },
  {
    id: 'list-reversal',
    title: 'In-Place List Reversal Algorithms',
    level: 'Advanced',
    duration: '25 mins',
    progress: 25,
    description: 'Flip every pointer arrow in a linked list using 3 pointers (prev, current, next) with O(1) space.',
    topics: ['Three-pointer state machine', 'In-place pointer reversal', 'O(1) auxiliary space bounds', 'Termination bounds'],
    lessonContent: [
      'List reversal cannot be solved via array swapping without duplicating memory.',
      'We initialize prev = NULL, current = HEAD, and next = NULL.',
      'At each iteration: next = current.next, current.next = prev, prev = current, current = next.'
    ],
    keyInvariants: [
      'Always store current.next in a temporary variable before flipping the pointer backwards.',
      'Auxiliary memory complexity is strictly O(1).',
      'At termination, the prev pointer becomes the new HEAD.'
    ],
    quiz: {
      question: 'What pointer holds the new HEAD address once reversal finishes?',
      options: ['current', 'HEAD', 'prev', 'next'],
      correctIndex: 2,
      explanation: 'When current reaches NULL, prev is pointing to the final node which is now the first node of the reversed list.'
    }
  },
  {
    id: 'cycle-detection',
    title: 'Fast & Slow Pointer Cycle Detection',
    level: 'Intermediate',
    duration: '18 mins',
    progress: 0,
    description: "Understand Floyd's Tortoise and Hare algorithm to detect infinite pointer loops with zero extra memory.",
    topics: ['Floyd algorithm', 'Relative pointer speed (2x vs 1x)', 'Cycle entry mathematics', 'O(1) memory invariance'],
    lessonContent: [
      'If a linked list contains a cycle, ordinary traversal loops infinitely.',
      'Floyd algorithm runs two pointers: slow moves 1 step, fast moves 2 steps.',
      'If fast catches slow, a cycle is proven. If fast reaches NULL, no cycle exists.'
    ],
    keyInvariants: [
      'Relative speed is 1 node per iteration, guaranteeing meeting within the loop.',
      'No hash set or extra memory is needed: O(1) auxiliary space.'
    ],
    quiz: {
      question: 'What is the space complexity of Floyd’s cycle detection algorithm?',
      options: ['O(N) space', 'O(log N) space', 'O(1) constant auxiliary space', 'O(N^2) space'],
      correctIndex: 2,
      explanation: 'Only two pointer references (slow and fast) are maintained, requiring constant O(1) memory.'
    }
  },
  {
    id: 'doubly-linked-lists',
    title: 'Doubly Linked Lists & Sentinel Nodes',
    level: 'Intermediate',
    duration: '22 mins',
    progress: 0,
    description: 'Explore bi-directional traversal with PREV and NEXT pointers, and simplify edge cases with dummy nodes.',
    topics: ['PREV and NEXT pointers', 'Sentinel / Dummy nodes', 'Bidirectional traversal', 'LRU cache foundation'],
    lessonContent: [
      'Doubly linked lists add a PREV pointer to every node, allowing O(1) deletions given only the node reference.',
      'Dummy sentinel nodes eliminate null pointer checks at HEAD and TAIL.'
    ],
    keyInvariants: [
      'Node.next.prev must always point back to Node.',
      'Sentinel nodes remain permanent and never store user data.'
    ],
    quiz: {
      question: 'Why does deleting a node in a Doubly Linked List take O(1) if the node reference is given?',
      options: [
        'Because we have direct access to node.prev and node.next without traversal.',
        'Because doubly linked lists use array contiguous RAM.',
        'Because the node automatically frees itself.',
        'Because memory addresses are strictly consecutive.'
      ],
      correctIndex: 0,
      explanation: 'Unlike singly linked lists where we must traverse to find the predecessor, node.prev directly provides it.'
    }
  },
  {
    id: 'stacks-and-queues',
    title: 'Stacks & Queues via Pointer Chains',
    level: 'Beginner',
    duration: '15 mins',
    progress: 0,
    description: 'Implement LIFO and FIFO fundamental data structures using singly linked lists with O(1) guarantees.',
    topics: ['LIFO stack push/pop', 'FIFO queue enqueue/dequeue', 'Tail pointer tracking', 'Call frame simulation'],
    lessonContent: [
      'A stack is implemented by pushing and popping exclusively at HEAD in O(1) time.',
      'A queue is implemented with HEAD for dequeue and TAIL for enqueue.'
    ],
    keyInvariants: [
      'Push & Pop on linked stack are strictly O(1) operations.',
      'Queue requires both HEAD and TAIL pointers for O(1) throughput.'
    ],
    quiz: {
      question: 'Which end of a singly linked list should serve as the Stack Top?',
      options: [
        'The TAIL node without a pointer.',
        'The HEAD node, because prepend and remove-head are O(1).',
        'The middle node.',
        'Any random index.'
      ],
      correctIndex: 1,
      explanation: 'Push and Pop at HEAD require zero traversal, guaranteeing strict O(1) complexity.'
    }
  }
];

export const SubjectsCurriculumView: React.FC = () => {
  const { setActiveTab } = useApp();
  const [levelFilter, setLevelFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [activeModule, setActiveModule] = useState<CurriculumModule | null>(null);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const filteredModules = MODULES.filter((m) => {
    if (levelFilter === 'All') return true;
    return m.level === levelFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
            <BookOpen className="h-3.5 w-3.5" />
            <span>My Learning & Curriculum</span>
          </div>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Structured Computer Science Curriculum
          </h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Curated, beginner-friendly learning paths with interactive concept evaluations.
          </p>
        </div>

        {/* Level Filter Tabs */}
        <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1 text-xs dark:border-zinc-700 dark:bg-zinc-850">
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                levelFilter === lvl
                  ? 'bg-white text-zinc-900 shadow-2xs dark:bg-zinc-700 dark:text-zinc-100'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Topic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModules.map((module) => {
          const isStarted = module.progress > 0;
          return (
            <div
              key={module.id}
              className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-[#1a1c23] dark:hover:border-zinc-700"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                      module.level === 'Beginner'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        : module.level === 'Intermediate'
                        ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}
                  >
                    {module.level}
                  </span>
                  <span className="flex items-center gap-1 text-zinc-400 text-[11px]">
                    <Clock className="h-3 w-3" />
                    {module.duration}
                  </span>
                </div>

                <h3 className="mt-2.5 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {module.title}
                </h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                  {module.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {module.topics.slice(0, 3).map((topic, i) => (
                    <span
                      key={i}
                      className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[11px] text-zinc-500">Mastery Progress</span>
                  <span className="text-xs font-semibold tabular-nums text-zinc-800 dark:text-zinc-200">
                    {module.progress}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full bg-violet-600 dark:bg-violet-500"
                    style={{ width: `${module.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setActiveModule(module);
                      setSelectedQuizAnswer(null);
                      setQuizSubmitted(false);
                    }}
                    className="flex-1 rounded-lg border border-zinc-200 bg-white py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-750"
                  >
                    {isStarted ? 'Continue Learning' : 'Start Learning'}
                  </button>

                  <button
                    onClick={() => setActiveTab('visualizer')}
                    title="Practice in Visualizer Sandbox"
                    className="rounded-lg bg-violet-50 p-2 text-violet-700 hover:bg-violet-100 dark:bg-violet-950/60 dark:text-violet-300"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lesson Reader Drawer / Modal */}
      {activeModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-[#1a1c23]">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <div>
                <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">
                  {activeModule.level} · {activeModule.duration}
                </span>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {activeModule.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveModule(null)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-xs px-2 py-1 rounded"
              >
                ✕ Close
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
              <p className="font-medium text-zinc-900 dark:text-zinc-100">{activeModule.description}</p>

              <div className="space-y-2">
                {activeModule.lessonContent.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-700 dark:bg-zinc-850">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
                  Core Engineering Invariants
                </div>
                <ul className="list-disc pl-4 space-y-1 text-zinc-600 dark:text-zinc-400">
                  {activeModule.keyInvariants.map((inv, i) => (
                    <li key={i}>{inv}</li>
                  ))}
                </ul>
              </div>

              {/* Quiz Check */}
              <div className="rounded-lg border border-violet-100 bg-violet-50/40 p-4 dark:border-violet-950/60 dark:bg-violet-950/20">
                <div className="font-semibold text-violet-900 dark:text-violet-200 mb-2 flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-violet-600" />
                  <span>Concept Check</span>
                </div>
                <p className="font-medium text-zinc-800 dark:text-zinc-200 mb-2.5">
                  {activeModule.quiz.question}
                </p>

                <div className="space-y-1.5">
                  {activeModule.quiz.options.map((opt, idx) => {
                    const isSelected = selectedQuizAnswer === idx;
                    const isCorrect = idx === activeModule.quiz.correctIndex;
                    let style = 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800';
                    if (quizSubmitted) {
                      if (isCorrect) style = 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200';
                      else if (isSelected) style = 'border-rose-400 bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-200';
                    } else if (isSelected) {
                      style = 'border-violet-600 bg-violet-50 text-violet-900 dark:border-violet-500 dark:bg-violet-950/60 dark:text-violet-200';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => !quizSubmitted && setSelectedQuizAnswer(idx)}
                        className={`w-full text-left rounded-md border p-2 text-xs transition-colors flex items-center justify-between ${style}`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && isCorrect && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  {!quizSubmitted ? (
                    <button
                      onClick={() => selectedQuizAnswer !== null && setQuizSubmitted(true)}
                      disabled={selectedQuizAnswer === null}
                      className="rounded bg-violet-600 px-3 py-1.5 font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <div className="text-[11px] text-zinc-600 dark:text-zinc-400">
                      <strong>{selectedQuizAnswer === activeModule.quiz.correctIndex ? '✓ Correct! ' : '✕ Incorrect. '}</strong>
                      {activeModule.quiz.explanation}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setActiveModule(null);
                      setActiveTab('visualizer');
                    }}
                    className="flex items-center gap-1 text-violet-600 hover:text-violet-700 font-semibold text-xs"
                  >
                    <span>Practice in Visualizer</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
