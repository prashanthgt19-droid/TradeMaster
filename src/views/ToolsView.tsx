import React, { useState } from 'react';
import { 
  Calculator, 
  BookOpen, 
  Brain, 
  FileText, 
  Download, 
  CheckCircle2, 
  ShieldAlert, 
  Flame, 
  Award, 
  ShieldCheck, 
  Receipt,
  Globe
} from 'lucide-react';
import { RiskPositionCalculator } from '../components/RiskPositionCalculator';
import { PositionSizeCalculator } from '../components/PositionSizeCalculator';
import { ForexLearningHub } from '../components/ForexLearningHub';
import { TradingJournalModal } from '../components/TradingJournalModal';
import { JournalEntry, Lesson, UserProfileState } from '../types';
import { ALL_LESSONS, COURSE_LEVELS } from '../data/coursesData';
import { CANDLESTICK_PATTERNS } from '../data/candlestickData';
import { generateLessonPDF, generateCourseCheatsheetPDF, generateAllCandlesticksPDF } from '../utils/pdfGenerator';
import { AdMobModal } from '../components/AdMobModal';

interface Props {
  profile: UserProfileState;
  journalEntries: JournalEntry[];
  onAddJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  onDeleteJournalEntry: (id: string) => void;
  onOpenLesson?: (lesson: Lesson) => void;
  initialTab?: 'riskPosition' | 'brokerageTaxes' | 'forexVantage' | 'journal' | 'psychology' | 'pdfLibrary';
}

