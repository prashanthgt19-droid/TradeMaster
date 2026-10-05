import React, { useState } from 'react';
import { 
  Calculator, 
  ShieldAlert, 
  TrendingUp, 
  Percent, 
  Receipt, 
  CheckCircle2,
  HelpCircle 
} from 'lucide-react';
import { calculatePositionSize, calculateIndianEquitiesCharges } from '../utils/calculators';

export const PositionSizeCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'position' | 'brokerage' | 'riskReward'>('position');

  // Position Size State
  const [capital, setCapital] = useState<number>(100000);
  const [riskPercent, setRiskPercent] = useState<number>(1);
  const [entryPrice, setEntryPrice] = useState<number>(500);
  const [stopLossPrice, setStopLossPrice] = useState<number>(490);
  const [targetPrice, setTargetPrice] = useState<number>(530);

  // Brokerage / Taxes State
  const [tradeType, setTradeType] = useState<'INTRADAY' | 'DELIVERY'>('INTRADAY');
  const [brokerBuyPrice, setBrokerBuyPrice] = useState<number>(500);
  const [brokerSellPrice, setBrokerSellPrice] = useState<number>(510);
  const [brokerQty, setBrokerQty] = useState<number>(100);

  const positionResult = calculatePositionSize(
    capital,
    riskPercent,
    entryPrice,
    stopLossPrice,
    targetPrice
  );

  const taxResult = calculateIndianEquitiesCharges(
    tradeType,
    brokerBuyPrice,
    brokerSellPrice,
    brokerQty
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-slate-100 shadow-xl">
      {/* Title & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
            <Calculator size={20} />
          </div>
          <div>
            <h2 className="text-base font-black text-white">Trading Math & Risk Calculators</h2>
            <p className="text-[11px] text-slate-400">Position Sizing • Risk-to-Reward • SEBI Brokerage & STT</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('position')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'position' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Position Size (1% Rule)
          </button>
          <button
            onClick={() => setActiveTab('brokerage')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'brokerage' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Brokerage & Taxes (NSE)
          </button>
        </div>
      </div>

      {activeTab === 'position' && (
        <div className="space-y-6">
          {/* Quick Presets */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Sample Indian Setup:</span>
            <button
              onClick={() => {
                setCapital(100000);
                setRiskPercent(1);
                setEntryPrice(500);
                setStopLossPrice(490);
                setTargetPrice(530);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-300 font-semibold border border-slate-700 hover:bg-slate-700 text-[11px]"
            >
              Default (₹1 Lakh / ₹500 Stock)
            </button>
            <button
              onClick={() => {
                setCapital(250000);
                setRiskPercent(1);
                setEntryPrice(2950);
                setStopLossPrice(2920);
                setTargetPrice(3040);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 text-indigo-300 font-semibold border border-slate-700 hover:bg-slate-700 text-[11px]"
            >
              Reliance Swing (₹2.5 Lakh)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Form */}
            <div className="space-y-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                1. Trade Parameters
              </h3>

              {/* Total Capital */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Total Trading Capital (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 font-mono font-bold">₹</span>
                  <input
                    type="number"
                    value={capital}
                    onChange={(e) => setCapital(Math.max(1000, Number(e.target.value)))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-sm font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Risk Percent */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Max Risk per Trade</span>
                  <span className="text-emerald-400 font-bold font-mono">{riskPercent}% (₹{(capital * riskPercent) / 100})</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.25"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                  <span>0.5% (Ultra Safe)</span>
                  <span>1.0% (Golden Rule)</span>
                  <span>2.0% (Aggressive)</span>
                </div>
              </div>

              {/* Entry & Stop Loss */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Entry Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(Math.max(0.1, Number(e.target.value)))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-red-400 mb-1">
                    Stop-Loss Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={stopLossPrice}
                    onChange={(e) => setStopLossPrice(Math.max(0.05, Number(e.target.value)))}
                    className="w-full bg-slate-900 border border-red-500/40 rounded-xl px-3 py-2 text-sm font-mono font-bold text-red-300 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Target Price */}
              <div>
                <label className="block text-xs font-semibold text-emerald-400 mb-1">
                  Target Price (₹) (Optional)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Math.max(0.1, Number(e.target.value)))}
                  className="w-full bg-slate-900 border border-emerald-500/40 rounded-xl px-3 py-2 text-sm font-mono font-bold text-emerald-300 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Exact Output Card */}
            <div className="flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-5 rounded-2xl border border-indigo-500/30">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Calculated Risk Management Output
                </span>
                
                {/* Highlighted Exact Position Size */}
                <div className="mt-3 p-4 rounded-xl bg-slate-900/90 border border-indigo-500/40 text-center">
                  <p className="text-xs text-slate-400 font-medium">Recommended Position Size</p>
                  <p className="text-3xl font-black font-mono text-emerald-400 mt-1">
                    {positionResult.positionSize.toLocaleString()} <span className="text-sm text-slate-300 font-sans">shares</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Formula: ₹{positionResult.maxRiskAmount} max risk ÷ ₹{positionResult.riskPerShare.toFixed(2)} risk/share
                  </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2.5 mt-4 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <p className="text-slate-400">Total Trade Value</p>
                    <p className="font-mono font-bold text-white text-sm mt-0.5">
                      ₹{positionResult.totalInvestment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <p className="text-slate-400">Capital At Risk</p>
                    <p className="font-mono font-bold text-red-400 text-sm mt-0.5">
                      ₹{positionResult.maxRiskAmount.toLocaleString('en-IN')} (Strict 1%)
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <p className="text-slate-400">Stop-Loss Distance</p>
                    <p className="font-mono font-bold text-amber-300 text-sm mt-0.5">
                      ₹{positionResult.riskPerShare.toFixed(2)} ({positionResult.stopLossPercent.toFixed(2)}%)
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <p className="text-slate-400">Risk-to-Reward Ratio</p>
                    <p className="font-mono font-bold text-emerald-400 text-sm mt-0.5">
                      {positionResult.riskRewardRatio ? `1 : ${positionResult.riskRewardRatio.toFixed(2)}` : 'N/A'}
                    </p>
                  </div>
                </div>

                {positionResult.potentialProfit && (
                  <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between text-xs">
                    <span className="text-slate-300">Potential Gross Profit at Target:</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      +₹{positionResult.potentialProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>If the stop loss at ₹{stopLossPrice} is hit, you lose strictly ₹{positionResult.maxRiskAmount} (1%), leaving ₹{(capital - positionResult.maxRiskAmount).toLocaleString()} intact.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'brokerage' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Form */}
            <div className="space-y-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                NSE Equity Tax Calculator
              </h3>

              {/* Trade Type */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTradeType('INTRADAY')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    tradeType === 'INTRADAY' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  Intraday Equity (MIS)
                </button>
                <button
                  onClick={() => setTradeType('DELIVERY')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    tradeType === 'DELIVERY' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  Delivery (CNC)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Buy Price (₹)</label>
                  <input
                    type="number"
                    value={brokerBuyPrice}
                    onChange={(e) => setBrokerBuyPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sell Price (₹)</label>
                  <input
                    type="number"
                    value={brokerSellPrice}
                    onChange={(e) => setBrokerSellPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Quantity (Shares)</label>
                <input
                  type="number"
                  value={brokerQty}
                  onChange={(e) => setBrokerQty(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-white"
                />
              </div>
            </div>

            {/* Breakdown Result */}
            <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Itemized Contract Note Charges
                </span>

                <div className="space-y-2 mt-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Brokerage (Buy + Sell):</span>
                    <span className="font-mono font-bold text-white">₹{taxResult.brokerage.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">STT (Securities Transaction Tax):</span>
                    <span className="font-mono font-bold text-white">₹{taxResult.stt.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Exchange Turnover Charge:</span>
                    <span className="font-mono font-bold text-white">₹{taxResult.exchangeCharges.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">GST (18% on Services):</span>
                    <span className="font-mono font-bold text-white">₹{taxResult.gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Stamp Duty & SEBI Fees:</span>
                    <span className="font-mono font-bold text-white">
                      ₹{(taxResult.stampDuty + taxResult.sebiTurnoverFee).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 font-bold text-amber-400 border-t border-slate-700">
                    <span>Total Statutory Deductions:</span>
                    <span className="font-mono">₹{taxResult.totalCharges.toFixed(2)}</span>
                  </div>
                </div>

                {/* Net P&L */}
                <div className={`mt-4 p-3 rounded-xl border text-center ${
                  taxResult.netPnl >= 0 ? 'bg-emerald-950/60 border-emerald-700' : 'bg-red-950/60 border-red-700'
                }`}>
                  <p className="text-xs text-slate-300">Net Profit / Loss (Post-Taxes)</p>
                  <p className={`text-2xl font-black font-mono mt-0.5 ${
                    taxResult.netPnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {taxResult.netPnl >= 0 ? '+' : ''}₹{taxResult.netPnl.toFixed(2)}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Breakeven requires stock to move at least <strong>₹{taxResult.breakevenPoints.toFixed(2)}</strong> per share.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
