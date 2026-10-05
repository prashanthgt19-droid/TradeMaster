import React from 'react';
import { 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  ShieldCheck, 
  AlertTriangle, 
  RotateCcw, 
  Moon, 
  Sun, 
  Sparkles,
  ExternalLink,
  Lock,
  Smartphone
} from 'lucide-react';
import { UserProfileState } from '../types';

interface Props {
  profile: UserProfileState;
  darkMode: boolean;
  onToggleTheme: () => void;
  onResetBalance: () => void;
  onResetAllProgress: () => void;
  onLoginGoogle: () => void;
  onLogout: () => void;
  onClose: () => void;
  onOpenInstallModal?: () => void;
}

export const SettingsView: React.FC<Props> = ({
  profile,
  darkMode,
  onToggleTheme,
  onResetBalance,
  onResetAllProgress,
  onLoginGoogle,
  onLogout,
  onClose,
  onOpenInstallModal,
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">App Settings & Profile</h1>
          <p className="text-xs text-slate-400">Manage account, virtual capital, theme and compliance disclosures</p>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white"
        >
          Close
        </button>
      </div>

      {/* Account Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 space-y-4">
        <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
          <UserIcon size={18} className="text-indigo-400" />
          <span>User Account & Cloud Sync</span>
        </h3>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <p className="font-bold text-white text-sm">
              {profile.displayName || 'Guest Trader'}
            </p>
            <p className="text-slate-400 text-[11px] mt-0.5">
              {profile.email || 'Anonymous Guest Session (Saved to Device & Cloud)'}
            </p>
          </div>

          {profile.email ? (
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-950/80 border border-red-800 text-red-300 hover:bg-red-900/60 flex items-center gap-1.5 transition-colors"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={onLoginGoogle}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-950 hover:bg-slate-200 flex items-center gap-1.5 transition-all shadow"
            >
              <LogIn size={14} />
              <span>Sign in with Google</span>
            </button>
          )}
        </div>
      </div>

      {/* Preferences & Reset */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 space-y-4 text-xs">
        <h3 className="font-extrabold text-sm text-white">Application Controls</h3>

        <div className="space-y-3">
          {/* Theme */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <p className="font-bold text-white">Visual Appearance</p>
              <p className="text-slate-400 text-[11px]">Dark Mode or Light Mode</p>
            </div>
            <button
              onClick={onToggleTheme}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold flex items-center gap-1.5"
            >
              {darkMode ? <Moon size={14} /> : <Sun size={14} />}
              <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>

          {/* Reset Virtual Capital */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <p className="font-bold text-white">Reset Simulated Balance</p>
              <p className="text-slate-400 text-[11px]">Restore virtual trading capital back to ₹100,000</p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Reset simulated balance to ₹100,000?')) {
                  onResetBalance();
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold border border-slate-700"
            >
              Reset to ₹1,00,000
            </button>
          </div>

          {/* Reset All Progress */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <p className="font-bold text-red-400">Reset Course Learning Progress</p>
              <p className="text-slate-400 text-[11px]">Clear all completed lessons and quiz scores</p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all lesson progress and quiz scores?')) {
                  onResetAllProgress();
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 font-bold"
            >
              Reset Progress
            </button>
          </div>
        </div>
      </div>

      {/* AdMob & Monetization Configuration Center */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Sparkles size={16} />
            <span className="text-sm text-white font-black">Monetization & Ad Revenue Center</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            AdMob Enabled
          </span>
        </div>

        <p className="text-slate-300 leading-relaxed">
          TradeMaster India is built with Google AdMob Rewarded Video Ads, allowing you to earn revenue every time a user downloads study PDFs, unlocks advanced modules, or resets virtual simulator funds.
        </p>

        {/* Ad Unit Configuration Table */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
          <p className="font-bold text-white text-[11px] uppercase tracking-wider text-slate-400">Current AdMob Unit IDs</p>
          <div className="font-mono text-[11px] text-slate-300 space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-slate-400">Rewarded Video Ad (Test ID):</span>
              <span className="text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">ca-app-pub-3940256099942544/5224354917</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-slate-400">Interstitial Ad Unit:</span>
              <span className="text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">ca-app-pub-3940256099942544/1033173712</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-slate-400">Banner Ad Unit:</span>
              <span className="text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">ca-app-pub-3940256099942544/6300978111</span>
            </div>
          </div>
        </div>

        {/* 3 Step Deployment & Earning Roadmap */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-[10px]">1</span>
            <p className="font-bold text-white text-xs">Deploy Public Domain</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Deploy to Firebase Hosting, Vercel, or your custom domain (e.g. trademasterindia.com) for permanent, free SSL hosting.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px]">2</span>
            <p className="font-bold text-white text-xs">Get Google AdMob IDs</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Create a free account at admob.google.com, create Rewarded Ad units, and paste your production Ad IDs into AdMobModal.tsx.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px]">3</span>
            <p className="font-bold text-white text-xs">Google Play Store APK</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Enter your live URL at pwabuilder.com to generate a signed Android APK / AAB package and publish directly on Google Play.
            </p>
          </div>
        </div>
      </div>

      {/* Full Statutory Disclaimers */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-slate-400 space-y-3 text-xs">
        <div className="flex items-center gap-2 text-white font-bold">
          <ShieldCheck size={18} className="text-emerald-400" />
          <span>Statutory Risk & Regulatory Disclosures</span>
        </div>
        <p className="leading-relaxed">
          <strong>1. Educational Platform Notice:</strong> TradeMaster India is strictly an educational and skill-development platform. It is NOT a SEBI-registered Research Analyst, Investment Adviser, or portfolio manager. The application does not provide personalized stock recommendations, trading tips, or guaranteed profit schemes.
        </p>
        <p className="leading-relaxed">
          <strong>2. Capital Loss Risk:</strong> Trading in cash equities, derivatives (futures & options), currencies, and cryptocurrencies carries significant market risk, and you may lose some or all of your invested capital.
        </p>
        <p className="leading-relaxed">
          <strong>3. Forex Regulations in India:</strong> Under the Foreign Exchange Management Act (FEMA) and Reserve Bank of India (RBI) notifications, resident Indians are legally permitted to trade currency derivatives ONLY on recognized Indian exchanges (NSE, BSE, MSE) in authorized currency pairs (USDINR, EURINR, GBPINR, JPYINR). Resident Indians are strictly prohibited from trading on unauthorized offshore electronic trading portals (ETPs).
        </p>
        <p className="leading-relaxed">
          <strong>4. Cryptocurrency Disclosure:</strong> Crypto assets and NFTs are unregulated and can be highly risky. There may be no regulatory recourse for any loss from such transactions.
        </p>
      </div>
    </div>
  );
};
