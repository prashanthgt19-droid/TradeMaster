import React, { useState } from 'react';
import { 
  Calculator, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Percent, 
  ArrowRight,
  Info,
  DollarSign
} from 'lucide-react';

export const RiskPositionCalculator: React.FC = () => {
  const [capital, setCapital] = useState<number>(100000);
  const [riskPercent, setRiskPercent] = useState<number>(1);
  const [entryPrice, setEntryPrice] = useState<number>(500);
  const [stopLossPrice, setStopLossPrice] = useState<number>(490);
  const [targetPrice, setTargetPrice] = useState<number>(530);

  // Calculations conforming to Level 8
  const maxRiskAmount = (capital * riskPercent) / 100;
  const isLong = entryPrice >= stopLossPrice;
  const riskPerShare = Math.max(0.01, Math.abs(entryPrice - stopLossPrice));
  const positionSize = Math.max(1, Math.floor(maxRiskAmount / riskPerShare));
  const totalInvestment = positionSize * entryPrice;
  const stopLossPercent = (riskPerShare / entryPrice) * 100;

  const profitPerShare = targetPrice > 0 ? Math.abs(targetPrice - entryPrice) : 0;
  const potentialProfit = positionSize * profitPerShare;
  const riskRewardRatio = riskPerShare > 0 ? (profitPerShare / riskPerShare).toFixed(2) : '0';

  const applyPreset = (c: number, r: number, ep: number, sl: number, tp: number) => {
    setCapital(c);
    setRiskPercent(r);
    setEntryPrice(ep);
    setStopLossPrice(sl);
    setTargetPrice(tp);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-slate-100 shadow-2xl space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
          <ShieldCheck size={16} />
          <span>LEVEL 8 RISK MANAGEMENT ENGINE</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
          <span>Risk & Position Size Calculator</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Calculate the exact required position size (share quantity) based on the golden 1% capital preservation rule.
        </p>
      </div>

      {/* Preset Badges */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold text-[11px]">Quick Scenarios:</span>
        <button
          onClick={() => applyPreset(100000, 1, 500, 490, 530)}
          className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold text-[11px] border border-slate-700 transition-colors"
        >
          📘 Level 8 Example (₹1 Lakh / ₹500 Entry / ₹490 SL)
        </button>
        <button
          onClick={() => applyPreset(250000, 1, 2940, 2910, 3010)}
          className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold text-[11px] border border-slate-700 transition-colors"
        >
          📈 Reliance Breakout (₹2.5 Lakh / 1% Risk)
        </button>
        <button
          onClick={() => applyPreset(500000, 1.5, 1680, 1655, 1750)}
          className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-[11px] border border-slate-700 transition-colors"
        >
          🏦 HDFC Bank Swing (₹5 Lakh / 1.5% Risk)
        </button>
      </div>

      {/* Inputs & Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 Columns) */}
        <div className="lg:col-span-7 space-y-4 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            1. Enter Your Trade Inputs
          </h3>

          {/* Capital Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Total Trading Capital (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-500 font-mono font-bold">₹</span>
              <input
                type="number"
                min="1000"
                step="5000"
                value={capital}
                onChange={(e) => setCapital(Math.max(100, Number(e.target.value)))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="100000"
              />
            </div>
          </div>

          {/* Risk Percentage Slider & Buttons */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span>Risk Per Trade (%)</span>
              <span className="text-emerald-400 font-bold font-mono text-sm">
                {riskPercent}% = ₹{maxRiskAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
            </div>
            
            <input
              type="range"
              min="0.25"
              max="3"
              step="0.25"
              value={riskPercent}
              onChange={(e) => setRiskPercent(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer mb-2"
            />

            <div className="flex items-center gap-1.5">
              {[0.5, 1.0, 1.5, 2.0, 3.0].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRiskPercent(r)}
                  className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    riskPercent === r
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {r}%
                </button>
              ))}
            </div>
          </div>

          {/* Entry & Stop Loss Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Entry Price (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-500 font-mono text-xs">₹</span>
                <input
                  type="number"
                  step="0.05"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(Math.max(0.01, Number(e.target.value)))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-sm font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-red-400 mb-1">
                Stop-Loss Price (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-red-500/70 font-mono text-xs">₹</span>
                <input
                  type="number"
                  step="0.05"
                  value={stopLossPrice}
                  onChange={(e) => setStopLossPrice(Math.max(0.01, Number(e.target.value)))}
                  className="w-full bg-slate-900 border border-red-500/50 rounded-xl pl-7 pr-3 py-2 text-sm font-mono font-bold text-red-300 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Optional Target Price */}
          <div>
            <label className="block text-xs font-semibold text-emerald-400 mb-1">
              Target Price (₹) <span className="text-slate-500 font-normal">(Optional for R:R calculation)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-emerald-500/70 font-mono text-xs">₹</span>
              <input
                type="number"
                step="0.05"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Math.max(0, Number(e.target.value)))}
                className="w-full bg-slate-900 border border-emerald-500/40 rounded-xl pl-7 pr-3 py-2 text-sm font-mono font-bold text-emerald-300 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Right Output & Breakdown (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-5 rounded-2xl border border-emerald-500/30">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Required Position Size
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                STRICT 1% RISK
              </span>
            </div>

            {/* Main Big Output Hero Card */}
            <div className="mt-3 p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 text-center shadow-inner">
              <p className="text-xs text-slate-400 font-medium">Buy Exactly</p>
              <p className="text-4xl font-black font-mono text-emerald-400 mt-1 tracking-tight">
                {positionSize.toLocaleString()}{' '}
                <span className="text-base text-slate-300 font-sans font-bold">shares</span>
              </p>
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mt-1.5 font-mono">
                <span>Formula: ₹{maxRiskAmount} ÷ ₹{riskPerShare.toFixed(2)}</span>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-2.5 mt-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Total Investment</span>
                <span className="font-mono font-bold text-white text-sm">
                  ₹{totalInvestment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Max Capital Loss</span>
                <span className="font-mono font-bold text-red-400 text-sm">
                  ₹{maxRiskAmount.toLocaleString('en-IN')} ({riskPercent}%)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Risk per Share</span>
                <span className="font-mono font-bold text-amber-300 text-sm">
                  ₹{riskPerShare.toFixed(2)} ({stopLossPercent.toFixed(2)}%)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Risk : Reward</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  1 : {riskRewardRatio}
                </span>
              </div>
            </div>

            {targetPrice > 0 && potentialProfit > 0 && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-300">Potential Profit at Target:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  +₹{potentialProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>
            )}
          </div>

          {/* Educational Formula Breakdown Box */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1 font-mono">
            <p className="text-white font-sans font-bold text-xs flex items-center gap-1.5 mb-1">
              <Info size={13} className="text-indigo-400" />
              <span>Level 8 Mathematical Step-by-Step:</span>
            </p>
            <p>1. Capital = ₹{capital.toLocaleString()}</p>
            <p>2. Maximum risk ({riskPercent}%) = ₹{maxRiskAmount.toLocaleString()}</p>
            <p>3. Entry = ₹{entryPrice} | Stop loss = ₹{stopLossPrice}</p>
            <p>4. Risk/share = ₹{riskPerShare.toFixed(2)}</p>
            <p className="text-emerald-300 font-bold">
              5. Position size = ₹{maxRiskAmount} ÷ ₹{riskPerShare.toFixed(2)} = {positionSize} shares
            </p>
          </div>
        </div>
      </div>

      {/* Capital Preservation Note */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
        <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Why This Protects You From Ruin:</strong>
          <p className="mt-0.5 text-slate-400 leading-relaxed">
            Even if this trade immediately hits your stop loss at ₹{stopLossPrice}, you will strictly lose only ₹{maxRiskAmount} ({riskPercent}% of your account). Your remaining ₹{(capital - maxRiskAmount).toLocaleString()} stays safe, allowing you to endure multiple consecutive losses without blowing up your account.
          </p>
        </div>
      </div>
    </div>
  );
};
