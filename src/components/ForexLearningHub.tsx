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
  ShieldCheck
} from 'lucide-react';
import { ALL_LESSONS } from '../data/coursesData';
import { Lesson, UserProfileState } from '../types';

interface Props {
  profile: UserProfileState;
  onOpenLesson: (lesson: Lesson) => void;
}

export const ForexLearningHub: React.FC<Props> = ({ profile, onOpenLesson }) => {
  const [vantageReferralUrl, setVantageReferralUrl] = useState<string>(() => {
    return localStorage.getItem('tm_vantage_referral_url') || 'https://www.vantagemarkets.com/?affid=trademaster_india';
  });
  const [copied, setCopied] = useState(false);
  const [isEditingUrl, setIsEditingUrl] = useState(false);

  // Forex Pip Calculator State
  const [currencyPair, setCurrencyPair] = useState<'EUR/USD' | 'GBP/USD' | 'USD/JPY' | 'USD/INR'>('EUR/USD');
  const [lotSize, setLotSize] = useState<number>(0.10); // Mini lot default
  const [pipMovement, setPipMovement] = useState<number>(30);

  const forexLessons = ALL_LESSONS.filter((l) => l.level === 10);

  // Pip value computation
  const getPipValuePerLot = (pair: string): number => {
    switch (pair) {
      case 'EUR/USD':
      case 'GBP/USD':
        return 10.0; // $10 per pip on 1.0 standard lot
      case 'USD/JPY':
        return 6.7; // Approx $6.70 per pip
      case 'USD/INR':
        return 11.8; // Approx ₹1000 per 1000 lot or ₹10 per tick
      default:
        return 10.0;
    }
  };

  const pipValue = getPipValuePerLot(currencyPair) * lotSize;
  const totalPnl = pipValue * pipMovement;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(vantageReferralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveReferral = (newUrl: string) => {
    setVantageReferralUrl(newUrl);
    localStorage.setItem('tm_vantage_referral_url', newUrl);
    setIsEditingUrl(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950/80 border border-amber-500/30 rounded-3xl p-6 sm:p-7 text-white shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Globe size={16} />
          <span>LEVEL 10 GLOBAL CURRENCY TRADING</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Forex Academy & Vantage Demo Hub
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Study the world’s largest $7.5 Trillion currency market from foundational pairs to institutional sessions, pips, and risk controls, plus practice risk-free on Vantage global demo trading platforms.
        </p>
      </div>

      {/* Vantage Educational Partner & Referral Card */}
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 text-slate-100 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-amber-500/20">
              V
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">Vantage Global Markets</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Global Broker Partner
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-Asset CFD & Forex Platform • Free Demo / Paper Trading Accounts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <a
              href={vantageReferralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-amber-500/20"
            >
              <span>Open Vantage Demo Account</span>
              <ExternalLink size={14} />
            </a>

            <button
              onClick={handleCopyLink}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Copy referral link"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-4">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-amber-400 font-bold block mb-0.5">Free Practice Demo</span>
            <p className="text-slate-400 text-[11px]">Trade major pairs (EUR/USD, GBP/USD) with zero real money risk.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-indigo-400 font-bold block mb-0.5">MT4 / MT5 Platforms</span>
            <p className="text-slate-400 text-[11px]">Professional technical charts, indicators, and candlestick inspection.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-emerald-400 font-bold block mb-0.5">Ultra-Low Spreads</span>
            <p className="text-slate-400 text-[11px]">Raw institutional spreads starting from 0.0 pips for educational study.</p>
          </div>
        </div>

        {/* Referral Link Manager (User can edit or customize link) */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-slate-500 font-mono text-[11px]">Referral Link:</span>
            {isEditingUrl ? (
              <input
                type="text"
                value={vantageReferralUrl}
                onChange={(e) => setVantageReferralUrl(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs font-mono text-white"
              />
            ) : (
              <span className="font-mono text-amber-300 text-[11px] truncate max-w-xs sm:max-w-md">
                {vantageReferralUrl}
              </span>
            )}
          </div>

          <button
            onClick={() => {
              if (isEditingUrl) {
                handleSaveReferral(vantageReferralUrl);
              } else {
                setIsEditingUrl(true);
              }
            }}
            className="text-[11px] font-bold text-slate-400 hover:text-white underline"
          >
            {isEditingUrl ? 'Save Custom URL' : 'Edit Referral Link'}
          </button>
        </div>

        {/* Statutory Regulatory Notice for India */}
        <div className="mt-4 p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
          <ShieldAlert size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Compliance Disclosure for Indian Residents:</strong> Under RBI guidelines and the Foreign Exchange Management Act (FEMA 1999), resident Indians must trade currency derivatives on recognized Indian exchanges (NSE/BSE). Vantage accounts are for simulated global market education and paper trading. Do not remit unauthorized Indian funds overseas under LRS for forex margin trading.
          </div>
        </div>
      </div>

      {/* Forex Course Lessons Curriculum Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-white uppercase tracking-wider">
          Level 10 Forex Curriculum (Basic to Advanced)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {forexLessons.map((lesson) => {
            const isCompleted = profile.progress[lesson.id]?.completed;
            return (
              <div
                key={lesson.id}
                onClick={() => onOpenLesson(lesson)}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all hover:bg-slate-800/60 flex items-center justify-between text-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 shrink-0">
                    {lesson.order}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      {lesson.category}
                    </span>
                    <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors mt-0.5">
                      {lesson.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {lesson.description}
                    </p>
                  </div>
                </div>

                <ArrowRight size={15} className="text-slate-500 group-hover:text-white shrink-0 ml-2" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Forex Pip & Lot Calculator */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
          <Calculator size={16} />
          <span>Interactive Forex Pip & Lot Calculator</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Currency Pair</label>
            <select
              value={currencyPair}
              onChange={(e) => setCurrencyPair(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
            >
              <option value="EUR/USD">EUR/USD (Major)</option>
              <option value="GBP/USD">GBP/USD (Major)</option>
              <option value="USD/JPY">USD/JPY (Yen Cross)</option>
              <option value="USD/INR">USD/INR (NSE India)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Lot Size</label>
            <div className="flex items-center gap-1.5">
              {[0.01, 0.10, 1.00].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setLotSize(size)}
                  className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                    lotSize === size
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  {size === 0.01 ? 'Micro (0.01)' : size === 0.10 ? 'Mini (0.10)' : 'Std (1.00)'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Pips Target / Movement</label>
            <input
              type="number"
              value={pipMovement}
              onChange={(e) => setPipMovement(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono font-bold"
            />
          </div>
        </div>

        {/* Calculated Result Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <p className="text-slate-400">Pip Value: <strong className="text-white font-mono">${pipValue.toFixed(2)} USD per pip</strong></p>
            <p className="text-[11px] text-slate-500 mt-0.5">Position size: {(lotSize * 100000).toLocaleString()} base currency units</p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Projected Movement Value</span>
            <span className="text-xl font-black font-mono text-emerald-400">
              ${totalPnl.toFixed(2)} USD <span className="text-xs text-slate-400">(~₹{(totalPnl * 84).toFixed(0)})</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
