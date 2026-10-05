import React, { useState } from 'react';
import { 
  BarChart2, 
  HelpCircle, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles 
} from 'lucide-react';
import { IndicatorData } from '../types';
import { INDICATORS_DATA } from '../data/indicatorsData';
import { QuizModal } from '../components/QuizModal';
import { jsPDF } from 'jspdf';

export const IndicatorsView: React.FC = () => {
  const [selectedInd, setSelectedInd] = useState<IndicatorData>(INDICATORS_DATA[0]);
  const [activeQuizInd, setActiveQuizInd] = useState<IndicatorData | null>(null);

  const handleDownloadIndicatorPdf = (ind: IndicatorData) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const margin = 18;
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(`INDICATOR STUDY GUIDE: ${ind.name.toUpperCase()}`, margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Category: ${ind.category} • Standard Settings: ${ind.standardSettings}`, margin, y);
    y += 10;

    const sections = [
      { label: 'What It Measures', text: ind.whatItMeasures },
      { label: 'How It Works (Math & Logic)', text: ind.howItWorks },
      { label: 'Real Market Example', text: ind.example },
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

    // How to interpret
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('Key Interpretation Rules', margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    ind.howToInterpret.forEach((rule) => {
      const lines = doc.splitTextToSize(`• ${rule}`, pageWidth - margin * 2);
      doc.text(lines, margin + 2, y);
      y += lines.length * 5 + 2;
    });
    y += 4;

    doc.save(`${ind.id}-indicator-guide.pdf`);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
          <BarChart2 size={20} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">Technical Indicators Mastery</h1>
          <p className="text-xs text-slate-400">Settings, Math, Divergences, Signal Confirmation & Pitfalls</p>
        </div>
      </div>

      {/* Indicator Chips Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {INDICATORS_DATA.map((ind) => {
          const isSelected = selectedInd.id === ind.id;
          return (
            <button
              key={ind.id}
              onClick={() => setSelectedInd(ind)}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {ind.shortName}
            </button>
          );
        })}
      </div>

      {/* Selected Indicator Deep Dive Card */}
      {selectedInd && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400">
              {selectedInd.category} INDICATOR • DEFAULT SETTINGS: {selectedInd.standardSettings}
            </span>
            <h2 className="text-2xl font-black text-white mt-1">{selectedInd.name}</h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {selectedInd.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
              <strong className="text-emerald-400 font-bold uppercase text-[11px] block">
                What It Measures
              </strong>
              <p className="text-slate-300 leading-relaxed">{selectedInd.whatItMeasures}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
              <strong className="text-indigo-400 font-bold uppercase text-[11px] block">
                How It Works Under the Hood
              </strong>
              <p className="text-slate-300 leading-relaxed">{selectedInd.howItWorks}</p>
            </div>
          </div>

          {/* How to Interpret */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">
              How to Interpret & Execute Signals
            </h3>
            <div className="space-y-2 text-slate-300">
              {selectedInd.howToInterpret.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Limitations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <span className="text-emerald-400 font-bold uppercase text-[11px] block">
                Indicator Strengths
              </span>
              <ul className="list-disc pl-4 text-slate-300 space-y-1">
                {selectedInd.strengths.map((str, idx) => (
                  <li key={idx}>{str}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-2">
              <span className="text-red-400 font-bold uppercase text-[11px] flex items-center gap-1">
                <AlertTriangle size={13} />
                <span>Limitations & Whipsaw Risks</span>
              </span>
              <ul className="list-disc pl-4 text-slate-300 space-y-1">
                {selectedInd.limitations.map((lim, idx) => (
                  <li key={idx}>{lim}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <button
              onClick={() => handleDownloadIndicatorPdf(selectedInd)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 transition-colors"
            >
              <Download size={14} />
              <span>Download {selectedInd.shortName} Study Notes PDF</span>
            </button>

            <button
              onClick={() => setActiveQuizInd(selectedInd)}
              className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20"
            >
              <HelpCircle size={15} />
              <span>Test Knowledge on {selectedInd.shortName}</span>
            </button>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {activeQuizInd && (
        <QuizModal
          lessonTitle={`Indicator Quiz: ${activeQuizInd.name}`}
          questions={[activeQuizInd.quizQuestion]}
          onClose={() => setActiveQuizInd(null)}
          onPassQuiz={() => {}}
          onDownloadPdf={() => handleDownloadIndicatorPdf(activeQuizInd)}
        />
      )}
    </div>
  );
};
