import { jsPDF } from 'jspdf';
import { Lesson, CandlestickPattern } from '../types';
import { parseTextToPoints } from '../components/LessonPointsRenderer';

export function generateLessonPDF(lesson: Lesson): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  function checkPageBreak(requiredSpace: number) {
    if (y + requiredSpace > pageHeight - 20) {
      doc.addPage();
      y = 20;
      drawHeaderFooter();
    }
  }

  function drawHeaderFooter() {
    const pageNum = doc.getNumberOfPages();
    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('TRADEMASTER INDIA – LEARN TRADING', margin, 12);
    doc.setFont('helvetica', 'normal');
    doc.text('EDUCATIONAL STUDY MATERIAL', pageWidth - margin - 50, 12);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, 14, pageWidth - margin, 14);

    // Footer
    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Strictly for educational & skill development purposes only. No financial advice.', margin, pageHeight - 10);
    doc.text(`Page ${pageNum}`, pageWidth - margin - 15, pageHeight - 10);
  }

  drawHeaderFooter();

  // Badge & Level
  doc.setFillColor(30, 41, 59); // Slate 800
  doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(52, 211, 153); // Emerald 400
  doc.text(`LEVEL ${lesson.level} • ${lesson.category.toUpperCase()}`, margin + 6, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text(lesson.title, margin + 6, y + 17);
  y += 32;

  // Description
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  const descLines = doc.splitTextToSize(lesson.description, contentWidth);
  doc.text(descLines, margin, y);
  y += descLines.length * 5 + 6;

  // Learning Objectives Box
  checkPageBreak(35);
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 8 + lesson.objectives.length * 6, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('🎯 Learning Objectives', margin + 5, y + 6);
  y += 11;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  lesson.objectives.forEach((obj) => {
    doc.text(`•  ${obj}`, margin + 6, y);
    y += 5.5;
  });
  y += 6;

  // Content Sections
  lesson.contentSections.forEach((sec) => {
    checkPageBreak(25);
    if (sec.title) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(sec.title, margin, y);
      y += 6;
    }

    const points = parseTextToPoints(sec.body);
    const allSecPoints = [...points, ...(sec.bulletPoints || [])];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);

    allSecPoints.forEach((pt) => {
      checkPageBreak(12);
      const ptLines = doc.splitTextToSize(`•  ${pt}`, contentWidth - 4);
      doc.text(ptLines, margin + 2, y);
      y += ptLines.length * 5 + 2.5;
    });
    y += 2;

    if (sec.calloutBox) {
      checkPageBreak(30);
      const isWarn = sec.calloutBox.type === 'warning' || sec.calloutBox.type === 'regulatory';
      doc.setFillColor(isWarn ? 254 : 240, isWarn ? 242 : 253, isWarn ? 242 : 244);
      doc.setDrawColor(isWarn ? 248 : 186, isWarn ? 113 : 230, isWarn ? 113 : 253);
      
      const boxTextLines = doc.splitTextToSize(sec.calloutBox.text, contentWidth - 10);
      const boxHeight = 10 + boxTextLines.length * 5;
      
      doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(isWarn ? 185 : 30, isWarn ? 28 : 58, isWarn ? 28 : 138);
      doc.text(`📌 ${sec.calloutBox.title}`, margin + 5, y + 6);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(isWarn ? 127 : 30, isWarn ? 29 : 41, isWarn ? 29 : 59);
      doc.text(boxTextLines, margin + 5, y + 11);
      y += boxHeight + 6;
    }
  });

  // Important Points
  checkPageBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('⭐ Key Takeaways & Rules', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  lesson.keyTakeaways.forEach((kt) => {
    checkPageBreak(12);
    const lines = doc.splitTextToSize(`✔ ${kt}`, contentWidth - 4);
    doc.text(lines, margin + 4, y);
    y += lines.length * 5 + 2;
  });
  y += 6;

  // Common Mistakes
  checkPageBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(185, 28, 28);
  doc.text('⚠️ Common Beginner Mistakes to Avoid', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  lesson.commonMistakes.forEach((cm) => {
    checkPageBreak(12);
    const lines = doc.splitTextToSize(`✖ ${cm}`, contentWidth - 4);
    doc.text(lines, margin + 4, y);
    y += lines.length * 5 + 2;
  });
  y += 8;

  // Quiz Quick Revision
  checkPageBreak(40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('📝 Quick Revision & Practice Questions', margin, y);
  y += 6;

  lesson.quiz.forEach((q, idx) => {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    const qLines = doc.splitTextToSize(`Q${idx + 1}: ${q.question}`, contentWidth);
    doc.text(qLines, margin, y);
    y += qLines.length * 5 + 1;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Correct Answer: ${q.options[q.correctIndex]}`, margin + 4, y);
    y += 5;
    const expLines = doc.splitTextToSize(`Explanation: ${q.explanation}`, contentWidth - 4);
    doc.text(expLines, margin + 4, y);
    y += expLines.length * 4.5 + 4;
  });

  // Statutory Disclaimer
  checkPageBreak(35);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('LEGAL & RISK DISCLAIMER (SEBI COMPLIANCE)', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  const disc = 'Trading and investing in securities, currencies, and cryptocurrencies involve substantial market risk of capital loss. Past performance does not guarantee future results. TradeMaster India provides strictly educational curriculum and does not provide financial advice, tips, recommendations, or guaranteed returns. Always practice with paper trading before risking real capital.';
  const discLines = doc.splitTextToSize(disc, contentWidth - 8);
  doc.text(discLines, margin + 4, y + 11);

  // Save PDF
  const safeFilename = `${lesson.id}-TradeMaster-India.pdf`;
  doc.save(safeFilename);
}

export function generateCourseCheatsheetPDF(): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  // Header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 32, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('TRADEMASTER INDIA', margin, 15);

  doc.setFontSize(10);
  doc.setTextColor(52, 211, 153);
  doc.text('Master Trading Reference Guide & Cheatsheet (11 Levels)', margin, 24);
  y = 42;

  // Core Pillars
  const pillars = [
    { title: '1. Position Sizing Formula', desc: 'Position Size = (Capital × Risk%) / (Entry Price - Stop Loss Price). Never risk > 1-2% per trade.' },
    { title: '2. Candlestick Rules', desc: 'Never trade a candle until it officially closes. Context (S&R, trend, volume) always overrides individual candle shapes.' },
    { title: '3. Risk-to-Reward Ratio', desc: 'Demand minimum 1:2 R:R. A 40% win-rate system with 1:2 R:R is consistently profitable.' },
    { title: '4. Support & Resistance Flip', desc: 'Broken Support flips to new Resistance; broken Resistance flips to new Support on pullback retests.' },
    { title: '5. VWAP Rule (Intraday)', desc: 'Buy pullbacks above rising VWAP; avoid longing equities trading below downward sloping VWAP.' },
    { title: '6. Trading Psychology', desc: 'Accept losses as normal operating costs. Set a 3% Max Daily Loss and shutdown the terminal when hit.' },
    { title: '7. Indian Regulatory Boundary', desc: 'Forex trading is legal for resident Indians ONLY on recognized exchanges (NSE/BSE) on approved pairs under FEMA/RBI.' },
  ];

  pillars.forEach((p, idx) => {
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, contentWidth, 16, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`${idx + 1}. ${p.title}`, margin + 4, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const lines = doc.splitTextToSize(p.desc, contentWidth - 8);
    doc.text(lines, margin + 4, y + 11);
    y += 20;
  });

  // Footer Disclaimer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('TradeMaster India © Educational Platform. Not financial advice. Trade responsibly.', margin, pageHeight - 12);

  doc.save('TradeMaster-India-Master-Cheatsheet.pdf');
}

/**
 * Generate a single comprehensive master PDF containing ALL candlestick formations
 * with anatomical diagrams, market psychology, entry triggers, stop loss rules, and summary matrix.
 */
export function generateAllCandlesticksPDF(patterns: CandlestickPattern[]): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  function drawHeaderFooter() {
    const pageNum = doc.getNumberOfPages();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('TRADEMASTER INDIA – MASTER CANDLESTICK FORMATIONS BIBLE', margin, 11);
    doc.setFont('helvetica', 'normal');
    doc.text('ALL FORMATIONS CHEATSHEET', pageWidth - margin - 50, 11);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, 13, pageWidth - margin, 13);

    // Footer
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('For educational & technical analysis training only. Always enforce 1:2 R:R & strict stop-loss.', margin, pageHeight - 8);
    doc.text(`Page ${pageNum}`, pageWidth - margin - 15, pageHeight - 8);
  }

  function checkPageBreak(requiredSpace: number) {
    if (y + requiredSpace > pageHeight - 16) {
      doc.addPage();
      y = 18;
      drawHeaderFooter();
    }
  }

  drawHeaderFooter();

  // Cover / Header Banner
  doc.setFillColor(15, 23, 42); // Deep Slate 900
  doc.roundedRect(margin, y, contentWidth, 30, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(52, 211, 153); // Emerald 400
  doc.text('OFFICIAL TECHNICAL ANALYSIS REFERENCE • ALL CANDLESTICK FORMATIONS', margin + 6, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('Master Candlestick Formations Bible', margin + 6, y + 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(`Comprehensive institutional guide to ${patterns.length} Single, Double & Triple Candlestick patterns with anatomical rules, entry, stop loss, and market psychology.`, margin + 6, y + 24);

  y += 36;

  // Render each candlestick pattern
  patterns.forEach((p, idx) => {
    // Check space for pattern block
    checkPageBreak(50);

    // Pattern Header Card
    const isBull = p.bias === 'BULLISH';
    const isBear = p.bias === 'BEARISH';
    const headerBg = isBull ? [240, 253, 244] : isBear ? [254, 242, 242] : [248, 250, 252];
    const borderCol = isBull ? [134, 239, 172] : isBear ? [252, 165, 165] : [203, 213, 225];
    const badgeTextCol = isBull ? [22, 101, 52] : isBear ? [153, 27, 27] : [51, 65, 85];

    doc.setFillColor(headerBg[0], headerBg[1], headerBg[2]);
    doc.setDrawColor(borderCol[0], borderCol[1], borderCol[2]);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentWidth, 13, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${idx + 1}. ${p.name.toUpperCase()} ${p.hindiName ? `(${p.hindiName})` : ''}`, margin + 5, y + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(badgeTextCol[0], badgeTextCol[1], badgeTextCol[2]);
    const metaStr = `BIAS: ${p.bias}  |  STRUCTURE: ${p.category} CANDLE  |  TYPE: ${p.type}`;
    doc.text(metaStr, margin + 5, y + 10);

    y += 17;

    // Draw visual candle representations if candleVisualSpec is present
    const spec = p.candleVisualSpec;
    if (spec && spec.candles && spec.candles.length > 0) {
      checkPageBreak(28);
      const diagramX = margin + 4;
      const diagramY = y;
      const diagramWidth = 42;
      const diagramHeight = 26;

      // Draw light container box for diagram
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(diagramX, diagramY, diagramWidth, diagramHeight, 2, 2, 'FD');

      const numCandles = spec.candles.length;
      const slotWidth = diagramWidth / (numCandles + 1);

      spec.candles.forEach((c, cIdx) => {
        const cx = diagramX + slotWidth * (cIdx + 1);
        const candleH = diagramHeight - 8;
        const normHigh = diagramY + 4 + ((100 - c.high) / 100) * candleH;
        const normLow = diagramY + 4 + ((100 - c.low) / 100) * candleH;
        const normOpen = diagramY + 4 + ((100 - c.open) / 100) * candleH;
        const normClose = diagramY + 4 + ((100 - c.close) / 100) * candleH;

        const isGreen = c.color === 'green' || (c.close >= c.open && c.color !== 'red');
        const isRed = c.color === 'red' || (c.close < c.open && c.color !== 'green');

        // Draw Wick
        doc.setDrawColor(isGreen ? 34 : isRed ? 239 : 100, isGreen ? 197 : isRed ? 68 : 116, isGreen ? 94 : isRed ? 68 : 139);
        doc.setLineWidth(0.6);
        doc.line(cx, normHigh, cx, normLow);

        // Draw Body
        const bodyTop = Math.min(normOpen, normClose);
        const bodyHeight = Math.max(Math.abs(normClose - normOpen), 1.2);
        const bodyWidth = 6;

        doc.setFillColor(isGreen ? 34 : isRed ? 239 : 148, isGreen ? 197 : isRed ? 68 : 163, isGreen ? 94 : isRed ? 68 : 184);
        doc.rect(cx - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight, 'F');
      });

      // Beside diagram: Appearance & Meaning
      const textX = diagramX + diagramWidth + 6;
      const textW = contentWidth - diagramWidth - 10;
      let textY = diagramY + 3;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text('Anatomy & Appearance:', textX, textY);
      textY += 3.8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      const appLines = doc.splitTextToSize(p.appearance, textW);
      doc.text(appLines, textX, textY);
      textY += appLines.length * 3.4 + 2;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text('Market Equilibrium:', textX, textY);
      textY += 3.8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      const meanLines = doc.splitTextToSize(p.meaning, textW);
      doc.text(meanLines, textX, textY);

      y = Math.max(diagramY + diagramHeight + 3, textY + meanLines.length * 3.4 + 2);
    }

    // Rules Box (Entry, Stop Loss, Confirmation, Psychology)
    checkPageBreak(26);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);

    const rules = [
      { label: '• Psychology:', text: p.psychology },
      { label: '• Interpretation:', text: p.interpretation },
      { label: '• Confirmation Rules:', text: p.confirmationRequirements },
      { label: '• Real Market Setup:', text: p.realExample },
    ];

    rules.forEach((r) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(r.label, margin + 4, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      const indent = doc.getTextWidth(r.label) + 2;
      const lines = doc.splitTextToSize(r.text, contentWidth - indent - 6);
      doc.text(lines, margin + 4 + indent, y);
      y += lines.length * 3.4 + 1.8;
    });

    if (p.commonMistakes && p.commonMistakes.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(185, 28, 28);
      doc.text('⚠ Pitfall to Avoid:', margin + 4, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(153, 27, 27);
      const pitLines = doc.splitTextToSize(p.commonMistakes.join(' '), contentWidth - 36);
      doc.text(pitLines, margin + 34, y);
      y += pitLines.length * 3.4 + 2.5;
    }

    // Divider line between patterns
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
  });

  // FINAL SUMMARY CHEATSHEET PAGE
  doc.addPage();
  y = 20;
  drawHeaderFooter();

  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('QUICK-REFERENCE CHEATSHEET MATRIX (ALL FORMATIONS)', margin + 6, y + 9);
  y += 18;

  // Table Header
  doc.setFillColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Pattern Name', margin + 3, y + 4.5);
  doc.text('Category', margin + 48, y + 4.5);
  doc.text('Bias', margin + 74, y + 4.5);
  doc.text('Key Signal', margin + 102, y + 4.5);
  doc.text('Optimal Stop-Loss Rule', margin + 138, y + 4.5);
  y += 8;

  patterns.forEach((p, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y - 3, contentWidth, 5.5, 'F');
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text(p.name, margin + 3, y + 1);

    doc.setFont('helvetica', 'normal');
    doc.text(p.category, margin + 48, y + 1);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(
      p.bias === 'BULLISH' ? 22 : p.bias === 'BEARISH' ? 185 : 71,
      p.bias === 'BULLISH' ? 101 : p.bias === 'BEARISH' ? 28 : 85,
      p.bias === 'BULLISH' ? 52 : p.bias === 'BEARISH' ? 28 : 105
    );
    doc.text(p.bias, margin + 74, y + 1);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(p.type, margin + 102, y + 1);
    doc.text(
      p.bias === 'BULLISH'
        ? 'Below Pattern Low'
        : p.bias === 'BEARISH'
        ? 'Above Pattern High'
        : 'Beyond Wick Extreme',
      margin + 138,
      y + 1
    );

    y += 5.2;
  });

  // Final footer notes
  y += 6;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Remember: Candlesticks provide entry triggers, not directional guarantees. Always combine with Higher Timeframe Support/Resistance and maintain a minimum 1:2 Risk-to-Reward ratio.',
    margin,
    y
  );

  doc.save('TradeMaster-All-Candlestick-Formations-Master-Bible.pdf');
}
