/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/DashboardView';
import { LinkedListVisualizerView } from './components/LinkedListVisualizerView';
import { SubjectsCurriculumView } from './components/SubjectsCurriculumView';
import { ChallengeLabView } from './components/ChallengeLabView';
import { AIMentorView } from './components/AIMentorView';
import { PortfolioView } from './components/PortfolioView';
import { DiagnosticAssessmentView } from './components/DiagnosticAssessmentView';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-zinc-900 transition-colors duration-150 dark:bg-[#121316] dark:text-zinc-100 flex flex-col antialiased">
      {/* Fixed Vertical Sidebar on Desktop (240px wide) + Collapsible Drawer on Mobile */}
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      {/* Main Content Area: Offset by 240px (md:pl-60) to stay right of the fixed sidebar */}
      <div className="flex flex-1 flex-col md:pl-60 min-w-0">
        {/* Compact Top Header */}
        <TopHeader onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Scrollable Page Viewport */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'diagnostic' && <DiagnosticAssessmentView />}
          {activeTab === 'subjects' && <SubjectsCurriculumView />}
          {activeTab === 'visualizer' && <LinkedListVisualizerView />}
          {activeTab === 'challenges' && <ChallengeLabView />}
          {activeTab === 'mentor' && <AIMentorView />}
          {activeTab === 'portfolio' && <PortfolioView />}
        </main>

        {/* Quiet Subdued Footer */}
        <footer className="mt-auto border-t border-zinc-200 bg-white py-5 text-xs text-zinc-500 transition-colors dark:border-zinc-800 dark:bg-[#15171e] dark:text-zinc-400">
          <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">Mindrift</span>
              <span>·</span>
              <span>Learn It. Play It. Prove It.</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline text-zinc-400">Local Strict Invariant Engine</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <button
                onClick={() => setActiveTab('visualizer')}
                className="hover:text-zinc-800 dark:hover:text-zinc-200"
              >
                Visualizer
              </button>
              <button
                onClick={() => setActiveTab('challenges')}
                className="hover:text-zinc-800 dark:hover:text-zinc-200"
              >
                Challenge Lab
              </button>
              <button
                onClick={() => setActiveTab('mentor')}
                className="hover:text-zinc-800 dark:hover:text-zinc-200"
              >
                AI Mentor
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className="hover:text-zinc-800 dark:hover:text-zinc-200"
              >
                Portfolio
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </ThemeProvider>
  );
}
