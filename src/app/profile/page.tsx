import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Sidebar, BottomNav } from "@/components/Navigation";
import { ACHIEVEMENTS } from "@/lib/data";
import { getLevelFromXP, getProgressPercent, formatXP } from "@/lib/utils";
import { LogOut, Star, Flame, Zap, Trophy, BookOpen, Heart } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, isAuthenticated, hearts, completedLessons, logout, theme } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated]);

  if (!user) return null;

  const level = getLevelFromXP(user.xp);
  const progressPct = getProgressPercent(user.xp);
  const xpToNext = level * 100 - user.xp;

  const handleLogout = async () => {
    try {
      const { auth, signOut } = await import("@/lib/firebase");
      await signOut(auth);
      logout();
      toast.success("Đã đăng xuất!");
      navigate("/");
    } catch (e) {
      toast.error("Lỗi đăng xuất!");
    }
  };

  const earnedAchievements = ACHIEVEMENTS.filter((a) => {
    if (a.type === "LESSONS_COMPLETED") return completedLessons.length >= a.requirement;
    if (a.type === "XP") return user.xp >= a.requirement;
    if (a.type === "STREAK") return user.streakDays >= a.requirement;
    return false;
  });

  const stats = [
    { icon: <Zap size={20} />, label: "Tổng XP", value: formatXP(user.xp), color: "var(--orange)" },
    { icon: <Star size={20} />, label: "Cấp độ", value: `Lv.${level}`, color: "var(--purple)" },
    { icon: <Flame size={20} />, label: "Streak", value: `${user.streakDays} ngày`, color: "var(--orange)" },
    { icon: <BookOpen size={20} />, label: "Bài hoàn thành", value: completedLessons.length.toString(), color: "var(--blue)" },
    { icon: <Heart size={20} />, label: "Tim còn lại", value: `${hearts}/5`, color: "var(--red)" },
    { icon: <Trophy size={20} />, label: "Thành tích", value: `${earnedAchievements.length}/${ACHIEVEMENTS.length}`, color: "var(--green)" },
  ];

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 main-content">
        {/* Top bar */}
        <div className="sticky top-0 z-40 px-6 py-4 border-b flex items-center justify-between"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <h1 className="font-black text-xl">👤 Hồ Sơ</h1>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:opacity-80"
            style={{ background: "rgba(255,75,75,0.1)", color: "var(--red)" }}>
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>

        <div className="p-6 max-w-2xl mx-auto space-y-6">
          {/* Avatar & Name */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="card text-center p-8">
            <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl font-black relative"
              style={{ background: "linear-gradient(135deg, #58CC02, #1CB0F6)" }}>
              <span className="text-white">{user.name.charAt(0).toUpperCase()}</span>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white"
                style={{ background: "var(--orange)" }}>
                {level}
              </div>
            </div>
            <h2 className="text-2xl font-black mb-1">{user.name}</h2>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>{user.email}</p>
            <div className="badge badge-green mx-auto">Người học tiếng Khmer</div>

            {/* Level progress */}
            <div className="mt-6">
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span style={{ color: "var(--text-muted)" }}>Lv.{level}</span>
                <span style={{ color: "var(--text-muted)" }}>Lv.{level + 1} ({xpToNext} XP nữa)</span>
              </div>
              <div className="xp-bar">
                <motion.div className="xp-fill"
                  initial={{ width: 0 }} animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }} />
              </div>
              <p className="text-xs mt-1 text-right font-semibold" style={{ color: "var(--green)" }}>
                {user.xp} XP
              </p>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}>
            <h3 className="font-black text-lg mb-3">📊 Thống kê</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {stats.map((s, i) => (
                <motion.div key={s.label}
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="card text-center py-4">
                  <div className="flex justify-center mb-2" style={{ color: s.color }}>{s.icon}</div>
                  <p className="text-xl font-black mb-1" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}>
            <h3 className="font-black text-lg mb-3">🏆 Thành tích</h3>
            <div className="space-y-3">
              {ACHIEVEMENTS.map((a, i) => {
                const earned = earnedAchievements.find(e => e.id === a.id);
                return (
                  <motion.div key={a.id}
                    initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="card flex items-center gap-4"
                    style={{ opacity: earned ? 1 : 0.5 }}>
                    <div className="text-3xl w-12 h-12 flex items-center justify-center rounded-2xl flex-shrink-0"
                      style={{ background: earned ? "rgba(88,204,2,0.15)" : "var(--bg-secondary)" }}>
                      {a.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-sm">{a.nameVi}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{a.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {earned
                        ? <span className="badge badge-green">✓ Đạt</span>
                        : <span className="badge badge-orange">+{a.xpReward} XP</span>
                      }
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Streak calendar placeholder */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }} className="card">
            <h3 className="font-black text-lg mb-4">🔥 Chuỗi học tập</h3>
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: 30 }).map((_, i) => {
                const active = i < user.streakDays;
                return (
                  <div key={i} className="w-8 h-8 rounded-lg"
                    style={{
                      background: active ? "var(--orange)" : "var(--bg-secondary)",
                      opacity: active ? 1 : 0.4,
                    }} />
                );
              })}
            </div>
            <p className="text-sm mt-3 font-semibold" style={{ color: "var(--text-muted)" }}>
              🔥 Đã học liên tiếp {user.streakDays} ngày!
            </p>
          </motion.div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
