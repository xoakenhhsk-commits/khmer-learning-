"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LESSONS, VOCABULARY } from "@/lib/data";
import { useStore } from "@/store/useStore";
import { Flashcard } from "@/components/Flashcard";
import { QuizGame } from "@/components/QuizGame";
import { ArrowLeft, BookOpen, Brain, Trophy, Volume2, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { playTTS, cn } from "@/lib/utils";

type Mode = "overview" | "flashcard" | "quiz" | "result";

export default function LessonPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { addXP, completeLesson } = useStore();
  const [mode, setMode] = useState<Mode>("overview");
  const [cardIndex, setCardIndex] = useState(0);
  const [quizResult, setQuizResult] = useState({ score: 0, xp: 0 });
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const lesson = LESSONS.find((l) => l.id === id);
  const vocab = VOCABULARY.filter((v) => v.lessonId === id);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "var(--bg)" }}>
        <Loader2 className="animate-spin text-green-500" size={40} />
      </div>
    );
  }

  if (!lesson) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-bold mb-4">Không tìm thấy bài học</h2>
        <Link href="/learn" className="btn-primary">← Quay lại</Link>
      </div>
    </div>
  );

  const handleSpeak = (vocabItem: typeof vocab[0]) => {
    if (speakingId) return;
    setSpeakingId(vocabItem.id);
    playTTS(vocabItem.khmerWord).finally(() => {
      setTimeout(() => setSpeakingId(null), 300);
    });
  };

  const handleQuizComplete = (score: number, xp: number) => {
    setQuizResult({ score, xp });
    completeLesson(lesson.id);
    setTimeout(() => setMode("result"), 1500);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="sticky top-0 z-40 px-4 py-3 flex items-center gap-4 border-b"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <Link href="/learn"
          className="p-2 rounded-xl hover:opacity-70 transition-opacity"
          style={{ background: "var(--bg-secondary)" }}>
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="font-black text-base">{lesson.title}</h1>
          <p className="khmer-text text-sm" style={{ color: "var(--text-muted)" }}>{lesson.titleKh}</p>
        </div>
        <span className="badge badge-orange">Lv.{lesson.level}</span>
      </div>

      <div className="max-w-xl mx-auto p-4">
        <AnimatePresence mode="wait">

          {/* Overview */}
          {mode === "overview" && (
            <motion.div key="overview"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} className="space-y-6 py-4">

              <div className="card text-center p-8">
                <div className="text-6xl mb-4">📖</div>
                <h2 className="text-xl font-black mb-2">{lesson.title}</h2>
                <p className="khmer-text text-2xl font-bold mb-2" style={{ color: "var(--green)" }}>
                  {lesson.titleKh}
                </p>
                <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>{lesson.description}</p>
                <div className="flex items-center justify-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-black" style={{ color: "var(--blue)" }}>{vocab.length}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Từ vựng</p>
                  </div>
                  <div className="w-px h-8" style={{ background: "var(--border)" }} />
                  <div className="text-center">
                    <p className="text-2xl font-black" style={{ color: "var(--orange)" }}>+{lesson.xpReward}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>XP</p>
                  </div>
                  <div className="w-px h-8" style={{ background: "var(--border)" }} />
                  <div className="text-center">
                    <p className="text-2xl font-black" style={{ color: "var(--purple)" }}>{lesson.level}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Level</p>
                  </div>
                </div>
              </div>

              {/* Vocab preview */}
              <div className="space-y-3">
                <h3 className="font-black text-base flex items-center gap-2">
                  🔤 Từ vựng trong bài
                  <span className="badge badge-blue">{vocab.length} từ</span>
                </h3>
                {vocab.map((v) => (
                  <motion.div 
                    key={v.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card flex items-center gap-4 py-4 group hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer"
                    onClick={() => handleSpeak(v)}
                  >
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm transition-transform group-hover:scale-110"
                      style={{ background: "rgba(88,204,2,0.1)", color: "var(--green)" }}>
                      <span className="khmer-text font-black">{v.khmerWord.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="khmer-text text-xl font-black mb-0.5">{v.khmerWord}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600">
                          {v.phoneticVi}
                        </span>
                        <span className="text-sm font-bold" style={{ color: "var(--blue)" }}>
                          {v.meaningVi}
                        </span>
                      </div>
                    </div>
                    <button
                      className={cn(
                        "p-3 rounded-2xl transition-all shadow-sm",
                        speakingId === v.id 
                          ? "bg-blue-500 text-white scale-110" 
                          : "bg-blue-50 text-blue-500 group-hover:bg-blue-100 group-hover:scale-110"
                      )}
                    >
                      {speakingId === v.id
                        ? <Loader2 size={20} className="animate-spin" />
                        : <Volume2 size={20} />
                      }
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <button onClick={() => setMode("flashcard")} className="btn-primary w-full text-base">
                  <BookOpen size={20} /> 📖 Học Flashcard (Có phát âm)
                </button>
                <button onClick={() => setMode("quiz")} className="btn-secondary w-full text-base">
                  <Brain size={20} /> 🧠 Làm Quiz ngay
                </button>
              </div>
            </motion.div>
          )}

          {/* Flashcard mode */}
          {mode === "flashcard" && (
            <motion.div key="flashcard"
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }} className="py-4 space-y-6">
              <Flashcard
                vocab={vocab[cardIndex]}
                current={cardIndex + 1}
                total={vocab.length}
                onNext={() => {
                  if (cardIndex < vocab.length - 1) setCardIndex((i) => i + 1);
                  else {
                    toast.success("🎉 Xem xong tất cả flashcard!");
                    setMode("quiz");
                  }
                }}
                onPrev={() => setCardIndex((i) => Math.max(0, i - 1))}
              />
              <button onClick={() => setMode("quiz")} className="btn-primary w-full">
                🧠 Tiếp theo: Làm Quiz
              </button>
            </motion.div>
          )}

          {/* Quiz mode */}
          {mode === "quiz" && (
            <motion.div key="quiz"
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }} className="py-4">
              <QuizGame vocab={vocab} onComplete={handleQuizComplete} />
            </motion.div>
          )}

          {/* Result */}
          {mode === "result" && (
            <motion.div key="result"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="py-8 text-center space-y-6">
              <div className="text-7xl animate-bounce-in">🏆</div>
              <h2 className="text-3xl font-black">Bài học hoàn thành!</h2>
              <div className="card p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span style={{ color: "var(--text-muted)" }}>Điểm số</span>
                  <span className="font-black text-xl" style={{ color: "var(--green)" }}>
                    {quizResult.score} điểm
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: "var(--text-muted)" }}>XP kiếm được</span>
                  <span className="font-black text-xl" style={{ color: "var(--orange)" }}>
                    +{quizResult.xp} XP ⚡
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <button onClick={() => router.push("/learn")} className="btn-primary w-full text-base">
                  🏠 Về trang chủ
                </button>
                <button onClick={() => { setMode("overview"); setCardIndex(0); }}
                  className="btn-secondary w-full text-base">
                  🔄 Học lại
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
