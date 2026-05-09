"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Zap, Trophy, Target, Star, Globe } from "lucide-react";

export default function HomePage() {
  const { isAuthenticated } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.replace("/learn");
  }, [isAuthenticated]);

  const features = [
    { icon: "🎴", title: "Flashcard tương tác", desc: "Học từ vựng qua thẻ 3D với phát âm chuẩn" },
    { icon: "🎮", title: "Mini Game học tập", desc: "Ghép từ, trắc nghiệm, điền từ, kéo thả" },
    { icon: "🔥", title: "Streak hàng ngày", desc: "Duy trì chuỗi học liên tiếp mỗi ngày" },
    { icon: "⚡", title: "Hệ thống XP", desc: "Tích điểm, lên cấp và mở khóa bài học mới" },
    { icon: "🏆", title: "Thành tích & Huy hiệu", desc: "Thu thập huy hiệu khi đạt mốc học tập" },
    { icon: "🗣️", title: "Phát âm TTS", desc: "Nghe người bản ngữ phát âm tiếng Khmer" },
  ];

  const stats = [
    { value: "2,500+", label: "Từ vựng" },
    { value: "50+", label: "Bài học" },
    { value: "10K+", label: "Học viên" },
    { value: "100%", label: "Miễn phí" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Decorative background elements for better feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-400/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🇰🇭</span>
          <span className="text-xl font-black" style={{ color: "var(--green)" }}>KhmerLearn</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-secondary py-2 px-5 text-sm">Đăng nhập</Link>
          <Link href="/register" className="btn-primary py-2 px-5 text-sm">Bắt đầu</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center px-6 py-12 md:py-20 max-w-4xl mx-auto relative z-10">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-8xl mb-8 animate-float inline-block">🇰🇭</motion.div>

        <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
          Học Tiếng Khmer{" "}
          <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">Dễ & Vui</span>
        </motion.h1>

        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Học tiếng Khmer theo phong cách Duolingo — từ vựng, bài học, mini game và theo dõi tiến độ. Hoàn toàn miễn phí!
        </motion.p>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/register" className="btn-primary text-lg px-12 py-5 w-full sm:w-auto shadow-lg shadow-green-500/20">
            🚀 Bắt đầu miễn phí
          </Link>
          <Link href="/login" className="btn-secondary text-lg px-12 py-5 w-full sm:w-auto">
            Đăng nhập
          </Link>
        </motion.div>

        {/* Sample khmer word */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="mt-16 inline-flex items-center gap-4 px-8 py-5 rounded-[2rem] shadow-sm"
          style={{ background: "rgba(88,204,2,0.08)", border: "2px solid rgba(88,204,2,0.2)" }}>
          <span className="khmer-text text-4xl font-bold" style={{ color: "var(--green)" }}>សួស្ដី</span>
          <span className="text-2xl font-light text-gray-400">|</span>
          <span className="text-2xl font-black">Xin chào! 👋</span>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="px-6 py-12 max-w-5xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div key={stat.label}
              initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="card text-center group hover:border-green-500/50 transition-colors">
              <div className="text-4xl font-black mb-1 group-hover:scale-110 transition-transform" style={{ color: "var(--green)" }}>{stat.value}</div>
              <div className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-6xl mx-auto relative z-10">
        <h2 className="text-4xl font-black text-center mb-16 tracking-tight">Tính năng nổi bật 🌟</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div key={f.title}
              initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              className="card hover:border-green-400 cursor-default p-8 group">
              <div className="text-5xl mb-6 group-hover:scale-125 transition-transform origin-left inline-block">{f.icon}</div>
              <h3 className="text-xl font-black mb-3">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center relative z-10">
        <motion.div whileInView={{ scale: [0.98, 1], opacity: [0, 1] }} viewport={{ once: true }}
          className="max-w-4xl mx-auto p-12 md:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)" }}>
          {/* Decorative circles inside CTA */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Sẵn sàng học tiếng Khmer?</h2>
            <p className="text-white/80 mb-10 text-xl font-medium max-w-xl mx-auto">Tham gia cùng hàng ngàn học viên đang học mỗi ngày và làm chủ ngôn ngữ Khmer ngay hôm nay!</p>
            <Link href="/register"
              className="inline-block bg-white font-black text-xl px-12 py-5 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl"
              style={{ color: "var(--green)" }}>
              🇰🇭 Bắt đầu ngay bây giờ
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="text-center py-12 text-sm relative z-10" style={{ color: "var(--text-muted)", borderTop: "2px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-bold">© 2026 KhmerLearn — Học tiếng Khmer miễn phí 🇰🇭</p>
          <div className="flex gap-6 font-bold text-xs uppercase tracking-widest">
            <a href="#" className="hover:text-green-500">Về chúng tôi</a>
            <a href="#" className="hover:text-green-500">Điều khoản</a>
            <a href="#" className="hover:text-green-500">Liên hệ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
