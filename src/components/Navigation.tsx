import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { BookOpen, Home, Trophy, User, Zap, BarChart2, Library, Heart, Menu, ChevronLeft } from "lucide-react";

const navItems = [
  { href: "/learn", icon: Home, label: "Trang chủ" },
  { href: "/lessons", icon: BookOpen, label: "Bài học" },
  { href: "/stories", icon: BookOpen, label: "Truyện" },
  { href: "/vocabulary", icon: Library, label: "Từ điển" },
  { href: "/leaderboard", icon: Trophy, label: "Xếp hạng" },
  { href: "/stats", icon: BarChart2, label: "Thống kê" },
  { href: "/profile", icon: User, label: "Hồ sơ" },
];

export function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { user, hearts, theme, toggleTheme } = useStore();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Default to true on mobile devices
    if (typeof window !== 'undefined' && window.innerWidth < 768) return true;
    return localStorage.getItem("sidebar_collapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebar_collapsed", String(isCollapsed));
    document.documentElement.style.setProperty('--sidebar-width', isCollapsed ? '80px' : '256px');
  }, [isCollapsed]);

  return (
    <>
      {/* Mobile Overlay Background */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
      
      {/* Sidebar Drawer */}
      <aside className={cn(
        "sidebar fixed left-0 top-0 h-full flex flex-col py-6 px-3 z-50 transition-all duration-300 border-r-2",
        // On mobile: completely hidden when collapsed, full width when open
        // On desktop: w-20 when collapsed, w-64 when open
        isCollapsed ? "-translate-x-full md:translate-x-0 md:w-20" : "translate-x-0 w-64 shadow-2xl md:shadow-none"
      )}
        style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        
        {/* Header with Toggle */}
        <div className={cn("flex items-center mb-8 px-2", isCollapsed ? "justify-center" : "justify-between")}>
          {!isCollapsed && (
            <Link to="/learn" className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: "var(--green)" }}>🇰🇭</div>
              <span className="text-xl font-black whitespace-nowrap" style={{ color: "var(--green)" }}>KhmerLearn</span>
            </Link>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn("p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500", isCollapsed && "mx-auto")}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-2">
          {(!isCollapsed || window.innerWidth >= 768) && navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} to={href}
                onClick={() => {
                  if (window.innerWidth < 768) setIsCollapsed(true);
                }}
                className={cn(
                  "nav-item flex-row text-base py-3 px-3 relative group", 
                  active && "active",
                  isCollapsed && "justify-center"
                )}
                style={active ? { background: "rgba(88,204,2,0.1)" } : {}}>
                <Icon size={24} className={cn("flex-shrink-0", active ? "text-green-500" : "text-gray-400")} />
                {!isCollapsed && <span className="font-bold whitespace-nowrap">{label}</span>}
                
                {/* Tooltip when collapsed */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100]">
                    {label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        {user && !isCollapsed && (
          <div className="mt-4 p-4 rounded-3xl space-y-4 shadow-sm border border-gray-100"
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
            
            <div className="space-y-2">
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
        {(!isCollapsed || window.innerWidth >= 768) && (
          <button onClick={toggleTheme}
            className={cn(
              "mt-4 w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-sm border border-gray-100",
              isCollapsed ? "px-0 flex justify-center" : "px-4"
            )}
            style={{ background: "var(--card)", color: "var(--text-muted)" }}>
            {isCollapsed ? (theme === "light" ? "🌙" : "☀️") : (theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode")}
          </button>
        )}
      </aside>

      {/* Mobile Top Header (Floating Hamburger) */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button 
          onClick={() => setIsCollapsed(false)}
          className={cn(
            "p-2 rounded-xl bg-white shadow-md border text-gray-700 transition-all",
            !isCollapsed && "opacity-0 pointer-events-none"
          )}
        >
          <Menu size={24} />
        </button>
      </div>
    </>
  );
}

export function BottomNav() {
  const location = useLocation();
  const pathname = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useStore();

  // Show only 4 items + Menu on bottom nav to prevent squishing
  const bottomItems = navItems.slice(0, 4);

  return (
    <>
      <nav className="bottom-nav justify-around items-center px-1 md:hidden">
        {bottomItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} to={href}
              className={cn("nav-item scale-90 sm:scale-100 flex-1 min-w-0 px-1", active && "active")}>
              <Icon size={20} />
              <span className="text-[10px] sm:text-xs font-bold truncate w-full text-center mt-1">{label}</span>
            </Link>
          );
        })}
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="nav-item scale-90 sm:scale-100 flex-1 min-w-0 px-1 text-gray-500"
        >
          <Menu size={20} />
          <span className="text-[10px] sm:text-xs font-bold truncate w-full text-center mt-1">Menu</span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-[#131f24] animate-slide-up md:hidden">
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xl" style={{ background: "var(--green)" }}>🇰🇭</div>
              <span className="text-xl font-black" style={{ color: "var(--green)" }}>KhmerLearn</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500">
              <ChevronLeft size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map(({ href, icon: Icon, label }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link key={href} to={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn("flex items-center gap-4 p-4 rounded-2xl transition-all", 
                    active ? "bg-green-50 dark:bg-green-900/20 text-green-500" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  <Icon size={24} />
                  <span className="font-bold text-lg">{label}</span>
                </Link>
              );
            })}
          </div>
          <div className="p-4 border-t dark:border-gray-800">
            <button onClick={toggleTheme}
              className="w-full py-4 rounded-2xl font-bold transition-all shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-center gap-2"
              style={{ background: "var(--card)", color: "var(--text-muted)" }}>
              {theme === "light" ? "🌙 Giao diện tối" : "☀️ Giao diện sáng"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
