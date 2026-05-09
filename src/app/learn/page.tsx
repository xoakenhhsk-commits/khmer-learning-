"use client";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar, BottomNav } from "@/components/Navigation";
import { LESSONS, CATEGORIES } from "@/lib/data";
import { getLevelFromXP, getProgressPercent, formatXP } from "@/lib/utils";
import Link from "next/link";
import { Lock, CheckCircle, Star, Zap, Flame, Heart } from "lucide-react";

export default function LearnPage() {
  const { user, isAuthenticated, hearts, completedLessons } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/");
  }, [isAuthenticated]);

  if (!user) return null;

  const level = getLevelFromXP(user.xp);
  const progressPct = getProgressPercent(user.xp);
  const xpToNext = level * 100 - user.xp;

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 main-content">
        {/* Top bar */}
        <div className="sticky top-0 z-40 px-6 py-3 flex items-center justify-between border-b"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-black text-lg" style={{ color: "var(--orange)" }}>
              <Flame size={22} /> {user.streakDays}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < hearts ? "text-red-500" : "text-gray-300"} style={{ fontSize: 18 }}>❤️</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-32 xp-bar">
                <div className="xp-fill" style={{ width: `${progressPct}%` }} />
              </div>
              <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>
                {xpToNext} XP đến Lv.{level + 1}
              </span>
            </div>
            <span className="flex items-center gap-1 font-black" style={{ color: "var(--green)" }}>
              <Zap size={18} /> {formatXP(user.xp)}
            </span>
          </div>
        </div>

        <div className="p-6 max-w-3xl mx-auto">
          {/* Welcome */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="mb-8 p-6 rounded-3xl text-white"
            style={{ background: "linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)" }}>
            <p className="text-white/80 text-sm mb-1">Chào mừng trở lại,</p>
            <h1 className="text-2xl font-black mb-3">{user.name} 👋</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 rounded-2xl px-4 py-2">
                <Star size={16} /> <span className="font-bold">Lv.{level}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-2xl px-4 py-2">
                <Flame size={16} /> <span className="font-bold">{user.streakDays} ngày</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-2xl px-4 py-2">
                <Zap size={16} /> <span className="font-bold">{formatXP(user.xp)} XP</span>
              </div>
            </div>
          </motion.div>

          {/* Daily Goal */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            className="card mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-black text-lg">🎯 Mục tiêu hôm nay</h2>
              <span className="badge badge-green">10 XP / ngày</span>
            </div>
            <div className="xp-bar mb-2">
              <div className="xp-fill" style={{ width: "60%" }} />
            </div>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>6/10 XP — Còn 4 XP nữa đạt mục tiêu!</p>
          </motion.div>

          {/* Lessons */}
          <h2 className="text-xl font-black mb-4">📚 Bài học của bạn</h2>

          <div className="space-y-4">
            {LESSONS.map((lesson, i) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const isUnlocked = i === 0 || completedLessons.includes(LESSONS[i - 1]?.id) || !lesson.isLocked;
              return (
                <motion.div key={lesson.id}
                  initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}>
                  <Link href={isUnlocked ? `/lessons/${lesson.id}` : "#"}
                    className={`card flex items-center gap-4 relative overflow-hidden ${!isUnlocked ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.01] transition-transform"}`}>
                    {/* Level badge */}
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                      style={{ background: isCompleted ? "rgba(88,204,2,0.15)" : isUnlocked ? "rgba(28,176,246,0.15)" : "var(--bg-secondary)" }}>
                      {CATEGORIES.find(c => c.id === lesson.categoryId)?.icon || "📖"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-black text-base">{lesson.title}</h3>
                        {isCompleted && <CheckCircle size={16} style={{ color: "var(--green)" }} />}
                      </div>
                      <p className="khmer-text text-sm mb-1" style={{ color: "var(--text-muted)" }}>{lesson.titleKh}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{lesson.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="badge badge-orange">Lv.{lesson.level}</span>
                        <span className="flex items-center gap-1 text-xs font-bold" style={{ color: "var(--green)" }}>
                          <Zap size={12} /> +{lesson.xpReward} XP
                        </span>
                      </div>
                    </div>

                    {!isUnlocked && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                          style={{ background: "var(--bg-secondary)" }}>
                          <Lock size={20} style={{ color: "var(--text-muted)" }} />
                        </div>
                      </div>
                    )}

                    {isCompleted && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                          style={{ background: "rgba(88,204,2,0.15)" }}>
                          <CheckCircle size={20} style={{ color: "var(--green)" }} />
                        </div>
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
