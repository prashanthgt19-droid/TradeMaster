import React, { useState } from 'react';
import { Search, X, BookOpen, ArrowRight } from 'lucide-react';
import { Lesson } from '../types';
import { ALL_LESSONS } from '../data/coursesData';

interface Props {
  onClose: () => void;
  onSelectLesson: (lesson: Lesson) => void;
}

export const SearchModal: React.FC<Props> = ({ onClose, onSelectLesson }) => {
  const [query, setQuery] = useState('');

  const results = query.trim() === ''
    ? []
    : ALL_LESSONS.filter(
        (l) =>
          l.title.toLowerCase().includes(query.toLowerCase()) ||
          l.description.toLowerCase().includes(query.toLowerCase()) ||
          l.category.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 pt-16">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-5 text-slate-100 shadow-2xl relative">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search lessons, e.g. 'RSI', 'VWAP', 'Hammer', 'Nifty'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
          {query.trim() === '' ? (
            <div className="text-center py-8 text-xs text-slate-500">
              Type keywords to search across 11 levels of trading curriculum.
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No matching lessons found for "{query}".
            </div>
          ) : (
            results.map((l) => (
              <div
                key={l.id}
                onClick={() => {
                  onSelectLesson(l);
                  onClose();
                }}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all flex items-center justify-between text-xs group"
              >
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Level {l.level} • {l.category}
                  </span>
                  <p className="font-bold text-white group-hover:text-emerald-400 mt-0.5">
                    {l.title}
                  </p>
                </div>
                <ArrowRight size={14} className="text-slate-500 group-hover:text-emerald-400" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
