import React, { useState } from 'react';
import { 
  LineChart, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  ShieldCheck, 
  HelpCircle,
  Eye,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { InteractiveChart } from '../components/InteractiveChart';

export const ChartReadingView: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<'structure' | 'sr_zones' | 'breakout_retest' | 'volume'>('structure');

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <LineChart size={20} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Chart Reading & Price Action</h1>
            <p className="text-xs text-slate-400">Market Structure, Support & Resistance, Breakouts & Volume Analysis</p>
          </div>
        </div>
      </div>

      {/* Interactive Live Simulator Chart Preview */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Interactive Training Terminal
          </span>
          <span className="text-[11px] text-slate-400">Toggle indicators & test chart reading live</span>
        </div>
        <InteractiveChart
          symbol="NIFTY 50"
          initialPrice={25180.50}
        />
      </div>

      {/* Topic Switcher Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setSelectedTopic('structure')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 ${
            selectedTopic === 'structure' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          1. Market Structure (HH, HL, LH, LL)
        </button>
        <button
          onClick={() => setSelectedTopic('sr_zones')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 ${
            selectedTopic === 'sr_zones' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          2. Support, Resistance & Flip Zones
        </button>
        <button
          onClick={() => setSelectedTopic('breakout_retest')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 ${
            selectedTopic === 'breakout_retest' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          3. Breakouts, Pullbacks & Traps
        </button>
        <button
          onClick={() => setSelectedTopic('volume')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 ${
            selectedTopic === 'volume' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          4. Volume Confirmation & Gaps
        </button>
      </div>

      {/* Topic Deep Dive Explanations */}
      {selectedTopic === 'structure' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-xl space-y-5">
          <h2 className="text-lg font-black text-white">Market Structure: The Language of Trends</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Market structure is the supreme foundation of technical analysis. Before looking at indicators or candlestick patterns, you must identify whether the broad structure is an <strong>Uptrend</strong>, <strong>Downtrend</strong>, or <strong>Sideways Range</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 space-y-1.5">
              <span className="text-emerald-400 font-bold uppercase text-[11px] flex items-center gap-1">
                <TrendingUp size={15} /> Uptrend Structure
              </span>
              <p className="font-bold text-white text-sm">Higher Highs (HH) + Higher Lows (HL)</p>
              <p className="text-slate-300 leading-relaxed">
                Buyers consistently push price higher than the previous peak, and pullbacks terminate at a higher floor than the previous dip. Rule: Focus strictly on buying pullbacks.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/60 space-y-1.5">
              <span className="text-red-400 font-bold uppercase text-[11px] flex items-center gap-1">
                <TrendingDown size={15} /> Downtrend Structure
              </span>
              <p className="font-bold text-white text-sm">Lower Highs (LH) + Lower Lows (LL)</p>
              <p className="text-slate-300 leading-relaxed">
                Sellers overwhelm buying rallies at lower peaks, breaking previous swing supports into new lower floors. Rule: Avoid trying to catch falling knives.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-amber-400 font-bold uppercase text-[11px]">
                Sideways / Consolidation
              </span>
              <p className="font-bold text-white text-sm">Equal Highs + Equal Lows (Range)</p>
              <p className="text-slate-300 leading-relaxed">
                Supply and demand are in equilibrium. Price bounces between a clear ceiling and floor. Rule: Wait for a confirmed breakout or trade range edges with tight stops.
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedTopic === 'sr_zones' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-xl space-y-5">
          <h2 className="text-lg font-black text-white">Support, Resistance & Role Reversal</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Support is a demand zone where institutional buyers historically accumulate. Resistance is a supply zone where sellers distribute.
          </p>

          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs space-y-2">
            <h4 className="font-bold text-indigo-300 text-sm">The "Role Reversal" Phenomenon</h4>
            <p className="text-slate-200 leading-relaxed">
              When a major Support level breaks to the downside, the traders who bought there are now trapped in losses. When price pulls back to that exact level, those trapped buyers rush to sell at "breakeven", transforming that old support into new <strong>Resistance</strong>.
            </p>
          </div>
        </div>
      )}

      {selectedTopic === 'breakout_retest' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-xl space-y-5">
          <h2 className="text-lg font-black text-white">Trading Authentic Breakouts vs Traps</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Why do over 70% of breakout trades fail for beginners? Because they chase high candles into overbought levels without waiting for volume proof or a retest.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <p className="font-bold text-emerald-400 text-sm">The Breakout-Retest Playbook</p>
              <p className="text-slate-300 leading-relaxed">
                1. Price breaks resistance with high volume.<br />
                2. Instead of chasing the breakout candle, wait for a calm pullback back to the broken level.<br />
                3. Look for a bullish candlestick confirmation (e.g. Hammer or Bullish Engulfing) at the new support.<br />
                4. Enter with a tight stop-loss placed safely below the retest low.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-2">
              <p className="font-bold text-red-400 text-sm">Identifying Bull & Bear Traps</p>
              <p className="text-slate-300 leading-relaxed">
                If a stock pokes above resistance on weak, declining volume and immediately prints a long upper shadow or closes right back inside the range, it is almost certainly an institutional liquidity sweep (Bull Trap).
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedTopic === 'volume' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-xl space-y-5">
          <h2 className="text-lg font-black text-white">Volume: The Institutional Footprint</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Price represents what participants agree on; Volume represents how much conviction they have. Institutions cannot hide their size—it always shows up on the volume bars.
          </p>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <p className="font-bold text-white text-sm">The 4 Volume Truths</p>
            <ul className="space-y-1.5 text-slate-300">
              <li>• <strong>Price Rising + Volume Expanding:</strong> Strong institutional accumulation (Healthiest bull trend).</li>
              <li>• <strong>Price Rising + Volume Drying Up:</strong> Buyer exhaustion; trend is vulnerable to sudden correction.</li>
              <li>• <strong>Price Falling + Volume Expanding:</strong> Institutional liquidation / panic selling.</li>
              <li>• <strong>Price Falling + Volume Drying Up:</strong> Normal corrective pullback before trend resumption.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
