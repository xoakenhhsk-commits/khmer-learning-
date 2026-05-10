import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { Sidebar, BottomNav } from "@/components/Navigation";
import { LESSONS, CATEGORIES } from "@/lib/data";
import { Lock, CheckCircle, Zap, BookOpen } from "lucide-react";

export default function LessonsPage() {
  const { user, isAuthenticated, completedLessons } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 main-content">
        <div className="p-6 max-w-3xl mx-auto">
          
          <div className="flex items-center gap-4 mb-8 mt-4">
            <div className="p-3 rounded-2xl bg-blue-100 text-blue-600 shadow-sm">
              <BookOpen size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Lộ trình bài học</h1>
              <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Học theo từng chủ đề để nâng cao vốn từ vựng</p>
            </div>
          </div>

          <div className="space-y-6">
            {LESSONS.map((lesson, i) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const isUnlocked = i === 0 || completedLessons.includes(LESSONS[i - 1]?.id) || !lesson.isLocked;
              const category = CATEGORIES.find(c => c.id === lesson.categoryId);
              
              return (
                <motion.div key={lesson.id}
                  initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}>
                  <Link to={isUnlocked ? `/lessons/${lesson.id}` : "#"}
                    className={`card flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden ${!isUnlocked ? "opacity-70 cursor-not-allowed grayscale-[0.5]" : "hover:scale-[1.01] hover:border-blue-400 transition-all shadow-md hover:shadow-lg"}`}>
                    
                    {/* Thumbnail / Icon */}
                    <div className="w-full sm:w-32 h-32 rounded-2xl flex flex-col items-center justify-center text-4xl flex-shrink-0 relative overflow-hidden"
                      style={{ background: isCompleted ? "rgba(88,204,2,0.1)" : isUnlocked ? "rgba(28,176,246,0.1)" : "var(--bg-secondary)" }}>
                      
                      {lesson.imageUrl ? (
                        <img src={lesson.imageUrl} alt={lesson.title} className="absolute inset-0 w-full h-full object-cover opacity-20" />
                      ) : null}
                      
                      <div className="z-10 bg-white/80 p-3 rounded-full shadow-sm mb-2 backdrop-blur-sm">
                        {category?.icon || "📖"}
                      </div>
                      <span className="z-10 text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-white/90 rounded-full shadow-sm text-gray-700">
                        Level {lesson.level}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 w-full text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                        <h3 className="font-black text-xl">{lesson.title}</h3>
                        {isCompleted && <CheckCircle size={20} style={{ color: "var(--green)" }} />}
                      </div>
                      <p className="khmer-text text-lg font-bold mb-2" style={{ color: "var(--green)" }}>{lesson.titleKh}</p>
                      <p className="text-sm font-medium mb-3" style={{ color: "var(--text-muted)" }}>{lesson.description}</p>
                      
                      <div className="flex items-center justify-center sm:justify-start gap-3">
                        <span className="badge badge-orange font-black">Chủ đề: {category?.name}</span>
                        <span className="flex items-center gap-1 text-sm font-black" style={{ color: "var(--orange)" }}>
                          <Zap size={16} className="fill-orange-500" /> +{lesson.xpReward} XP
                        </span>
                      </div>
                    </div>

                    {/* Lock/Unlock Status */}
                    {!isUnlocked && (
                      <div className="absolute right-6 top-6 sm:top-1/2 sm:-translate-y-1/2">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm"
                          style={{ background: "var(--bg-secondary)" }}>
                          <Lock size={20} style={{ color: "var(--text-muted)" }} />
                        </div>
                      </div>
                    )}

                    {isCompleted && (
                      <div className="absolute right-6 top-6 sm:top-1/2 sm:-translate-y-1/2">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm bg-green-50">
                          <CheckCircle size={28} className="text-green-500" />
                        </div>
                      </div>
                    )}
                    
                    {/* Progress indicator (mocked) */}
                    {isUnlocked && !isCompleted && (
                      <div className="absolute right-6 top-6 sm:top-1/2 sm:-translate-y-1/2">
                         <div className="w-24 h-2 rounded-full bg-gray-200 overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: "30%" }} />
                         </div>
                         <p className="text-[10px] text-right font-bold text-gray-500 mt-1">Đang học...</p>
                      </div>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
          
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
