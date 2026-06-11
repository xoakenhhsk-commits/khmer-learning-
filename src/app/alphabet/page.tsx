import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/Navigation";
import { useStore } from "@/store/useStore";
import { khmerConsonants, KhmerConsonant } from "@/data/alphabet";
import { playTTS, shuffleArray, cn } from "@/lib/utils";
import { Volume2, BookOpen, BrainCircuit, ArrowLeft, Trophy, CheckCircle2, XCircle } from "lucide-react";
import confetti from "canvas-confetti";

type Mode = "learn" | "quiz" | "result";

export default function AlphabetPage() {
  const [mode, setMode] = useState<Mode>("learn");
  const [selectedChar, setSelectedChar] = useState<KhmerConsonant | null>(null);
  
  // Quiz State
  const [quizQuestions, setQuizQuestions] = useState<KhmerConsonant[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<KhmerConsonant[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  
  const addXP = useStore(state => state.addXP);

  // Initialize Quiz
  const startQuiz = () => {
    const shuffled = shuffleArray(khmerConsonants).slice(0, 10); // 10 questions per quiz
    setQuizQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setMode("quiz");
    generateOptions(shuffled[0]);
  };

  const generateOptions = (correctChar: KhmerConsonant) => {
    const others = khmerConsonants.filter(c => c.id !== correctChar.id);
    const wrongOptions = shuffleArray(others).slice(0, 3);
    setOptions(shuffleArray([correctChar, ...wrongOptions]));
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const handleAnswer = (answerId: string) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(answerId);
    const correct = answerId === quizQuestions[currentIndex].id;
    setIsCorrect(correct);
    
    if (correct) {
      playTTS("ត្រឹមត្រូវ"); // Correct
      setScore(s => s + 1);
    } else {
      playTTS("ខុសហើយ"); // Incorrect
    }

    setTimeout(() => {
      if (currentIndex < quizQuestions.length - 1) {
        generateOptions(quizQuestions[currentIndex + 1]);
        setCurrentIndex(i => i + 1);
      } else {
        finishQuiz();
      }
    }, 1500);
  };

  const finishQuiz = () => {
    setMode("result");
    addXP(score * 5);
    if (score >= 5) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <Sidebar />
      <main className="main-content min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black mb-2" style={{ color: "var(--text)" }}>Bảng chữ cái Khmer</h1>
            <p className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>
              Học 33 phụ âm cơ bản và luyện tập trí nhớ
            </p>
          </div>
          
          {mode === "learn" && (
            <button onClick={startQuiz} className="btn-primary w-full sm:w-auto">
              <BrainCircuit size={20} /> BẮT ĐẦU LUYỆN TẬP
            </button>
          )}
          {mode !== "learn" && (
            <button onClick={() => setMode("learn")} className="btn-secondary w-full sm:w-auto">
              <ArrowLeft size={20} /> QUAY LẠI HỌC
            </button>
          )}
        </div>

        {/* LEARN MODE */}
        {mode === "learn" && (
          <div className="space-y-8 animate-fade-in">
            {/* Legend */}
            <div className="flex gap-4 justify-center flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm font-bold">Âm "A" (Giọng thanh)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-sm font-bold">Âm "O" (Giọng trầm)</span>
              </div>
            </div>

            {/* Alphabet Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
              {khmerConsonants.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedChar(item);
                    playTTS(item.char);
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-2xl border-b-4 transition-all hover:brightness-110 aspect-square",
                    item.series === "A" ? "bg-green-50 border-green-200 text-green-700" : "bg-blue-50 border-blue-200 text-blue-700"
                  )}
                  style={{ 
                    background: item.series === "A" ? "rgba(88,204,2,0.1)" : "rgba(28,176,246,0.1)",
                    borderColor: item.series === "A" ? "rgba(88,204,2,0.3)" : "rgba(28,176,246,0.3)",
                  }}
                >
                  <span className="khmer-text text-3xl sm:text-4xl font-bold mb-1">{item.char}</span>
                  <span className="text-xs sm:text-sm font-bold opacity-80">{item.phonetic}</span>
                </motion.button>
              ))}
            </div>

            {/* Selected Character Detail (Popup/Modal style) */}
            <AnimatePresence>
              {selectedChar && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="fixed inset-x-0 bottom-0 sm:inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/20 backdrop-blur-sm"
                  onClick={() => setSelectedChar(null)}
                >
                  <div 
                    className="w-full sm:w-[400px] bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-700 relative"
                    onClick={e => e.stopPropagation()}
                  >
                    <button 
                      onClick={() => setSelectedChar(null)}
                      className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200"
                    >
                      ×
                    </button>
                    
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-32 h-32 rounded-3xl flex items-center justify-center mb-6 shadow-inner",
                        selectedChar.series === "A" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                      )}>
                        <span className="khmer-text text-7xl font-bold">{selectedChar.char}</span>
                      </div>
                      
                      <h2 className="text-3xl font-black mb-1">{selectedChar.phonetic}</h2>
                      <p className="text-gray-500 font-bold mb-6">Nhóm âm "{selectedChar.series}"</p>
                      
                      <div className="grid grid-cols-2 gap-4 w-full mb-6">
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl flex flex-col items-center">
                          <span className="text-xs font-bold text-gray-400 mb-1 uppercase">Ký tự chân</span>
                          <span className="khmer-text text-3xl font-bold">{selectedChar.subscript}</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl flex flex-col items-center">
                          <span className="text-xs font-bold text-gray-400 mb-1 uppercase">Ví dụ</span>
                          <span className="text-base font-bold text-center h-full flex items-center">{selectedChar.meaning}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => playTTS(selectedChar.char)}
                        className="btn-primary w-full"
                      >
                        <Volume2 size={20} /> NGHE LẠI
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* QUIZ MODE */}
        {mode === "quiz" && quizQuestions.length > 0 && (
          <div className="max-w-2xl mx-auto animate-slide-up">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 xp-bar">
                <div className="xp-fill" style={{ width: `${((currentIndex) / quizQuestions.length) * 100}%` }} />
              </div>
              <span className="font-bold text-gray-500">{currentIndex + 1}/{quizQuestions.length}</span>
            </div>

            <div className="card p-8 sm:p-12 text-center mb-8 relative overflow-hidden">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Chữ nào có phiên âm là</p>
              <h2 className="text-5xl sm:text-6xl font-black text-blue-500">{quizQuestions[currentIndex].phonetic}</h2>
              
              <button 
                onClick={() => playTTS(quizQuestions[currentIndex].char)}
                className="mt-6 mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200 transition-colors"
              >
                <Volume2 size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {options.map((opt) => {
                let stateClass = "";
                if (selectedAnswer) {
                  if (opt.id === quizQuestions[currentIndex].id) stateClass = "correct";
                  else if (opt.id === selectedAnswer) stateClass = "wrong";
                  else stateClass = "opacity-50";
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleAnswer(opt.id)}
                    disabled={!!selectedAnswer}
                    className={cn(
                      "quiz-option justify-center py-8 text-4xl sm:text-5xl khmer-text transition-all",
                      stateClass
                    )}
                  >
                    {opt.char}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* RESULT MODE */}
        {mode === "result" && (
          <div className="max-w-md mx-auto text-center animate-bounce-in pt-10">
            <div className="w-32 h-32 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Trophy size={64} />
            </div>
            <h2 className="text-3xl font-black mb-4">Hoàn thành bài tập!</h2>
            <p className="text-xl font-bold mb-8 text-gray-500">
              Bạn đạt <span className="text-green-500">{score}/{quizQuestions.length}</span> điểm
            </p>

            <div className="card mb-8 p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200">
              <div className="flex items-center justify-center gap-3 text-green-600 dark:text-green-400">
                <span className="font-black text-2xl">+{score * 5} XP</span>
              </div>
            </div>

            <div className="space-y-4">
              <button onClick={startQuiz} className="btn-primary w-full text-lg py-4">
                LÀM LẠI BÀI
              </button>
              <button onClick={() => setMode("learn")} className="btn-secondary w-full text-lg py-4">
                VỀ BẢNG CHỮ CÁI
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
