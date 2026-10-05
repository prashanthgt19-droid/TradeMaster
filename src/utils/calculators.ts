/**
 * Trading Math & Risk Calculators with Indian Market Taxes/Charges
 */

export interface PositionSizeResult {
  maxRiskAmount: number;
  riskPerShare: number;
  positionSize: number;
  totalInvestment: number;
  targetPrice?: number;
  potentialProfit?: number;
  riskRewardRatio?: number;
  stopLossPercent: number;
}

export function calculatePositionSize(
  capital: number,
  riskPercent: number,
  entryPrice: number,
  stopLossPrice: number,
  targetPrice?: number
): PositionSizeResult {
  const maxRiskAmount = (capital * riskPercent) / 100;
  const isLong = entryPrice >= stopLossPrice;
  const riskPerShare = isLong ? Math.max(0.01, entryPrice - stopLossPrice) : Math.max(0.01, stopLossPrice - entryPrice);
  
  const positionSize = Math.max(1, Math.floor(maxRiskAmount / riskPerShare));
  const totalInvestment = positionSize * entryPrice;
  const stopLossPercent = (riskPerShare / entryPrice) * 100;

  let potentialProfit: number | undefined;
  let riskRewardRatio: number | undefined;

  if (targetPrice) {
    const profitPerShare = isLong ? targetPrice - entryPrice : entryPrice - targetPrice;
    potentialProfit = positionSize * Math.max(0, profitPerShare);
    riskRewardRatio = Math.max(0, profitPerShare / riskPerShare);
  }

  return {
    maxRiskAmount,
    riskPerShare,
    positionSize,
    totalInvestment,
    targetPrice,
    potentialProfit,
    riskRewardRatio,
    stopLossPercent,
  };
}

export interface IndianBrokerageCharges {
  brokerage: number;
  stt: number;
  exchangeCharges: number;
  gst: number;
  sebiTurnoverFee: number;
  stampDuty: number;
  totalCharges: number;
  netPnl: number;
  breakevenPoints: number;
}

export function calculateIndianEquitiesCharges(
  tradeType: 'INTRADAY' | 'DELIVERY',
  buyPrice: number,
  sellPrice: number,
  quantity: number
): IndianBrokerageCharges {
  const buyTurnover = buyPrice * quantity;
  const sellTurnover = sellPrice * quantity;
  const totalTurnover = buyTurnover + sellTurnover;
  const grossPnl = (sellPrice - buyPrice) * quantity;

  // Brokerage (Discount broker standard: ₹20 or 0.03%, whichever is lower per executed order)
  const buyBrokerage = tradeType === 'DELIVERY' ? 0 : Math.min(20, buyTurnover * 0.0003);
  const sellBrokerage = tradeType === 'DELIVERY' ? 0 : Math.min(20, sellTurnover * 0.0003);
  const brokerage = buyBrokerage + sellBrokerage;

  // STT (Securities Transaction Tax)
  // Delivery: 0.1% on both Buy and Sell
  // Intraday: 0.025% on Sell side only
  const stt = tradeType === 'DELIVERY' 
    ? (buyTurnover * 0.001) + (sellTurnover * 0.001)
    : sellTurnover * 0.00025;

  // Exchange Transaction Charge (NSE ~ 0.00297%)
  const exchangeCharges = totalTurnover * 0.0000297;

  // SEBI Turnover Fees (₹10 per crore = 0.0001%)
  const sebiTurnoverFee = totalTurnover * 0.000001;

  // Stamp Duty (Buy side only: 0.015% Delivery, 0.003% Intraday)
  const stampDuty = tradeType === 'DELIVERY'
    ? buyTurnover * 0.00015
    : buyTurnover * 0.00003;

  // GST (18% on Brokerage + Exchange charges + SEBI charges)
  const gst = 0.18 * (brokerage + exchangeCharges + sebiTurnoverFee);

  const totalCharges = brokerage + stt + exchangeCharges + gst + sebiTurnoverFee + stampDuty;
  const netPnl = grossPnl - totalCharges;
  const breakevenPoints = totalCharges / quantity;

  return {
    brokerage,
    stt,
    exchangeCharges,
    gst,
    sebiTurnoverFee,
    stampDuty,
    totalCharges,
    netPnl,
    breakevenPoints,
  };
}
