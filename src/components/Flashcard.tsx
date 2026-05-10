"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, RotateCcw, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { VocabItem, playTTS } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  vocab: VocabItem;
  onNext?: () => void;
  onPrev?: () => void;
  current?: number;
  total?: number;
}

export function Flashcard({ vocab, onNext, onPrev, current = 1, total = 1 }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayed, setAutoPlayed] = useState(false);

  // Auto-play pronunciation when card changes
  useEffect(() => {
    setFlipped(false);
    setIsPlaying(false);
    
    // Slight delay to allow transition to finish
    const timer = setTimeout(() => {
      handleSpeak();
    }, 500);
    
    return () => {
      clearTimeout(timer);
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
    };
  }, [vocab.id]);

  const handleSpeak = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isPlaying) return;
    
    setIsPlaying(true);
    playTTS(vocab.khmerWord).finally(() => {
      // Add a small delay before allowing next play to avoid overlapping
      setTimeout(() => setIsPlaying(false), 500);
    });
  };

  const handleNext = () => {
    if (isPlaying) return;
    setFlipped(false);
    onNext?.();
  };

  const handlePrev = () => {
    if (isPlaying) return;
    setFlipped(false);
    onPrev?.();
  };

  const progressPct = (current / total) * 100;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-3 w-full px-2">
        <div className="flex-1 xp-bar">
          <div className="xp-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <span className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>
          {current}/{total}
        </span>
      </div>

      {/* Card Container */}
      <div className="w-full relative h-[320px] sm:h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={vocab.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <div
              className={cn("flashcard w-full h-full", flipped && "flipped")}
              onClick={() => setFlipped(!flipped)}
            >
              <div className="flashcard-inner w-full h-full">
                {/* Front */}
                <div
                  className="flashcard-front w-full h-full flex flex-col items-center justify-center p-6 sm:p-8 card overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #58CC02 0%, #4CAF00 100%)", border: "none" }}
                >
                  <motion.p
                    className="khmer-text text-4xl sm:text-6xl font-bold text-white text-center mb-3 sm:mb-4 cursor-pointer hover:scale-105 transition-transform"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    onClick={handleSpeak}
                  >
                    {vocab.khmerWord}
                  </motion.p>
                  <p className="text-white/90 text-lg sm:text-xl font-medium mb-4 sm:mb-6 bg-black/10 px-4 py-1 rounded-full">
                    {vocab.phoneticVi}
                  </p>

                  {/* Speaker button */}
                  <button
                    onClick={handleSpeak}
                    className={cn(
                      "p-5 rounded-full transition-all flex items-center justify-center shadow-lg",
                      isPlaying ? "bg-white scale-110" : "bg-white/20 hover:bg-white/40 hover:scale-110"
                    )}
                  >
                    {isPlaying
                      ? <Loader2 size={32} className="text-green-600 animate-spin" />
                      : <Volume2 size={32} className={cn(isPlaying ? "text-green-600" : "text-white")} />
                    }
                  </button>

                  {isPlaying && (
                    <div className="mt-6 flex gap-1.5 items-end h-8">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <motion.div key={i}
                          className="w-1.5 rounded-full bg-white"
                          animate={{ height: [8, 32, 8] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                        />
                      ))}
                    </div>
                  )}

                  <p className="absolute bottom-6 text-white/60 text-sm font-bold tracking-widest animate-pulse">
                    NHẤN ĐỂ XEM NGHĨA
                  </p>
                </div>

                {/* Back */}
                <div className="flashcard-back w-full h-full flex flex-col items-center justify-center p-6 sm:p-8 card">
                  <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 drop-shadow-sm">🇻🇳</div>
                  <h3 className="text-3xl sm:text-4xl font-black mb-2 text-center" style={{ color: "var(--text)" }}>
                    {vocab.meaningVi}
                  </h3>
                  {vocab.meaningEn && (
                    <p className="text-lg mb-6 font-medium" style={{ color: "var(--text-muted)" }}>
                      {vocab.meaningEn}
                    </p>
                  )}

                  {/* Audio control on back */}
                  <button
                    onClick={handleSpeak}
                    className={cn(
                      "mb-6 px-6 py-3 rounded-2xl flex items-center gap-3 font-bold transition-all shadow-sm",
                      isPlaying ? "bg-blue-100 text-blue-600 scale-105" : "bg-blue-50 text-blue-500 hover:bg-blue-100"
                    )}
                  >
                    {isPlaying ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} />}
                    Nghe phát âm
                  </button>

                  {vocab.exampleVi && (
                    <div className="w-full p-5 rounded-2xl border-2 border-dashed" style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
                      <p className="text-xs font-black mb-2 tracking-wider" style={{ color: "var(--green)" }}>VÍ DỤ</p>
                      <p 
                        className="khmer-text text-base font-bold mb-1 leading-relaxed cursor-pointer hover:text-green-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          playTTS(vocab.exampleKh);
                        }}
                      >
                        {vocab.exampleKh}
                      </p>
                      <p className="text-sm italic" style={{ color: "var(--text-muted)" }}>{vocab.exampleVi}</p>
                    </div>
                  )}
                  
                  <p className="absolute bottom-6 text-xs font-bold tracking-widest" style={{ color: "var(--text-muted)" }}>
                    NHẤN ĐỂ QUAY LẠI
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 sm:gap-4 w-full">
        <button
          onClick={handlePrev} disabled={current <= 1 || isPlaying}
          className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl border-b-4 transition-all disabled:opacity-30 active:border-b-0 active:translate-y-1"
          style={{ borderColor: "var(--border)", background: "var(--card)", borderBottomColor: "#ccc" }}
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={() => { setFlipped(false); handleSpeak(); }}
          className="flex-1 flex items-center justify-center gap-2 h-14 sm:h-16 rounded-2xl border-b-4 font-black text-sm sm:text-base transition-all hover:brightness-95 active:border-b-0 active:translate-y-1"
          style={{ borderColor: "var(--border)", background: "var(--card)", borderBottomColor: "#ccc" }}
        >
          <RotateCcw size={18} /> NGHE LẠI
        </button>

        <button
          onClick={handleNext} disabled={current >= total || isPlaying}
          className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl border-b-4 transition-all disabled:opacity-30 active:border-b-0 active:translate-y-1"
          style={{ borderColor: "var(--border)", background: "var(--card)", borderBottomColor: "#ccc" }}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <p className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>
        💡 Mẹo: Sử dụng phím mũi tên để chuyển thẻ
      </p>
    </div>
  );
}
