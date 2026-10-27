import React, { useState } from 'react';
import { Menu, Search, Bell, Sparkles, CheckCircle2, ChevronRight, X, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';

interface TopHeaderProps {
  onMenuClick: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onMenuClick }) => {
  const { activeTab, setActiveTab, proofRecords, selectedObjective } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const getBreadcrumbs = () => {
    switch (activeTab) {
      case 'dashboard':
        return ['Mindrift', 'Dashboard'];
      case 'diagnostic':
        return ['Mindrift', 'Diagnostic Assessment', 'Diagnose & Identify'];
      case 'subjects':
        return ['Mindrift', 'My Learning', 'Curriculum'];
      case 'visualizer':
        return ['Mindrift', 'Visualizer', 'Singly Linked List'];
      case 'challenges':
        return ['Mindrift', 'Challenges', 'Algorithmic Problem Lab'];
      case 'mentor':
        return ['Mindrift', 'AI Mentor', 'Socratic Tutor'];
      case 'portfolio':
        return ['Mindrift', 'My Portfolio', 'Verified Proofs'];
      default:
        return ['Mindrift', 'Dashboard'];
    }
  };

  const breadcrumbs = getBreadcrumbs();

  const searchableItems = [
    { label: 'Singly Linked List Visualizer', tab: 'visualizer' as ActiveTab, desc: 'Interactive pointer operations' },
    { label: 'Middle Node Challenge', tab: 'challenges' as ActiveTab, desc: 'Find middle using fast & slow pointers' },
    { label: 'Reverse Linked List', tab: 'challenges' as ActiveTab, desc: 'In-place pointer reversal' },
    { label: 'Memory References & Big-O', tab: 'subjects' as ActiveTab, desc: 'Heap allocation and pointer costs' },
    { label: 'Ask AI Mentor about Pointers', tab: 'mentor' as ActiveTab, desc: 'Socratic guidance on invariants' },
    { label: 'View Verified Proof Tokens', tab: 'portfolio' as ActiveTab, desc: 'Earned certificates & badges' },
  ];

  const filteredItems = searchQuery.trim()
    ? searchableItems.filter(
        (item) =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-zinc-200 bg-white/95 px-4 sm:px-6 backdrop-blur-md transition-colors dark:border-zinc-800 dark:bg-[#121316]/95">
      {/* Left: Mobile Menu Trigger + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight className="h-3 w-3 text-zinc-300 dark:text-zinc-600" />}
              <span
                className={
                  idx === breadcrumbs.length - 1
                    ? 'font-semibold text-zinc-900 dark:text-zinc-100'
                    : 'hidden sm:inline hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer'
                }
                onClick={() => {
                  if (idx === 0) setActiveTab('dashboard');
                }}
              >
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Quick Search + Notifications + User Avatar */}
      <div className="flex items-center gap-2.5">
        {/* Functional Search Bar */}
        <div className="relative">
          <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-700 focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500 dark:border-zinc-700/80 dark:bg-zinc-850 dark:text-zinc-300">
            <Search className="h-3.5 w-3.5 text-zinc-400 mr-1.5 shrink-0" />
            <input
              type="text"
              placeholder="Search concepts, lab..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="w-28 sm:w-44 bg-transparent outline-none placeholder:text-zinc-400 text-xs"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchDropdown(false);
                }}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {showSearchDropdown && filteredItems.length > 0 && (
            <div className="absolute right-0 mt-1 w-64 sm:w-72 rounded-lg border border-zinc-200 bg-white p-1.5 shadow-lg dark:border-zinc-800 dark:bg-[#1a1c23] z-50">
              <div className="px-2 py-1 text-[10px] uppercase font-semibold text-zinc-400">
                Matching Modules
              </div>
              <div className="space-y-0.5">
                {filteredItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveTab(item.tab);
                      setShowSearchDropdown(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left rounded-md px-2.5 py-1.5 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                  >
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">{item.label}</div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg border border-zinc-200 bg-white p-1.5 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700/80 dark:bg-zinc-850 dark:text-zinc-300 dark:hover:bg-zinc-800"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-violet-600 ring-2 ring-white dark:ring-zinc-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl border border-zinc-200 bg-white p-3 shadow-xl dark:border-zinc-800 dark:bg-[#1a1c23] z-50">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  Learning Notifications
                </span>
                <span className="text-[10px] text-violet-600 dark:text-violet-400 font-medium">
                  {proofRecords.length} Verified
                </span>
              </div>

              <div className="mt-2 space-y-2 text-xs">
                <div className="rounded-md bg-violet-50/70 p-2 text-violet-950 dark:bg-violet-950/40 dark:text-violet-200">
                  <div className="font-semibold flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-violet-600" />
                    <span>Daily Streak Active (5 Days)</span>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300 mt-0.5">
                    Target today's challenge: {selectedObjective.title}.
                  </p>
                </div>

                <div className="rounded-md bg-zinc-50 p-2 dark:bg-zinc-800/60">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                    <Award className="h-3 w-3 text-emerald-500" />
                    <span>Recent Token Generated</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {proofRecords[0]?.title ?? 'Local verification engine active.'}
                  </p>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-center">
                <button
                  onClick={() => {
                    setActiveTab('portfolio');
                    setShowNotifications(false);
                  }}
                  className="text-[11px] font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400"
                >
                  View All Portfolio Proofs →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div
          onClick={() => setActiveTab('portfolio')}
          className="flex cursor-pointer items-center gap-2 rounded-lg pl-1 text-xs"
          title="View profile and portfolio"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 font-semibold text-white text-xs">
            H
          </div>
        </div>
      </div>
    </header>
  );
};
