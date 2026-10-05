import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Download, 
  Trophy, 
  ArrowRight 
} from 'lucide-react';
import { QuizQuestion } from '../types';

interface Props {
  lessonTitle: string;
  questions: QuizQuestion[];
  onClose: () => void;
  onPassQuiz: (score: number) => void;
  onDownloadPdf?: () => void;
}

export const QuizModal: React.FC<Props> = ({
  lessonTitle,
  questions,
  onClose,
  onPassQuiz,
  onDownloadPdf,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQ = questions[currentIdx];
  const totalQuestions = questions.length;
  const isLast = currentIdx === totalQuestions - 1;

  const handleSelectOption = (optIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIdx]: optIndex,
    }));
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    let correctCount = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / totalQuestions) * 100);
    if (scorePercent >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      onPassQuiz(scorePercent);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentIdx(0);
  };

  // Calculate score if submitted
  let correctCount = 0;
  if (isSubmitted) {
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctIndex) {
        correctCount++;
      }
    });
  }
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const passed = scorePercent >= 70;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 text-slate-100 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="border-b border-slate-800 pb-4 mb-5">
          <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
            Concept Mastery Quiz • 70% Required to Pass
          </span>
          <h2 className="text-lg font-black text-white mt-0.5">{lessonTitle}</h2>
        </div>

        {/* Quiz Body */}
        {!isSubmitted ? (
          <div>
            {/* Progress Bar & Counter */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-2">
              <span>Question {currentIdx + 1} of {totalQuestions}</span>
              <span>{Math.round(((currentIdx + 1) / totalQuestions) * 100)}% Completed</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mb-6 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <div className="mb-6">
              <h3 className="text-base font-bold text-white leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentIdx] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-3 text-sm ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-semibold shadow-md'
                        : 'bg-slate-800/60 border-slate-700/70 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'border-slate-600 text-slate-400'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="leading-snug">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              >
                Previous
              </button>

              {isLast ? (
                <button
                  onClick={handleSubmit}
                  disabled={selectedAnswers[currentIdx] === undefined}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 disabled:opacity-40 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  Submit & Score
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={selectedAnswers[currentIdx] === undefined}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30 transition-all flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Results View */
          <div>
            <div className="text-center py-4 border-b border-slate-800 mb-6">
              <div className="inline-flex p-3 rounded-full mb-3 bg-slate-800 border border-slate-700">
                <Trophy size={36} className={passed ? 'text-amber-400 animate-bounce' : 'text-slate-500'} />
              </div>
              <h3 className="text-2xl font-black text-white">
                {passed ? '🎉 Congratulations! Quiz Passed!' : 'Need More Revision'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                You scored <strong className={passed ? 'text-emerald-400' : 'text-red-400'}>{scorePercent}%</strong> ({correctCount} / {totalQuestions} correct)
              </p>
              {passed ? (
                <p className="text-xs text-emerald-300 font-medium mt-1">
                  Lesson marked as completed! PDF lesson notes are now unlocked.
                </p>
              ) : (
                <p className="text-xs text-red-400 mt-1">
                  A minimum score of 70% is required to mark this lesson complete. Review explanations below and retry!
                </p>
              )}
            </div>

            {/* Answer Explanations Review */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1 mb-6">
              {questions.map((q, idx) => {
                const userAns = selectedAnswers[idx];
                const isCorrect = userAns === q.correctIndex;
                return (
                  <div
                    key={q.id}
                    className={`p-3.5 rounded-xl border text-xs ${
                      isCorrect ? 'bg-emerald-950/40 border-emerald-800/60' : 'bg-red-950/40 border-red-800/60'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-1.5">
                      {isCorrect ? (
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                      )}
                      <p className="font-bold text-white">
                        {idx + 1}. {q.question}
                      </p>
                    </div>

                    <div className="ml-6 space-y-1 text-slate-300">
                      <p>
                        Your answer:{' '}
                        <span className={isCorrect ? 'text-emerald-300 font-semibold' : 'text-red-300 font-semibold'}>
                          {userAns !== undefined ? q.options[userAns] : 'Not answered'}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-emerald-300">
                          Correct answer: <strong>{q.options[q.correctIndex]}</strong>
                        </p>
                      )}
                      <p className="text-slate-400 italic mt-1 bg-slate-900/60 p-2 rounded border border-slate-800">
                        💡 {q.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={handleRetry}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw size={14} />
                <span>Retry Quiz</span>
              </button>

              <div className="flex items-center gap-2">
                {passed && onDownloadPdf && (
                  <button
                    onClick={onDownloadPdf}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
                  >
                    <Download size={14} />
                    <span>Download PDF</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
