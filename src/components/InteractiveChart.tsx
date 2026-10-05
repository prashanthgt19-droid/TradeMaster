import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, BarChart2, TrendingUp, Layers, Eye, EyeOff } from 'lucide-react';

interface Props {
  symbol: string;
  initialPrice: number;
  marketType?: string;
  onPriceChange?: (newPrice: number) => void;
}

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const InteractiveChart: React.FC<Props> = ({
  symbol,
  initialPrice,
  onPriceChange,
}) => {
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1D'>('5m');
  const [chartType, setChartType] = useState<'candle' | 'line'>('candle');
  const [showEma9, setShowEma9] = useState(true);
  const [showEma20, setShowEma20] = useState(true);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showRsi, setShowRsi] = useState(false);
  const [showVolume, setShowVolume] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);

  // Generate initial candle series
  const [candles, setCandles] = useState<Candle[]>(() => {
    const list: Candle[] = [];
    let current = initialPrice * 0.98;
    const count = 32;

    for (let i = 0; i < count; i++) {
      const volatility = initialPrice * 0.004;
      const change = (Math.random() - 0.48) * volatility;
      const open = current;
      const close = Math.max(1, open + change);
      const high = Math.max(open, close) + Math.random() * volatility * 0.6;
      const low = Math.min(open, close) - Math.random() * volatility * 0.6;
      const volume = Math.floor(10000 + Math.random() * 80000);

      const minsAgo = (count - i) * 5;
      const date = new Date(Date.now() - minsAgo * 60000);
      const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

      list.push({
        time: timeStr,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume,
      });
      current = close;
    }
    return list;
  });

  // Simulated live market ticks
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCandles((prev) => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        const volatility = last.close * 0.0015;
        const delta = (Math.random() - 0.49) * volatility;
        const newClose = Number(Math.max(1, last.close + delta).toFixed(2));
        const newHigh = Number(Math.max(last.high, newClose).toFixed(2));
        const newLow = Number(Math.min(last.low, newClose).toFixed(2));
        const updatedLast = {
          ...last,
          close: newClose,
          high: newHigh,
          low: newLow,
          volume: last.volume + Math.floor(Math.random() * 200),
        };

        if (onPriceChange) {
          onPriceChange(newClose);
        }

        return [...prev.slice(0, prev.length - 1), updatedLast];
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isPlaying, onPriceChange]);

  const latestCandle = candles[candles.length - 1] || null;
  const currentPrice = latestCandle?.close || initialPrice;
  const openFirst = candles[0]?.open || initialPrice;
  const priceDiff = currentPrice - openFirst;
  const percentDiff = (priceDiff / openFirst) * 100;
  const isPositive = priceDiff >= 0;

  // Compute Moving Averages
  const calculateEma = (period: number): number[] => {
    const k = 2 / (period + 1);
    const emaValues: number[] = [];
    let prevEma = candles[0]?.close || 0;

    candles.forEach((c, idx) => {
      if (idx === 0) {
        emaValues.push(prevEma);
      } else {
        const ema = c.close * k + prevEma * (1 - k);
        emaValues.push(ema);
        prevEma = ema;
      }
    });
    return emaValues;
  };

  const ema9 = calculateEma(9);
  const ema20 = calculateEma(20);

  // Min and max for chart bounds
  const prices = candles.flatMap((c) => [c.high, c.low]);
  const minPrice = Math.min(...prices) * 0.998;
  const maxPrice = Math.max(...prices) * 1.002;
  const priceRange = Math.max(1, maxPrice - minPrice);

  const maxVolume = Math.max(...candles.map((c) => c.volume), 1);

  // SVG dimensions
  const svgWidth = 600;
  const svgHeight = showRsi ? 230 : 280;
  const rsiHeight = 70;
  const marginY = 20;
  const marginX = 15;
  const chartHeight = svgHeight - marginY * 2;
  const usableWidth = svgWidth - marginX * 2;
  const candleWidth = Math.max(4, Math.min(14, (usableWidth / candles.length) * 0.65));

  const getY = (val: number) => {
    return marginY + chartHeight - ((val - minPrice) / priceRange) * chartHeight;
  };

  const activeCandle = hoveredCandle || latestCandle;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl text-slate-100 flex flex-col gap-3 select-none">
      {/* Top Controls & Ticker Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wide text-white">{symbol}</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {timeframe}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-black font-mono tracking-tight text-white">
                ₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className={`text-xs font-bold font-mono ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}{priceDiff.toFixed(2)} ({isPositive ? '+' : ''}{percentDiff.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {/* Timeframes */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            {(['1m', '5m', '15m', '1D'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 rounded-md font-bold transition-colors ${
                  timeframe === tf ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Style */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setChartType('candle')}
              className={`px-2 py-1 rounded-md font-bold transition-colors ${
                chartType === 'candle' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Candles
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-2 py-1 rounded-md font-bold transition-colors ${
                chartType === 'line' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Line
            </button>
          </div>

          {/* Simulator Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause ticks' : 'Resume ticks'}
            className={`p-1.5 rounded-lg border flex items-center justify-center transition-colors ${
              isPlaying
                ? 'bg-emerald-950/80 border-emerald-700 text-emerald-400'
                : 'bg-amber-950/80 border-amber-700 text-amber-400'
            }`}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
        </div>
      </div>

      {/* Indicator Chips Bar */}
      <div className="flex flex-wrap items-center justify-between text-xs gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setShowEma9(!showEma9)}
            className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold flex items-center gap-1 transition-all ${
              showEma9
                ? 'bg-blue-950 border-blue-500 text-blue-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
            EMA 9
          </button>

          <button
            onClick={() => setShowEma20(!showEma20)}
            className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold flex items-center gap-1 transition-all ${
              showEma20
                ? 'bg-amber-950 border-amber-500 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            EMA 20
          </button>

          <button
            onClick={() => setShowBollinger(!showBollinger)}
            className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold flex items-center gap-1 transition-all ${
              showBollinger
                ? 'bg-purple-950 border-purple-500 text-purple-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
            Bollinger Bands
          </button>

          <button
            onClick={() => setShowRsi(!showRsi)}
            className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold flex items-center gap-1 transition-all ${
              showRsi
                ? 'bg-pink-950 border-pink-500 text-pink-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 inline-block" />
            RSI 14
          </button>

          <button
            onClick={() => setShowVolume(!showVolume)}
            className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold flex items-center gap-1 transition-all ${
              showVolume
                ? 'bg-slate-800 border-slate-600 text-slate-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            Vol
          </button>
        </div>

        {/* OHLC Bar */}
        {activeCandle && (
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300">
            <span>O: <strong className="text-white">{activeCandle.open}</strong></span>
            <span>H: <strong className="text-emerald-400">{activeCandle.high}</strong></span>
            <span>L: <strong className="text-red-400">{activeCandle.low}</strong></span>
            <span>C: <strong className="text-white">{activeCandle.close}</strong></span>
          </div>
        )}
      </div>

      {/* Main Interactive SVG Chart */}
      <div className="relative bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden w-full">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto cursor-crosshair"
          onMouseLeave={() => setHoveredCandle(null)}
        >
          <defs>
            <linearGradient id="bullishGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="bearishGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((ratio) => {
            const y = marginY + chartHeight * ratio;
            const priceLevel = maxPrice - ratio * priceRange;
            return (
              <g key={ratio}>
                <line x1={marginX} y1={y} x2={svgWidth - marginX} y2={y} stroke="#1e293b" strokeDasharray="3 3" strokeWidth="0.8" />
                <text x={svgWidth - marginX - 5} y={y - 3} textAnchor="end" fill="#64748b" fontSize="9" fontFamily="monospace">
                  ₹{priceLevel.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Volume Bars at Bottom */}
          {showVolume &&
            candles.map((c, i) => {
              const x = marginX + (i / (candles.length - 1)) * usableWidth;
              const volHeight = (c.volume / maxVolume) * 45;
              const y = svgHeight - marginY - volHeight;
              const isGreen = c.close >= c.open;
              return (
                <rect
                  key={`vol-${i}`}
                  x={x - candleWidth / 2}
                  y={y}
                  width={candleWidth}
                  height={volHeight}
                  fill={isGreen ? '#10b981' : '#ef4444'}
                  opacity={0.22}
                />
              );
            })}

          {/* Bollinger Bands */}
          {showBollinger && (
            <path
              d={candles
                .map((c, i) => {
                  const x = marginX + (i / (candles.length - 1)) * usableWidth;
                  const dev = priceRange * 0.12;
                  const yUpper = getY(Math.min(maxPrice, ema20[i] + dev));
                  return `${i === 0 ? 'M' : 'L'} ${x} ${yUpper}`;
                })
                .join(' ')}
              fill="none"
              stroke="#c084fc"
              strokeWidth="1.2"
              strokeDasharray="2 2"
              opacity={0.7}
            />
          )}

          {/* EMA 9 Line */}
          {showEma9 && (
            <path
              d={ema9
                .map((val, i) => {
                  const x = marginX + (i / (candles.length - 1)) * usableWidth;
                  const y = getY(val);
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                })
                .join(' ')}
              fill="none"
              stroke="#60a5fa"
              strokeWidth="1.8"
            />
          )}

          {/* EMA 20 Line */}
          {showEma20 && (
            <path
              d={ema20
                .map((val, i) => {
                  const x = marginX + (i / (candles.length - 1)) * usableWidth;
                  const y = getY(val);
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                })
                .join(' ')}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.8"
            />
          )}

          {/* Candles or Line Chart */}
          {chartType === 'line' ? (
            <path
              d={candles
                .map((c, i) => {
                  const x = marginX + (i / (candles.length - 1)) * usableWidth;
                  const y = getY(c.close);
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                })
                .join(' ')}
              fill="none"
              stroke={isPositive ? '#10b981' : '#ef4444'}
              strokeWidth="2.2"
            />
          ) : (
            candles.map((c, i) => {
              const x = marginX + (i / (candles.length - 1)) * usableWidth;
              const yHigh = getY(c.high);
              const yLow = getY(c.low);
              const yOpen = getY(c.open);
              const yClose = getY(c.close);
              const isGreen = c.close >= c.open;
              const color = isGreen ? '#10b981' : '#ef4444';
              const bodyTop = Math.min(yOpen, yClose);
              const bodyHeight = Math.max(1.8, Math.abs(yClose - yOpen));

              return (
                <g
                  key={i}
                  onMouseEnter={() => setHoveredCandle(c)}
                  className="cursor-pointer group"
                >
                  {/* Invisible broad hitbox for smooth mobile / mouse hover */}
                  <rect
                    x={x - candleWidth}
                    y={marginY}
                    width={candleWidth * 2}
                    height={chartHeight}
                    fill="transparent"
                  />
                  {/* Wick */}
                  <line
                    x1={x}
                    y1={yHigh}
                    x2={x}
                    y2={yLow}
                    stroke={color}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  {/* Body */}
                  <rect
                    x={x - candleWidth / 2}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={color}
                    rx="1"
                    className="transition-all duration-150"
                  />
                </g>
              );
            })
          )}

          {/* Current Live Price Line */}
          {latestCandle && (
            <g>
              <line
                x1={marginX}
                y1={getY(latestCandle.close)}
                x2={svgWidth - marginX}
                y2={getY(latestCandle.close)}
                stroke={isPositive ? '#10b981' : '#ef4444'}
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              <rect
                x={svgWidth - marginX - 58}
                y={getY(latestCandle.close) - 9}
                width="56"
                height="18"
                fill={isPositive ? '#065f46' : '#991b1b'}
                rx="3"
              />
              <text
                x={svgWidth - marginX - 30}
                y={getY(latestCandle.close) + 3}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {latestCandle.close}
              </text>
            </g>
          )}
        </svg>

        {/* RSI Sub-Panel */}
        {showRsi && (
          <div className="border-t border-slate-800 bg-slate-950/90 p-2">
            <div className="flex items-center justify-between text-[10px] text-pink-400 font-mono font-bold mb-1">
              <span>RSI (14)</span>
              <span>Value: 56.4 (Bullish Momentum)</span>
            </div>
            <div className="h-9 relative border-y border-slate-800/80">
              <div className="absolute top-[30%] left-0 right-0 border-b border-pink-500/20 text-[9px] text-slate-500">
                <span className="absolute right-1 -top-3">70</span>
              </div>
              <div className="absolute top-[70%] left-0 right-0 border-b border-pink-500/20 text-[9px] text-slate-500">
                <span className="absolute right-1 -top-3">30</span>
              </div>
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path
                  d="M 0 18 Q 20 8 40 22 T 80 12 T 100 15"
                  fill="none"
                  stroke="#f472b6"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
