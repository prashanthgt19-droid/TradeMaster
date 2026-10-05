import React from 'react';
import { Trophy, CheckCircle2, Lock, X, Flame } from 'lucide-react';
import { UserProfileState } from '../types';
import { COURSE_LEVELS, ALL_LESSONS } from '../data/coursesData';

interface Props {
  profile: UserProfileState;
  onClose: () => void;
}

export const BadgesModal: React.FC<Props> = ({ profile, onClose }) => {
  const totalLessons = ALL_LESSONS.length;
  const completedCount = Object.values(profile.progress).filter((p) => p.completed).length;

  const badges = [
    {
      id: 'badge-1',
      title: 'Beginner Trader',
      icon: '🌱',
      description: 'Completed Level 1: Market Fundamentals & Order Types',
      unlocked: ALL_LESSONS.filter((l) => l.level === 1).every((l) => profile.progress[l.id]?.completed),
    },
    {
      id: 'badge-2',
      title: 'Candlestick Student',
      icon: '🕯️',
      description: 'Completed Level 2: Candlestick Anatomy & Reversal Patterns',
      unlocked: ALL_LESSONS.filter((l) => l.level === 2).every((l) => profile.progress[l.id]?.completed),
    },
    {
      id: 'badge-3',
      title: 'Chart Reader',
      icon: '📈',
      description: 'Completed Level 3: Support, Resistance & Trend Structure',
      unlocked: ALL_LESSONS.filter((l) => l.level === 3).every((l) => profile.progress[l.id]?.completed),
    },
    {
      id: 'badge-4',
      title: 'Indicator Master',
      icon: '📊',
      description: 'Completed Level 4: Moving Averages, RSI, MACD & Bollinger Bands',
      unlocked: ALL_LESSONS.filter((l) => l.level === 4).every((l) => profile.progress[l.id]?.completed),
    },
    {
      id: 'badge-5',
      title: 'Risk Manager',
      icon: '🛡️',
      description: 'Completed Level 8: The 1% Rule & Position Sizing Mastery',
      unlocked: ALL_LESSONS.filter((l) => l.level === 8).every((l) => profile.progress[l.id]?.completed),
    },
    {
      id: 'badge-6',
      title: 'Mindful Trader',
      icon: '🧠',
      description: 'Maintained a 3-day learning streak & completed Psychology lesson',
      unlocked: profile.streakDays >= 3 || ALL_LESSONS.filter((l) => l.level === 9).some((l) => profile.progress[l.id]?.completed),
    },
    {
      id: 'badge-7',
      title: 'Advanced Technical Analyst',
      icon: '🎯',
      description: 'Completed at least 8 total curriculum lessons',
      unlocked: completedCount >= 8,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-0.5">
            <Trophy size={16} />
            <span>Trader Honors & Milestones</span>
          </div>
          <h2 className="text-xl font-black text-white">Academy Badges</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Earn badges as you pass lesson quizzes and maintain your daily streak.
          </p>
        </div>

        {/* Badges List */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs transition-all ${
                b.unlocked
                  ? 'bg-amber-950/20 border-amber-500/40'
                  : 'bg-slate-950 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 border ${
                    b.unlocked
                      ? 'bg-amber-500/20 border-amber-500/50 shadow-md shadow-amber-500/10'
                      : 'bg-slate-800 border-slate-700'
                  }`}
                >
                  {b.icon}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <span>{b.title}</span>
                    {b.unlocked && (
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    )}
                  </h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">{b.description}</p>
                </div>
              </div>

              <div className="shrink-0 font-bold">
                {b.unlocked ? (
                  <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30">
                    Earned
                  </span>
                ) : (
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                    <Lock size={12} />
                    <span>Locked</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
