/**
 * TradeMaster India – Learn Trading
 * Professional Educational Mobile App & PWA
 */

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, loginAnonymously, loginWithGoogle, logoutUser, testConnection, handleFirestoreError, OperationType } from './firebase';
import { UserProfileState, Lesson, JournalEntry, PaperTradeOrder } from './types';
import { ALL_LESSONS } from './data/coursesData';

// Components & Views
import { Navbar } from './components/Navbar';
import { BottomNav, ActiveTab } from './components/BottomNav';
import { RiskBanner } from './components/RiskBanner';
import { BadgesModal } from './components/BadgesModal';
import { SearchModal } from './components/SearchModal';
import { TradingJournalModal } from './components/TradingJournalModal';
import { InstallAppBanner } from './components/InstallAppBanner';
import { InstallMobileAppModal } from './components/InstallMobileAppModal';

import { HomeView } from './views/HomeView';
import { LearnView } from './views/LearnView';
import { LessonDetailView } from './views/LessonDetailView';
import { ForexView } from './views/ForexView';
import { CandlestickSchoolView } from './views/CandlestickSchoolView';
import { ChartReadingView } from './views/ChartReadingView';
import { PaperTradingTerminal } from './components/PaperTradingTerminal';
import { ToolsView } from './views/ToolsView';
import { SettingsView } from './views/SettingsView';

