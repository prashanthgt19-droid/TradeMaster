import React, { useState } from 'react';
import { 
  Globe, 
  ExternalLink, 
  ShieldAlert, 
  Calculator, 
  BookOpen, 
  TrendingUp, 
  Copy, 
  Check, 
  Clock, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  HelpCircle,
  Play,
  CheckCircle2,
  FileText,
  Video
} from 'lucide-react';
import { ALL_LESSONS } from '../data/coursesData';
import { Lesson, UserProfileState } from '../types';

interface Props {
  profile: UserProfileState;
  onOpenLesson: (lesson: Lesson) => void;
  initialSubTab?: 'curriculum' | 'vantage' | 'calculator' | 'fema';
}

export const ForexView: React.FC<Props> = ({ 
  profile, 
  onOpenLesson,
  initialSubTab = 'curriculum'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'curriculum' | 'vantage' | 'calculator' | 'fema'>(initialSubTab);
  
  // Vantage Referral Link State
  const [vantageReferralUrl, setVantageReferralUrl] = useState<string>(() => {
    return localStorage.getItem('tm_vantage_referral_url') || 'https://www.vantagemarkets.com/?affid=trademaster_india';
  });
  const [copied, setCopied] = useState(false);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [tempUrl, setTempUrl] = useState(vantageReferralUrl);

  // Forex Pip Calculator State
  const [currencyPair, setCurrencyPair] = useState<'EUR/USD' | 'GBP/USD' | 'USD/JPY' | 'USD/INR' | 'AUD/USD'>('EUR/USD');
  const [lotSize, setLotSize] = useState<number>(0.10); // Mini lot default
  const [customLot, setCustomLot] = useState<string>('0.10');
  const [pipMovement, setPipMovement] = useState<number>(30);

  const forexLessons = ALL_LESSONS.filter((l) => l.level === 10);
  const completedForex = forexLessons.filter((l) => profile.progress[l.id]?.completed).length;
  const progressPercent = Math.round((completedForex / forexLessons.length) * 100);

  // Pip value computation
  const getPipValuePerLot = (pair: string): number => {
    switch (pair) {
      case 'EUR/USD':
      case 'GBP/USD':
      case 'AUD/USD':
        return 10.0; // $10 per pip on 1.0 standard lot
      case 'USD/JPY':
        return 6.7; // Approx $6.70 per pip
      case 'USD/INR':
        return 11.8; // Approx ₹1000 per lot on NSE
      default:
        return 10.0;
    }
  };

  const pipValue = getPipValuePerLot(currencyPair) * lotSize;
  const totalPnl = pipValue * pipMovement;
  const totalPnlInr = totalPnl * 84.5;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(vantageReferralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveReferral = () => {
    const cleanUrl = tempUrl.trim() || 'https://www.vantagemarkets.com/?affid=trademaster_india';
    setVantageReferralUrl(cleanUrl);
    localStorage.setItem('tm_vantage_referral_url', cleanUrl);
    setIsEditingUrl(false);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/90 via-slate-900 to-indigo-950/90 border border-amber-500/40 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 flex items-center gap-1.5 shadow-md shadow-amber-500/20">
              <Globe size={13} className="text-slate-950" />
              <span>LEVEL 10 MASTERCLASS</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-amber-300 border border-amber-500/30">
              Basic to Advanced
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-emerald-300 border border-emerald-500/30">
              Vantage Demo Partner
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Forex Trading Academy: Basic to Advanced
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Master the world’s largest $7.5 Trillion currency market. Learn currency pair anatomy, pip math, lot sizing, the 3 major sessions, RBI & FEMA regulations, and practice safely on Vantage global demo platforms.
          </p>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
            <div className="p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Lessons</span>
              <span className="text-base font-black text-white">{forexLessons.length} Modules</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Completion</span>
              <span className="text-base font-black text-emerald-400">{progressPercent}%</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Practice Broker</span>
              <span className="text-base font-black text-amber-400">Vantage Demo</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">India Legality</span>
              <span className="text-base font-black text-indigo-300">NSE / BSE FEMA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveSubTab('curriculum')}
          className={`px-4 py-2 rounded-2xl font-bold text-xs transition-all shrink-0 flex items-center gap-1.5 ${
            activeSubTab === 'curriculum'
              ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <BookOpen size={14} />
          <span>Curriculum (Basic to Advanced)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('vantage')}
          className={`px-4 py-2 rounded-2xl font-bold text-xs transition-all shrink-0 flex items-center gap-1.5 ${
            activeSubTab === 'vantage'
              ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Globe size={14} />
          <span>Vantage Demo & Referral Link</span>
        </button>

        <button
          onClick={() => setActiveSubTab('calculator')}
          className={`px-4 py-2 rounded-2xl font-bold text-xs transition-all shrink-0 flex items-center gap-1.5 ${
            activeSubTab === 'calculator'
              ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Calculator size={14} />
          <span>Pip & Lot Calculator</span>
        </button>

        <button
          onClick={() => setActiveSubTab('fema')}
          className={`px-4 py-2 rounded-2xl font-bold text-xs transition-all shrink-0 flex items-center gap-1.5 ${
            activeSubTab === 'fema'
              ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <ShieldAlert size={14} />
          <span>RBI & FEMA Compliance</span>
        </button>
      </div>

      {/* Sub-Tab 1: Curriculum (Basic to Advanced) */}
      {activeSubTab === 'curriculum' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-base font-black text-white">Forex Learning Modules (Basic to Advanced)</h2>
              <p className="text-xs text-slate-400">Step-by-step structured lessons with interactive quizzes and downloadable PDFs</p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">
              {completedForex} / {forexLessons.length} Completed
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {forexLessons.map((lesson) => {
              const progress = profile.progress[lesson.id];
              const isCompleted = progress?.completed;
              const quizScore = progress?.quizScore;

              return (
                <div
                  key={lesson.id}
                  onClick={() => onOpenLesson(lesson)}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-5 cursor-pointer transition-all hover:bg-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shrink-0 border ${
                      isCompleted 
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    }`}>
                      {isCompleted ? <CheckCircle2 size={24} /> : <span>0{lesson.order}</span>}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                          {lesson.category}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                          <Video size={10} /> Video
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock size={11} /> {lesson.estimatedMinutes} mins
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <HelpCircle size={11} /> {lesson.quiz.length} Questions
                        </span>
                        {quizScore !== undefined && (
                          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.2 rounded-full border border-emerald-500/30">
                            Score: {quizScore}%
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-base text-white group-hover:text-amber-400 transition-colors">
                        {lesson.title}
                      </h3>

                      <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                        {lesson.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenLesson(lesson);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 group-hover:scale-105"
                    >
                      <Play size={12} className="fill-slate-950" />
                      <span>{isCompleted ? 'Review Lesson' : 'Start Lesson'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Vantage Demo & Referral Link */}
      {activeSubTab === 'vantage' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border-b border-slate-800 pb-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-black text-slate-950 text-2xl shadow-xl shadow-amber-500/25">
                  V
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-white">Vantage Global Markets</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Official Partner
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl">
                    Global Multi-Asset CFD & Forex Broker • Free MetaTrader 4 / MetaTrader 5 Demo Accounts for Risk-Free Practice
                  </p>
                </div>
              </div>

              {/* Direct Open Link Button */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <a
                  href={vantageReferralUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/25"
                >
                  <span>Open Vantage Demo Account</span>
                  <ExternalLink size={15} />
                </a>

                <button
                  onClick={handleCopyLink}
                  className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shrink-0"
                  title="Copy referral link"
                >
                  {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            {/* Referral Link Viewer and Editor */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                  <span className="text-slate-400 font-mono text-[11px] shrink-0">Your Active Referral Link:</span>
                  {isEditingUrl ? (
                    <input
                      type="text"
                      value={tempUrl}
                      onChange={(e) => setTempUrl(e.target.value)}
                      placeholder="https://www.vantagemarkets.com/?affid=..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                    />
                  ) : (
                    <span className="font-mono text-amber-300 text-[11px] truncate select-all">
                      {vantageReferralUrl}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isEditingUrl ? (
                    <>
                      <button
                        onClick={handleSaveReferral}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-[11px] hover:bg-emerald-400 transition-colors"
                      >
                        Save URL
                      </button>
                      <button
                        onClick={() => {
                          setTempUrl(vantageReferralUrl);
                          setIsEditingUrl(false);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 font-bold text-[11px] hover:bg-slate-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setTempUrl(vantageReferralUrl);
                        setIsEditingUrl(true);
                      }}
                      className="text-[11px] font-bold text-slate-400 hover:text-white underline"
                    >
                      Edit Custom Referral Link
                    </button>
                  )}

                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] flex items-center gap-1 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check size={13} className="text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Why Practice on Vantage Demo? */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mb-6">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-amber-400 font-black block mb-1 text-sm">1. Zero Financial Risk</span>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Trade with $100,000 in virtual simulation money. Test currency pair strategies and candlestick patterns without losing real money.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-indigo-400 font-black block mb-1 text-sm">2. Industry MT4 & MT5</span>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Access institutional charting, multi-timeframe analysis (1m to Monthly), and technical indicators like Moving Averages and RSI.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-emerald-400 font-black block mb-1 text-sm">3. Realistic Spreads</span>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Experience real market liquidity and raw spreads starting from 0.0 pips during London & New York session overlaps.
                </p>
              </div>
            </div>

            {/* How to Get Started Step-by-Step Guide */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-3">
              <h4 className="font-extrabold text-white text-sm">
                4 Steps to Start Your Free Demo Practice:
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-300 text-[11px] leading-relaxed">
                <li><strong className="text-white">Click "Open Vantage Demo Account"</strong> using the referral button above to access the partner registration page.</li>
                <li><strong className="text-white">Choose "Demo Account"</strong> during signup and select MetaTrader 4 (MT4) or MetaTrader 5 (MT5).</li>
                <li><strong className="text-white">Select Virtual Balance ($10,000 to $100,000)</strong> and set reasonable leverage (1:30 suggested for education).</li>
                <li><strong className="text-white">Login to MT4/MT5 WebTrader</strong> or download the app on mobile/desktop to practice the setups taught in TradeMaster India.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Interactive Pip & Lot Calculator */}
      {activeSubTab === 'calculator' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-xl space-y-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Calculator size={16} />
              <span>Interactive Forex Pip & Lot Sizing Calculator</span>
            </div>
            <h2 className="text-xl font-black text-white">
              Calculate Pip Value, Lot Sizes & Profit/Loss Projections
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Test your position sizing math before executing any simulated trade on Vantage Demo or Indian exchange currency futures.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1.5 font-bold">Currency Pair</label>
              <select
                value={currencyPair}
                onChange={(e) => setCurrencyPair(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3 text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="EUR/USD">EUR/USD (Major Pair)</option>
                <option value="GBP/USD">GBP/USD (Major Pair)</option>
                <option value="AUD/USD">AUD/USD (Commodity Major)</option>
                <option value="USD/JPY">USD/JPY (Japanese Yen Cross)</option>
                <option value="USD/INR">USD/INR (NSE India Exchange)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-bold">Lot Sizing Tier</label>
              <div className="flex items-center gap-1.5">
                {[
                  { label: 'Micro (0.01)', val: 0.01 },
                  { label: 'Mini (0.10)', val: 0.10 },
                  { label: 'Std (1.00)', val: 1.00 },
                ].map((tier) => (
                  <button
                    key={tier.val}
                    type="button"
                    onClick={() => {
                      setLotSize(tier.val);
                      setCustomLot(String(tier.val));
                    }}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      lotSize === tier.val
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-bold">Target Movement (Pips)</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={pipMovement}
                onChange={(e) => setPipMovement(Math.max(1, Number(e.target.value) || 1))}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3 text-white font-mono font-bold text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 block font-mono">
                Contract Size: <strong className="text-white">{(lotSize * 100000).toLocaleString()} base currency units</strong>
              </span>
              <span className="text-[11px] text-slate-400 block font-mono">
                Pip Value: <strong className="text-emerald-400">${pipValue.toFixed(2)} USD per pip</strong>
              </span>
              <span className="text-[10px] text-slate-500">
                1 Pip movement = 0.0001 for {currencyPair} (or 0.01 for JPY)
              </span>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                Projected Profit / Loss on {pipMovement} Pips
              </span>
              <span className="text-2xl font-black font-mono text-emerald-400 block">
                ${totalPnl.toFixed(2)} USD
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                (~₹{totalPnlInr.toLocaleString('en-IN', { maximumFractionDigits: 0 })} INR equivalent)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: FEMA & RBI Compliance */}
      {activeSubTab === 'fema' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-xl space-y-5">
            <div className="flex items-center gap-2.5 text-amber-400">
              <ShieldAlert size={22} className="shrink-0" />
              <div>
                <h2 className="text-lg font-black text-white">
                  Regulatory Compliance & FEMA 1999 Guidelines for Indian Residents
                </h2>
                <p className="text-xs text-slate-400">Essential statutory legal knowledge required for every Indian trader</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30">
                <span className="text-emerald-400 font-extrabold text-sm block mb-1.5">
                  ✅ Where Resident Indians CAN Legally Trade Forex:
                </span>
                <ul className="space-y-2 text-slate-300 text-[11px] leading-relaxed">
                  <li>• <strong className="text-white">Exchange-Traded Currency Derivatives:</strong> Traded on recognized Indian exchanges (NSE, BSE, MCX) through SEBI-registered brokers.</li>
                  <li>• <strong className="text-white">Authorized Rupee Pairs:</strong> USD/INR, EUR/INR, GBP/INR, JPY/INR.</li>
                  <li>• <strong className="text-white">Permitted Cross Pairs:</strong> EUR/USD, GBP/USD, USD/JPY listed on Indian exchanges.</li>
                  <li>• <strong className="text-white">Taxation:</strong> Profit is treated as business income under Income Tax rules.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-red-500/30">
                <span className="text-red-400 font-extrabold text-sm block mb-1.5">
                  🚫 What is Strictly Prohibited under FEMA & RBI:
                </span>
                <ul className="space-y-2 text-slate-300 text-[11px] leading-relaxed">
                  <li>• <strong className="text-white">LRS Overseas Remittance:</strong> Remitting money overseas under the Liberalised Remittance Scheme (LRS) for margin trading in forex is prohibited.</li>
                  <li>• <strong className="text-white">Unauthorized Offshore Brokers:</strong> Depositing Indian rupees via debit card, credit card, net banking, or crypto into offshore apps on the RBI Alert List.</li>
                  <li>• <strong className="text-white">Hawala / Peer-to-Peer Routing:</strong> Funneling funds through unapproved overseas channels violates FEMA 1999.</li>
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed">
              <strong className="text-white block mb-1">Educational Purpose & Vantage Partner Disclaimer:</strong>
              TradeMaster India provides global forex education, macroeconomic analysis, and paper-trading simulation. Information regarding Vantage Global Markets is provided strictly for global educational reference and risk-free virtual demo accounts. Resident Indians must adhere to RBI guidelines and trade real currency contracts solely on SEBI-recognized Indian exchanges.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
