import React, { useState } from 'react';
import { 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle, 
  ShieldCheck, 
  Check, 
  X, 
  Clock, 
  Briefcase,
  History,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { MarketTicker, PaperTradeOrder, MarketType } from '../types';
import { INITIAL_MARKET_TICKERS } from '../data/marketSymbols';
import { InteractiveChart } from './InteractiveChart';

interface Props {
  virtualBalance: number;
  onUpdateBalance: (newBalance: number) => void;
  onSaveToJournal?: (trade: PaperTradeOrder) => void;
}

export const PaperTradingTerminal: React.FC<Props> = ({
  virtualBalance,
  onUpdateBalance,
  onSaveToJournal,
}) => {
  const [selectedTicker, setSelectedTicker] = useState<MarketTicker>(INITIAL_MARKET_TICKERS[0]);
  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT' | 'SL_LIMIT'>('MARKET');
  const [quantity, setQuantity] = useState<number>(10);
  const [limitPrice, setLimitPrice] = useState<number>(selectedTicker.price);
  const [stopLoss, setStopLoss] = useState<number>(Number((selectedTicker.price * 0.985).toFixed(2)));
  const [target, setTarget] = useState<number>(Number((selectedTicker.price * 1.03).toFixed(2)));

  const [activeTab, setActiveTab] = useState<'chart' | 'orders' | 'positions'>('chart');
  const [positions, setPositions] = useState<PaperTradeOrder[]>([
    {
      id: 'demo-pos-1',
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd.',
      market: 'INDIAN_STOCK',
      side: 'BUY',
      orderType: 'MARKET',
      entryPrice: 2920.00,
      currentPrice: 2942.30,
      quantity: 15,
      stopLoss: 2890.00,
      target: 3000.00,
      status: 'OPEN',
      unrealizedPnl: (2942.30 - 2920.00) * 15,
      openedAt: 'Today, 10:14 AM',
    },
  ]);

  const [closedTrades, setClosedTrades] = useState<PaperTradeOrder[]>([]);

  // Update prices as chart ticks
  const handlePriceUpdate = (newPrice: number) => {
    setSelectedTicker((prev) => ({
      ...prev,
      price: newPrice,
    }));

    // Update unrealized PnL on active positions for this symbol
    setPositions((prev) =>
      prev.map((pos) => {
        if (pos.symbol === selectedTicker.symbol) {
          const pnl = pos.side === 'BUY'
            ? (newPrice - pos.entryPrice) * pos.quantity
            : (pos.entryPrice - newPrice) * pos.quantity;
          return {
            ...pos,
            currentPrice: newPrice,
            unrealizedPnl: pnl,
          };
        }
        return pos;
      })
    );
  };

  const handleSelectTicker = (ticker: MarketTicker) => {
    setSelectedTicker(ticker);
    setLimitPrice(ticker.price);
    setStopLoss(Number((ticker.price * (orderSide === 'BUY' ? 0.985 : 1.015)).toFixed(2)));
    setTarget(Number((ticker.price * (orderSide === 'BUY' ? 1.03 : 0.97)).toFixed(2)));
  };

  const tradeCost = quantity * (orderType === 'MARKET' ? selectedTicker.price : limitPrice);
  const potentialLoss = Math.abs(stopLoss - (orderType === 'MARKET' ? selectedTicker.price : limitPrice)) * quantity;
  const potentialGain = Math.abs(target - (orderType === 'MARKET' ? selectedTicker.price : limitPrice)) * quantity;
  const rrRatio = potentialLoss > 0 ? (potentialGain / potentialLoss).toFixed(2) : 'N/A';

  const handleExecuteOrder = () => {
    if (orderSide === 'BUY' && tradeCost > virtualBalance) {
      alert('Insufficient virtual balance! Reduce quantity or close existing simulated positions.');
      return;
    }

    const execPrice = orderType === 'MARKET' ? selectedTicker.price : limitPrice;
    const newPosition: PaperTradeOrder = {
      id: `trade-${Date.now()}`,
      symbol: selectedTicker.symbol,
      name: selectedTicker.name,
      market: selectedTicker.market,
      side: orderSide,
      orderType,
      entryPrice: execPrice,
      currentPrice: execPrice,
      quantity,
      stopLoss,
      target,
      status: 'OPEN',
      unrealizedPnl: 0,
      openedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (orderSide === 'BUY') {
      onUpdateBalance(virtualBalance - tradeCost);
    } else {
      onUpdateBalance(virtualBalance + tradeCost);
    }

    setPositions([newPosition, ...positions]);
    setActiveTab('positions');
  };

  const handleClosePosition = (posId: string) => {
    const pos = positions.find((p) => p.id === posId);
    if (!pos) return;

    const exitPrice = pos.currentPrice;
    const realized = pos.side === 'BUY'
      ? (exitPrice - pos.entryPrice) * pos.quantity
      : (pos.entryPrice - exitPrice) * pos.quantity;

    const closedPos: PaperTradeOrder = {
      ...pos,
      status: 'CLOSED',
      realizedPnl: realized,
      closedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Return capital + realized PnL
    onUpdateBalance(virtualBalance + (pos.entryPrice * pos.quantity) + realized);

    setPositions(positions.filter((p) => p.id !== posId));
    setClosedTrades([closedPos, ...closedTrades]);

    if (onSaveToJournal) {
      onSaveToJournal(closedPos);
    }
  };

  const totalUnrealized = positions.reduce((acc, p) => acc + (p.unrealizedPnl || 0), 0);

  return (
    <div className="space-y-4">
      {/* Prominent Disclaimer Banner */}
      <div className="bg-amber-950/80 border border-amber-500/40 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-200">
        <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white uppercase font-bold tracking-wider">
            Simulated Educational Environment
          </strong>
          <p className="mt-0.5 text-slate-300">
            This is a simulated paper-trading platform. No real money or actual stock exchange orders are involved. Practice your position sizing, candlestick confirmations, and stop-loss discipline risk-free.
          </p>
        </div>
      </div>

      {/* Market Watch Ticker Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {INITIAL_MARKET_TICKERS.map((t) => {
          const isSelected = selectedTicker.symbol === t.symbol;
          const isUp = t.change >= 0;
          return (
            <button
              key={t.symbol}
              onClick={() => handleSelectTicker(t)}
              className={`px-3 py-2 rounded-xl border text-left shrink-0 transition-all ${
                isSelected
                  ? 'bg-slate-800 border-emerald-500 shadow-md'
                  : 'bg-slate-900/90 border-slate-800 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-extrabold text-xs text-white">{t.symbol}</span>
                <span className={`text-[10px] font-mono font-bold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isUp ? '+' : ''}{t.changePercent.toFixed(2)}%
                </span>
              </div>
              <p className="font-mono font-bold text-xs text-slate-200 mt-0.5">
                ₹{t.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </button>
          );
        })}
      </div>

      {/* Terminal View Switcher */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('chart')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'chart' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Chart
          </button>
          <button
            onClick={() => setActiveTab('positions')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'positions' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Open Positions</span>
            {positions.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px]">
                {positions.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Trade History ({closedTrades.length})
          </button>
        </div>

        <div className="text-right text-xs">
          <span className="text-slate-400 text-[11px]">Unrealized P&L: </span>
          <span className={`font-mono font-bold ${totalUnrealized >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalUnrealized >= 0 ? '+' : ''}₹{totalUnrealized.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Main Trading Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Chart or Open Positions */}
        <div className="lg:col-span-2">
          {activeTab === 'chart' && (
            <InteractiveChart
              symbol={selectedTicker.symbol}
              initialPrice={selectedTicker.price}
              onPriceChange={handlePriceUpdate}
            />
          )}

          {activeTab === 'positions' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 min-h-[300px]">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Active Virtual Positions ({positions.length})
              </h3>
              {positions.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  <Briefcase size={32} className="mx-auto mb-2 opacity-50" />
                  No open positions. Use the order panel on the right to enter a simulated paper trade.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {positions.map((pos) => {
                    const pnl = pos.unrealizedPnl || 0;
                    const isProfit = pnl >= 0;
                    return (
                      <div
                        key={pos.id}
                        className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-white text-sm">{pos.symbol}</span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                pos.side === 'BUY'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-red-500/20 text-red-300'
                              }`}
                            >
                              {pos.side} {pos.quantity} Qty
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-mono">
                            <span>Entry: ₹{pos.entryPrice.toFixed(2)}</span>
                            <span>LTP: ₹{pos.currentPrice.toFixed(2)}</span>
                            <span>SL: ₹{pos.stopLoss || 'None'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400">P&L</span>
                            <p className={`font-mono font-black text-sm ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                              {isProfit ? '+' : ''}₹{pnl.toFixed(2)}
                            </p>
                          </div>

                          <button
                            onClick={() => handleClosePosition(pos.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-700 hover:bg-red-900/60 text-red-200 font-bold text-xs transition-colors"
                          >
                            Square Off
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 min-h-[300px]">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Closed Trades History
              </h3>
              {closedTrades.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  <History size={32} className="mx-auto mb-2 opacity-50" />
                  No closed trades yet in this session.
                </div>
              ) : (
                <div className="space-y-2">
                  {closedTrades.map((t) => {
                    const pnl = t.realizedPnl || 0;
                    return (
                      <div
                        key={t.id}
                        className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{t.symbol}</span>
                            <span className="text-[10px] text-slate-400">{t.side} {t.quantity} Qty</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                            Bought ₹{t.entryPrice} • Sold ₹{t.currentPrice} • Closed at {t.closedAt}
                          </p>
                        </div>
                        <span
                          className={`font-mono font-bold text-sm ${
                            pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {pnl >= 0 ? '+' : ''}₹{pnl.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Col: Instant Order Placement Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-black text-white uppercase tracking-wider">
                Order Placement
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                LTP: ₹{selectedTicker.price.toFixed(2)}
              </span>
            </div>

            {/* Buy / Sell Tabs */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setOrderSide('BUY')}
                className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  orderSide === 'BUY'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                BUY / LONG
              </button>
              <button
                onClick={() => setOrderSide('SELL')}
                className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  orderSide === 'SELL'
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                SELL / SHORT
              </button>
            </div>

            {/* Order Types */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
              {(['MARKET', 'LIMIT', 'SL_LIMIT'] as const).map((ot) => (
                <button
                  key={ot}
                  onClick={() => setOrderType(ot)}
                  className={`flex-1 py-1 rounded-lg transition-all ${
                    orderType === ot ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {ot}
                </button>
              ))}
            </div>

            {/* Quantity */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Quantity</span>
                <span className="text-slate-400 font-mono">Total: ₹{tradeCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-white"
              />
            </div>

            {/* Limit Price if not market */}
            {orderType !== 'MARKET' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Limit Price (₹)</label>
                <input
                  type="number"
                  step="0.05"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-white"
                />
              </div>
            )}

            {/* Stop Loss & Target */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block font-semibold text-red-400 mb-1">Stop-Loss (₹)</label>
                <input
                  type="number"
                  step="0.05"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-red-500/40 rounded-xl px-2.5 py-1.5 font-mono font-bold text-red-300"
                />
              </div>
              <div>
                <label className="block font-semibold text-emerald-400 mb-1">Target (₹)</label>
                <input
                  type="number"
                  step="0.05"
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-emerald-500/40 rounded-xl px-2.5 py-1.5 font-mono font-bold text-emerald-300"
                />
              </div>
            </div>

            {/* Risk / Reward Metrics preview */}
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Potential Loss:</span>
                <span className="font-mono font-bold text-red-400">-₹{potentialLoss.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Potential Profit:</span>
                <span className="font-mono font-bold text-emerald-400">+₹{potentialGain.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800/60 pt-1 font-semibold">
                <span className="text-slate-300">Risk : Reward</span>
                <span className="font-mono text-amber-300">1 : {rrRatio}</span>
              </div>
            </div>
          </div>

          {/* Execute Button */}
          <button
            onClick={handleExecuteOrder}
            className={`w-full py-3 mt-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg ${
              orderSide === 'BUY'
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                : 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/20'
            }`}
          >
            {orderSide} {quantity} {selectedTicker.symbol} ({orderType})
          </button>
        </div>
      </div>
    </div>
  );
};
