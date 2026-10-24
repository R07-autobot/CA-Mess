import React, { useState, useEffect, useCallback } from 'react';
import { AIFlashcard, ScheduledTopic } from '../types/ca-study';
import { 
  Sparkles, 
  X, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  ThumbsUp, 
  RotateCcw, 
  BrainCircuit, 
  CheckCircle2, 
  Layers, 
  ListFilter, 
  Lightbulb, 
  AlertTriangle, 
  Shuffle, 
  BookOpen,
  Award,
  Zap,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playChime } from '../utils/audio';

interface AIFlashcardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: ScheduledTopic | null;
  dateStr?: string;
}

export const AIFlashcardsModal: React.FC<AIFlashcardsModalProps> = ({
  isOpen,
  onClose,
  topic,
  dateStr,
}) => {
  const [flashcards, setFlashcards] = useState<AIFlashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [reviewIds, setReviewIds] = useState<Set<string>>(new Set());
  const [isDeckFinished, setIsDeckFinished] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [cardSource, setCardSource] = useState<'ai' | 'curated'>('ai');

  const fetchFlashcards = useCallback(async () => {
    if (!topic) return;
    setLoading(true);
    setError(null);
    setIsDeckFinished(false);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredIds(new Set());
    setReviewIds(new Set());

    try {
      const res = await fetch('/api/ai/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicTitle: topic.chapterTitle,
          paperCode: topic.paperCode,
          paperShortName: topic.paperShortName,
          subtopics: topic.subtopics || [],
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      if (Array.isArray(data.flashcards) && data.flashcards.length > 0) {
        setFlashcards(data.flashcards);
        setCardSource(data.source === 'curated' || data.source === 'curated_fallback' ? 'curated' : 'ai');
      } else {
        throw new Error('No flashcards generated');
      }
    } catch (err: any) {
      console.error('Flashcard fetch error:', err);
      setError(err?.message || 'Failed to generate flashcards.');
    } finally {
      setLoading(false);
    }
  }, [topic]);

  useEffect(() => {
    if (isOpen && topic) {
      fetchFlashcards();
    }
  }, [isOpen, topic, fetchFlashcards]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    if (!isOpen || loading || flashcards.length === 0 || isDeckFinished || viewMode === 'list') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === 'ArrowRight' || e.key === 'l') {
        e.preventDefault();
        handleNextCard();
      } else if (e.key === 'ArrowLeft' || e.key === 'h') {
        e.preventDefault();
        handlePrevCard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, flashcards.length, isDeckFinished, viewMode, currentIndex, isFlipped]);

  if (!isOpen || !topic) return null;

  const currentCard = flashcards[currentIndex];
  const totalCards = flashcards.length;

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
    playChime('card_flip');
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    if (currentIndex < totalCards - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsDeckFinished(true);
      playChime('milestone_unlocked');
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const markMastered = () => {
    if (!currentCard) return;
    setMasteredIds((prev) => new Set(prev).add(currentCard.id));
    setReviewIds((prev) => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
    playChime('card_flip');
    handleNextCard();
  };

  const markNeedReview = () => {
    if (!currentCard) return;
    setReviewIds((prev) => new Set(prev).add(currentCard.id));
    setMasteredIds((prev) => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
    playChime('card_flip');
    handleNextCard();
  };

  const restartDeck = (onlyReview: boolean = false) => {
    if (onlyReview && reviewIds.size > 0) {
      const reviewSubset = flashcards.filter((c) => reviewIds.has(c.id));
      setFlashcards(reviewSubset);
    }
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsDeckFinished(false);
  };

  const shuffleDeck = () => {
    setFlashcards((prev) => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsDeckFinished(false);
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Hard':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scaleIn text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30 flex-shrink-0">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {topic.paperCode} • {topic.paperShortName}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>AI Quick-Fire Flashcards</span>
                </span>
                {cardSource === 'curated' && (
                  <span className="text-[10px] text-slate-400">
                    (ICAI Curated Mastery Set)
                  </span>
                )}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white truncate mt-0.5">
                {topic.chapterTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-3">
            <button
              onClick={() => setViewMode((prev) => (prev === 'card' ? 'list' : 'card'))}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title={viewMode === 'card' ? 'Switch to All Cards Sheet View' : 'Switch to 3D Flip Card View'}
            >
              {viewMode === 'card' ? <ListFilter className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
              <span className="hidden sm:inline">{viewMode === 'card' ? 'Cheat Sheet' : 'Flip Cards'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-Header Toolbar: Progress, Scores, Actions */}
        <div className="bg-slate-950/60 px-4 sm:px-6 py-2.5 border-b border-slate-800/80 flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-300">
              Deck Progress: <strong className="text-indigo-400 font-mono">{currentIndex + 1}</strong> of <strong className="font-mono">{totalCards || 0}</strong>
            </span>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> {masteredIds.size} Mastered
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <RotateCcw className="w-3.5 h-3.5" /> {reviewIds.size} Need Review
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={shuffleDeck}
              disabled={loading || flashcards.length <= 1}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 flex items-center gap-1 cursor-pointer disabled:opacity-50 transition-colors"
              title="Randomize card order"
            >
              <Shuffle className="w-3 h-3 text-slate-400" />
              <span className="hidden sm:inline">Shuffle</span>
            </button>

            <button
              onClick={fetchFlashcards}
              disabled={loading}
              className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors active:scale-95 disabled:opacity-50"
              title="Generate a brand new set of AI flashcards for this topic"
            >
              <RotateCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full h-1 bg-slate-950 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${totalCards > 0 ? ((currentIndex + 1) / totalCards) * 100 : 0}%` }}
          />
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col justify-center">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-600/30 animate-pulse">
                  <Sparkles className="w-8 h-8 text-white animate-spin" />
                </div>
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  Generating High-Yield Quick-Fire Flashcards...
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Gemini 3.8 Flash is drafting 5-10 sharp exam questions, statutory limits, and ICAI model answers for <strong>"{topic.chapterTitle}"</strong>.
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-amber-400" />
              <p className="text-sm text-slate-300 max-w-md">{error}</p>
              <button
                onClick={fetchFlashcards}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer transition-all"
              >
                Retry Generation
              </button>
            </div>
          ) : isDeckFinished ? (
            /* Deck Completion Screen */
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-5 animate-scaleIn">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-black text-white">
                  Topic Flashcard Run Completed!
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  You just revised {totalCards} quick-fire points for <strong>{topic.chapterTitle}</strong>.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-emerald-500/30 text-center">
                  <span className="text-2xl font-black font-mono text-emerald-400">{masteredIds.size}</span>
                  <span className="block text-xs text-slate-400 font-semibold mt-0.5">Mastered Cards</span>
                </div>
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-amber-500/30 text-center">
                  <span className="text-2xl font-black font-mono text-amber-400">{reviewIds.size}</span>
                  <span className="block text-xs text-slate-400 font-semibold mt-0.5">Need Review</span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap justify-center pt-2">
                {reviewIds.size > 0 && (
                  <button
                    onClick={() => restartDeck(true)}
                    className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Review {reviewIds.size} Flagged Cards</span>
                  </button>
                )}

                <button
                  onClick={() => restartDeck(false)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Restart Full Deck</span>
                </button>

                <button
                  onClick={fetchFlashcards}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate New Questions</span>
                </button>
              </div>
            </div>
          ) : viewMode === 'list' ? (
            /* Cheat-Sheet List View */
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span>All {totalCards} Quick-Fire Revision Cards for Rapid Reading</span>
                <span className="font-mono text-indigo-400">{topic.chapterTitle}</span>
              </div>
              {flashcards.map((card, idx) => (
                <div key={card.id || idx} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2.5 hover:border-indigo-500/40 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Card #{idx + 1} • {card.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getDifficultyBadge(card.difficulty)}`}>
                      {card.difficulty}
                    </span>
                  </div>
                  <h5 className="text-sm font-bold text-white leading-snug">
                    {card.question}
                  </h5>
                  <div className="text-xs text-slate-300 bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 whitespace-pre-line leading-relaxed">
                    <strong className="text-emerald-400 block mb-1">ICAI Model Answer:</strong>
                    {card.answer}
                  </div>
                  {card.keyTakeaway && (
                    <div className="text-[11px] text-amber-300 bg-amber-500/10 px-2.5 py-1.5 rounded-lg border border-amber-500/20 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{card.keyTakeaway}</span>
                    </div>
                  )}
                  {card.examTip && (
                    <div className="text-[11px] text-red-300 bg-red-500/10 px-2.5 py-1.5 rounded-lg border border-red-500/20 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span><strong>ICAI Exam Trap:</strong> {card.examTip}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Interactive 3D Flip Card */
            currentCard && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div 
                  onClick={handleFlip}
                  className="w-full min-h-[300px] sm:min-h-[340px] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border-2 border-indigo-500/40 hover:border-indigo-400/70 rounded-2xl p-6 sm:p-8 cursor-pointer shadow-2xl relative flex flex-col justify-between transition-all duration-300 hover:shadow-indigo-500/10 group select-none"
                >
                  {/* Card Top Pill Row */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        {currentCard.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getDifficultyBadge(currentCard.difficulty)}`}>
                        {currentCard.difficulty}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono font-semibold">
                      {isFlipped ? 'Answer Side' : 'Question Side'} (Click to Flip)
                    </span>
                  </div>

                  {/* Card Center Content */}
                  <div className="my-auto py-4">
                    {!isFlipped ? (
                      <div className="space-y-4 text-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 mx-auto flex items-center justify-center">
                          <HelpCircle className="w-5 h-5" />
                        </div>
                        <h4 className="text-base sm:text-xl font-extrabold text-white leading-relaxed max-w-xl mx-auto">
                          {currentCard.question}
                        </h4>
                        <p className="text-xs text-indigo-300/80 font-medium">
                          Tap card or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">Space</kbd> to reveal answer
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3.5 animate-fadeIn">
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>ICAI Standard Provision & Model Answer:</span>
                        </div>
                        <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal whitespace-pre-line bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
                          {currentCard.answer}
                        </div>

                        {currentCard.keyTakeaway && (
                          <div className="text-xs text-amber-300 bg-amber-500/15 px-3 py-2 rounded-xl border border-amber-500/30 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                            <span><strong>Memory Key:</strong> {currentCard.keyTakeaway}</span>
                          </div>
                        )}

                        {currentCard.examTip && (
                          <div className="text-xs text-rose-300 bg-rose-500/15 px-3 py-2 rounded-xl border border-rose-500/30 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                            <span><strong>ICAI Trap:</strong> {currentCard.examTip}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Hint Bar */}
                  <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-slate-500 group-hover:text-slate-300 transition-colors">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Click to flip</span>
                    </span>
                    <span className="font-mono text-slate-400">
                      Card {currentIndex + 1} of {totalCards}
                    </span>
                  </div>
                </div>

                {/* Self-Rating & Navigation Controls */}
                <div className="flex items-center justify-between w-full max-w-xl gap-2 pt-1 flex-wrap">
                  <button
                    onClick={handlePrevCard}
                    disabled={currentIndex === 0}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={markNeedReview}
                      className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                      title="Flag card for further review"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Review Later</span>
                    </button>

                    <button
                      onClick={markMastered}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
                      title="Mark concept mastered"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Got It!</span>
                    </button>
                  </div>

                  <button
                    onClick={handleNextCard}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-md active:scale-95"
                  >
                    <span>{currentIndex === totalCards - 1 ? 'Finish' : 'Next'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Working Professional 5h Protocol: 5-minute active-recall flashcard drill</span>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <span>Keyboard:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px]">Space</kbd> Flip
            <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px]">← / →</kbd> Navigate
          </div>
        </div>
      </div>
    </div>
  );
};
