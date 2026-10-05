/**
 * Core Data Models & TypeScript Interfaces for TradeMaster India
 */

export type MarketType = 'INDIAN_STOCK' | 'FOREX' | 'CRYPTO' | 'GENERAL';

export type LevelNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  type?: 'mcq' | 'true_false' | 'identify_candle' | 'risk_calc';
}

export interface LessonContentSection {
  title?: string;
  body: string;
  bulletPoints?: string[];
  calloutBox?: {
    type: 'tip' | 'warning' | 'example' | 'regulatory';
    title: string;
    text: string;
  };
  chartType?: 'candlestick' | 'support_resistance' | 'indicator' | 'breakout';
}

export interface LessonVideo {
  youtubeId?: string;
  videoUrl?: string;
  duration?: string;
  title?: string;
  channelName?: string;
  timestamps?: { time: string; label: string }[];
}

export interface Lesson {
  id: string;
  courseId: string;
  level: LevelNumber;
  title: string;
  category: string;
  marketType: MarketType;
  description: string;
  estimatedMinutes: number;
  order: number;
  isLocked: boolean;
  rewardAdRequired: boolean;
  objectives: string[];
  contentSections: LessonContentSection[];
  keyTakeaways: string[];
  commonMistakes: string[];
  quiz: QuizQuestion[];
  pdfAvailable: boolean;
  video?: LessonVideo;
}

export interface CourseLevelInfo {
  level: LevelNumber;
  title: string;
  subtitle: string;
  market: MarketType;
  description: string;
  badgeName: string;
  badgeIcon: string;
  totalLessons: number;
  accentColor: string;
}

export interface CandlestickPattern {
  id: string;
  name: string;
  hindiName?: string;
  category: 'SINGLE' | 'DOUBLE' | 'TRIPLE';
  bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  type: 'REVERSAL' | 'CONTINUATION' | 'INDECISION';
  appearance: string;
  meaning: string;
  psychology: string;
  interpretation: string;
  whereUseful: string;
  confirmationRequirements: string;
  commonMistakes: string[];
  realExample: string;
  quizQuestion: QuizQuestion;
  candleVisualSpec: {
    candles: Array<{
      open: number;
      high: number;
      low: number;
      close: number;
      color: 'green' | 'red' | 'gray';
      label?: string;
    }>;
  };
}

export interface IndicatorData {
  id: string;
  name: string;
  shortName: string;
  category: 'TREND' | 'MOMENTUM' | 'VOLATILITY' | 'VOLUME' | 'SUPPORT_RESISTANCE';
  description: string;
  whatItMeasures: string;
  howItWorks: string;
  standardSettings: string;
  howToInterpret: string[];
  example: string;
  strengths: string[];
  limitations: string[];
  commonMistakes: string[];
  quizQuestion: QuizQuestion;
}

export interface UserProgressRecord {
  lessonId: string;
  completed: boolean;
  quizScore: number;
  quizPassed: boolean;
  unlockedViaReward: boolean;
  pdfDownloaded: boolean;
  updatedAt: string;
}

export interface UserProfileState {
  userId: string;
  displayName: string;
  email?: string;
  virtualBalance: number;
  streakDays: number;
  lastActiveDate: string;
  bookmarks: string[];
  progress: Record<string, UserProgressRecord>;
  badges: string[];
}

export interface PaperTradeOrder {
  id: string;
  symbol: string;
  name: string;
  market: MarketType;
  side: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT' | 'SL_LIMIT';
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  stopLoss?: number;
  target?: number;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  realizedPnl?: number;
  unrealizedPnl?: number;
  openedAt: string;
  closedAt?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  market: MarketType;
  symbol: string;
  side: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice?: number;
  stopLoss?: number;
  target?: number;
  quantity: number;
  pnl?: number;
  strategy: string;
  emotion: 'Disciplined' | 'Fearful' | 'Greedy' | 'FOMO' | 'Confident' | 'Revenge Trade';
  lessonLearned: string;
  createdAt: string;
}

export interface MarketTicker {
  symbol: string;
  name: string;
  market: MarketType;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: string;
  history: number[];
}
