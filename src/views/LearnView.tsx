import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Clock, 
  Play, 
  FileText,
  Filter,
  Globe,
  ArrowRight,
  Video
} from 'lucide-react';
import { Lesson, MarketType, UserProfileState } from '../types';
import { COURSE_LEVELS, ALL_LESSONS } from '../data/coursesData';

interface Props {
  profile: UserProfileState;
  onOpenLesson: (lesson: Lesson) => void;
  selectedLevelFilter?: number | null;
  onClearLevelFilter?: () => void;
  onOpenForexHub?: () => void;
}

export const LearnView: React.FC<Props> = ({
  profile,
  onOpenLesson,
  selectedLevelFilter,
  onClearLevelFilter,
  onOpenForexHub,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [marketFilter, setMarketFilter] = useState<'ALL' | MarketType>('ALL');
  const [activeLevel, setActiveLevel] = useState<number | 'ALL'>(selectedLevelFilter || 'ALL');

  // Synchronize when selectedLevelFilter prop changes
  useEffect(() => {
    if (selectedLevelFilter !== undefined && selectedLevelFilter !== null) {
      setActiveLevel(selectedLevelFilter);
      if (selectedLevelFilter === 10) {
        setMarketFilter('FOREX');
      } else if (selectedLevelFilter === 11) {
        setMarketFilter('CRYPTO');
      } else {
        setMarketFilter('ALL');
      }
    }
  }, [selectedLevelFilter]);

  // Filter lessons safely
  const filteredLessons = ALL_LESSONS.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMarket = marketFilter === 'ALL' || lesson.marketType === marketFilter;
    const matchesLevel = activeLevel === 'ALL' || lesson.level === activeLevel;

    return matchesSearch && matchesMarket && matchesLevel;
  });

  return (
    <div className="space-y-5 pb-16">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">Course Curriculum</h1>
          <p className="text-xs text-slate-400">11 Levels from Beginner to Advanced Institutional Concepts</p>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search lessons, RSI, Forex, Nifty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Forex Highlight Banner when Forex is active or Level 10 selected */}
      {(marketFilter === 'FOREX' || activeLevel === 10) && (
        <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950/80 border border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-lg">
          <div>
            <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase text-[10px]">
              <Globe size={13} />
              <span>Forex Learning & Global Broker Demo Hub</span>
            </div>
            <p className="text-white font-bold text-sm mt-0.5">
              Level 10: Currency Pairs, Pips, Sessions & Vantage Demo Account
            </p>
            <p className="text-slate-300 text-[11px] mt-0.5">
              Learn currency trading rules, use the Pip Calculator, and access the Vantage global demo practice hub.
            </p>
          </div>
          {onOpenForexHub && (
            <button
              onClick={onOpenForexHub}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shrink-0 flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <span>Open Forex & Vantage Hub</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      )}

      {/* Market Type Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => {
            setMarketFilter('ALL');
          }}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
            marketFilter === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Markets
        </button>
        <button
          onClick={() => {
            setMarketFilter('INDIAN_STOCK');
            if (activeLevel === 10) setActiveLevel('ALL');
          }}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
            marketFilter === 'INDIAN_STOCK' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          🇮🇳 Indian Stock (NSE/BSE)
        </button>
        <button
          onClick={() => {
            setMarketFilter('FOREX');
            setActiveLevel('ALL'); // Reset level so all Forex lessons show
          }}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            marketFilter === 'FOREX' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Globe size={13} />
          <span>💱 Forex</span>
        </button>
        <button
          onClick={() => {
            setMarketFilter('CRYPTO');
            if (activeLevel === 10) setActiveLevel('ALL');
          }}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
            marketFilter === 'CRYPTO' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          🪙 Crypto
        </button>
      </div>

      {/* Level Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setActiveLevel('ALL')}
          className={`px-3 py-1 rounded-lg font-bold transition-all shrink-0 ${
            activeLevel === 'ALL' ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          All Levels
        </button>
        {COURSE_LEVELS.map((lvl) => (
          <button
            key={lvl.level}
            onClick={() => {
              setActiveLevel(lvl.level);
              if (lvl.level === 10) {
                setMarketFilter('FOREX');
              } else if (marketFilter === 'FOREX') {
                setMarketFilter('ALL');
              }
            }}
            className={`px-3 py-1 rounded-lg font-bold transition-all shrink-0 flex items-center gap-1 ${
              activeLevel === lvl.level
                ? lvl.level === 10
                  ? 'bg-amber-500 text-slate-950 font-black border border-amber-400'
                  : 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span>{lvl.badgeIcon}</span>
            <span>L{lvl.level}</span>
            {lvl.level === 10 && <span className="text-[10px] uppercase font-bold tracking-tight">(Forex)</span>}
          </button>
        ))}
      </div>

      {/* Lesson List */}
      <div className="space-y-3">
        {filteredLessons.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
            <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-bold text-sm text-white">No lessons match your search criteria</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing filters or search terms</p>
          </div>
        ) : (
          filteredLessons.map((lesson) => {
            const progress = profile.progress[lesson.id];
            const isCompleted = progress?.completed;
            const isRewardUnlocked = progress?.unlockedViaReward;
            const isLocked = lesson.isLocked && !isRewardUnlocked;

            return (
              <div
                key={lesson.id}
                onClick={() => onOpenLesson(lesson)}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 cursor-pointer transition-all hover:bg-slate-800/60 flex items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                      isCompleted
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                        : isLocked
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={20} className="text-emerald-400" />
                    ) : isLocked ? (
                      <Lock size={18} className="text-amber-400" />
                    ) : (
                      <span>{lesson.order}</span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        LEVEL {lesson.level} • {lesson.category}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                        <Video size={10} /> Video
                      </span>
                      {isLocked && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                          <Sparkles size={10} /> Ad Unlock
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors mt-0.5">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {lesson.description}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {lesson.estimatedMinutes} mins
                      </span>
                      <span>•</span>
                      <span>{lesson.quiz.length} Quiz Questions</span>
                      {progress?.quizScore !== undefined && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold font-mono">
                            Quiz Score: {progress.quizScore}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 text-slate-500 group-hover:text-white transition-colors">
                  <span className="text-xs font-bold hidden sm:inline-block">Study</span>
                  <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-emerald-500 group-hover:text-slate-950 flex items-center justify-center transition-all">
                    <Play size={12} className="fill-current ml-0.5" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
