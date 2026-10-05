import React from 'react';
import { 
  Home, 
  BookOpen, 
  CandlestickChart, 
  LineChart, 
  Calculator, 
  Layers,
  Globe
} from 'lucide-react';

export type ActiveTab = 'home' | 'learn' | 'forex' | 'candlestick' | 'charts' | 'simulator' | 'tools';

interface Props {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<Props> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'learn' as ActiveTab, label: 'Courses', icon: BookOpen },
    { id: 'forex' as ActiveTab, label: 'Forex', icon: Globe, isSpecial: true },
    { id: 'candlestick' as ActiveTab, label: 'Candles', icon: CandlestickChart },
    { id: 'charts' as ActiveTab, label: 'Charts', icon: LineChart },
    { id: 'simulator' as ActiveTab, label: 'Paper Trade', icon: Layers },
    { id: 'tools' as ActiveTab, label: 'Tools', icon: Calculator },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 text-slate-400 select-none pb-safe">
      <div className="max-w-xl mx-auto px-1 flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive
                  ? tab.isSpecial
                    ? 'text-amber-400 scale-105 font-black'
                    : 'text-emerald-400 scale-105 font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${
                isActive 
                  ? tab.isSpecial 
                    ? 'bg-amber-500/15' 
                    : 'bg-emerald-500/15' 
                  : ''
              }`}>
                <Icon size={19} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
              </div>
              <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-tight truncate max-w-[52px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