const STORAGE_KEY_PROFILE = 'tm_india_profile_v1';
const STORAGE_KEY_JOURNAL = 'tm_india_journal_v1';
const STORAGE_KEY_THEME = 'tm_india_theme_v1';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    return saved !== null ? saved === 'true' : true;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<number | null>(null);
  const [toolsInitialTab, setToolsInitialTab] = useState<'riskPosition' | 'brokerageTaxes' | 'forexVantage' | 'journal' | 'psychology' | 'pdfLibrary'>('riskPosition');

  // Modals
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [showSettingsView, setShowSettingsView] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  const handleOpenForexHub = (targetLesson?: Lesson) => {
    setActiveLesson(targetLesson || null);
    setShowSettingsView(false);
    setActiveTab('forex');
  };

  // User Profile State
  const [profile, setProfile] = useState<UserProfileState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      userId: 'guest-' + Math.random().toString(36).substring(2, 9),
      displayName: 'Trader Aspirant',
      virtualBalance: 100000,
      streakDays: 3,
      lastActiveDate: new Date().toISOString().split('T')[0],
      bookmarks: [],
      progress: {
        'l1-financial-markets': {
          lessonId: 'l1-financial-markets',
          completed: true,
          quizScore: 100,
          quizPassed: true,
          unlockedViaReward: false,
          pdfDownloaded: false,
          updatedAt: new Date().toISOString(),
        },
      },
      badges: ['Beginner Trader'],
    };
  });

  // Journal entries
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_JOURNAL);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 'j-sample-1',
        date: new Date().toISOString().split('T')[0],
        market: 'INDIAN_STOCK',
        symbol: 'RELIANCE',
        side: 'BUY',
        entryPrice: 2915,
        exitPrice: 2942,
        quantity: 20,
        pnl: 540,
        strategy: 'Hammer at 200 EMA Support',
        emotion: 'Disciplined',
        lessonLearned: 'Waited patiently for confirmation candle. Exit target hit smoothly.',
        createdAt: new Date().toISOString(),
      },
    ];
  });

  // Test Firebase connection & initialize auth
  useEffect(() => {
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        setProfile((prev) => ({
          ...prev,
          userId: user.uid,
          displayName: user.displayName || prev.displayName,
          email: user.email || undefined,
        }));

        // Try fetching user profile from Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data();
            setProfile((prev) => ({
              ...prev,
              virtualBalance: data.virtualBalance ?? prev.virtualBalance,
              streakDays: data.streakDays ?? prev.streakDays,
            }));
          } else {
            // Initialize user doc in Firestore
            await setDoc(userDocRef, {
              userId: user.uid,
              displayName: user.displayName || 'Trader Aspirant',
              email: user.email || '',
              virtualBalance: 100000,
              streakDays: 1,
              lastActiveDate: new Date().toISOString().split('T')[0],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        } catch (err) {
          console.warn('Could not sync user document with Firestore (offline mode active)');
        }
      } else {
        // Attempt anonymous sign-in if enabled on Firebase project; gracefully remain in local guest session
        loginAnonymously().catch(() => {});
      }
    });

    return () => unsubscribe();
  }, []);

  // Save profile to local storage whenever changed
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  }, [profile]);

  // Save journal entries
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_JOURNAL, JSON.stringify(journalEntries));
  }, [journalEntries]);

  // Save theme
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handlers
  const handleUpdateProgress = async (lessonId: string, completed: boolean, score?: number) => {
    const updatedRecord = {
      lessonId,
      completed,
      quizScore: score ?? 100,
      quizPassed: completed,
      unlockedViaReward: profile.progress[lessonId]?.unlockedViaReward || false,
      pdfDownloaded: profile.progress[lessonId]?.pdfDownloaded || false,
      updatedAt: new Date().toISOString(),
    };

    setProfile((prev) => ({
      ...prev,
      progress: {
        ...prev.progress,
        [lessonId]: updatedRecord,
      },
    }));

    // Sync to Firestore if authenticated
    if (auth.currentUser) {
      try {
        const progressDocRef = doc(db, 'users', auth.currentUser.uid, 'progress', lessonId);
        await setDoc(progressDocRef, {
          userId: auth.currentUser.uid,
          lessonId,
          completed,
          quizScore: score ?? 100,
          quizPassed: completed,
          unlockedViaReward: updatedRecord.unlockedViaReward,
          pdfDownloaded: updatedRecord.pdfDownloaded,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Firestore progress sync deferred:', err);
      }
    }
  };

  const handleUnlockViaReward = async (lessonId: string) => {
    setProfile((prev) => ({
      ...prev,
      progress: {
        ...prev.progress,
        [lessonId]: {
          lessonId,
          completed: prev.progress[lessonId]?.completed || false,
          quizScore: prev.progress[lessonId]?.quizScore || 0,
          quizPassed: prev.progress[lessonId]?.quizPassed || false,
          unlockedViaReward: true,
          pdfDownloaded: prev.progress[lessonId]?.pdfDownloaded || false,
          updatedAt: new Date().toISOString(),
        },
      },
    }));

    if (auth.currentUser) {
      try {
        const docRef = doc(db, 'users', auth.currentUser.uid, 'progress', lessonId);
        await setDoc(docRef, {
          userId: auth.currentUser.uid,
          lessonId,
          completed: false,
          unlockedViaReward: true,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (err) {
        console.warn('Reward sync deferred');
      }
    }
  };

  const handleToggleBookmark = (lessonId: string) => {
    setProfile((prev) => {
      const exists = prev.bookmarks.includes(lessonId);
      return {
        ...prev,
        bookmarks: exists
          ? prev.bookmarks.filter((id) => id !== lessonId)
          : [...prev.bookmarks, lessonId],
      };
    });
  };

  const handleUpdateVirtualBalance = async (newBalance: number) => {
    setProfile((prev) => ({
      ...prev,
      virtualBalance: Math.max(0, Number(newBalance.toFixed(2))),
    }));

    if (auth.currentUser) {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userRef, { virtualBalance: newBalance, updatedAt: new Date().toISOString() }, { merge: true });
      } catch (err) {
        console.warn('Balance sync deferred');
      }
    }
  };

  const handleAddJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    const id = `j-${Date.now()}`;
    const newEntry: JournalEntry = {
      ...entry,
      id,
      createdAt: new Date().toISOString(),
    };

    setJournalEntries([newEntry, ...journalEntries]);

    if (auth.currentUser) {
      try {
        const journalRef = doc(db, 'users', auth.currentUser.uid, 'journal', id);
        await setDoc(journalRef, {
          ...newEntry,
          userId: auth.currentUser.uid,
        });
      } catch (err) {
        console.warn('Journal sync deferred');
      }
    }
  };

  const handleDeleteJournalEntry = (id: string) => {
    setJournalEntries((prev) => prev.filter((j) => j.id !== id));
  };

  const handleResetBalance = () => {
    handleUpdateVirtualBalance(100000);
  };

  const handleResetAllProgress = () => {
    setProfile((prev) => ({
      ...prev,
      progress: {},
    }));
  };

  const handleSelectLevel = (level: number) => {
    if (level === 10) {
      handleOpenForexHub();
      return;
    }
    setSelectedLevelFilter(level);
    setActiveLesson(null);
    setActiveTab('learn');
  };

  const handleOpenLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
  };

  const handleBackFromLesson = () => {
    setActiveLesson(null);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} flex flex-col font-sans transition-colors duration-200 antialiased selection:bg-emerald-500 selection:text-slate-950`}>
      {/* Statutory Regulatory & Risk Warning Banner */}
      <RiskBanner />

      {/* In-App Mobile PWA Install Banner */}
      <InstallAppBanner onOpenModal={() => setShowInstallModal(true)} />

      {/* Main Sticky Header */}
      <Navbar
        profile={profile}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onOpenSearch={() => setShowSearchModal(true)}
        onOpenProfile={() => setShowSettingsView(true)}
        onOpenBadges={() => setShowBadgesModal(true)}
        onOpenForex={() => handleOpenForexHub()}
        onOpenInstallModal={() => setShowInstallModal(true)}
      />

      {/* Main Responsive Body View Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-5 pb-24">
        {/* If a lesson is being actively viewed */}
        {activeLesson ? (
          <LessonDetailView
            lesson={activeLesson}
            profile={profile}
            onBack={handleBackFromLesson}
            onUpdateProgress={handleUpdateProgress}
            onToggleBookmark={handleToggleBookmark}
            onUnlockReward={handleUnlockViaReward}
          />
        ) : showSettingsView ? (
          <SettingsView
            profile={profile}
            darkMode={darkMode}
            onToggleTheme={() => setDarkMode(!darkMode)}
            onResetBalance={handleResetBalance}
            onResetAllProgress={handleResetAllProgress}
            onLoginGoogle={() => loginWithGoogle()}
            onLogout={() => logoutUser()}
            onClose={() => setShowSettingsView(false)}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeView
                profile={profile}
                onSelectLevel={handleSelectLevel}
                onOpenLesson={handleOpenLesson}
                onNavigateTab={(tab) => {
                  if (tab === 'learn') setActiveTab('learn');
                  else if (tab === 'forex') handleOpenForexHub();
                  else if (tab === 'candlestick') setActiveTab('candlestick');
                  else if (tab === 'charts') setActiveTab('charts');
                  else if (tab === 'simulator') setActiveTab('simulator');
                  else if (tab === 'tools') {
                    setToolsInitialTab('riskPosition');
                    setActiveTab('tools');
                  }
                }}
                onOpenJournal={() => setShowJournalModal(true)}
                onOpenPdfLibrary={() => {
                  setToolsInitialTab('pdfLibrary');
                  setActiveTab('tools');
                }}
                onOpenForexHub={handleOpenForexHub}
              />
            )}

            {activeTab === 'learn' && (
              <LearnView
                profile={profile}
                onOpenLesson={handleOpenLesson}
                selectedLevelFilter={selectedLevelFilter}
                onClearLevelFilter={() => setSelectedLevelFilter(null)}
                onOpenForexHub={handleOpenForexHub}
              />
            )}

            {activeTab === 'forex' && (
              <ForexView
                profile={profile}
                onOpenLesson={handleOpenLesson}
              />
            )}

            {activeTab === 'candlestick' && (
              <CandlestickSchoolView
                profile={profile}
                onUpdateQuizPassed={(pId) => {}}
              />
            )}

            {activeTab === 'charts' && (
              <ChartReadingView />
            )}

            {activeTab === 'simulator' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-white">Paper Trading Terminal</h1>
                    <p className="text-xs text-slate-400">Risk-free simulated trading for Indian Equities, Forex & Crypto</p>
                  </div>
                </div>

                <PaperTradingTerminal
                  virtualBalance={profile.virtualBalance}
                  onUpdateBalance={handleUpdateVirtualBalance}
                  onSaveToJournal={(pos) => {
                    const pnl = pos.realizedPnl || 0;
                    handleAddJournalEntry({
                      date: new Date().toISOString().split('T')[0],
                      market: pos.market,
                      symbol: pos.symbol,
                      side: pos.side,
                      entryPrice: pos.entryPrice,
                      exitPrice: pos.currentPrice,
                      quantity: pos.quantity,
                      pnl,
                      strategy: 'Paper Trading Terminal Execution',
                      emotion: pnl >= 0 ? 'Disciplined' : 'Fearful',
                      lessonLearned: `Simulated trade closed. P&L: ₹${pnl.toFixed(2)}`,
                    });
                  }}
                />
              </div>
            )}

            {activeTab === 'tools' && (
              <ToolsView
                profile={profile}
                journalEntries={journalEntries}
                onAddJournalEntry={handleAddJournalEntry}
                onDeleteJournalEntry={handleDeleteJournalEntry}
                onOpenLesson={handleOpenLesson}
                initialTab={toolsInitialTab}
              />
            )}
          </>
        )}
      </main>

      {/* Search Modal */}
      {showSearchModal && (
        <SearchModal
          onClose={() => setShowSearchModal(false)}
          onSelectLesson={(l) => {
            setActiveLesson(l);
          }}
        />
      )}

      {/* Badges Modal */}
      {showBadgesModal && (
        <BadgesModal
          profile={profile}
          onClose={() => setShowBadgesModal(false)}
        />
      )}

      {/* Trading Journal Modal */}
      {showJournalModal && (
        <TradingJournalModal
          entries={journalEntries}
          onAddEntry={handleAddJournalEntry}
          onDeleteEntry={handleDeleteJournalEntry}
          onClose={() => setShowJournalModal(false)}
        />
      )}

      {/* Android & iOS Mobile App Installation Modal */}
      <InstallMobileAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />

      {/* Android Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveLesson(null);
          setShowSettingsView(false);
          setActiveTab(tab);
        }}
      />
    </div>
  );
}