export const ToolsView: React.FC<Props> = ({
  profile,
  journalEntries,
  onAddJournalEntry,
  onDeleteJournalEntry,
  onOpenLesson,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<'riskPosition' | 'brokerageTaxes' | 'forexVantage' | 'journal' | 'psychology' | 'pdfLibrary'>(initialTab || 'riskPosition');
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [isAdUnlocked, setIsAdUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('tm_candlestick_all_pdf_unlocked') === 'true';
  });

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Psychology Daily Checklist state
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    planDefined: false,
    maxLossSet: false,
    emotionalCalm: true,
    noFomo: false,
    stopLossReady: false,
  });

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecked = Object.values(checklist).every(Boolean);

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header & Section Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">Trader's Toolkit & Calculators</h1>
          <p className="text-xs text-slate-400">Position Sizing, NSE Brokerage & Taxes, Journal, Psychology & Study Vault</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs font-bold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('riskPosition')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'riskPosition' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck size={14} className={activeTab === 'riskPosition' ? 'text-emerald-400' : 'text-slate-400'} />
            <span>Risk / Position Size</span>
          </button>
          <button
            onClick={() => setActiveTab('brokerageTaxes')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'brokerageTaxes' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Receipt size={14} className={activeTab === 'brokerageTaxes' ? 'text-amber-400' : 'text-slate-400'} />
            <span>NSE Brokerage & STT</span>
          </button>
          <button
            onClick={() => setActiveTab('forexVantage')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'forexVantage' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe size={14} className={activeTab === 'forexVantage' ? 'text-amber-400' : 'text-slate-400'} />
            <span>Forex & Vantage Hub</span>
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'journal' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen size={14} />
            <span>Journal ({journalEntries.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('psychology')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'psychology' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Brain size={14} />
            <span>Psychology</span>
          </button>
          <button
            onClick={() => setActiveTab('pdfLibrary')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'pdfLibrary' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText size={14} />
            <span>PDF Library</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Standalone Risk / Position Calculator (Level 8) */}
      {activeTab === 'riskPosition' && (
        <RiskPositionCalculator />
      )}

      {/* Tab 2: Brokerage & Taxes Calculator */}
      {activeTab === 'brokerageTaxes' && (
        <PositionSizeCalculator />
      )}

      {/* Tab 3: Forex Learning & Vantage Hub */}
      {activeTab === 'forexVantage' && (
        <ForexLearningHub
          profile={profile}
          onOpenLesson={(lesson) => {
            if (onOpenLesson) onOpenLesson(lesson);
          }}
        />
      )}

      {/* Tab 2: Journal Overview */}
      {activeTab === 'journal' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-white">Your Simulated Trading Journal</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Total Logged Trades: <strong>{journalEntries.length}</strong>
              </p>
            </div>
            <button
              onClick={() => setShowJournalModal(true)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow"
            >
              Open Full Journal & Analytics
            </button>
          </div>

          {/* Quick list of recent journal entries */}
          <div className="space-y-2.5">
            {journalEntries.slice(0, 5).map((entry) => {
              const isProfit = (entry.pnl || 0) >= 0;
              return (
                <div
                  key={entry.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-sm">{entry.symbol}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{entry.date}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                        {entry.emotion}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Strategy: <span className="text-indigo-300">{entry.strategy}</span>
                    </p>
                  </div>
                  <span className={`font-mono font-bold text-base ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isProfit ? '+' : ''}₹{entry.pnl?.toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>

          {showJournalModal && (
            <TradingJournalModal
              entries={journalEntries}
              onAddEntry={onAddJournalEntry}
              onDeleteEntry={onDeleteJournalEntry}
              onClose={() => setShowJournalModal(false)}
            />
          )}
        </div>
      )}

      {/* Tab 3: Trading Psychology Checklist */}
      {activeTab === 'psychology' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Brain size={16} />
              <span>Pre-Session Mental Discipline</span>
            </div>
            <h2 className="text-xl font-black text-white">Daily Trader's Emotional Checklist</h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Complete these 5 affirmations before opening any charting terminal or executing any trade.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { key: 'planDefined', title: '1. I have an objective setup with predetermined entry, target, and stop loss.' },
              { key: 'maxLossSet', title: '2. I will risk no more than 1% of my account capital on this setup.' },
              { key: 'stopLossReady', title: '3. I accept that taking a loss is normal and I will not hesitate to exit if stopped out.' },
              { key: 'noFomo', title: '4. I will not chase moving candles out of FOMO. If I miss a trade, another will appear.' },
              { key: 'emotionalCalm', title: '5. I am calm, sober, and free of the urge to seek revenge on prior losses.' },
            ].map((item) => {
              const isChecked = checklist[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() => toggleCheck(item.key)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 text-xs ${
                    isChecked
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                        : 'border-slate-600'
                    }`}
                  >
                    {isChecked && <CheckCircle2 size={16} className="text-slate-950" />}
                  </div>
                  <span className="leading-relaxed">{item.title}</span>
                </div>
              );
            })}
          </div>

          {allChecked ? (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2.5">
              <CheckCircle2 size={18} />
              <span>You have completed your psychological preparation. Trade with discipline and protect your capital.</span>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <ShieldAlert size={16} />
              <span>Check all 5 items to verify that your mindset is aligned for disciplined execution.</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: PDF Library */}
      {activeTab === 'pdfLibrary' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-white">Downloadable PDF Study Library</h2>
              <p className="text-xs text-slate-400">Official vector PDF revision sheets with charts, quizzes & summaries</p>
            </div>

            <button
              onClick={generateCourseCheatsheetPDF}
              className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 flex items-center gap-2 transition-all shadow"
            >
              <Download size={14} />
              <span>Download Master Cheatsheet PDF</span>
            </button>
          </div>

          {/* Master Candlestick Bible (All Formations in 1 Single PDF) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-950 to-indigo-950/40 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-extrabold text-white text-xs sm:text-sm">All Candlestick Formations Master Bible</p>
                  <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {CANDLESTICK_PATTERNS.length} Formations
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Complete single PDF handbook with vector diagrams, rules & summary cheatsheet</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (isAdUnlocked) {
                  generateAllCandlesticksPDF(CANDLESTICK_PATTERNS);
                } else {
                  setShowAdModal(true);
                }
              }}
              className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 flex items-center gap-1.5 transition-all shadow shrink-0"
            >
              <Download size={14} />
              <span>{isAdUnlocked ? 'Download Formations PDF' : 'Watch Ad & Download'}</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {ALL_LESSONS.map((lesson) => {
              const isCompleted = profile.progress[lesson.id]?.completed;
              return (
                <div
                  key={lesson.id}
                  className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-indigo-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white">{lesson.title}</p>
                      <p className="text-[10px] text-slate-400">Level {lesson.level} • {lesson.category}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => generateLessonPDF(lesson)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <Download size={13} />
                    <span>PDF</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rewarded Ad Modal for Full Candlestick Bible PDF */}
      {showAdModal && (
        <AdMobModal
          rewardTitle="Unlock & Download All Candlestick Formations Master Bible (Single PDF)"
          onRewardEarned={() => {
            setIsAdUnlocked(true);
            localStorage.setItem('tm_candlestick_all_pdf_unlocked', 'true');
            setShowAdModal(false);
            generateAllCandlesticksPDF(CANDLESTICK_PATTERNS);
          }}
          onClose={() => setShowAdModal(false)}
        />
      )}
    </div>
  );
};
