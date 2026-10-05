import React from 'react';
import { Check, Dot, ArrowRight, Sparkles } from 'lucide-react';

interface Props {
  text: string;
  bulletPoints?: string[];
  pointStyle?: 'numbers' | 'bullets' | 'cards';
  accentColor?: 'emerald' | 'indigo' | 'amber';
}

export function parseTextToPoints(text: string): string[] {
  if (!text) return [];

  // Split on newlines first
  const rawLines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const points: string[] = [];

  for (const line of rawLines) {
    // Check if line starts with a bullet (•, -, *) or number (1., 1))
    if (/^([•\-\*]|\d+[\.\)])\s*/.test(line)) {
      const clean = line.replace(/^([•\-\*]|\d+[\.\)])\s*/, '').trim();
      if (clean) points.push(clean);
    } else {
      // If line is longer than 150 chars and has multiple sentences, split into readable sentences
      const sentences = line.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g);
      if (sentences && sentences.length > 1 && line.length > 130) {
        sentences.forEach((s) => {
          const trimmed = s.trim();
          if (trimmed.length > 0) points.push(trimmed);
        });
      } else {
        points.push(line);
      }
    }
  }

  return points.length > 0 ? points : [text];
}

export const LessonPointsRenderer: React.FC<Props> = ({
  text,
  bulletPoints = [],
  pointStyle = 'cards',
  accentColor = 'emerald',
}) => {
  const parsedPoints = parseTextToPoints(text);
  const allPoints = [...parsedPoints, ...bulletPoints];

  const getAccentBadge = (index: number) => {
    switch (accentColor) {
      case 'amber':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'indigo':
        return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400';
      case 'emerald':
      default:
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
    }
  };

  return (
    <div className="space-y-2.5 my-3">
      {allPoints.map((pt, idx) => {
        // Detect if point has a title prefix e.g. "Base Currency (EUR): The currency..." or "1. Majors:"
        const colonIndex = pt.indexOf(':');
        const hasHighlightTitle = colonIndex > 0 && colonIndex < 40;

        let titlePart = '';
        let bodyPart = pt;

        if (hasHighlightTitle) {
          titlePart = pt.slice(0, colonIndex + 1).trim();
          bodyPart = pt.slice(colonIndex + 1).trim();
        }

        return (
          <div
            key={idx}
            className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700/80 transition-all text-xs sm:text-sm group"
          >
            {/* Number or Bullet Badge */}
            <div
              className={`w-6 h-6 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 border mt-0.5 ${getAccentBadge(
                idx
              )}`}
            >
              {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
            </div>

            {/* Point Content */}
            <div className="flex-1 leading-relaxed">
              {hasHighlightTitle ? (
                <>
                  <strong className="text-white font-extrabold mr-1.5 block sm:inline">
                    {titlePart}
                  </strong>
                  <span className="text-slate-300 font-normal">{bodyPart}</span>
                </>
              ) : (
                <span className="text-slate-300 font-normal">{pt}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
