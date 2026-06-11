import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { BookOpen, Home, Trophy, User, Zap, BarChart2, Library, Heart, Menu, Type } from "lucide-react";

const navItems = [
  { href: "/learn", icon: Home, label: "Trang chủ" },
  { href: "/lessons", icon: BookOpen, label: "Bài học" },
  { href: "/alphabet", icon: Type, label: "Chữ cái" },
  { href: "/stories", icon: BookOpen, label: "Truyện" },
  { href: "/vocabulary", icon: Library, label: "Từ điển" },
  { href: "/leaderboard", icon: Trophy, label: "Xếp hạng" },
  { href: "/stats", icon: BarChart2, label: "Thống kê" },
  { href: "/profile", icon: User, label: "Hồ sơ" },
];

export function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { user, hearts, theme, toggleTheme, deviceOS, setDeviceOS } = useStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      const saved = localStorage.getItem("sidebar_collapsed");
      setIsCollapsed(saved === "true");
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      localStorage.setItem("sidebar_collapsed", String(isCollapsed));
      document.documentElement.style.setProperty('--sidebar-width', isCollapsed ? '80px' : '256px');
    }
  }, [isCollapsed, isMounted]);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const handleToggle = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  if (!isMounted) {
    return (
      <>
        {/* Mobile Hamburger button placeholder */}
        <div className="md:hidden fixed left-4 top-3 z-[60]">
          <button className="p-2 rounded-xl shadow-sm border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <Menu size={24} />
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Mobile Overlay Background */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={cn(
        "sidebar fixed left-0 top-0 h-full flex flex-col py-6 px-3 z-50 transition-all duration-300 border-r-2",
        // Mobile: hidden by default, show when open
        "md:translate-x-0",
        isMobileOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full md:translate-x-0",
        // Desktop: collapsed or expanded
        isCollapsed ? "md:w-20" : "md:w-64"
      )}
        style={{ background: "var(--card)", borderColor: "var(--border)" }}>

        {/* Header with Toggle */}
        <div className={cn("flex items-center mb-8 px-2", isCollapsed && !isMobileOpen ? "flex-col gap-2 justify-center" : "justify-between")}>
          {(!isCollapsed || isMobileOpen) && (
            <Link to="/learn" className="flex items-center gap-3 overflow-hidden group/logo">
              {/* KH Learn Logo SVG */}
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transition-transform duration-200 group-hover/logo:scale-110"
                style={{
                  background: "linear-gradient(135deg, #0F1B3C 0%, #1a3a6b 50%, #10B981 100%)",
                  boxShadow: "0 4px 15px rgba(16,185,129,0.35)"
                }}>
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Open Book */}
                  <path d="M13 20C13 20 5 16.5 5 9V6C5 6 9 4.5 13 7C17 4.5 21 6 21 6V9C21 16.5 13 20 13 20Z" fill="#F5C842" fillOpacity="0.15" stroke="#F5C842" strokeWidth="1.2" strokeLinejoin="round"/>
                  <line x1="13" y1="7" x2="13" y2="20" stroke="#F5C842" strokeWidth="1.2" strokeDasharray="2 1"/>
                  {/* Stars */}
                  <circle cx="8.5" cy="11" r="1" fill="#ffffff" fillOpacity="0.9"/>
                  <circle cx="17.5" cy="11" r="1" fill="#ffffff" fillOpacity="0.9"/>
                  <circle cx="13" cy="4" r="0.8" fill="#F5C842"/>
                  {/* KH letters small */}
                  <text x="9" y="17" fontSize="5" fontWeight="bold" fill="#ffffff" fontFamily="Arial">KH</text>
                </svg>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-black whitespace-nowrap tracking-tight"
                  style={{
                    background: "linear-gradient(135deg, #10B981, #F5C842)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}>KH Learn</span>
                <span className="text-[9px] font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: "var(--text-muted)" }}>Khmer Language</span>
              </div>
            </Link>
          )}
          {/* Mini logo when collapsed on desktop */}
          {isCollapsed && !isMobileOpen && (
            <Link to="/learn" className="group/logo">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-200 group-hover/logo:scale-110"
                style={{
                  background: "linear-gradient(135deg, #0F1B3C 0%, #1a3a6b 50%, #10B981 100%)",
                  boxShadow: "0 4px 15px rgba(16,185,129,0.35)"
                }}>
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 20C13 20 5 16.5 5 9V6C5 6 9 4.5 13 7C17 4.5 21 6 21 6V9C21 16.5 13 20 13 20Z" fill="#F5C842" fillOpacity="0.15" stroke="#F5C842" strokeWidth="1.2" strokeLinejoin="round"/>
                  <line x1="13" y1="7" x2="13" y2="20" stroke="#F5C842" strokeWidth="1.2" strokeDasharray="2 1"/>
                  <circle cx="8.5" cy="11" r="1" fill="#ffffff" fillOpacity="0.9"/>
                  <circle cx="17.5" cy="11" r="1" fill="#ffffff" fillOpacity="0.9"/>
                  <circle cx="13" cy="4" r="0.8" fill="#F5C842"/>
                  <text x="9" y="17" fontSize="5" fontWeight="bold" fill="#ffffff" fontFamily="Arial">KH</text>
                </svg>
              </div>
            </Link>
          )}
          <button
            onClick={handleToggle}
            className={cn("p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500", isCollapsed && !isMobileOpen ? "" : "mx-auto")}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} to={href}
                className={cn(
                  "nav-item flex-row text-sm py-3 px-3 relative group",
                  active && "active",
                  isCollapsed && !isMobileOpen ? "justify-center md:justify-center" : "justify-start"
                )}
                style={active ? { background: "rgba(88,204,2,0.12)", color: "var(--green)" } : {}}>
                <Icon size={22} className={cn("flex-shrink-0", active ? "text-green-500" : "text-gray-400")} />
                {(!isCollapsed || isMobileOpen) && <span className="font-bold whitespace-nowrap ml-3">{label}</span>}

                {/* Tooltip when collapsed on desktop */}
                {isCollapsed && !isMobileOpen && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100]">
                    {label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        {user && (!isCollapsed || isMobileOpen) && (
          <div className="mt-4 p-4 rounded-3xl space-y-3 shadow-sm border border-gray-100 dark:border-gray-700"
            style={{ background: "var(--bg-secondary)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg overflow-hidden border-2 border-white shadow-sm flex-shrink-0"
                style={{ background: "var(--green)" }}>
                {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : "👤"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm truncate">{user.name}</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                  <p className="text-[10px] font-bold uppercase tracking-wider truncate" style={{ color: "var(--text-muted)" }}>
                    Lv. {user.level}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">Sinh lực</span>
                <div className="flex gap-1 flex-shrink-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Heart key={i} size={12} className={cn(i < hearts ? "text-red-500 fill-red-500" : "text-gray-300")} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Theme toggle */}
        <button onClick={toggleTheme}
          className={cn(
            "mt-3 w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-sm border border-gray-100 dark:border-gray-700",
            isCollapsed && !isMobileOpen ? "px-0 flex justify-center" : "px-4"
          )}
          style={{ background: "var(--card)", color: "var(--text-muted)" }}>
          {isCollapsed && !isMobileOpen
            ? (theme === "light" ? "🌙" : "☀️")
            : (theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode")}
        </button>

        {/* Device Switcher */}
        <button
          onClick={() => {
            const nextOS = deviceOS === "ios" ? "android" : (deviceOS === "android" ? "desktop" : "ios");
            setDeviceOS(nextOS);
          }}
          className={cn(
            "mt-2 w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center gap-2",
            isCollapsed && !isMobileOpen ? "px-0" : "px-4"
          )}
          style={{ background: "var(--card)", color: "var(--text-muted)" }}>
          {isCollapsed && !isMobileOpen
            ? (deviceOS === "ios" ? "🍎" : (deviceOS === "android" ? "🤖" : "💻"))
            : (
              <>
                {deviceOS === "ios" ? "🍎 iPhone UI" : (deviceOS === "android" ? "🤖 Android UI" : "💻 Desktop UI")}
              </>
            )
          }
        </button>
      </aside>

      {/* Mobile Top Header (Floating Hamburger) */}
      <div
        className="md:hidden fixed left-4 z-[60]"
        style={{
          top: deviceOS === "ios" ? "calc(env(safe-area-inset-top, 47px) + 0.75rem)"
            : (deviceOS === "auto" ? "calc(env(safe-area-inset-top, 0px) + 0.75rem)" : "0.75rem")
        }}
      >
        <button
          onClick={() => setIsMobileOpen(true)}
          className={cn(
            "p-2 rounded-xl shadow-sm border transition-all flex items-center justify-center",
            isMobileOpen && "opacity-0 pointer-events-none"
          )}
          style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text)" }}
        >
          <Menu size={24} />
        </button>
      </div>
    </>
  );
}

// BottomNav is intentionally removed as all navigation is now handled via the Sidebar drawer.
export function BottomNav() {
  return null;
}
