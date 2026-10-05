import React from 'react';
import { 
  Play, 
  ArrowRight, 
  CandlestickChart, 
  LineChart, 
  Layers, 
  BookOpen, 
  FileText, 
  ShieldCheck, 
  Trophy, 
  Flame, 
  Sparkles,
  TrendingUp,
  Clock,
  Compass,
  CheckCircle2,
  Lock,
  Download,
  Calculator,
  Globe
} from 'lucide-react';
import { CourseLevelInfo, Lesson, UserProfileState } from '../types';
import { COURSE_LEVELS, ALL_LESSONS } from '../data/coursesData';
import { generateCourseCheatsheetPDF } from '../utils/pdfGenerator';

interface Props {
  profile: UserProfileState;
  onSelectLevel: (level: number) => void;
  onOpenLesson: (lesson: Lesson) => void;
  onNavigateTab: (tab: 'learn' | 'forex' | 'candlestick' | 'charts' | 'simulator' | 'tools') => void;
  onOpenJournal: () => void;
  onOpenPdfLibrary: () => void;
  onOpenForexHub?: () => void;
}

export const HomeView: React.FC<Props> = ({
  profile,
  onSelectLevel,
  onOpenLesson,
  onNavigateTab,
  onOpenJournal,
  onOpenPdfLibrary,
  onOpenForexHub,
}) => {
  // Compute overall progress
  const totalLessons = ALL_LESSONS.length;
  const completedCount = Object.values(profile.progress).filter((p) => p.completed).length;
  const overallProgressPercent = Math.round((completedCount / totalLessons) * 100);

  // Find next uncompleted lesson to "Continue Course"
  const nextLesson = ALL_LESSONS.find((l) => !profile.progress[l.id]?.completed) || ALL_LESSONS[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-emerald-400 text-xs font-bold mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Official Educational Platform</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            TradeMaster India
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium mt-1 italic">
            “Learn. Practice. Understand. Trade Responsibly.”
          </p>

          <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
            From absolute beginner to institutional chart reading. Master Indian Equities (NSE/BSE), permitted Forex, and Crypto through structured interactive lessons, risk math, and virtual paper trading.
          </p>

          {/* Quick Action Navigation Grid requested by prompt */}
          <div className="flex flex-wrap items-center gap-2.5 mt-6">
            <button
              onClick={() => onOpenLesson(nextLesson)}
              className="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
            >
              <Play size={14} className="fill-slate-950" />
              <span>{completedCount > 0 ? 'Continue Course' : 'Start Learning'}</span>
            </button>

            <button
              onClick={() => onNavigateTab('candlestick')}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700/80 transition-all flex items-center gap-1.5"
            >
              <CandlestickChart size={14} className="text-amber-400" />
              <span>Candlestick School</span>
            </button>

            <button
              onClick={() => onNavigateTab('charts')}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700/80 transition-all flex items-center gap-1.5"
            >
              <LineChart size={14} className="text-indigo-400" />
              <span>Chart Reading</span>
            </button>

            <button
              onClick={() => onNavigateTab('simulator')}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700/80 transition-all flex items-center gap-1.5"
            >
              <Layers size={14} className="text-emerald-400" />
              <span>Practice Simulator</span>
            </button>

            <button
              onClick={() => onNavigateTab('tools')}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700/80 transition-all flex items-center gap-1.5"
            >
              <Calculator size={14} className="text-emerald-400" />
              <span>Risk Calculator</span>
            </button>

            <button
              onClick={() => {
                if (onOpenForexHub) {
                  onOpenForexHub();
                } else {
                  onNavigateTab('forex');
                }
              }}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700/80 transition-all flex items-center gap-1.5"
            >
              <Globe size={14} className="text-amber-400" />
              <span>Forex Learning & Vantage</span>
            </button>

            <button
              onClick={onOpenJournal}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700/80 transition-all flex items-center gap-1.5"
            >
              <BookOpen size={14} className="text-pink-400" />
              <span>Trading Journal</span>
            </button>

            <button
              onClick={onOpenPdfLibrary}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700/80 transition-all flex items-center gap-1.5"
            >
              <FileText size={14} className="text-cyan-400" />
              <span>PDF Library</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Learning Progress & Milestone Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-slate-100 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-amber-400" />
            <h3 className="font-extrabold text-sm text-white">Your Academy Journey</h3>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">
            {completedCount} of {totalLessons} Lessons Completed ({overallProgressPercent}%)
          </span>
        </div>

        {/* Big Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-800 overflow-hidden mb-4">
          <div
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 h-full rounded-full transition-all duration-500 shadow"
            style={{ width: `${Math.max(4, overallProgressPercent)}%` }}
          />
        </div>

        {/* Daily Streak & Master Cheatsheet Download */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Flame size={18} className="fill-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">{profile.streakDays} Day Learning Streak</p>
                <p className="text-[10px] text-slate-400">Study daily to unlock the Mindful Trader badge</p>
              </div>
            </div>
          </div>

          <div
            onClick={generateCourseCheatsheetPDF}
            className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between hover:border-indigo-500/50 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20">
                <Download size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Master Course Cheatsheet PDF</p>
                <p className="text-[10px] text-slate-400">11-Level rules, formulas & setups</p>
              </div>
            </div>
            <ArrowRight size={14} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
          </div>
        </div>
      </div>

      {/* Featured Level 10 Forex & Vantage Learning Card */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950/80 border border-amber-500/40 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Globe size={15} />
            <span>Level 10 Masterclass & Global Broker Hub</span>
          </div>
          <h3 className="text-lg font-black text-white">
            Forex Trading: Pairs, Pips, Sessions & Vantage Demo
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Master currency crosses, calculate pips & lots, understand RBI / FEMA guidelines, and practice with Vantage global demo trading accounts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
          <button
            onClick={() => {
              if (onOpenForexHub) {
                onOpenForexHub();
              } else {
                onNavigateTab('forex');
              }
            }}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <BookOpen size={14} className="text-amber-400" />
            <span>Forex Lessons</span>
          </button>

          <button
            onClick={() => {
              if (onOpenForexHub) {
                onOpenForexHub();
              } else {
                onNavigateTab('forex');
              }
            }}
            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-amber-500/20"
          >
            <span>Vantage Hub & Calc</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Course Levels Grid (11 Levels) */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="text-base font-black text-white">Course Curriculum (Levels 1 – 11)</h2>
            <p className="text-xs text-slate-400">Systematic learning roadmap from basics to professional execution</p>
          </div>
          <button
            onClick={() => onNavigateTab('learn')}
            className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COURSE_LEVELS.map((lvl) => {
            const levelLessons = ALL_LESSONS.filter((l) => l.level === lvl.level);
            const levelCompleted = levelLessons.filter((l) => profile.progress[l.id]?.completed).length;
            const levelPercent = levelLessons.length > 0 ? Math.round((levelCompleted / levelLessons.length) * 100) : 0;
            const isFinished = levelPercent === 100;

            return (
              <div
                key={lvl.level}
                onClick={() => {
                  if (lvl.level === 10) {
                    if (onOpenForexHub) onOpenForexHub();
                    else onNavigateTab('forex');
                  } else {
                    onSelectLevel(lvl.level);
                  }
                }}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-xl group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      LEVEL {lvl.level}
                    </span>
                    <span className="text-lg">{lvl.badgeIcon}</span>
                  </div>

                  <h3 className="font-extrabold text-base text-white group-hover:text-emerald-400 transition-colors">
                    {lvl.title}
                  </h3>
                  <p className="text-xs text-indigo-300 font-medium mt-0.5">{lvl.subtitle}</p>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {lvl.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] mb-1.5 font-medium">
                    <span className="text-slate-400">{lvl.totalLessons} Lessons</span>
                    <span className={isFinished ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                      {levelPercent}% Completed
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${levelPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
