import React, { useState } from 'react';
import {
  Play,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Search,
  RotateCcw,
  Sparkles,
  Info,
  Check,
  Award,
  Layers,
  HelpCircle,
  Wand2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRESET_OBJECTIVES } from '../utils/linkedListValidator';
import { LinkedListObjective, NodeData } from '../types';

export const LinkedListVisualizerView: React.FC = () => {
  const {
    nodes,
    selectedObjective,
    setSelectedObjective,
    verificationResult,
    isVerifying,
    verifyCurrentList,
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
    setNodes,
    addProofRecord,
  } = useApp();

  // Control inputs
  const [inputValue, setInputValue] = useState<string>('25');
  const [inputIndex, setInputIndex] = useState<string>('1');
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [customInputString, setCustomInputString] = useState<string>('10, 20, 30, 40');
  const [claimedToken, setClaimedToken] = useState<boolean>(false);

  // Collapsible controls for right column
  const [showDeleteControls, setShowDeleteControls] = useState<boolean>(true);
  const [showSearchControls, setShowSearchControls] = useState<boolean>(true);
  const [showGuidance, setShowGuidance] = useState<boolean>(true);

  // Quick helper to fill target list directly for instant testing
  const handleLoadExactSolution = () => {
    let addr = 160;
    const solutionNodes: NodeData[] = selectedObjective.targetList.map((val) => {
      addr += 8;
      return {
        id: Math.random().toString(36).substring(2, 9),
        value: val,
        address: `0x00${addr.toString(16).toUpperCase()}`,
        isHighlighted: true,
      };
    });
    setNodes(solutionNodes);
    setSearchFeedback(`Loaded exact expected solution: [${selectedObjective.targetList.join(', ')}]. Now click 'Verify Current List Match Objectives' to test validation.`);
  };

  const handleSearch = () => {
    const val = parseInt(searchValue, 10);
    if (isNaN(val)) {
      setSearchFeedback('Enter a valid numeric value to search.');
      return;
    }
    const idx = nodes.findIndex((n) => Number(n.value) === val);
    if (idx !== -1) {
      setSearchFeedback(`Found value ${val} at index [${idx}] (${nodes[idx].address}).`);
      setSelectedNode(nodes[idx]);
    } else {
      setSearchFeedback(`Value ${val} not found (searched ${nodes.length} nodes to NULL).`);
      setSelectedNode(null);
    }
  };

  const handleInsertHead = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;
    insertHead(val);
  };

  const handleInsertTail = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;
    insertTail(val);
  };

  const handleInsertAtIndex = () => {
    const val = parseInt(inputValue, 10);
    const idx = parseInt(inputIndex, 10);
    if (isNaN(val) || isNaN(idx)) return;
    if (idx < 0 || idx > nodes.length) {
      alert(`Index must be between 0 and ${nodes.length}`);
      return;
    }
    insertAtIndex(idx, val);
  };

  const handleDeleteValue = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;
    const ok = deleteByValue(val);
    if (!ok) {
      alert(`Value ${val} was not found in the list.`);
    }
  };

  const handleCreateCustomObjective = () => {
    const parsed = customInputString
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));

    if (parsed.length === 0) {
      alert('Please enter at least one comma-separated number.');
      return;
    }

    const customObj: LinkedListObjective = {
      id: `custom-${Date.now()}`,
      title: `Custom Target: [${parsed.join(', ')}]`,
      badge: 'Custom',
      difficulty: 'Intermediate',
      description: `Verify that the linked list matches custom sequence [${parsed.join(' -> ')}].`,
      requirements: [
        `List must contain exactly ${parsed.length} nodes`,
        `Nodes must appear sequentially: ${parsed.join(' -> ')} -> NULL`,
        'Pointer addresses must terminate at NULL',
      ],
      targetList: parsed,
      allowDuplicates: true,
      exactLength: parsed.length,
      hint: 'Construct the nodes in this exact sequence using the insertion controls.',
    };

    setSelectedObjective(customObj);
    setShowCustomModal(false);
  };

  // Node details for status header
  const headNode = nodes.length > 0 ? nodes[0] : null;
  const tailNode = nodes.length > 0 ? nodes[nodes.length - 1] : null;

  return (
    <div className="space-y-6">
      {/* A. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23]">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <span>Dashboard</span>
            <span>/</span>
            <span>Visualizer</span>
            <span>/</span>
            <span className="font-semibold text-violet-600 dark:text-violet-400">Linked List</span>
          </div>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Linked List Visualizer
          </h1>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            Understand pointers through interactive practice.
          </p>
        </div>

        {/* Objective Selector & Reset Action */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Objective:</span>
            <select
              value={selectedObjective.id}
              onChange={(e) => {
                const found = PRESET_OBJECTIVES.find((o) => o.id === e.target.value);
                if (found) {
                  setSelectedObjective(found);
                  setClaimedToken(false);
                }
              }}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-850 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            >
              {PRESET_OBJECTIVES.map((obj) => (
                <option key={obj.id} value={obj.id}>
                  {obj.title} ({obj.difficulty})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => resetToObjective(selectedObjective)}
            title="Reset list to this objective's initial challenge template"
            className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-750"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Challenge</span>
          </button>

          <button
            onClick={() => setShowCustomModal(true)}
            className="flex items-center gap-1 rounded-lg border border-dashed border-violet-300 bg-violet-50/50 px-2.5 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-100/70 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300"
          >
            <Wand2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Custom</span>
          </button>
        </div>
      </div>

      {/* B. COMPACT OBJECTIVE CARD */}
      <div className="rounded-xl border border-violet-100 bg-violet-50/40 p-4 shadow-2xs dark:border-violet-950/60 dark:bg-violet-950/20">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-violet-950 dark:text-violet-200">
                Target Objective: {selectedObjective.title}
              </span>
              <span className="rounded bg-violet-200/60 px-2 py-0.5 text-[10px] font-semibold text-violet-800 dark:bg-violet-900/60 dark:text-violet-300">
                {selectedObjective.difficulty}
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {selectedObjective.description}
            </p>
          </div>

          {/* Validation & Solution Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleLoadExactSolution}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 shadow-2xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-750"
              title="Auto-fill the expected target sequence to test validation"
            >
              Test Solution Preset
            </button>

            <button
              onClick={verifyCurrentList}
              disabled={isVerifying}
              id="verify-current-list-btn"
              className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-violet-700 active:scale-98 disabled:opacity-60 dark:bg-violet-600 dark:hover:bg-violet-500 whitespace-nowrap"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Verify Current List Match Objectives</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Objective Invariant Criteria Strip */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-violet-100/80 pt-2 text-xs text-zinc-600 dark:border-violet-900/40 dark:text-zinc-400">
          <div>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">Target Sequence: </span>
            <span className="font-mono font-semibold text-violet-700 dark:text-violet-300">
              [{selectedObjective.targetList.join(' → ')} → NULL]
            </span>
          </div>
          <span>·</span>
          <div>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">Required Count: </span>
            <span>{selectedObjective.exactLength ?? selectedObjective.targetList.length} nodes</span>
          </div>
          <span>·</span>
          <div>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">Duplicates: </span>
            <span>{selectedObjective.allowDuplicates ? 'Allowed' : 'Strictly Disallowed'}</span>
          </div>
        </div>
      </div>

      {/* C. MAIN WORKSPACE: TWO-COLUMN LAYOUT ON DESKTOP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (7 cols): INTERACTIVE LINKED LIST CANVAS */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23]">
            {/* Canvas Header & List Stats */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3 dark:border-zinc-800/80">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  Visualization Canvas
                </span>
                <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-mono font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {nodes.length} nodes
                </span>
              </div>

              {/* Quick Canvas Toolbar */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => generateRandomList(4)}
                  className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  title="Generate 4 random sorted nodes"
                >
                  Random 4
                </button>
                <button
                  onClick={reverseList}
                  disabled={nodes.length <= 1}
                  className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  title="Reverse all pointer connections in place"
                >
                  Reverse
                </button>
                <button
                  onClick={clearList}
                  disabled={nodes.length === 0}
                  className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-rose-400 dark:hover:bg-rose-950/30"
                  title="Clear all nodes from list"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Live Status Bar */}
            <div className="mt-2.5 flex items-center gap-4 text-[11px] text-zinc-500 dark:text-zinc-400">
              <div>
                HEAD:{' '}
                <strong className="font-mono text-zinc-800 dark:text-zinc-200">
                  {headNode ? `${headNode.address} (val: ${headNode.value})` : 'NULL'}
                </strong>
              </div>
              <span>·</span>
              <div>
                TAIL:{' '}
                <strong className="font-mono text-zinc-800 dark:text-zinc-200">
                  {tailNode ? `${tailNode.address} (val: ${tailNode.value})` : 'NULL'}
                </strong>
              </div>
            </div>

            {/* Interactive Linked List Canvas with Horizontal Scroll if needed */}
            <div className="mt-4 min-h-[190px] overflow-x-auto rounded-lg border border-dashed border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-700/80 dark:bg-zinc-850/30">
              {nodes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Layers className="h-8 w-8 text-zinc-400" />
                  <p className="mt-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    The list is currently empty
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    HEAD is referencing NULL (0x000000). Use the controls on the right to insert nodes.
                  </p>
                  <button
                    onClick={() => insertHead(10)}
                    className="mt-3 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700"
                  >
                    Insert [10] as HEAD
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 py-4">
                  {/* HEAD Label Indicator */}
                  <div className="flex flex-col items-center pr-1 shrink-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-700 dark:text-violet-400">
                      HEAD
                    </span>
                    <ArrowRight className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  </div>

                  {nodes.map((node, index) => {
                    const isSelected = selectedNode?.id === node.id;
                    const isTail = index === nodes.length - 1;
                    const nextAddr = isTail ? 'NULL' : nodes[index + 1].address;

                    return (
                      <React.Fragment key={node.id}>
                        {/* Node Unit */}
                        <div
                          onClick={() => setSelectedNode(node)}
                          className={`group relative flex cursor-pointer flex-col rounded-lg border transition-all shrink-0 ${
                            isSelected
                              ? 'border-violet-600 ring-2 ring-violet-500/20 shadow-md dark:border-violet-500'
                              : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800'
                          }`}
                        >
                          {/* Node Header: Index & Memory Hex */}
                          <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-2.5 py-1 text-[10px] font-mono text-zinc-500 dark:border-zinc-700/60 dark:bg-zinc-850 dark:text-zinc-400">
                            <span>[{index}]</span>
                            <span className="text-zinc-400 dark:text-zinc-500">{node.address}</span>
                          </div>

                          {/* Node Body: DATA | NEXT */}
                          <div className="flex items-stretch divide-x divide-zinc-100 px-1 py-1.5 dark:divide-zinc-700/60">
                            {/* DATA Partition */}
                            <div className="flex flex-col items-center justify-center px-3.5 py-2">
                              <span className="text-[9px] font-semibold uppercase text-zinc-400">DATA</span>
                              <span className="text-lg font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                                {node.value}
                              </span>
                            </div>

                            {/* NEXT Pointer Partition */}
                            <div className="flex flex-col items-center justify-center px-2.5 py-2 bg-zinc-50/40 dark:bg-zinc-850/40">
                              <span className="text-[9px] font-semibold uppercase text-zinc-400">NEXT</span>
                              <span className="font-mono text-xs font-semibold text-violet-600 dark:text-violet-400">
                                {nextAddr === 'NULL' ? 'NULL' : '→'}
                              </span>
                            </div>
                          </div>

                          {/* Delete shortcut on hover */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteAtIndex(index);
                            }}
                            title={`Delete node at index ${index}`}
                            className="absolute -top-2 -right-2 hidden h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-white shadow-2xs group-hover:flex hover:bg-rose-700"
                          >
                            <Trash2 className="h-2.5 w-2.5" />
                          </button>
                        </div>

                        {/* Connecting Pointer Arrow */}
                        <div className="flex items-center text-zinc-400 px-0.5 shrink-0 dark:text-zinc-600">
                          <div className="h-0.5 w-4 bg-zinc-300 dark:bg-zinc-700" />
                          <ArrowRight className="h-3.5 w-3.5 -ml-1 text-zinc-400 dark:text-zinc-500" />
                        </div>
                      </React.Fragment>
                    );
                  })}

                  {/* NULL Pointer Terminator */}
                  <div className="flex flex-col items-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-center dark:border-zinc-700 dark:bg-zinc-800/40 shrink-0">
                    <span className="text-[9px] font-mono font-bold text-zinc-400 dark:text-zinc-500">
                      TAIL NEXT
                    </span>
                    <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      NULL
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Clicked Node Inspector */}
            {selectedNode && (
              <div className="mt-3 flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs dark:border-zinc-700 dark:bg-zinc-850">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">Inspecting Node:</span>
                  <span>
                    Address: <code className="font-mono text-violet-700 dark:text-violet-300">{selectedNode.address}</code>
                  </span>
                  <span>
                    Value: <code className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{selectedNode.value}</code>
                  </span>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>

          {/* D. STATUS AND VALIDATION FEEDBACK CARD */}
          {verificationResult && (
            <div
              id="verification-results-panel"
              className={`rounded-xl border p-5 shadow-2xs transition-all ${
                verificationResult.isValid
                  ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20'
                  : 'border-amber-200 bg-amber-50/40 dark:border-amber-900/60 dark:bg-amber-950/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 border-zinc-200/60 dark:border-zinc-800/60 gap-3">
                <div className="flex items-center gap-2.5">
                  {verificationResult.isValid ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/80 dark:text-emerald-300">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/80 dark:text-amber-300">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                  )}

                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {verificationResult.isValid
                        ? 'Verification Passed: All Invariants Satisfied'
                        : 'Verification Mismatch: List Does Not Match Objectives'}
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Scanned {verificationResult.scannedCount} nodes against target '{verificationResult.objectiveTitle}' (Local Verification).
                    </p>
                  </div>
                </div>

                {verificationResult.isValid && verificationResult.proofToken && (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] rounded bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {verificationResult.proofToken}
                    </span>
                    <button
                      onClick={() => {
                        addProofRecord({
                          id: `proof-${Date.now()}`,
                          title: `Verified: ${selectedObjective.title}`,
                          category: 'Linked List Visualizer',
                          completedAt: 'Just now',
                          token: verificationResult.proofToken!,
                          details: `Validated list [${nodes.map((n) => n.value).join(', ')}] matched objective requirements.`,
                          grade: 'Verified',
                        });
                        setClaimedToken(true);
                      }}
                      disabled={claimedToken}
                      className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {claimedToken ? 'Claimed ✓' : 'Claim Proof'}
                    </button>
                  </div>
                )}
              </div>

              {/* Feedback Breakdown */}
              <div className="mt-3 space-y-2 text-xs">
                {verificationResult.isValid ? (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded border border-emerald-200 bg-white/70 p-2 text-center dark:border-emerald-900 dark:bg-zinc-900">
                      <div className="text-[10px] text-zinc-400 uppercase">Length</div>
                      <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        {verificationResult.scannedCount} Nodes
                      </div>
                    </div>
                    <div className="rounded border border-emerald-200 bg-white/70 p-2 text-center dark:border-emerald-900 dark:bg-zinc-900">
                      <div className="text-[10px] text-zinc-400 uppercase">Ordering</div>
                      <div className="font-mono font-bold text-emerald-600">Strict Match</div>
                    </div>
                    <div className="rounded border border-emerald-200 bg-white/70 p-2 text-center dark:border-emerald-900 dark:bg-zinc-900">
                      <div className="text-[10px] text-zinc-400 uppercase">Pointers</div>
                      <div className="font-mono font-bold text-emerald-600">Valid Chain</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Error diagnostics */}
                    {verificationResult.errors.length > 0 && (
                      <div className="rounded-md border border-amber-300/80 bg-white/80 p-2.5 dark:border-amber-900/60 dark:bg-zinc-900/60">
                        <span className="font-semibold text-amber-900 dark:text-amber-200">
                          Issues Found:
                        </span>
                        <ul className="mt-1 list-disc pl-4 space-y-0.5 text-zinc-700 dark:text-zinc-300 text-[11px]">
                          {verificationResult.errors.map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Mismatch breakdown */}
                    {verificationResult.mismatches.length > 0 && (
                      <div className="rounded-md border border-zinc-200 bg-white/80 p-2.5 dark:border-zinc-800 dark:bg-zinc-900/60">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          Mismatched Elements:
                        </span>
                        <div className="mt-1 space-y-1 font-mono text-[11px]">
                          {verificationResult.mismatches.map((m, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between rounded bg-zinc-50 px-2 py-0.5 dark:bg-zinc-800/60"
                            >
                              <span>{m.message}</span>
                              <span className="text-zinc-500">
                                Target: <strong className="text-emerald-600">{String(m.expected)}</strong> | Current:{' '}
                                <strong className="text-rose-500">{String(m.actual)}</strong>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommended action */}
                    {verificationResult.recommendations.length > 0 && (
                      <div className="flex items-center justify-between rounded-md bg-violet-50/60 p-2 text-[11px] text-violet-950 dark:bg-violet-950/30 dark:text-violet-200">
                        <span>
                          <strong>Fix:</strong> {verificationResult.recommendations[0]}
                        </span>
                        <button
                          onClick={handleLoadExactSolution}
                          className="rounded bg-violet-600 px-2 py-0.5 text-white font-medium hover:bg-violet-700 shrink-0 ml-2"
                        >
                          Auto-Fix List
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (5 cols): CONTROLS & GUIDANCE */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card: Add Node Form */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23]">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5 text-violet-600" />
              <span>Add Node Controls</span>
            </h3>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                  Node Value
                </label>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="mt-0.5 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-mono font-semibold text-zinc-900 focus:border-violet-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                  Target Index
                </label>
                <input
                  type="number"
                  min="0"
                  max={nodes.length}
                  value={inputIndex}
                  onChange={(e) => setInputIndex(e.target.value)}
                  className="mt-0.5 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-mono font-semibold text-zinc-900 focus:border-violet-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1.5">
              <button
                onClick={handleInsertHead}
                className="rounded-lg bg-zinc-900 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Insert Head
              </button>
              <button
                onClick={handleInsertTail}
                className="rounded-lg bg-zinc-900 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Insert Tail
              </button>
              <button
                onClick={handleInsertAtIndex}
                className="rounded-lg border border-zinc-200 bg-white py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              >
                Insert @ Idx
              </button>
            </div>
          </div>

          {/* Card: Delete Operations (Collapsible) */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23]">
            <div
              onClick={() => setShowDeleteControls(!showDeleteControls)}
              className="flex cursor-pointer items-center justify-between"
            >
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                <span>Delete Node Operations</span>
              </h3>
              {showDeleteControls ? (
                <ChevronUp className="h-3.5 w-3.5 text-zinc-400" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              )}
            </div>

            {showDeleteControls && (
              <div className="mt-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={deleteHead}
                    disabled={nodes.length === 0}
                    className="rounded-lg border border-zinc-200 bg-white py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    Delete Head
                  </button>
                  <button
                    onClick={deleteTail}
                    disabled={nodes.length === 0}
                    className="rounded-lg border border-zinc-200 bg-white py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    Delete Tail
                  </button>
                </div>
                <button
                  onClick={handleDeleteValue}
                  disabled={nodes.length === 0}
                  className="w-full rounded-lg border border-zinc-200 bg-white py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-rose-400"
                >
                  Delete Node with Value [{inputValue}]
                </button>
              </div>
            )}
          </div>

          {/* Card: Search / Traversal (Collapsible) */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23]">
            <div
              onClick={() => setShowSearchControls(!showSearchControls)}
              className="flex cursor-pointer items-center justify-between"
            >
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5 text-blue-500" />
                <span>Search & Traversal</span>
              </h3>
              {showSearchControls ? (
                <ChevronUp className="h-3.5 w-3.5 text-zinc-400" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              )}
            </div>

            {showSearchControls && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Search node value..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="flex-1 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-900 focus:border-violet-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                  <button
                    onClick={handleSearch}
                    className="rounded-md bg-zinc-900 px-3 py-1 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
                  >
                    Find
                  </button>
                </div>
                {searchFeedback && (
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 bg-zinc-50 p-2 rounded dark:bg-zinc-850">
                    {searchFeedback}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Card: Conceptual Guidance & Hints (Collapsible) */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23]">
            <div
              onClick={() => setShowGuidance(!showGuidance)}
              className="flex cursor-pointer items-center justify-between"
            >
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-violet-600" />
                <span>Step Guidance & Invariant Hint</span>
              </h3>
              {showGuidance ? (
                <ChevronUp className="h-3.5 w-3.5 text-zinc-400" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              )}
            </div>

            {showGuidance && (
              <div className="mt-3 space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
                <p className="bg-violet-50/50 p-2.5 rounded-lg border border-violet-100 dark:border-violet-900/40 dark:bg-violet-950/20 text-[11px] leading-relaxed">
                  <strong>Hint:</strong> {selectedObjective.hint}
                </p>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">Objective Invariant:</span>{' '}
                  {selectedObjective.requirements.join(' · ')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Objective Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-[#1a1c23]">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Create Custom Target Sequence
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Enter comma-separated node values. The verification engine will check your list against this target.
            </p>
            <div className="mt-4">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Node Sequence
              </label>
              <input
                type="text"
                value={customInputString}
                onChange={(e) => setCustomInputString(e.target.value)}
                placeholder="e.g. 10, 20, 30, 40"
                className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-mono font-medium text-zinc-900 focus:border-violet-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustomObjective}
                className="rounded-md bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700"
              >
                Set Objective
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
