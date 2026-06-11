import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sidebar, BottomNav } from "@/components/Navigation";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Story } from "@/lib/data";
import { BookOpen, Clock, ChevronRight, Search, Loader2 } from "lucide-react";

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchStories() {
      try {
        const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Story));
        setStories(data);
      } catch (err) {
        console.error("Error fetching stories:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStories();
  }, []);

  const filteredStories = stories.filter(s => 
    s.titleKh.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.titleVi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Sidebar />
      <main className="md:ml-64 p-4 pb-24 sm:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black mb-2">Truyện Khmer</h1>
              <p style={{ color: "var(--text-muted)" }}>Học qua những câu chuyện kể và văn bản song ngữ</p>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Tìm tên truyện..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-2xl border-2 outline-none w-full sm:w-64 focus:border-green-500 transition-colors"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-green-500 mb-4" size={40} />
              <p className="font-bold text-gray-500">Đang tải truyện...</p>
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-6xl mb-4">📖</div>
              <h2 className="text-xl font-bold mb-2">Chưa có câu chuyện nào</h2>
              <p className="text-gray-500">Quay lại sau để cập nhật thêm nhiều câu chuyện hay nhé!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredStories.map((story, i) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={`/stories/${story.id}`} className="block group">
                    <div className="card p-6 flex items-center gap-6 hover:border-green-500 transition-all hover:shadow-md">
                      <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center text-3xl group-hover:bg-green-100 transition-colors">
                        📚
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="khmer-text text-xl font-bold text-gray-800 mb-1 group-hover:text-green-600 transition-colors">
                          {story.titleKh}
                        </h3>
                        <p className="text-lg font-black text-gray-500 mb-2">{story.titleVi}</p>
                        
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                          <span className="flex items-center gap-1">
                            <Clock size={14} /> {story.createdAt ? new Date(story.createdAt).toLocaleDateString("vi-VN") : "Gần đây"}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen size={14} /> {Object.keys(story.wordMeanings).length} từ vựng
                          </span>
                        </div>
                      </div>
                      
                      <ChevronRight className="text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all" size={24} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
