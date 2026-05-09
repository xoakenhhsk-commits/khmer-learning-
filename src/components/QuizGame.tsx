"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { Volume2, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { cn, shuffleArray, playTTS } from "@/lib/utils";
import { VocabItem } from "@/lib/data";
import toast from "react-hot-toast";

interface QuizProps {
  vocab: VocabItem[];
  onComplete: (score: number, xp: number) => void;
}

type Question = {
  vocab: VocabItem;
  options: string[];
  correctAnswer: string;
  type: "kh_to_vi" | "vi_to_kh";
};

function buildQuestions(vocab: VocabItem[]): Question[] {
  return vocab.map((item) => {
    const isKhToVi = Math.random() > 0.4; // Favor kh_to_vi for more audio practice
    const others = vocab.filter((v) => v.id !== item.id);
    const wrongOptions = shuffleArray(others)
      .slice(0, 3)
      .map((v) => (isKhToVi ? v.meaningVi : v.khmerWord));
    const correctAnswer = isKhToVi ? item.meaningVi : item.khmerWord;
    const options = shuffleArray([correctAnswer, ...wrongOptions]);
    return { vocab: item, options, correctAnswer, type: isKhToVi ? "kh_to_vi" : "vi_to_kh" };
  });
}

export function QuizGame({ vocab, onComplete }: QuizProps) {
  const [questions] = useState(() => buildQuestions(shuffleArray(vocab).slice(0, 6)));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { loseHeart, addXP, hearts } = useStore();

  const q = questions[current];

  // Auto-play Khmer word when question shows
  useEffect(() => {
    if (q?.type === "kh_to_vi") {
      const t = setTimeout(() => {
        setIsPlaying(true);
        playTTS(q.vocab.khmerWord).finally(() => {
          setTimeout(() => setIsPlaying(false), 300);
        });
      }, 400);
      return () => clearTimeout(t);
    }
  }, [current]);

  const handleSpeak = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    playTTS(q.vocab.khmerWord).finally(() => {
      setTimeout(() => setIsPlaying(false), 300);
    });
  };

  const handleAnswer = (option: string) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    const correct = option === q.correctAnswer;

    if (correct) {
      setScore((s) => s + 1);
      toast.success("Đúng rồi! 🎉", { duration: 1000 });
      // Always play audio when correct to reinforce learning
      playTTS(q.vocab.khmerWord);
    } else {
      loseHeart();
      toast.error(`Sai rồi! Đáp án: ${q.correctAnswer}`, { duration: 2000 });
      // Speak correct answer so they learn it
      setTimeout(() => playTTS(q.vocab.khmerWord), 500);
    }

    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent((c) => c + 1);
        setSelected(null);
        setAnswered(false);
      } else {
        const finalScore = correct ? score + 1 : score;
        const xpEarned = finalScore * 10 + (finalScore === questions.length ? 20 : 0);
        addXP(xpEarned);
        setShowResult(true);
        onComplete(finalScore, xpEarned);
      }
    }, 1800); // Increased delay to allow audio to finish
  };

  if (showResult) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center gap-6 p-8 text-center"
      >
        <div className="text-7xl animate-bounce-in">
          {pct >= 80 ? "🏆" : pct >= 60 ? "⭐" : "📚"}
        </div>
        <h2 className="text-3xl font-black">
          {pct >= 80 ? "Xuất sắc!" : pct >= 60 ? "Tốt lắm!" : "Cố gắng hơn!"}
        </h2>
        <div className="text-6xl font-black" style={{ color: "var(--green)" }}>{pct}%</div>
        <p className="text-lg" style={{ color: "var(--text-muted)" }}>
          {score}/{questions.length} câu đúng
        </p>
        <div className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-lg"
          style={{ background: "rgba(88,204,2,0.15)", color: "var(--green)" }}>
          ⚡ +{score * 10 + (pct === 100 ? 20 : 0)} XP
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1 xp-bar">
          <div className="xp-fill" style={{ width: `${(current / questions.length) * 100}%` }} />
        </div>
        <div className="ml-4 flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.span key={i}
              animate={i === hearts ? { scale: [1, 1.3, 1] } : {}}
              className={i < hearts ? "heart" : "heart-empty"}
            >❤️</motion.span>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current}
          initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }} transition={{ duration: 0.25 }}
        >
          {/* Question Card */}
          <div className="card text-center mb-6">
            <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
              {q.type === "kh_to_vi" ? "🔤 Từ tiếng Khmer này có nghĩa là gì?" : "🔤 Từ nào là tiếng Khmer?"}
            </p>

            <div className="flex items-center justify-center gap-3 mb-2">
              <p className={cn("font-black", q.type === "kh_to_vi" ? "khmer-text text-5xl" : "text-3xl")}
                style={{ color: "var(--text)" }}>
                {q.type === "kh_to_vi" ? q.vocab.khmerWord : q.vocab.meaningVi}
              </p>

              {q.type === "kh_to_vi" && (
                <button onClick={handleSpeak}
                  className={cn(
                    "p-2 rounded-xl transition-all flex-shrink-0",
                    isPlaying ? "scale-110" : "hover:opacity-70"
                  )}
                  style={{ background: "rgba(28,176,246,0.1)", color: "var(--blue)" }}
                >
                  {isPlaying
                    ? <Loader2 size={20} className="animate-spin" />
                    : <Volume2 size={20} />
                  }
                </button>
              )}
            </div>

            {/* Sound wave indicator */}
            {isPlaying && q.type === "kh_to_vi" && (
              <div className="flex gap-1 items-end h-5 justify-center mt-1">
                {[0,1,2,3,4].map((i) => (
                  <motion.div key={i}
                    className="w-1 rounded-full"
                    style={{ background: "var(--blue)" }}
                    animate={{ height: [3, 16, 3] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </div>
            )}

            {q.type === "kh_to_vi" && (
              <p className="mt-2 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                📢 {q.vocab.phoneticVi}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3">
            {q.options.map((option, i) => {
              const isSelected = selected === option;
              const isCorrect = option === q.correctAnswer;
              const showFeedback = answered;
              return (
                <motion.button key={option}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => handleAnswer(option)}
                  className={cn("quiz-option",
                    showFeedback && isCorrect && "correct",
                    showFeedback && isSelected && !isCorrect && "wrong",
                    !showFeedback && "hover:scale-[1.01]"
                  )}
                >
                  <span className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ background: "var(--bg-secondary)" }}>
                    {["A", "B", "C", "D"][i]}
                  </span>
                  <span className={cn("khmer-text flex-1 text-left font-semibold", q.type === "vi_to_kh" && "text-xl")}>
                    {option}
                  </span>
                  {showFeedback && isCorrect && <CheckCircle size={20} style={{ color: "var(--green)" }} />}
                  {showFeedback && isSelected && !isCorrect && <XCircle size={20} style={{ color: "var(--red)" }} />}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="text-center text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
        Câu {current + 1} / {questions.length} • 💡 Nhấn để chọn đáp án
      </p>
    </div>
  );
}
