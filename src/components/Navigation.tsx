import { Link, useLocation } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { BookOpen, Home, Trophy, User, Zap, BarChart2, Library, Heart } from "lucide-react";

const navItems = [
  { href: "/learn", icon: Home, label: "Trang chủ" },
  { href: "/lessons", icon: BookOpen, label: "Bài học" },
  { href: "/vocabulary", icon: Library, label: "Từ điển" },
  { href: "/leaderboard", icon: Trophy, label: "Xếp hạng" },
  { href: "/stats", icon: BarChart2, label: "Thống kê" },
  { href: "/profile", icon: User, label: "Hồ sơ" },
];

export function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { user, hearts, theme, toggleTheme } = useStore();

  return (
    <aside className="sidebar fixed left-0 top-0 h-full w-64 border-r-2 flex flex-col py-6 px-4 z-50"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}>
      {/* Logo */}
      <Link to="/learn" className="flex items-center gap-3 px-3 mb-8">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: "var(--green)" }}>🇰🇭</div>
        <span className="text-xl font-black" style={{ color: "var(--green)" }}>KhmerLearn</span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} to={href}
              className={cn("nav-item flex-row text-base", active && "active")}
              style={active ? { background: "rgba(88,204,2,0.1)" } : {}}>
              <Icon size={22} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      {user && (
        <div className="mt-4 p-4 rounded-3xl space-y-4 shadow-sm border border-gray-100"
          style={{ background: "var(--bg-secondary)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg overflow-hidden border-2 border-white shadow-sm"
              style={{ background: "var(--green)" }}>
              {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : "👤"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-sm truncate">{user.name}</p>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Cấp độ {user.level}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">Sinh lực</span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Heart key={i} size={14} className={cn(i < hearts ? "text-red-500 fill-red-500" : "text-gray-300")} />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">Kinh nghiệm</span>
              <span className="flex items-center gap-1 font-black text-xs" style={{ color: "var(--orange)" }}>
                <Zap size={12} className="fill-orange-500" /> {user.xp} XP
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Theme toggle */}
      <button onClick={toggleTheme}
        className="mt-4 w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-sm border border-gray-100"
        style={{ background: "var(--card)", color: "var(--text-muted)" }}>
        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>
    </aside>
  );
}

export function BottomNav() {
  const location = useLocation();
  const pathname = location.pathname;
  // Show all 6 items on bottom nav
  const bottomItems = navItems;

  return (
    <nav className="bottom-nav justify-around items-center px-2">
      {bottomItems.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link key={href} to={href}
            className={cn("nav-item scale-90 sm:scale-100", active && "active")}>
            <Icon size={20} />
            <span className="text-[10px] sm:text-xs font-bold">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
