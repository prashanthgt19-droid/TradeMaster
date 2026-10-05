import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Smile, 
  Frown, 
  Meh, 
  X, 
  CheckCircle2,
  PieChart
} from 'lucide-react';
import { JournalEntry, MarketType } from '../types';

interface Props {
  entries: JournalEntry[];
  onAddEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  onDeleteEntry: (id: string) => void;
  onClose: () => void;
}

export const TradingJournalModal: React.FC<Props> = ({
  entries,
  onAddEntry,
  onDeleteEntry,
  onClose,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [symbol, setSymbol] = useState('NIFTY 50');
  const [market, setMarket] = useState<MarketType>('INDIAN_STOCK');
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [entryPrice, setEntryPrice] = useState<number>(25100);
  const [exitPrice, setExitPrice] = useState<number>(25200);
  const [quantity, setQuantity] = useState<number>(50);
  const [strategy, setStrategy] = useState('VWAP + Price Action Pullback');
  const [emotion, setEmotion] = useState<'Disciplined' | 'Fearful' | 'Greedy' | 'FOMO' | 'Confident' | 'Revenge Trade'>('Disciplined');
  const [lessonLearned, setLessonLearned] = useState('Waited for candle close above VWAP before entering; respected stop loss.');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const pnl = side === 'BUY'
      ? (exitPrice - entryPrice) * quantity
      : (entryPrice - exitPrice) * quantity;

    onAddEntry({
      date: new Date().toISOString().split('T')[0],
      market,
      symbol,
      side,
      entryPrice,
      exitPrice,
      quantity,
      pnl,
      strategy,
      emotion,
      lessonLearned,
    });
    setShowAddForm(false);
  };

  // Compute Statistics
  const totalTrades = entries.length;
  const winningTrades = entries.filter((e) => (e.pnl || 0) > 0).length;
  const losingTrades = entries.filter((e) => (e.pnl || 0) < 0).length;
  const winRate = totalTrades > 0 ? Math.round((winningTrades / totalTrades) * 100) : 0;
  
  const profits = entries.filter((e) => (e.pnl || 0) > 0).map((e) => e.pnl || 0);
  const losses = entries.filter((e) => (e.pnl || 0) < 0).map((e) => Math.abs(e.pnl || 0));
  
  const avgProfit = profits.length > 0 ? Math.round(profits.reduce((a, b) => a + b, 0) / profits.length) : 0;
  const avgLoss = losses.length > 0 ? Math.round(losses.reduce((a, b) => a + b, 0) / losses.length) : 0;
  const totalSimulatedPnl = entries.reduce((acc, e) => acc + (e.pnl || 0), 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 text-slate-100 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Trading Psychology & Performance Journal</h2>
              <p className="text-[11px] text-slate-400">Track habits, emotional patterns, strategy hit-rate and P&L</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all shadow"
            >
              <Plus size={14} />
              <span>Log Trade</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Total Trades</span>
            <p className="text-xl font-mono font-black text-white mt-0.5">{totalTrades}</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Win Rate</span>
            <p className="text-xl font-mono font-black text-emerald-400 mt-0.5">{winRate}%</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Avg Win / Loss</span>
            <p className="text-xs font-mono font-bold mt-1">
              <span className="text-emerald-400">+₹{avgProfit}</span> / <span className="text-red-400">-₹{avgLoss}</span>
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Total Simulated P&L</span>
            <p className={`text-xl font-mono font-black mt-0.5 ${totalSimulatedPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {totalSimulatedPnl >= 0 ? '+' : ''}₹{totalSimulatedPnl.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Add Entry Form Modal Drawer */}
        {showAddForm && (
          <form onSubmit={handleSave} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-4 space-y-3 text-xs">
            <div className="flex items-center justify-between font-bold text-white border-b border-slate-800 pb-2">
              <span>New Journal Entry</span>
              <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white">
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="text-slate-400 block mb-1">Symbol</label>
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-bold text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Side</label>
                <select
                  value={side}
                  onChange={(e) => setSide(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-bold text-white"
                >
                  <option value="BUY">BUY / LONG</option>
                  <option value="SELL">SELL / SHORT</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Entry Price (₹)</label>
                <input
                  type="number"
                  step="0.05"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Exit Price (₹)</label>
                <input
                  type="number"
                  step="0.05"
                  value={exitPrice}
                  onChange={(e) => setExitPrice(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-slate-400 block mb-1">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Setup / Strategy</label>
                <input
                  type="text"
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Dominant Emotion</label>
                <select
                  value={emotion}
                  onChange={(e) => setEmotion(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-bold"
                >
                  <option value="Disciplined">Disciplined (Followed Plan)</option>
                  <option value="FOMO">FOMO (Chased Market)</option>
                  <option value="Fearful">Fearful (Exited Prematurely)</option>
                  <option value="Greedy">Greedy (Failed to Take Profit)</option>
                  <option value="Revenge Trade">Revenge Trade (Emotional)</option>
                  <option value="Confident">Confident</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Lesson Learned / Reflection</label>
              <textarea
                value={lessonLearned}
                onChange={(e) => setLessonLearned(e.target.value)}
                rows={2}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                placeholder="What did you do right? What could you improve next time?"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-500 font-bold text-slate-950 hover:bg-emerald-400"
              >
                Save Trade Log
              </button>
            </div>
          </form>
        )}

        {/* Entries List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {entries.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <BookOpen size={36} className="mx-auto mb-2 opacity-40" />
              Your journal is empty. Click "+ Log Trade" to record a simulated trade and analyze your emotional patterns.
            </div>
          ) : (
            entries.map((item) => {
              const isProfit = (item.pnl || 0) >= 0;
              return (
                <div
                  key={item.id}
                  className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white text-sm">{item.symbol}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            item.side === 'BUY'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {item.side} {item.quantity} Qty
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
                      </div>

                      <p className="text-[11px] text-slate-300 mt-1 font-mono">
                        Entry: ₹{item.entryPrice} • Exit: ₹{item.exitPrice}
                      </p>
                      <p className="text-[11px] text-indigo-300 font-medium mt-0.5">
                        Setup: {item.strategy}
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-base font-black font-mono ${
                          isProfit ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {isProfit ? '+' : ''}₹{item.pnl?.toLocaleString('en-IN')}
                      </span>
                      <div className="flex items-center justify-end gap-1.5 mt-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                          {item.emotion}
                        </span>
                        <button
                          onClick={() => onDeleteEntry(item.id)}
                          className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {item.lessonLearned && (
                    <div className="mt-2.5 pt-2 border-t border-slate-900 text-[11px] text-slate-400 italic">
                      💡 Lesson: "{item.lessonLearned}"
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
