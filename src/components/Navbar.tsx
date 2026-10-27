import React from 'react';
import { Sun, Moon, Play, CheckCircle2, BookOpen, Layers, Bot, Award, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { activeTab, setActiveTab } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'subjects', label: 'Curriculum', icon: BookOpen },
    { id: 'visualizer', label: 'Visualizer', icon: Play },
    { id: 'challenges', label: 'Challenges', icon: CheckCircle2 },
    { id: 'mentor', label: 'AI Mentor', icon: Bot },
    { id: 'portfolio', label: 'Portfolio', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md transition-colors duration-150 dark:border-zinc-800 dark:bg-[#15171e]/95">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand wordmark (single element, no adjacent badges or pill tags) */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-zinc-900 transition-opacity hover:opacity-85 dark:text-zinc-50"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-600 text-white shadow-sm dark:bg-violet-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="whitespace-nowrap">Mindrift</span>
        </button>

        {/* Zone 2: Navigation links (single line, no wrap, subtle hover/active states) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap rounded-md ${
                  isActive
                    ? 'bg-zinc-100 text-violet-700 font-semibold dark:bg-zinc-800 dark:text-violet-300'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/50'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-violet-600 dark:text-violet-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary action + working Light/Dark theme toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Light / Dark Mode Toggle button */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
          >
            {theme === 'light' ? (
              <>
                <Moon className="h-3.5 w-3.5 text-zinc-600" />
                <span className="hidden sm:inline">Dark</span>
              </>
            ) : (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            )}
          </button>

          {/* Primary CTA button */}
          <button
            onClick={() => setActiveTab('visualizer')}
            className="flex items-center gap-1.5 rounded-md bg-violet-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-xs transition-colors hover:bg-violet-700 active:scale-98 dark:bg-violet-600 dark:hover:bg-violet-500 whitespace-nowrap"
          >
            <Play className="h-3 w-3 fill-white" />
            <span>Open Visualizer</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar for smaller viewports */}
      <div className="flex md:hidden overflow-x-auto border-t border-zinc-100 px-4 py-2 gap-1 dark:border-zinc-800/80">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-violet-50 text-violet-700 font-semibold dark:bg-violet-950/60 dark:text-violet-300'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <Icon className="h-3 w-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
