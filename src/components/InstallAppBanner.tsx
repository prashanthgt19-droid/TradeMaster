import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Sparkles, ChevronRight } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface Props {
  onOpenModal: () => void;
}

export const InstallAppBanner: React.FC<Props> = ({ onOpenModal }) => {
  const { isInstalled, isIOS, isAndroid } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    return localStorage.getItem('tm_pwa_banner_dismissed') === 'true';
  });

  if (isInstalled || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('tm_pwa_banner_dismissed', 'true');
  };

  return (
    <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border-b border-emerald-500/25 px-4 py-2.5 text-xs text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div 
          onClick={onOpenModal} 
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity flex-1 min-w-0"
        >
          <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center text-slate-950 font-bold shrink-0 shadow-sm">
            <Smartphone size={15} />
          </span>
          <div className="truncate">
            <p className="font-extrabold text-[12px] flex items-center gap-1.5 truncate">
              <span>Install TradeMaster Native App</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                {isIOS ? 'iPhone / iOS' : isAndroid ? 'Android' : 'Android & iOS'}
              </span>
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              Standalone full-screen mode • Zero address bar • Ultra-fast offline trading notes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenModal}
            className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md shadow-emerald-500/20 transition-all"
          >
            <Download size={12} />
            <span>Install</span>
          </button>

          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
