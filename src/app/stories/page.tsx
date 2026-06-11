import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sidebar, BottomNav } from "@/components/Navigation";
import { Story } from "@/lib/data";
import { BookOpen, Clock, ChevronRight, Search, Loader2, BookMarked } from "lucide-react";

// Dữ liệu mẫu khi Firebase chưa có hoặc bị lỗi
const SAMPLE_STORIES: Story[] = [
  {
    id: "sample-1",
    titleKh: "ការជួបជុំ",
    titleVi: "Gặp Gỡ Bạn Bè",
    contentKh: `សួស្តី! តើអ្នកសុខសប្បាយទេ?
ខ្ញុំសុខសប្បាយ អរគុណ។ តើអ្នកវិញ?
ខ្ញុំក៏សុខសប្បាយដែរ។ យូរណាស់ហើយ មិនបានជួបអ្នក។
បាទ ខ្ញុំរវល់ណាស់ ព្រោះធ្វើការច្រើន។
ថ្ងៃនេះ មានពេលទំនេរ ហើយក៏នឹករលឹក ចង់ជួបអ្នក។
តើអ្នកទៅផឹកកាហ្វេជាមួយខ្ញុំ ថ្ងៃស្អែកបានទេ?
បាទ ខ្ញុំចង់ទៅ! យើងជួបគ្នា នៅហាងកាហ្វេ ម៉ោងប្រាំ។`,
    meaningVi: `Xin chào! Bạn có khỏe không?
Tôi khỏe, cảm ơn. Còn bạn thì sao?
Tôi cũng khỏe. Đã lâu lắm rồi mình không gặp nhau.
Vâng, tôi bận lắm vì làm việc nhiều.
Hôm nay có thời gian rảnh nên cũng nhớ, muốn gặp bạn.
Bạn có đi uống cà phê với tôi ngày mai không?
Vâng, tôi muốn đi! Chúng ta gặp nhau ở quán cà phê lúc 5 giờ.`,
    wordMeanings: {
      "សួស្តី": { vi: "Xin chào", phonetic: "suo-sdei" },
      "អ្នក": { vi: "Bạn / Anh / Chị", phonetic: "neak" },
      "សុខសប្បាយ": { vi: "Khỏe mạnh", phonetic: "sok-sabay" },
      "ខ្ញុំ": { vi: "Tôi", phonetic: "knhom" },
      "អរគុណ": { vi: "Cảm ơn", phonetic: "or-kun" },
      "យូរ": { vi: "Lâu", phonetic: "yur" },
      "ជួប": { vi: "Gặp", phonetic: "chuob" },
      "រវល់": { vi: "Bận rộn", phonetic: "ro-vol" },
      "ធ្វើការ": { vi: "Làm việc", phonetic: "tveu-kar" },
      "ទំនេរ": { vi: "Rảnh rang", phonetic: "tom-ner" },
      "ផឹក": { vi: "Uống", phonetic: "phoek" },
      "កាហ្វេ": { vi: "Cà phê", phonetic: "ka-fe" },
      "ថ្ងៃស្អែក": { vi: "Ngày mai", phonetic: "tngai-saek" },
    },
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "sample-2",
    titleKh: "ព្រឹកព្រហាម",
    titleVi: "Buổi Sáng Gia Đình",
    contentKh: `ព្រឹកព្រហាម ម្តាយ ក្រោកឡើងជាមុន ហើយចំអិនអាហារ។
ក្លិនបាយ ដូចជាប្រាប់ ឱ្យក្រោក ពីដំណេក។
ឪពុក ត្រៀមខ្លួន ទៅធ្វើការ ហើយពាក់សម្លៀកបំពាក់ ស្ស្អាត។
កូន ពីរ នាក់ ក្រោកឡើង ហើយ ដើរ ទៅ បន្ទប់ ទឹក ។
គ្រួសារ ទាំងមូល អង្គុយ ញ៉ាំ អាហារ ព្រឹក ជាមួយ គ្នា ។`,
    meaningVi: `Buổi sáng sớm, mẹ dậy trước và nấu cơm.
Mùi cơm như báo hiệu mọi người thức dậy.
Bố chuẩn bị đi làm và mặc quần áo gọn gàng.
Hai đứa con thức dậy rồi đi vào phòng tắm.
Cả gia đình ngồi ăn bữa sáng cùng nhau.`,
    wordMeanings: {
      "ព្រឹកព្រហាម": { vi: "Sáng sớm", phonetic: "proek-pro-ham" },
      "ម្តាយ": { vi: "Mẹ", phonetic: "m-day" },
      "ក្រោក": { vi: "Thức dậy", phonetic: "kraok" },
      "ចំអិន": { vi: "Nấu nướng", phonetic: "chom-aen" },
      "អាហារ": { vi: "Thức ăn / Bữa ăn", phonetic: "a-har" },
      "ឪពុក": { vi: "Bố / Cha", phonetic: "ow-puk" },
      "ធ្វើការ": { vi: "Đi làm", phonetic: "tveu-kar" },
      "គ្រួសារ": { vi: "Gia đình", phonetic: "krou-sar" },
      "ញ៉ាំ": { vi: "Ăn", phonetic: "nyam" },
    },
    createdAt: "2026-01-02T00:00:00Z",
  },
  {
    id: "sample-3",
    titleKh: "ទៅផ្សារ",
    titleVi: "Đi Chợ Buổi Sáng",
    contentKh: `ព្រឹក ម្លេះ ម្តាយ ហៅ ខ្ញុំ ទៅ ផ្សារ ជាមួយ ។
ផ្សារ នៅ ជិត ផ្ទះ ខ្ញុំ ដើរ ប្រហែល ដប់ នាទី ។
បន្លែ ស្រស់ ៗ ជួរ ដែរ ព្រម ២ ្ម ត្រី ផ្សេង ៗ ។
ម្តាយ ចូលចិត្ត ទិញ ត្រី ព្រោះ ធ្វើ ម្ហូប ឆ្ងាញ់ ។
យើង វិល ត្រ ឡប់ ផ្ទះ ស្រួល ចិត្ត ។`,
    meaningVi: `Sáng sớm mẹ gọi tôi đi chợ cùng.
Chợ ở gần nhà, đi bộ khoảng mười phút.
Rau tươi xếp hàng cùng với các loại cá khác nhau.
Mẹ thích mua cá vì nấu món ăn rất ngon.
Chúng tôi trở về nhà với tâm trạng vui vẻ.`,
    wordMeanings: {
      "ផ្សារ": { vi: "Chợ", phonetic: "psar" },
      "ជិត": { vi: "Gần", phonetic: "chet" },
      "ផ្ទះ": { vi: "Nhà", phonetic: "pteah" },
      "ដើរ": { vi: "Đi bộ", phonetic: "daer" },
      "ដប់": { vi: "Mười", phonetic: "dop" },
      "ស្រស់": { vi: "Tươi", phonetic: "sros" },
      "ត្រី": { vi: "Cá", phonetic: "trey" },
      "ចូលចិត្ត": { vi: "Thích", phonetic: "joul-jit" },
      "ម្ហូប": { vi: "Món ăn", phonetic: "mhoup" },
      "ស្រួល": { vi: "Thoải mái", phonetic: "sruol" },
    },
    createdAt: "2026-01-03T00:00:00Z",
  },
];

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [usingSampleData, setUsingSampleData] = useState(false);

  useEffect(() => {
    async function fetchStories() {
      try {
        const { collection, getDocs, query, orderBy } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Story));
        if (data.length === 0) {
          setStories(SAMPLE_STORIES);
          setUsingSampleData(true);
        } else {
          setStories(data);
        }
      } catch (err) {
        console.error("Error fetching stories:", err);
        setStories(SAMPLE_STORIES);
        setUsingSampleData(true);
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
      <main className="md:ml-64 p-4 pb-24 sm:p-8" style={{ marginLeft: "var(--sidebar-width, 256px)" }}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 mt-4 md:mt-0">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-green-100 text-green-600 shadow-sm">
                <BookMarked size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-black mb-1">Truyện Khmer</h1>
                <p style={{ color: "var(--text-muted)" }} className="text-sm font-medium">Học qua những câu chuyện kể và văn bản song ngữ</p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Tìm tên truyện..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-2xl border-2 outline-none w-full sm:w-64 focus:border-green-500 transition-colors"
                style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
          </div>

          {/* Sample data notice */}
          {usingSampleData && !loading && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center gap-3">
              <span className="text-2xl">📖</span>
              <div>
                <p className="font-bold text-amber-700">Đang hiển thị truyện mẫu</p>
                <p className="text-xs text-amber-600">Admin có thể thêm truyện mới từ trang quản trị.</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-green-500 mb-4" size={40} />
              <p className="font-bold text-gray-500">Đang tải truyện...</p>
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-6xl mb-4">📖</div>
              <h2 className="text-xl font-bold mb-2">Không tìm thấy truyện</h2>
              <p className="text-gray-500">Thử từ khóa khác hoặc xóa bộ lọc tìm kiếm.</p>
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
                    <div className="card p-6 flex items-center gap-6 hover:border-green-500 transition-all hover:shadow-lg hover:-translate-y-0.5">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform flex-shrink-0 shadow-md">
                        📚
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="khmer-text text-xl font-bold mb-1 group-hover:text-green-600 transition-colors" style={{ color: "var(--text)" }}>
                          {story.titleKh}
                        </h3>
                        <p className="text-base font-black mb-2" style={{ color: "var(--text-muted)" }}>{story.titleVi}</p>

                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {story.createdAt ? new Date(story.createdAt).toLocaleDateString("vi-VN") : "Gần đây"}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen size={14} />
                            {Object.keys(story.wordMeanings).length} từ vựng
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all flex-shrink-0" size={24} />
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
