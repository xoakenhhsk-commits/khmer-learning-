"use client";
import { Sidebar, BottomNav } from "@/components/Navigation";
import { motion } from "framer-motion";
import { Trophy, Medal, Star } from "lucide-react";
import { formatXP, cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";

import { LEADERBOARD_MOCK } from "@/lib/data";

export default function LeaderboardPage() {
  const { user: currentUser } = useStore();
  
  // Combine mock data with current user if they are logged in
  const allUsers = [...LEADERBOARD_MOCK];
  if (currentUser) {
    const userInMock = allUsers.find(u => u.name === currentUser.name);
    if (!userInMock) {
      allUsers.push({
        rank: 0, // Will be recalculated
        name: currentUser.name,
        avatar: currentUser.avatar || "👤",
        xp: currentUser.xp,
        streak: currentUser.streakDays,
        country: "🇻🇳"
      });
    } else {
      // Update existing mock user with current real XP
      userInMock.xp = currentUser.xp;
      userInMock.streak = currentUser.streakDays;
    }
  }

  // Sort and re-rank
  const sortedUsers = allUsers.sort((a, b) => b.xp - a.xp).slice(0, 10);

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 main-content">
        <div className="p-6 max-w-2xl mx-auto">
          
          <div className="text-center mb-10 mt-8">
             <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} 
               className="inline-block p-6 rounded-[2.5rem] mb-6 shadow-xl"
               style={{ background: "linear-gradient(135deg, #FFD900 0%, #FF9600 100%)", color: "white" }}>
               <Trophy size={64} strokeWidth={2.5} />
             </motion.div>
             <h1 className="text-4xl font-black mb-3 tracking-tight">Bảng Xếp Hạng</h1>
             <p className="text-lg font-medium" style={{ color: "var(--text-muted)" }}>Học tập cùng cộng đồng KhmerLearn! 🇰🇭</p>
          </div>

          <div className="space-y-3 pb-20">
             {sortedUsers.map((user, index) => {
                const isCurrentUser = currentUser && user.name === currentUser.name;
                const isTop3 = index < 3;
                const rankColors = ["#FFD700", "#C0C0C0", "#CD7F32"];
                
                return (
                   <motion.div key={user.name} 
                      initial={{ x: -20, opacity: 0 }} 
                      animate={{ x: 0, opacity: 1 }} 
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "card flex items-center gap-4 p-5 relative overflow-hidden transition-all hover:scale-[1.02]",
                        index === 0 && "ring-4 ring-yellow-400/30",
                        isCurrentUser && "ring-2 ring-blue-500 bg-blue-50/50"
                      )}
                      style={index === 0 ? { background: "rgba(255, 217, 0, 0.05)" } : {}}
                    >
                      {/* Rank Indicator */}
                      <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                        {isTop3 ? (
                          <Medal size={32} style={{ color: rankColors[index] }} />
                        ) : (
                          <span className="font-black text-xl text-gray-400">#{index + 1}</span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner border-2 border-white"
                         style={{ background: "var(--bg-secondary)" }}>
                         {user.avatar}
                      </div>

                      {/* Name & Info */}
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2">
                           <h3 className="font-black text-lg truncate">{user.name}</h3>
                           <span className="text-xl">{user.country}</span>
                         </div>
                         <div className="flex items-center gap-3 text-sm font-bold" style={{ color: "var(--text-muted)" }}>
                           <span className="flex items-center gap-1"><Star size={14} className="text-yellow-500 fill-yellow-500" /> {user.streak} ngày</span>
                         </div>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <div className="text-2xl font-black" style={{ color: "var(--green)" }}>
                           {formatXP(user.xp)}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>XP</div>
                      </div>

                      {/* Background Rank Number */}
                      <div className="absolute -right-4 -bottom-4 text-8xl font-black opacity-[0.03] select-none pointer-events-none">
                        {index + 1}
                      </div>
                   </motion.div>
                )
             })}
          </div>

        </div>
      </main>
      <BottomNav />
    </div>
  );
}
