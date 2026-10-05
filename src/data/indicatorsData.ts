import { IndicatorData } from '../types';

export const INDICATORS_DATA: IndicatorData[] = [
  {
    id: 'vwap',
    name: 'Volume Weighted Average Price (VWAP)',
    shortName: 'VWAP',
    category: 'VOLUME',
    description: 'The supreme intraday benchmark representing the average price weighted by volume throughout the trading day.',
    whatItMeasures: 'The true institutional average price of a stock based on cumulative volume traded at each price point during the current day.',
    howItWorks: 'Calculates the sum of (Typical Price × Volume) divided by Total Cumulative Volume since the 9:15 AM market open.',
    standardSettings: 'Session VWAP (intraday reset at 9:15 AM IST). Often plotted with upper and lower standard deviation bands.',
    howToInterpret: [
      'Price ABOVE VWAP: Intraday trend is bullish; institutional buyers are in control.',
      'Price BELOW VWAP: Intraday trend is bearish; institutional sellers dominate.',
      'VWAP Pullback: Buying pullbacks towards VWAP in an uptrend offers high-probability entries with tight stop-losses.',
    ],
    example: 'Reliance opens at ₹2,900, rallies to ₹2,930, pulls back to VWAP at ₹2,912 with a bullish hammer candle, and resumes rally to ₹2,945.',
    strengths: [
      'Eliminates single-tick noise and reflects real institutional participation.',
      'Widely used by algorithmic trading desks and mutual funds executing large blocks.',
    ],
    limitations: [
      'Strictly an intraday indicator; resets to zero each morning.',
      'Less effective in late afternoon when volume accumulates and VWAP moves slowly.',
    ],
    commonMistakes: [
      'Using VWAP on daily or weekly charts (it is designed exclusively for intraday 1m to 15m charts).',
      'Shorting an equity that is trading strongly above an upward-sloping VWAP.',
    ],
    quizQuestion: {
      id: 'quiz-vwap',
      question: 'Why do institutional fund managers benchmark their intraday executions against VWAP?',
      options: [
        'Because buying below VWAP means their average execution was cheaper than the overall market volume average',
        'Because SEBI penalizes anyone who trades away from VWAP',
        'VWAP guarantees a 50% profit',
        'VWAP is the only indicator on TV',
      ],
      correctIndex: 0,
      explanation: 'Institutions strive to buy below VWAP and sell above VWAP to achieve favorable average pricing.',
    },
  },
  {
    id: 'rsi',
    name: 'Relative Strength Index (RSI)',
    shortName: 'RSI',
    category: 'MOMENTUM',
    description: 'A momentum oscillator measuring the speed and velocity of recent price changes on a scale of 0 to 100.',
    whatItMeasures: 'Internal momentum and speed of directional price moves; identifies overbought, oversold, and divergence conditions.',
    howItWorks: 'Compares the magnitude of recent gains to recent losses over a specified lookback window.',
    standardSettings: '14 periods. Overbought threshold: 70. Oversold threshold: 30. Midline: 50.',
    howToInterpret: [
      'RSI > 70: Overbought territory. Look for momentum deceleration or potential pullback (do NOT blindly short).',
      'RSI < 30: Oversold territory. Look for signs of buying absorption.',
      'RSI > 50: Bullish momentum dominates; buyers have statistical advantage.',
      'Bullish Divergence: Price creates Lower Low, but RSI creates Higher Low (bullish reversal clue).',
      'Bearish Divergence: Price creates Higher High, but RSI creates Lower High (bearish reversal clue).',
    ],
    example: 'Nifty 50 daily chart drops to a new swing low at 24,000, while RSI rises from 24 to 34 (Bullish Divergence). Nifty reverses and rallies 800 points.',
    strengths: [
      'Divergences provide early warning signals before price reverses.',
      'Works across all timeframes (5m, 15m, 1H, Daily, Weekly).',
    ],
    limitations: [
      'In strong trending runaway markets, RSI can stay pinned above 70 or below 30 for weeks.',
    ],
    commonMistakes: [
      'Selling immediately upon RSI crossing 70 during a powerful breakout.',
    ],
    quizQuestion: {
      id: 'quiz-rsi',
      question: 'What is a "Bullish Divergence" on the RSI oscillator?',
      options: [
        'Price makes a lower low while RSI makes a higher low',
        'Both price and RSI hit 100',
        'RSI drops to negative numbers',
        'RSI crosses above 70',
      ],
      correctIndex: 0,
      explanation: 'Bullish divergence occurs when downward price momentum weakens, indicated by higher lows on RSI while price reaches new lows.',
    },
  },
  {
    id: 'macd',
    name: 'Moving Average Convergence Divergence',
    shortName: 'MACD',
    category: 'TREND',
    description: 'A trend-following momentum indicator displaying the relationship between two exponential moving averages.',
    whatItMeasures: 'Both trend direction and momentum acceleration/deceleration.',
    howItWorks: 'MACD Line = (12 EMA - 26 EMA). Signal Line = 9 EMA of MACD Line. Histogram = MACD Line - Signal Line.',
    standardSettings: 'Fast Length: 12, Slow Length: 26, Signal Smoothing: 9 (Standard 12, 26, 9).',
    howToInterpret: [
      'Bullish Crossover: MACD line crosses ABOVE the Signal line, histogram turns green.',
      'Bearish Crossover: MACD line crosses BELOW the Signal line, histogram turns red.',
      'Zero Line: MACD crossing above 0 confirms broader upward trend; below 0 confirms downward trend.',
    ],
    example: 'Tata Steel daily chart MACD crosses above Signal Line below the zero line, triggering a fresh multi-week swing rally.',
    strengths: [
      'Combines trend and momentum in one cohesive indicator.',
      'Reduces noise compared to raw price crossovers.',
    ],
    limitations: [
      'Lagging indicator; crossovers happen after a portion of the move has already unfolded.',
    ],
    commonMistakes: [
      'Taking every tiny MACD crossover in a flat, sideways range where false signals abound.',
    ],
    quizQuestion: {
      id: 'quiz-macd',
      question: 'What does a rising green MACD histogram indicate?',
      options: [
        'The distance between the MACD line and the Signal line is expanding in favor of the bulls',
        'The stock exchange is giving bonus shares',
        'Zero trades are happening',
        'The stock is overvalued by 100%',
      ],
      correctIndex: 0,
      explanation: 'An expanding green histogram shows that bullish momentum is accelerating faster than its signal average.',
    },
  },
  {
    id: 'bollinger-bands',
    name: 'Bollinger Bands',
    shortName: 'BB',
    category: 'VOLATILITY',
    description: 'A volatility indicator consisting of a middle moving average with statistical standard deviation envelopes above and below.',
    whatItMeasures: 'Relative highness or lowness of price and cyclical volatility expansion and contraction.',
    howItWorks: 'Middle Band = 20 SMA. Upper Band = 20 SMA + (2 × 20-period Standard Deviation). Lower Band = 20 SMA - (2 × Standard Deviation).',
    standardSettings: 'Length: 20, Standard Deviation: 2.0.',
    howToInterpret: [
      'Bollinger Squeeze: Bands contract tightly together; indicates a period of quiet consolidation that precedes explosive directional breakouts.',
      'Band Walking: In a strong trend, price frequently "walks" along the upper or lower band without reversing.',
      'Double Bottom at Lower Band: Price touches lower band, bounces, tests lower level on higher band value, then rallies (W-Bottom).',
    ],
    example: 'Bank Nifty 15-minute bands contract to their tightest level in 5 days, followed by a 400-point breakout bar.',
    strengths: [
      'Dynamically adapts to changing market volatility.',
      'Statistically 90-95% of price action remains contained within 2 standard deviations.',
    ],
    limitations: [
      'Bands widen after volatility has already exploded.',
    ],
    commonMistakes: [
      'Assuming touching the upper band is an automatic sell signal (in strong bull runs, price hugs the upper band for days).',
    ],
    quizQuestion: {
      id: 'quiz-bb',
      question: 'What does a "Bollinger Band Squeeze" foreshadow?',
      options: [
        'An impending explosive volatility breakout as market compression resolves',
        'Permanent market closure',
        'A guaranteed 0% return',
        'A dividend payout',
      ],
      correctIndex: 0,
      explanation: 'Periods of low volatility (squeeze) are cyclically followed by periods of high volatility (expansion).',
    },
  },
  {
    id: 'fibonacci-retracement',
    name: 'Fibonacci Retracement & Extension',
    shortName: 'Fibonacci',
    category: 'SUPPORT_RESISTANCE',
    description: 'Mathematical ratio levels derived from the Fibonacci sequence that act as natural geometric inflection zones for pullbacks.',
    whatItMeasures: 'The depth of a corrective pullback within an ongoing impulse trend.',
    howItWorks: 'Plotted between a major Swing Low and Swing High (for an uptrend) or Swing High to Swing Low (for a downtrend).',
    standardSettings: 'Key Retracement Levels: 23.6%, 38.2%, 50% (Dow midpoint), 61.8% (Golden Ratio), 78.6%. Extension: 127.2%, 161.8%.',
    howToInterpret: [
      'Golden Pocket (50% – 61.8%): The sweet spot where high-probability trend pullbacks terminate and find strong buyer support.',
      'Confluence: A 61.8% Fib retracement aligning with a horizontal support zone and 50 SMA creates high-probability confluence.',
    ],
    example: 'Nifty rallies from 24,000 to 25,000 (1,000-point impulse). It pulls back to 24,382 (61.8% retracement level) and prints a bullish hammer before surging to new highs.',
    strengths: [
      'Universal self-fulfilling prophecy tracked by algorithmic trading models worldwide.',
      'Provides objective, mathematical risk-to-reward boundaries.',
    ],
    limitations: [
      'Subjective: different traders may pick slightly different swing points to draw from.',
    ],
    commonMistakes: [
      'Drawing Fibonacci backwards or forcing it across arbitrary, insignificant intraday wicks.',
    ],
    quizQuestion: {
      id: 'quiz-fib',
      question: 'Which Fibonacci level is universally referred to as the "Golden Ratio"?',
      options: ['61.8% (0.618)', '10%', '99.9%', '5%'],
      correctIndex: 0,
      explanation: 'The 61.8% ratio is the mathematical Golden Ratio (Phi) observed in geometry, nature, and financial markets.',
    },
  },
  {
    id: 'atr',
    name: 'Average True Range (ATR)',
    shortName: 'ATR',
    category: 'VOLATILITY',
    description: 'Measures absolute market volatility in currency units or points without directional bias.',
    whatItMeasures: 'The average price range an asset moves over N periods, taking into account overnight gaps.',
    howItWorks: 'True Range is the maximum of: (Current High - Current Low), |Current High - Previous Close|, or |Current Low - Previous Close|. ATR is the 14-period smoothed average.',
    standardSettings: '14 periods.',
    howToInterpret: [
      'Stop-Loss Placement: A 1.5x or 2x ATR stop-loss adapts automatically to current volatility, keeping you safe from random market noise.',
      'High ATR = High volatility; widen stop-loss and reduce position size.',
      'Low ATR = Low volatility; price ranges are compressed.',
    ],
    example: 'Nifty ATR is 150 points. A 1.5x ATR stop loss means giving your swing trade 225 points of breathing room.',
    strengths: [
      'Essential for objective, volatility-based stop-loss placement and position sizing.',
    ],
    limitations: [
      'Provides zero indication of trend direction (ATR can spike during both rallies and crashes).',
    ],
    commonMistakes: [
      'Thinking a high ATR means you should buy (it only means volatility is high).',
    ],
    quizQuestion: {
      id: 'quiz-atr',
      question: 'What is the primary practical use of the Average True Range (ATR) indicator?',
      options: [
        'Setting volatility-adjusted stop-loss buffers and sizing positions appropriately',
        'Predicting exact market top ticks',
        'Calculating broker commission fees',
        'Finding which company will declare dividends',
      ],
      correctIndex: 0,
      explanation: 'ATR measures market volatility, allowing traders to set stop-losses that adjust to current market noise.',
    },
  },
];
