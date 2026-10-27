import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, Lightbulb, Play, RotateCcw, Copy, Check, Terminal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';

export const AIMentorView: React.FC = () => {
  const { setActiveTab, selectedObjective, nodes } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'mentor',
      text: `Hello Harshita! I am your Mindrift Socratic Computer Science Mentor. I can help guide your thinking on pointer mechanics, memory layouts, time complexities, and debugging your linked list visualizer and challenge objectives. What would you like to explore?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const suggestedPrompts = [
    'How do I safely insert a node into the middle of a list without memory leaks?',
    'Why is inserting at HEAD O(1) but TAIL is O(N) without a tail pointer?',
    "Explain the invariant checks in 'Verify Current List Match Objectives'.",
    'How does Floyd’s cycle detection (tortoise and hare) work?',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      let codeSnippet: string | undefined;

      const lower = text.toLowerCase();
      if (lower.includes('middle') || lower.includes('insert')) {
        reply = `To safely splice a node into the middle of a Singly Linked List without losing reference to the rest of the chain, follow the Two-Step Handshake rule:
        
1. Step 1: Set the new node's \`next\` pointer to the predecessor's \`next\` target:
\`new_node.next = prev_node.next;\`

2. Step 2: Point the predecessor to your new node:
\`prev_node.next = new_node;\`

If you mistakenly execute Step 2 first, you overwrite \`prev_node.next\` before preserving the target, permanently orphaning all succeeding nodes in memory!`;
        codeSnippet = `// The safe two-step handshake:
new_node.next = prev.next; // Step 1: Link new node to forward chain
prev.next = new_node;      // Step 2: Reroute predecessor pointer to new node`;
      } else if (lower.includes('head') || lower.includes('tail') || lower.includes('o(1)')) {
        reply = `Great inquiry on Big-O computational bounds!

• Inserting at HEAD: O(1) constant time. You already have a direct pointer reference to HEAD. You assign \`new_node.next = HEAD\`, then update \`HEAD = new_node\`. No iteration is required!

• Inserting at TAIL (without dedicated tail pointer): O(N) linear time. Because each node only knows the address of its immediate successor, you must start at HEAD and traverse node-by-node until \`current.next === NULL\`. That requires traversing all N nodes!`;
      } else if (lower.includes('verify') || lower.includes('objective') || lower.includes('invariant')) {
        reply = `The 'Verify Current List Match Objectives' engine runs local invariant checks against your current canvas. Currently, your sandbox has ${nodes.length} nodes ([${nodes.map((n) => n.value).join(', ')}]) targeted at objective '${selectedObjective.title}'.

The verifier asserts:
1. Exact sequence matching: Checks node[i].value === target[i].
2. Length constraints: Asserts count satisfies exact or min/max requirements.
3. Duplication policy: Ensures no illegal duplicate values exist.
4. Ordering: Ensures required sorting (ascending or descending) is maintained.
5. Pointer integrity: Ensures HEAD is non-null when expected and terminated properly at NULL.`;
      } else if (lower.includes('cycle') || lower.includes('floyd') || lower.includes('tortoise')) {
        reply = `Floyd's Cycle-Finding Algorithm (Tortoise and Hare) uses two pointers moving at different speeds:
- \`slow\` advances by 1 node per iteration.
- \`fast\` advances by 2 nodes per iteration.

If a loop exists, \`fast\` will eventually lap and meet \`slow\` inside the cycle. If \`fast\` reaches NULL, no cycle exists.
Time Complexity: O(N), Auxiliary Space: O(1).`;
      } else {
        reply = `That is an insightful question! In linked structures, the golden rule is: always establish the outgoing connection of the new pointer before severing existing reference links.

Your current visualizer list has [${nodes.map((n) => n.value).join(' → ')}]. You can test any operation interactively in the Visualizer tab, or verify algorithmic edge cases in the Challenge Lab!`;
      }

      const mentorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'mentor',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        codeSnippet,
      };

      setMessages((prev) => [...prev, mentorMsg]);
      setIsTyping(false);
    }, 350);
  };

  const handleCopyCode = (snippet: string, id: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
            <Bot className="h-3.5 w-3.5" />
            <span>Interactive Learning Assistant</span>
            <span className="text-zinc-400">·</span>
            <span className="rounded bg-violet-100 px-1.5 py-0.2 text-[10px] font-mono text-violet-800 dark:bg-violet-950 dark:text-violet-300">
              Local Socratic Reasoning Engine
            </span>
          </div>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            AI Computer Science Mentor
          </h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Trained on pointer mechanics, memory layouts, invariants, and algorithm optimization.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('visualizer')}
          className="flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-violet-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-violet-700"
        >
          <Play className="h-3 w-3 fill-white" />
          <span>Test in Visualizer</span>
        </button>
      </div>

      {/* Main Chat Container */}
      <div className="flex flex-col h-[580px] rounded-xl border border-zinc-200 bg-white shadow-2xs dark:border-zinc-800 dark:bg-[#1a1c23]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isUser
                      ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900'
                      : 'bg-violet-600 text-white'
                  }`}
                >
                  {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>

                <div
                  className={`max-w-[82%] rounded-xl p-3.5 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                      : 'border border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {msg.codeSnippet && (
                    <div className="relative mt-2.5 rounded-lg bg-zinc-900 p-3 font-mono text-[11px] text-zinc-100 dark:bg-zinc-950">
                      <button
                        onClick={() => handleCopyCode(msg.codeSnippet!, msg.id)}
                        className="absolute top-2 right-2 flex items-center gap-1 rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-300 hover:bg-zinc-700"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="h-2.5 w-2.5 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-2.5 w-2.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                      <pre className="overflow-x-auto">{msg.codeSnippet}</pre>
                    </div>
                  )}

                  <div
                    className={`mt-1.5 text-[10px] ${
                      isUser ? 'text-zinc-400 dark:text-zinc-500 text-right' : 'text-zinc-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-zinc-400 pl-10">
              <Sparkles className="h-3.5 w-3.5 animate-spin text-violet-500" />
              <span>Mentor is analyzing invariants...</span>
            </div>
          )}
        </div>

        {/* Suggested Questions Strip */}
        <div className="border-t border-zinc-100 bg-zinc-50/50 p-2.5 dark:border-zinc-800 dark:bg-zinc-800/30">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-semibold text-zinc-400 shrink-0 flex items-center gap-1 pl-1">
              <Lightbulb className="h-3 w-3 text-amber-500" /> Suggested:
            </span>
            {suggestedPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] text-zinc-700 hover:border-violet-300 hover:text-violet-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-violet-600 whitespace-nowrap shrink-0"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="border-t border-zinc-200 p-3 sm:p-4 dark:border-zinc-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about node pointers, edge cases, time complexity, or debugging your list..."
              className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:border-violet-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-violet-700 disabled:opacity-40"
            >
              <span>Send</span>
              <Send className="h-3 w-3" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
