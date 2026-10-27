import React, { useState } from 'react';
import {
  LayoutDashboard,
  Brain,
  BookOpen,
  Play,
  CheckCircle2,
  Bot,
  Award,
  Sun,
  Moon,
  Settings,
  X,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { activeTab, setActiveTab, learnerProfile } = useApp();
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [animSpeed, setAnimSpeed] = useState<string>('normal');

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'diagnostic', label: 'Diagnostic Test', icon: Brain },
    { id: 'subjects', label: 'My Learning', icon: BookOpen },
    { id: 'challenges', label: 'Practice Challenges', icon: CheckCircle2 },
    { id: 'visualizer', label: 'Visualizer', icon: Play },
    { id: 'mentor', label: 'AI Mentor', icon: Bot },
    { id: 'portfolio', label: 'My Portfolio', icon: Award },
  ];

  const handleNavClick = (id: ActiveTab) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white text-zinc-900 transition-colors duration-150 dark:bg-[#15171e] dark:text-zinc-100">
      {/* Top Brand Block */}
      <div>
        <div className="flex items-center justify-between px-5 pt-6 pb-5 border-b border-zinc-100 dark:border-zinc-800/80">
          <button
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white shadow-xs group-hover:bg-violet-700 transition-colors">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                Mindrift
              </span>
              <span className="block text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                Learn It. Play It. Prove It.
              </span>
            </div>
          </button>

          {/* Close button on mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Primary Navigation */}
        <div className="px-3 py-4">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Learning Journey
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-violet-50 text-violet-900 font-semibold shadow-2xs dark:bg-violet-950/40 dark:text-violet-200'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive
                          ? 'text-violet-600 dark:text-violet-400'
                          : 'text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <div className="h-1.5 w-1.5 rounded-full bg-violet-600 dark:bg-violet-400" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Section: Real User Profile & Dark/Light Switch */}
      <div className="border-t border-zinc-100 p-3 dark:border-zinc-800/80 space-y-2">
        {/* User Profile Card with Real XP and Level */}
        <div className="flex items-center justify-between rounded-lg bg-zinc-50/80 p-2.5 dark:bg-zinc-800/50">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-semibold text-xs shadow-xs">
              {learnerProfile.name[0] || 'L'}
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-zinc-900" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                {learnerProfile.name}
              </div>
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                Level {learnerProfile.level} · {learnerProfile.xp} XP
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowSettingsModal(true)}
            title="Learning Settings"
            className="rounded p-1.5 text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-700 dark:hover:bg-zinc-700/60 dark:hover:text-zinc-200"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700/80 dark:bg-zinc-850 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          <div className="flex items-center gap-2">
            {theme === 'light' ? (
              <>
                <Moon className="h-3.5 w-3.5 text-zinc-500" />
                <span>Dark Theme</span>
              </>
            ) : (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                <span>Light Theme</span>
              </>
            )}
          </div>
          <span className="text-[10px] uppercase font-mono text-zinc-400">
            {theme === 'light' ? 'OFF' : 'ON'}
          </span>
        </button>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-[#1a1c23]">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Sliders className="h-4 w-4 text-violet-600" />
                <span>Platform Preferences</span>
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-zinc-700 dark:text-zinc-300">
                  Visualizer Animation Pace
                </label>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {['normal', 'fast', 'instant'].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setAnimSpeed(spd)}
                      className={`rounded-md border py-1.5 text-center capitalize text-xs ${
                        animSpeed === spd
                          ? 'border-violet-600 bg-violet-50 font-semibold text-violet-700 dark:border-violet-500 dark:bg-violet-950/50 dark:text-violet-300'
                          : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {spd}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-3 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-700 dark:text-zinc-300">Theme</span>
                  <button
                    onClick={toggleTheme}
                    className="rounded bg-zinc-100 px-2.5 py-1 font-medium capitalize text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    {theme} Mode
                  </button>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-3 dark:border-zinc-800">
                <div className="text-[11px] text-zinc-500">
                  Learning Model: <strong className="text-violet-600">Diagnose → Identify → Practice → Verify</strong>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="rounded-md bg-violet-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-violet-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-30 md:flex md:w-60 md:flex-col border-r border-zinc-200 dark:border-zinc-800">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-200 ease-in-out md:hidden dark:bg-[#15171e] ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
