"use client";
import { useState } from "react";
import { Sidebar, BottomNav } from "@/components/Navigation";
import { VOCABULARY } from "@/lib/data";
import { playTTS, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Volume2, Book, Loader2, Globe } from "lucide-react";

export default function VocabularyPage() {
  const [search, setSearch] = useState("");
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const filteredVocab = VOCABULARY.filter(v => 
    v.khmerWord.toLowerCase().includes(search.toLowerCase()) ||
    v.meaningVi.toLowerCase().includes(search.toLowerCase()) ||
    v.phoneticVi.toLowerCase().includes(search.toLowerCase())
  );

  const handleSpeak = async (v: any) => {
    setSpeakingId(v.id);
    await playTTS(v.khmerWord);
    setSpeakingId(null);
  };

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
      <Sidebar />
      
      <main className="flex-1 ml-0 md:ml-64 main-content">
        <div className="p-6 max-w-4xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 mt-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">Từ điển Khmer</h1>
              <p className="text-xs sm:text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                Tìm kiếm và luyện phát âm tất cả các từ đã học
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text"
                placeholder="Tìm kiếm từ hoặc nghĩa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-blue-400 focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pb-24">
            <AnimatePresence mode="popLayout">
              {filteredVocab.map((v) => (
                <motion.div
                  layout
                  key={v.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="card p-5 group hover:border-blue-400 transition-all cursor-pointer relative overflow-hidden"
                  onClick={() => handleSpeak(v)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black bg-blue-50 text-blue-500">
                      {v.khmerWord.charAt(0)}
                    </div>
                    <button 
                      className={cn(
                        "p-2.5 rounded-xl transition-all shadow-sm",
                        speakingId === v.id 
                          ? "bg-blue-500 text-white" 
                          : "bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500"
                      )}
                    >
                      {speakingId === v.id ? <Loader2 size={18} className="animate-spin" /> : <Volume2 size={18} />}
                    </button>
                  </div>

                  <h3 className="khmer-text text-2xl font-black mb-1 group-hover:text-blue-600 transition-colors">
                    {v.khmerWord}
                  </h3>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                    {v.phoneticVi}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-0.5 rounded-lg bg-green-50 text-green-600 text-[10px] font-black">
                      VN
                    </div>
                    <p className="text-sm font-bold text-gray-700">{v.meaningVi}</p>
                  </div>

                  {/* Category Tag */}
                  <div className="absolute -right-2 -bottom-2 opacity-10 rotate-12 transition-transform group-hover:rotate-0">
                    <Globe size={80} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredVocab.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Search size={40} />
              </div>
              <h3 className="text-xl font-black text-gray-500">Không tìm thấy từ nào</h3>
              <p className="text-gray-400 font-medium">Thử tìm kiếm với từ khóa khác nhé!</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
