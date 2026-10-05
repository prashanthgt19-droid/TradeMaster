import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  Share2, 
  PlusSquare, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallMobileAppModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'packaging'>(
    isIOS ? 'ios' : 'android'
  );
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Smartphone size={24} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                <span>Install Mobile App</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Android & iOS
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Run TradeMaster as a standalone native app on your phone
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="grid grid-cols-3 p-2 bg-slate-950/50 border-b border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('android')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'android'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🤖 Android</span>
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'ios'
                ? 'bg-indigo-600 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🍎 iPhone (iOS)</span>
          </button>
          <button
            onClick={() => setActiveTab('packaging')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'packaging'
                ? 'bg-slate-800 text-amber-400 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📦 APK & App Store</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* TAB 1: ANDROID */}
          {activeTab === 'android' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
                  <Zap size={14} />
                  <span>Instant 1-Tap Android Installation</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Install TradeMaster directly to your Android device home screen. Works with zero browser address bars, instant offline loading, and silky smooth 60fps chart rendering.
                </p>
              </div>

              {isInstalled ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 text-center space-y-2">
                  <CheckCircle2 size={32} className="text-emerald-400 mx-auto" />
                  <p className="font-black text-sm text-white">App is Installed & Running Standalone!</p>
                  <p className="text-xs text-slate-400">You are already using TradeMaster as an installed native app.</p>
                </div>
              ) : isInstallable ? (
                <button
                  onClick={async () => {
                    await install();
                    onClose();
                  }}
                  className="w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25"
                >
                  <Download size={18} />
                  <span>Install TradeMaster App (Android)</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-200">How to install manually on Android Chrome / Edge:</p>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">1</span>
                      <span>Tap the <strong>three dots menu (⋮)</strong> at the top right of Chrome.</span>
                    </div>
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">2</span>
                      <span>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
                    </div>
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">3</span>
                      <span>Tap <strong>"Install"</strong>. The TradeMaster icon will appear in your Android app drawer!</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Native App Benefits */}
              <div className="grid grid-cols-2 gap-2.5 text-[11px] pt-1">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-slate-300">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Full-Screen Standalone UI</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-slate-300">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Offline Lesson Notes</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-slate-300">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Ultra-fast Candlestick Charts</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-slate-300">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>₹0 Download / No App Store Fee</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: iOS (iPhone / iPad) */}
          {activeTab === 'ios' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs uppercase tracking-wider">
                  <AppleIcon size={14} />
                  <span>Add to iPhone & iPad Home Screen</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Apple allows any web app to run with full native performance and standalone display on iOS using Safari's "Add to Home Screen".
                </p>
              </div>

              {/* 3 Step Visual Guide */}
              <div className="space-y-2.5 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0">
                    <Share2 size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs">Step 1: Open in Safari & Tap Share</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Open this URL in <strong>Apple Safari</strong> and tap the <strong>Share</strong> button <span className="font-mono text-indigo-300 font-bold">[ ⬆ ]</span> at the bottom of your screen.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0">
                    <PlusSquare size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs">Step 2: Tap "Add to Home Screen"</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Scroll down in the share sheet and tap <strong className="text-white">"Add to Home Screen"</strong> (with the plus icon).
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs">Step 3: Tap "Add" in Top Right</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Confirm the title <strong className="text-white">TradeMaster</strong> and tap <strong>Add</strong>. The official app icon will appear on your iPhone screen!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PACKAGING (APK & Google Play / Apple App Store) */}
          {activeTab === 'packaging' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                <p className="font-extrabold text-amber-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Layers size={14} />
                  <span>How to Package into Native APK / AAB & IPA</span>
                </p>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Because TradeMaster is built with complete PWA compliance, you can turn this exact codebase into signed Google Play <strong>.apk / .aab</strong> and Apple App Store <strong>.ipa</strong> files using modern zero-rewrite tools:
                </p>
              </div>

              {/* Option A: PWABuilder (Easiest - 1 Click) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-white font-extrabold text-xs">Method 1: PWABuilder (Recommended - Zero Code)</strong>
                  <span className="px-2 py-0.5 rounded-md text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">1-Click</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Go to <a href="https://www.pwabuilder.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline font-bold">pwabuilder.com</a>, enter your app's live URL, and click <strong>"Package for Stores"</strong>. It automatically builds signed packages for:
                </p>
                <ul className="space-y-1 text-slate-400 text-[11px] pl-4 list-disc">
                  <li><strong>Google Play Store (Android):</strong> Generates signed Android App Bundle (.aab) with Trusted Web Activity (TWA).</li>
                  <li><strong>Apple App Store (iOS):</strong> Generates Xcode project ready to build into an iOS .ipa file.</li>
                </ul>
              </div>

              {/* Option B: Capacitor CLI */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-white font-extrabold text-xs">Method 2: Capacitor (Full Native Bridge)</strong>
                  <span className="px-2 py-0.5 rounded-md text-[10px] bg-indigo-500/20 text-indigo-400 font-bold">Capacitor</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Run these 3 commands to generate Android Studio and Xcode projects:
                </p>
                <div className="p-2.5 rounded-xl bg-slate-900 font-mono text-[10px] text-emerald-400 flex items-center justify-between">
                  <span>npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios</span>
                  <button
                    onClick={() => handleCopy('npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios', 'cap')}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    {copiedCmd === 'cap' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 font-mono text-[10px] text-emerald-400 flex items-center justify-between">
                  <span>npx cap add android && npx cap add ios</span>
                  <button
                    onClick={() => handleCopy('npx cap add android && npx cap add ios', 'add')}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    {copiedCmd === 'add' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px] flex items-center gap-1">
            <ShieldCheck size={13} className="text-emerald-400" /> Complete PWA & Mobile Web Standards
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-bold bg-slate-800 text-white hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

function AppleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 170 170" fill="currentColor">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.7-7.85-12.01-14.42-5.46-8.36-9.76-17.84-12.89-28.45-3.14-10.6-4.71-20.9-4.71-30.88 0-14.12 3.59-25.76 10.77-34.92 7.18-9.16 16.32-13.82 27.42-13.98 4.69 0 10.15 1.25 16.38 3.75 6.23 2.5 10.08 3.82 11.55 3.96 1.83-.28 5.76-1.66 11.78-4.14 6.02-2.48 11.28-3.6 15.78-3.37 11.83.67 21.44 4.88 28.84 12.63-10.45 6.35-15.54 14.88-15.28 25.61.27 8.35 3.6 15.34 9.99 20.98 6.39 5.64 13.98 9.07 22.77 10.3-.95 3.03-2.12 6.54-3.52 10.53-1.4 3.99-2.88 7.74-4.44 11.24zM119.22 33.02c0-7.39 2.67-14.28 8.01-20.67 5.34-6.39 11.97-10.36 19.89-11.91.33 1.2.49 2.37.49 3.51 0 7.28-2.8 14.21-8.4 20.78-5.6 6.57-12.39 10.48-20.37 11.73-.22-1.12-.33-2.27-.33-3.44z" />
    </svg>
  );
}
