import React from 'react';

interface CandleSpec {
  open: number;
  high: number;
  low: number;
  close: number;
  color: 'green' | 'red' | 'gray';
  label?: string;
}

interface Props {
  candles: CandleSpec[];
  width?: number;
  height?: number;
  showLabels?: boolean;
}

export const CandlestickVisual: React.FC<Props> = ({
  candles,
  width = 240,
  height = 160,
  showLabels = true,
}) => {
  const paddingX = 30;
  const paddingY = 20;
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;

  // Coordinate mapper (high is 100%, low is 0%)
  const getY = (val: number) => {
    return height - paddingY - (val / 100) * usableHeight;
  };

  const candleSpacing = usableWidth / Math.max(1, candles.length);
  const candleBodyWidth = Math.min(26, candleSpacing * 0.55);

  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
      <svg width={width} height={height} className="overflow-visible">
        {/* Subtle grid lines */}
        <line x1={paddingX} y1={getY(75)} x2={width - paddingX} y2={getY(75)} stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
        <line x1={paddingX} y1={getY(50)} x2={width - paddingX} y2={getY(50)} stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
        <line x1={paddingX} y1={getY(25)} x2={width - paddingX} y2={getY(25)} stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />

        {candles.map((c, i) => {
          const cx = paddingX + candleSpacing * i + candleSpacing / 2;
          const yHigh = getY(c.high);
          const yLow = getY(c.low);
          const yOpen = getY(c.open);
          const yClose = getY(c.close);

          const isBullish = c.close > c.open;
          const isNeutral = Math.abs(c.close - c.open) < 2;

          let fillColor = '#10b981'; // Green
          let strokeColor = '#059669';
          if (c.color === 'red' || (!isBullish && !isNeutral)) {
            fillColor = '#ef4444'; // Red
            strokeColor = '#dc2626';
          } else if (c.color === 'gray' || isNeutral) {
            fillColor = '#94a3b8'; // Slate
            strokeColor = '#64748b';
          }

          const bodyTop = Math.min(yOpen, yClose);
          const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

          return (
            <g key={i} className="transition-all duration-300">
              {/* Wick */}
              <line
                x1={cx}
                y1={yHigh}
                x2={cx}
                y2={yLow}
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Real Body */}
              <rect
                x={cx - candleBodyWidth / 2}
                y={bodyTop}
                width={candleBodyWidth}
                height={bodyHeight}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth="1.5"
                rx="2"
              />

              {/* Label */}
              {showLabels && c.label && (
                <text
                  x={cx}
                  y={height - 4}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="10"
                  fontWeight="600"
                  className="select-none font-sans"
                >
                  {c.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {showLabels && (
        <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" /> Bullish (Close &gt; Open)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-red-500 inline-block" /> Bearish (Close &lt; Open)
          </span>
        </div>
      )}
    </div>
  );
};
