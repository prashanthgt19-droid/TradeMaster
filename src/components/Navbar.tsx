import React from 'react';
import { 
  Flame, 
  Wallet, 
  Search, 
  Sun, 
  Moon, 
  BookOpen, 
  User as UserIcon,
  ShieldCheck,
  Award,
  Globe,
  Smartphone
} from 'lucide-react';
import { UserProfileState } from '../types';

interface Props {
  profile: UserProfileState;
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onOpenProfile: () => void;
  onOpenBadges: () => void;
  onOpenForex?: () => void;
  onOpenInstallModal?: () => void;
}

export const Navbar: React.FC<Props> = ({
  profile,
  darkMode,
  onToggleTheme,
  onOpenSearch,
  onOpenProfile,
  onOpenBadges,
  onOpenForex,
  onOpenInstallModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white select-none shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 via-indigo-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-black text-sm text-white">TM</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                TradeMaster India
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PRO ED
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden xs:block">
              Learn • Practice • Trade Responsibly
            </p>
          </div>
        </div>

        {/* Right Stats & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Forex Button */}
          {onOpenForex && (
            <button
              onClick={onOpenForex}
              className="flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-full text-xs font-black transition-all hover:scale-105"
              title="Forex Academy & Vantage Hub"
            >
              <Globe size={13} className="text-amber-400" />
              <span className="hidden xs:inline">Forex</span>
            </button>
          )}

          {/* Install Mobile App Button */}
          {onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              className="flex items-center gap-1 bg-gradient-to-r from-emerald-500/15 to-indigo-500/15 hover:from-emerald-500/25 hover:to-indigo-500/25 border border-emerald-500/35 text-emerald-300 px-2.5 py-1 rounded-full text-xs font-bold transition-all hover:scale-105"
              title="Install Mobile App (Android & iOS)"
            >
              <Smartphone size={13} className="text-emerald-400" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          {/* Daily Streak */}
          <div 
            onClick={onOpenBadges}
            className="flex items-center gap-1 bg-amber-950/50 border border-amber-500/40 text-amber-300 px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer hover:bg-amber-900/40 transition-colors"
            title={`${profile.streakDays} Day Learning Streak`}
          >
            <Flame size={14} className="text-amber-400 fill-amber-400 animate-pulse" />
            <span>{profile.streakDays}d</span>
          </div>

          {/* Virtual Paper Balance */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 px-2.5 py-1 rounded-full text-xs font-mono font-bold text-emerald-400">
            <Wallet size={13} className="text-emerald-400" />
            <span>₹{(profile.virtualBalance).toLocaleString('en-IN')}</span>
          </div>

          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Search lessons and topics"
          >
            <Search size={18} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User Profile / Settings */}
          <button
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 hover:border-emerald-500 transition-colors"
            title="Account & Settings"
          >
            <UserIcon size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
