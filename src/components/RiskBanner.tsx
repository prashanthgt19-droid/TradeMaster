import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, X } from 'lucide-react';

export const RiskBanner: React.FC = () => {
  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    return (
      <div className="bg-amber-950/70 border-b border-amber-800/60 px-3 py-1 text-center">
        <button
          onClick={() => setMinimized(false)}
          className="text-[11px] text-amber-300/90 font-medium hover:underline inline-flex items-center gap-1.5"
        >
          <AlertTriangle size={12} className="text-amber-400" />
          <span>Statutory Educational Disclaimer & Risk Disclosure (Click to expand)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border-b border-amber-500/30 px-3.5 py-2 text-slate-200 text-xs shadow-md transition-all">
      <div className="max-w-6xl mx-auto flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="p-1 rounded-md bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            <AlertTriangle size={15} />
          </div>
          <div>
            <p className="font-bold text-amber-300 text-[11px] uppercase tracking-wider flex items-center gap-1">
              <span>Educational & Skill Development Platform Only</span>
              <span className="text-slate-400 font-normal">| Not Financial Advice</span>
            </p>
            <p className="text-[11px] text-slate-300 leading-tight mt-0.5">
              Trading stocks, futures, currencies, and cryptocurrencies carries significant risk of capital loss. Past performance does not guarantee future results. No profit guarantees or trade calls are provided. Always practice in our paper trading simulator before using real money.
            </p>
          </div>
        </div>

        <button
          onClick={() => setMinimized(true)}
          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800/80 transition-colors shrink-0"
          title="Minimize warning"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
