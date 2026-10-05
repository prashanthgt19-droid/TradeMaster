import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle, 
  Download, 
  Bookmark, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  Lock,
  Share2,
  ListOrdered
} from 'lucide-react';
import { Lesson, UserProfileState } from '../types';
import { generateLessonPDF } from '../utils/pdfGenerator';
import { QuizModal } from '../components/QuizModal';
import { AdMobModal } from '../components/AdMobModal';
import { LessonPointsRenderer } from '../components/LessonPointsRenderer';
import { LessonVideoPlayer } from '../components/LessonVideoPlayer';

interface Props {
  lesson: Lesson;
  profile: UserProfileState;
  onBack: () => void;
  onUpdateProgress: (lessonId: string, completed: boolean, score?: number) => void;
  onToggleBookmark: (lessonId: string) => void;
  onUnlockReward: (lessonId: string) => void;
}

export const LessonDetailView: React.FC<Props> = ({
  lesson,
  profile,
  onBack,
  onUpdateProgress,
  onToggleBookmark,
  onUnlockReward,
}) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [studyInPoints, setStudyInPoints] = useState<boolean>(true);

  const progress = profile.progress[lesson.id];
  const isCompleted = progress?.completed;
  const isRewardUnlocked = progress?.unlockedViaReward;
  const isBookmarked = profile.bookmarks.includes(lesson.id);

  // If locked and not unlocked via reward
  const isLocked = lesson.isLocked && !isRewardUnlocked;

  const handleDownloadPdf = () => {
    generateLessonPDF(lesson);
  };

  const handlePassQuiz = (score: number) => {
    onUpdateProgress(lesson.id, true, score);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Top Navigation & Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
        >
          <ArrowLeft size={16} />
          <span>Back to Curriculum</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleBookmark(lesson.id)}
            className={`p-2 rounded-xl border transition-colors ${
              isBookmarked
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={isBookmarked ? 'Bookmarked' : 'Add to bookmarks'}
          >
            <Bookmark size={16} className={isBookmarked ? 'fill-amber-400' : ''} />
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={!isCompleted && isLocked}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors disabled:opacity-40"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
        </div>
      </div>

      {/* Locked Barrier if Lesson requires Ad */}
      {isLocked ? (
        <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Lock size={32} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">{lesson.title}</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              This advanced lesson is unlocked through our Google AdMob rewarded learning partner.
            </p>
          </div>

          <button
            onClick={() => setShowAdModal(true)}
            className="px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-110 transition-all flex items-center gap-2 mx-auto shadow-lg shadow-amber-500/25"
          >
            <Sparkles size={16} />
            <span>Unlock Lesson via Rewarded Ad (5s)</span>
          </button>
        </div>
      ) : (
        /* Full Lesson Content */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-xl space-y-8">
          {/* Header */}
          <div className="border-b border-slate-800 pb-5">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
              <span>Level {lesson.level}</span>
              <span>•</span>
              <span>{lesson.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Clock size={12} /> {lesson.estimatedMinutes} mins
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {lesson.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {lesson.description}
            </p>
          </div>

          {/* Point-by-Point Study Mode Banner & Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-indigo-950/40 border border-emerald-500/30 text-xs shadow-md">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0">
                <ListOrdered size={16} />
              </span>
              <div>
                <p className="font-extrabold text-white text-xs sm:text-sm flex items-center gap-1.5">
                  <span>Structured Points Study Mode</span>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Active
                  </span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  All concepts broken down into numbered points & bullet takeaways for easy comprehension
                </p>
              </div>
            </div>

            <button
              onClick={() => setStudyInPoints(!studyInPoints)}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all shrink-0 flex items-center justify-center gap-1.5 ${
                studyInPoints
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <span>{studyInPoints ? 'Points Active ✓' : 'Switch to Points'}</span>
            </button>
          </div>

          {/* Embedded Video Masterclass Player */}
          <LessonVideoPlayer 
            lesson={lesson} 
            onVideoComplete={() => {
              // mark lesson completed or note in progress
            }} 
          />

          {/* Learning Objectives Box */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <h3 className="font-extrabold text-xs text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span>🎯 What You Will Master In This Lesson</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {lesson.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            {lesson.contentSections.map((sec, i) => (
              <div key={i} className="space-y-3">
                {sec.title && (
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                    <h2 className="text-base sm:text-lg font-black text-white border-l-3 border-emerald-500 pl-3">
                      {sec.title}
                    </h2>
                    <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-950 text-slate-400 border border-slate-800">
                      Part {i + 1}
                    </span>
                  </div>
                )}

                {studyInPoints ? (
                  <LessonPointsRenderer
                    text={sec.body}
                    bulletPoints={sec.bulletPoints}
                    accentColor={lesson.marketType === 'FOREX' ? 'amber' : 'emerald'}
                  />
                ) : (
                  <>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {sec.body}
                    </p>

                    {sec.bulletPoints && (
                      <ul className="space-y-2 pl-4 text-xs sm:text-sm text-slate-300">
                        {sec.bulletPoints.map((bp, bIdx) => (
                          <li key={bIdx} className="list-disc leading-relaxed">
                            {bp}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}

                {sec.calloutBox && (
                  <div
                    className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                      sec.calloutBox.type === 'warning' || sec.calloutBox.type === 'regulatory'
                        ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                        : 'bg-indigo-950/40 border-indigo-500/40 text-indigo-200'
                    }`}
                  >
                    <p className="font-bold text-white mb-1">
                      📌 {sec.calloutBox.title}
                    </p>
                    <p className="whitespace-pre-line text-slate-300 leading-relaxed">
                      {sec.calloutBox.text}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Key Takeaways */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5">
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider mb-3">
              ⭐ Key Takeaways & Rules
            </h3>
            <div className="space-y-2">
              {lesson.keyTakeaways.map((kt, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{kt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-5">
            <h3 className="font-extrabold text-xs text-red-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <AlertTriangle size={15} />
              <span>Common Beginner Traps to Avoid</span>
            </h3>
            <div className="space-y-2">
              {lesson.commonMistakes.map((cm, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="text-red-400 font-bold">✖</span>
                  <span>{cm}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer: Take Quiz & Completion */}
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              {isCompleted ? (
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 size={18} />
                  <span>Lesson Mastered • Quiz Passed ({progress?.quizScore || 100}%)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <HelpCircle size={16} />
                  <span>Score 70% on the quiz to complete lesson and unlock downloadable PDF</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowQuiz(true)}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <HelpCircle size={15} />
                <span>{isCompleted ? 'Review / Retake Quiz' : 'Take Lesson Quiz'}</span>
              </button>

              {isCompleted && (
                <button
                  onClick={handleDownloadPdf}
                  className="px-4 py-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1.5 shadow"
                >
                  <Download size={15} />
                  <span>Download PDF</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuiz && (
        <QuizModal
          lessonTitle={lesson.title}
          questions={lesson.quiz}
          onClose={() => setShowQuiz(false)}
          onPassQuiz={handlePassQuiz}
          onDownloadPdf={handleDownloadPdf}
        />
      )}

      {/* Rewarded Ad Modal */}
      {showAdModal && (
        <AdMobModal
          rewardTitle={lesson.title}
          onRewardEarned={() => onUnlockReward(lesson.id)}
          onClose={() => setShowAdModal(false)}
        />
      )}
    </div>
  );
};
