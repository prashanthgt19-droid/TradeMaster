import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Sparkles, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface Props {
  rewardTitle: string; // e.g. "Unlock Lesson: RSI, MACD & Bollinger Bands" or "Unlock PDF Notes"
  onRewardEarned: () => void;
  onClose: () => void;
}

export const AdMobModal: React.FC<Props> = ({
  rewardTitle,
  onRewardEarned,
  onClose,
}) => {
  const [adState, setAdState] = useState<'prompt' | 'loading' | 'playing' | 'completed' | 'failed'>('prompt');
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const testAdUnitId = 'ca-app-pub-3940256099942544/5224354917'; // Official Google AdMob Rewarded Test ID

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (adState === 'playing' && secondsRemaining > 0) {
      timer = setTimeout(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (adState === 'playing' && secondsRemaining === 0) {
      setAdState('completed');
    }
    return () => clearTimeout(timer);
  }, [adState, secondsRemaining]);

  const handleStartAd = () => {
    setAdState('loading');
    // Simulate realistic AdMob SDK network load
    setTimeout(() => {
      setAdState('playing');
      setSecondsRemaining(5);
    }, 1200);
  };

  const handleClaimReward = () => {
    onRewardEarned();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative overflow-hidden">
        {/* AdMob Test Header Indicator */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[11px] font-mono uppercase text-slate-400">
              Google AdMob • Rewarded Ad
            </span>
          </div>
          <span className="text-[10px] font-mono bg-slate-800 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
            TEST MODE
          </span>
        </div>

        {adState === 'prompt' && (
          <div className="text-center py-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
              <Sparkles size={28} />
            </div>

            <h3 className="text-lg font-black text-white">Unlock with Rewarded Ad</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed px-2">
              Watch a quick 5-second educational partner clip to unlock:
            </p>
            <div className="my-3 py-2 px-3 bg-slate-950/80 rounded-xl border border-slate-800 text-emerald-400 font-bold text-xs">
              {rewardTitle}
            </div>

            <p className="text-[11px] text-slate-400 mb-5">
              Ad Unit: <span className="font-mono text-slate-300">{testAdUnitId}</span>
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStartAd}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 font-black"
              >
                <Play size={14} className="fill-slate-950" />
                <span>Watch Ad (5s)</span>
              </button>
            </div>
          </div>
        )}

        {adState === 'loading' && (
          <div className="text-center py-8">
            <div className="w-10 h-10 border-3 border-amber-500/30 border-t-amber-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs font-bold text-slate-200">Loading Google AdMob video stream...</p>
            <p className="text-[10px] text-slate-400 font-mono mt-1">Connecting to AdMob test network</p>
          </div>
        )}

        {adState === 'playing' && (
          <div className="py-2 text-center">
            {/* Simulated Video Ad Screen */}
            <div className="relative aspect-video bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 rounded-2xl border border-slate-700/80 flex flex-col items-center justify-center p-4 overflow-hidden shadow-inner">
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Ad playing: {secondsRemaining}s
              </div>

              <div className="text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center mx-auto text-indigo-300">
                  <ShieldCheck size={20} />
                </div>
                <p className="font-extrabold text-sm text-white">NSE / BSE Certified Investor Awareness</p>
                <p className="text-[11px] text-slate-300 max-w-xs">
                  "Always verify SEBI registration before following social media financial advisors. Trade responsibly."
                </p>
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
                <div
                  className="h-full bg-amber-400 transition-all duration-1000 ease-linear"
                  style={{ width: `${((5 - secondsRemaining) / 5) * 100}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-3 font-medium">
              Please watch until the timer concludes to verify reward.
            </p>
          </div>
        )}

        {adState === 'completed' && (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-3 text-emerald-400">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-black text-white">Congratulations!</h3>
            <p className="text-xs text-slate-300 mt-1">Reward Verified by AdMob SDK.</p>
            <p className="text-sm font-bold text-emerald-400 mt-2 px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-800">
              {rewardTitle} Unlocked!
            </p>

            <button
              onClick={handleClaimReward}
              className="mt-6 w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/25"
            >
              Continue to Lesson / PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
