import React, { useState } from 'react';
import { 
  CandlestickChart, 
  HelpCircle, 
  Download, 
  Filter, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles, 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  BookOpen,
  FileText,
  Lock,
  Play
} from 'lucide-react';
import { CandlestickPattern, UserProfileState } from '../types';
import { CANDLESTICK_PATTERNS } from '../data/candlestickData';
import { CandlestickVisual } from '../components/CandlestickVisual';
import { QuizModal } from '../components/QuizModal';
import { AdMobModal } from '../components/AdMobModal';
import { generateAllCandlesticksPDF } from '../utils/pdfGenerator';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';

interface Props {
  profile: UserProfileState;
  onUpdateQuizPassed?: (patternId: string) => void;
}

export const CandlestickSchoolView: React.FC<Props> = ({
  profile,
  onUpdateQuizPassed,
}) => {
  const [selectedPattern, setSelectedPattern] = useState<CandlestickPattern>(CANDLESTICK_PATTERNS[0]);
  const [biasFilter, setBiasFilter] = useState<'ALL' | 'BULLISH' | 'BEARISH' | 'NEUTRAL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'SINGLE' | 'DOUBLE' | 'TRIPLE'>('ALL');
  const [activeQuizPattern, setActiveQuizPattern] = useState<CandlestickPattern | null>(null);

  // AdMob Rewarded Ad state for downloading ALL formations in 1 single PDF
  const [showAdModal, setShowAdModal] = useState<boolean>(false);
  const [isAdUnlocked, setIsAdUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('tm_candlestick_all_pdf_unlocked') === 'true';
  });
  const [downloadSuccessNotice, setDownloadSuccessNotice] = useState<string | null>(null);

  const filteredPatterns = CANDLESTICK_PATTERNS.filter((p) => {
    const matchBias = biasFilter === 'ALL' || p.bias === biasFilter;
    const matchCat = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchBias && matchCat;
  });

  const handleTriggerAllFormationsDownload = () => {
    if (isAdUnlocked) {
      // Already unlocked in this browser: download directly
      generateAllCandlesticksPDF(CANDLESTICK_PATTERNS);
      setDownloadSuccessNotice('Master Candlestick Bible PDF downloaded! All formations included.');
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      } catch (e) {
        // ignore
      }
      setTimeout(() => setDownloadSuccessNotice(null), 5000);
    } else {
      // Open rewarded video ad modal
      setShowAdModal(true);
    }
  };

  const handleAdRewardEarned = () => {
    setIsAdUnlocked(true);
    localStorage.setItem('tm_candlestick_all_pdf_unlocked', 'true');
    setShowAdModal(false);

    // Automatically trigger the single comprehensive PDF download!
    generateAllCandlesticksPDF(CANDLESTICK_PATTERNS);
    setDownloadSuccessNotice('🎉 Ad completed! Master Candlestick Formations Bible (Single PDF) downloaded successfully!');
    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } catch (e) {
      // ignore
    }
    setTimeout(() => setDownloadSuccessNotice(null), 6000);
  };

  const handleDownloadPatternPDF = (p: CandlestickPattern) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const margin = 18;
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(`CANDLESTICK MASTERCLASS: ${p.name.toUpperCase()}`, margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Bias: ${p.bias} • Type: ${p.type} • Structure: ${p.category}`, margin, y);
    y += 10;

    const sections = [
      { label: 'Appearance', text: p.appearance },
      { label: 'Meaning & Equilibrium', text: p.meaning },
      { label: 'Market Psychology', text: p.psychology },
      { label: 'Strategic Interpretation', text: p.interpretation },
      { label: 'Where Most Useful', text: p.whereUseful },
      { label: 'Confirmation Requirements', text: p.confirmationRequirements },
      { label: 'Real Market Example', text: p.realExample },
    ];

    sections.forEach((sec) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text(sec.label, margin, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      const lines = doc.splitTextToSize(sec.text, pageWidth - margin * 2);
      doc.text(lines, margin, y);
      y += lines.length * 5 + 4;
    });

    // Disclaimer
    y += 4;
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Disclaimer: No candlestick pattern guarantees future price movement. Always trade with a stop-loss.', margin, y);

    doc.save(`${p.id}-candlestick-study.pdf`);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <CandlestickChart size={20} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Candlestick School</h1>
            <p className="text-xs text-slate-400">Master Japanese Candlesticks, Anatomy & Price Action Psychology</p>
          </div>
        </div>
      </div>

      {/* Download Success Toast Notification */}
      {downloadSuccessNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-2xl animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <span>{downloadSuccessNotice}</span>
          </div>
          <button
            onClick={() => setDownloadSuccessNotice(null)}
            className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>
      )}

      {/* Master PDF Download Card: All Candlestick Formations in 1 Single PDF (Unlocked after viewing Ad) */}
      <div className="bg-gradient-to-r from-amber-950/50 via-slate-900 to-indigo-950/50 border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <Sparkles size={11} /> Master Study Material
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {CANDLESTICK_PATTERNS.length} Formations Included
              </span>
              {isAdUnlocked ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1">
                  <CheckCircle2 size={11} /> Unlocked
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                  <Play size={10} className="text-amber-400 fill-amber-400" /> Free with 1 Short Ad
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-black text-white">
              All Candlestick Formations in 1 Single Master PDF
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Download the complete printable handbook containing all Single, Double & Triple candlestick formations. Includes vector candle diagrams, entry rules, stop-loss zones, institutional psychology, and summary cheatsheet matrix.
            </p>
          </div>

          <div className="shrink-0 flex flex-col gap-2">
            <button
              onClick={handleTriggerAllFormationsDownload}
              className="px-5 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 hover:brightness-110 flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/25 cursor-pointer hover:scale-105"
            >
              <Download size={16} />
              <span>{isAdUnlocked ? 'Download All Formations PDF' : 'Watch Ad to Download All Formations'}</span>
            </button>
            <p className="text-[10px] text-center text-slate-400">
              {isAdUnlocked ? '✅ Unlocked & ready to download anytime' : '⚡ 5-second sponsored ad unlocks complete PDF'}
            </p>
          </div>
        </div>
      </div>

      {/* Anatomy Primer Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-slate-100 shadow-xl">
        <h3 className="font-extrabold text-sm text-white mb-2">
          The Anatomy of a Japanese Candlestick
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Every candle visualizes 4 critical numbers: <strong>Open, High, Low, Close (OHLC)</strong>. 
          The solid area is the <strong>Real Body</strong>, which measures the net progress between Open and Close. 
          The thin lines extending above and below are the <strong>Upper and Lower Wicks (Shadows)</strong>, representing price rejection.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/60">
            <p className="font-bold text-emerald-400 flex items-center gap-1.5">
              <TrendingUp size={15} />
              <span>Bullish Candle (Green)</span>
            </p>
            <p className="text-slate-300 text-[11px] mt-1">
              Close &gt; Open. Buyers entered aggressively and controlled the closing auction. Lower wick shows sellers failed to sustain lower prices.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-red-950/40 border border-red-800/60">
            <p className="font-bold text-red-400 flex items-center gap-1.5">
              <TrendingDown size={15} />
              <span>Bearish Candle (Red)</span>
            </p>
            <p className="text-slate-300 text-[11px] mt-1">
              Close &lt; Open. Sellers overwhelmed buyers. Upper wick shows buyers tried to push up but were forcefully rejected by supply.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        {/* Bias Tabs */}
        <div className="flex items-center gap-1.5 text-xs">
          {(['ALL', 'BULLISH', 'BEARISH', 'NEUTRAL'] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBiasFilter(b)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                biasFilter === b
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Structure Category Tabs */}
        <div className="flex items-center gap-1.5 text-xs">
          {(['ALL', 'SINGLE', 'DOUBLE', 'TRIPLE'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                categoryFilter === c
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {c === 'ALL' ? 'All Formations' : `${c} Candle`}
            </button>
          ))}
        </div>
      </div>

      {/* Pattern Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
        {filteredPatterns.map((pat) => {
          const isSelected = selectedPattern.id === pat.id;
          return (
            <button
              key={pat.id}
              onClick={() => setSelectedPattern(pat)}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800 border-emerald-500 shadow-md scale-102'
                  : 'bg-slate-900/90 border-slate-800 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    pat.bias === 'BULLISH'
                      ? 'bg-emerald-400'
                      : pat.bias === 'BEARISH'
                      ? 'bg-red-400'
                      : 'bg-slate-400'
                  }`}
                />
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  {pat.category}
                </span>
              </div>
              <p className="font-extrabold text-xs text-white leading-tight">{pat.name}</p>
              <p className="text-[10px] text-indigo-300 mt-0.5">{pat.type}</p>
            </button>
          );
        })}
      </div>

      {/* Pattern Deep Dive Detail Card */}
      {selectedPattern && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1 text-xs">
                <span
                  className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                    selectedPattern.bias === 'BULLISH'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : selectedPattern.bias === 'BEARISH'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {selectedPattern.bias}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-400">{selectedPattern.type} SETUP</span>
              </div>

              <h2 className="text-2xl font-black text-white">{selectedPattern.name}</h2>
              {selectedPattern.hindiName && (
                <p className="text-xs text-slate-400 mt-0.5 font-medium">{selectedPattern.hindiName}</p>
              )}
            </div>

            {/* Visual SVG Diagram */}
            <div className="shrink-0">
              <CandlestickVisual
                candles={selectedPattern.candleVisualSpec.candles}
                width={200}
                height={140}
              />
            </div>
          </div>

          {/* Core Analysis Breakdown (The 8 Pillars requested by prompt) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <strong className="text-white uppercase font-bold text-[11px] text-emerald-400 block">
                1. Visual Appearance
              </strong>
              <p className="text-slate-300 leading-relaxed">{selectedPattern.appearance}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <strong className="text-white uppercase font-bold text-[11px] text-indigo-400 block">
                2. Market Meaning
              </strong>
              <p className="text-slate-300 leading-relaxed">{selectedPattern.meaning}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <strong className="text-white uppercase font-bold text-[11px] text-pink-400 block">
                3. Market Psychology
              </strong>
              <p className="text-slate-300 leading-relaxed">{selectedPattern.psychology}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <strong className="text-white uppercase font-bold text-[11px] text-amber-400 block">
                4. Strategic Interpretation
              </strong>
              <p className="text-slate-300 leading-relaxed">{selectedPattern.interpretation}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <strong className="text-white uppercase font-bold text-[11px] text-cyan-400 block">
                5. Where Most Useful
              </strong>
              <p className="text-slate-300 leading-relaxed">{selectedPattern.whereUseful}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <strong className="text-white uppercase font-bold text-[11px] text-teal-400 block">
                6. Confirmation Requirements
              </strong>
              <p className="text-slate-300 leading-relaxed">{selectedPattern.confirmationRequirements}</p>
            </div>
          </div>

          {/* Common Mistakes & Real Example */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-1">
              <strong className="text-red-400 uppercase font-bold text-[11px] flex items-center gap-1">
                <AlertTriangle size={13} />
                <span>Common Beginner Mistakes</span>
              </strong>
              <ul className="list-disc pl-4 text-slate-300 space-y-1">
                {selectedPattern.commonMistakes.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <strong className="text-white uppercase font-bold text-[11px] text-emerald-300 block">
                Real Market Example
              </strong>
              <p className="text-slate-300 leading-relaxed italic">
                "{selectedPattern.realExample}"
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleTriggerAllFormationsDownload}
                className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
                title="Download all candlestick formations in 1 single comprehensive PDF"
              >
                <Download size={14} />
                <span>{isAdUnlocked ? 'Download ALL Formations (1 Single PDF)' : 'Watch Ad to Download ALL Formations'}</span>
              </button>

              <button
                onClick={() => handleDownloadPatternPDF(selectedPattern)}
                className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors border border-slate-700"
                title={`Download single PDF study sheet for ${selectedPattern.name}`}
              >
                <Download size={13} />
                <span>{selectedPattern.name} Only</span>
              </button>
            </div>

            <button
              onClick={() => setActiveQuizPattern(selectedPattern)}
              className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20"
            >
              <HelpCircle size={15} />
              <span>Test Knowledge on {selectedPattern.name}</span>
            </button>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {activeQuizPattern && (
        <QuizModal
          lessonTitle={`Pattern Quiz: ${activeQuizPattern.name}`}
          questions={[activeQuizPattern.quizQuestion]}
          onClose={() => setActiveQuizPattern(null)}
          onPassQuiz={() => {
            if (onUpdateQuizPassed) onUpdateQuizPassed(activeQuizPattern.id);
          }}
          onDownloadPdf={() => handleDownloadPatternPDF(activeQuizPattern)}
        />
      )}

      {/* Rewarded Ad Modal for Full Candlestick Bible PDF */}
      {showAdModal && (
        <AdMobModal
          rewardTitle="Unlock & Download All Candlestick Formations Master Bible (Single PDF)"
          onRewardEarned={handleAdRewardEarned}
          onClose={() => setShowAdModal(false)}
        />
      )}
    </div>
  );
};
