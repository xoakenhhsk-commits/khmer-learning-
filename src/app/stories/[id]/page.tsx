import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { Sidebar, BottomNav } from "@/components/Navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Story } from "@/lib/data";
import { InteractiveText } from "@/components/InteractiveText";
import { ArrowLeft, Book, Languages, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"reading" | "meaning">("reading");

  useEffect(() => {
    async function fetchStory() {
      if (!id) return;
      try {
        const docRef = doc(db, "stories", id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setStory({ id: snap.id, ...snap.data() } as Story);
        }
      } catch (err) {
        console.error("Error fetching story:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStory();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-green-500" size={40} />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy truyện</h2>
        <Link to="/stories" className="btn-primary">Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Sidebar />
      <main className="md:ml-64 p-4 pb-24 sm:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <Link to="/stories" className="inline-flex items-center gap-2 text-gray-500 font-bold mb-6 hover:text-green-600 transition-colors">
            <ArrowLeft size={20} /> Quay lại danh sách
          </Link>

          {/* Story Header */}
          <header className="mb-8 text-center">
            <h1 className="khmer-text text-4xl sm:text-5xl font-bold mb-2 text-green-600">
              {story.titleKh}
            </h1>
            <h2 className="text-xl sm:text-2xl font-black text-gray-800">
              {story.titleVi}
            </h2>
          </header>

          {/* Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-2xl mb-8 w-fit mx-auto">
            <button
              onClick={() => setTab("reading")}
              className={cn(
                "px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2",
                tab === "reading" ? "bg-white shadow-sm text-green-600" : "text-gray-500"
              )}
            >
              <Book size={18} /> Đọc truyện
            </button>
            <button
              onClick={() => setTab("meaning")}
              className={cn(
                "px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2",
                tab === "meaning" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"
              )}
            >
              <Languages size={18} /> Nghĩa tiếng Việt
            </button>
          </div>

          <div className="card p-6 sm:p-10 mb-8 min-h-[400px]">
            {tab === "reading" ? (
              <div>
                <div className="flex items-center gap-2 mb-6 p-3 bg-blue-50 text-blue-600 rounded-2xl text-sm font-medium">
                  <Info size={18} />
                  <span>Mẹo: Nhấn vào từng từ màu xanh để xem nghĩa và nghe phát âm.</span>
                </div>
                <InteractiveText contentKh={story.contentKh} wordMeanings={story.wordMeanings} />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg leading-relaxed text-gray-700 text-justify"
              >
                {story.meaningVi.split("\n").map((para, i) => (
                  <p key={i} className="mb-4 last:mb-0">{para}</p>
                ))}
              </motion.div>
            )}
          </div>

          {/* Vocabulary Summary */}
          <section className="mt-12">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center text-lg">📝</span>
              Từ vựng trong bài
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(story.wordMeanings).map(([word, info]) => (
                <div key={word} className="card p-4 flex items-center justify-between group hover:border-green-500 transition-all">
                  <div>
                    <p className="khmer-text text-2xl font-bold text-gray-800 mb-1">{word}</p>
                    <p className="text-xs text-gray-400 font-bold uppercase">/{info.phonetic}/</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{info.vi}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
