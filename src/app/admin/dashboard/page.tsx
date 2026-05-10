import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, FileText, Database, Plus, LogOut, Loader2, Book, FileSpreadsheet, Languages, AlignLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useStore } from "@/store/useStore"; 
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResults, setOcrResults] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"vocab" | "stories">("vocab");
  const [lessons, setLessons] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [isCreatingNewLesson, setIsCreatingNewLesson] = useState(false);
  const [newLessonData, setNewLessonData] = useState({
    title: "",
    titleKh: "",
    description: "",
    categoryId: "1"
  });

  useEffect(() => {
    // Simple protection
    const isAuth = sessionStorage.getItem("admin_auth");
    if (isAuth !== "true") {
      navigate("/admin", { replace: true });
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/save");
      const data = await res.json();
      if (data.lessons) setLessons(data.lessons);
      if (data.categories) setCategories(data.categories);
      if (data.lessons && data.lessons.length > 0) {
        setSelectedLessonId(data.lessons[0].id);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setOcrResults([]); // Clear previous results
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Đang xử lý file Excel...");
    try {
      const { read, utils } = await import('xlsx');
      const reader = new FileReader();
      
      reader.onload = (evt) => {
        try {
          const bstr = evt.target?.result;
          const wb = read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = utils.sheet_to_json(ws, { header: 1 }) as any[][];

          // Map rows to vocab objects
          // Format theo ảnh của bạn: Cột A = Khmer, Cột B = Phiên âm, Cột C = Nghĩa VN
          const results = data.slice(1) // Skip header row
            .map((row) => ({
              type: "vocab",
              khmerWord: String(row[0] || "").trim(),
              meaningVi: String(row[2] || "").trim(), // Cột C
              phoneticVi: String(row[1] || "").trim()  // Cột B
            }))
            .filter(item => item.khmerWord && item.meaningVi);

          setOcrResults(prev => [...prev, ...results]);
          toast.success(`Đã nhập thành công ${results.length} từ từ Excel!`, { id: toastId });
        } catch (err) {
          toast.error("Lỗi khi đọc nội dung Excel", { id: toastId });
        }
      };
      reader.readAsBinaryString(file);
    } catch (err) {
      toast.error("Không thể tải thư viện Excel", { id: toastId });
    }
  };

  const handleExcelStories = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Đang xử lý Excel Truyện...");
    try {
      const { read, utils } = await import('xlsx');
      const reader = new FileReader();
      
      reader.onload = (evt) => {
        try {
          const bstr = evt.target?.result;
          const wb = read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = utils.sheet_to_json(ws, { header: 1 }) as any[][];

          // Map rows to Story objects
          // Cột A: Tên truyện, B: Khmer text, C: Nghĩa Việt, D: Nghĩa từng từ (từ=nghĩa=phiênâm|...)
          const results = data.slice(1) // Skip header
            .map((row) => {
              const wordMeanings: any = {};
              const vocabStr = String(row[3] || ""); // Cột D
              vocabStr.split("|").forEach(pair => {
                const parts = pair.split("=");
                if (parts.length >= 2) {
                  wordMeanings[parts[0].trim()] = {
                    vi: parts[1].trim(),
                    phonetic: parts[2] ? parts[2].trim() : parts[0].trim()
                  };
                }
              });

              const titleParts = String(row[0] || "").split("-");

              return {
                titleKh: titleParts[0]?.trim() || "Chưa có tên",
                titleVi: titleParts[1]?.trim() || "Chưa có tên",
                contentKh: String(row[1] || "").trim(),
                meaningVi: String(row[2] || "").trim(),
                wordMeanings
              };
            })
            .filter(item => item.contentKh && item.titleKh);

          setStories(prev => [...prev, ...results]);
          setActiveTab("stories");
          toast.success(`Đã nhập thành công ${results.length} truyện!`, { id: toastId });
        } catch (err) {
          toast.error("Lỗi khi đọc nội dung Excel", { id: toastId });
        }
      };
      reader.readAsBinaryString(file);
    } catch (err) {
      toast.error("Không thể tải thư viện Excel", { id: toastId });
    }
  };

  const handleSaveStories = async () => {
    if (stories.length === 0) return;
    const toastId = toast.loading("Đang lưu truyện vào Firestore...");
    try {
      for (const story of stories) {
        await addDoc(collection(db, "stories"), {
          ...story,
          createdAt: new Date().toISOString(),
          serverTimestamp: serverTimestamp()
        });
      }
      toast.success(`Đã lưu ${stories.length} truyện thành công!`, { id: toastId });
      setStories([]);
    } catch (err: any) {
      toast.error("Lỗi khi lưu: " + err.message, { id: toastId });
    }
  };

  const handleProcessOCR = async () => {
    if (!image) return toast.error("Vui lòng tải ảnh lên trước!");
    
    setIsProcessing(true);
    try {
      // Use Tesseract.js directly in the browser (no Python needed)
      const Tesseract = (await import('tesseract.js')).default;
      
      toast.loading("Đang tải AI nhận diện (lần đầu sẽ hơi lâu)...", { id: 'ocr-toast' });
      
      const result = await Tesseract.recognize(image, 'khm', {
        logger: m => console.log(m)
      });

      const text = result.data.text;
      
      // Process text
      const lines = text.split('\n').map(l => l.trim()).filter(l => l);
      const parsedResults: any[] = [];
      
      for (const line of lines) {
        // Handle grammar (usually Title = Content)
        if (line.includes('=')) {
          const parts = line.split('=');
          parsedResults.push({
            type: "grammar",
            title: parts[0].trim(),
            content: parts[1] ? parts[1].trim() : ""
          });
          continue;
        }

        // Handle vocabulary (Khmer - Meaning - Phonetic or variations)
        // Look for common separators: -, :, –, —, or double space
        let separator = '-';
        if (line.includes(':')) separator = ':';
        else if (line.includes('–')) separator = '–';
        else if (line.includes('—')) separator = '—';
        else if (line.includes('  ')) separator = '  ';

        const parts = line.split(separator);
        const khmerWord = parts[0]?.trim();
        
        if (khmerWord && khmerWord.length > 0) {
          // Attempt to extract meaning and phonetic
          let meaning = "Chưa có nghĩa";
          let phonetic = khmerWord.replace(/ /g, "-"); // Default mock

          if (parts.length > 1) {
            meaning = parts[1].trim();
          }
          if (parts.length > 2) {
            phonetic = parts[2].trim();
          }

          parsedResults.push({
            type: "vocab",
            khmerWord,
            meaningVi: meaning,
            phoneticVi: phonetic
          });
        }
      }

      setOcrResults(parsedResults);
      toast.success("Trích xuất văn bản thành công!", { id: 'ocr-toast' });
    } catch (err: any) {
      toast.error(err.message, { id: 'ocr-toast' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToDatabase = async () => {
    if (ocrResults.length === 0) return;
    if (isCreatingNewLesson && (!newLessonData.title || !newLessonData.titleKh)) {
      return toast.error("Vui lòng nhập đầy đủ thông tin Chủ đề mới!");
    }
    
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: ocrResults,
          lessonId: isCreatingNewLesson ? null : selectedLessonId,
          newLesson: isCreatingNewLesson ? newLessonData : null
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(
        `Đã lưu ${data.added} mục vào chủ đề ${data.lessonId}! ` + 
        (data.skipped > 0 ? `(Bỏ qua ${data.skipped} từ đã tồn tại)` : "")
      );
      setOcrResults([]);
      setImage(null);
      fetchData(); // Refresh lessons
      setIsCreatingNewLesson(false);
    } catch (err: any) {
      toast.error("Lỗi lưu DB: " + err.message);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("admin_auth");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Database size={24} />
          </div>
          <h1 className="text-xl font-black">KhmerLearn Admin</h1>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">
          <LogOut size={18} /> Đăng xuất
        </button>
      </header>

      <main className="p-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Col - Upload */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black mb-4 flex items-center gap-2">
              <Upload className="text-blue-500" /> Tải lên Sách/Ảnh Tiếng Khmer
            </h2>
            
            <label className="border-2 border-dashed border-gray-300 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-gray-50 relative overflow-hidden">
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-contain p-2" />
              ) : (
                <>
                  <FileText size={48} className="text-gray-400 mb-4" />
                  <p className="font-bold text-gray-500">Nhấn để chọn ảnh</p>
                  <p className="text-xs text-gray-400 mt-1">Hỗ trợ JPG, PNG</p>
                </>
              )}
            </label>

            <button 
              onClick={handleProcessOCR}
              disabled={!image || isProcessing}
              className="w-full mt-4 py-3 rounded-xl bg-blue-600 text-white font-bold disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            >
              {isProcessing ? <Loader2 className="animate-spin" /> : <FileText />}
              {isProcessing ? "Đang xử lý Python OCR..." : "Chạy Python OCR"}
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black mb-4 flex items-center gap-2">
              <FileSpreadsheet className="text-green-600" /> Nhập từ Excel (.xlsx)
            </h2>
            <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-center">
              <p className="text-sm text-gray-500 mb-3">Định dạng chuẩn: Cột A (Khmer), Cột B (Phiên âm), Cột C (Nghĩa VN)</p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-bold cursor-pointer hover:bg-green-700 transition-all">
                <Plus size={18} /> Chọn file Excel
                <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleExcelUpload} />
              </label>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black mb-4 flex items-center gap-2">
              <Book className="text-purple-500" /> Nhập Truyện từ Excel (.xlsx)
            </h2>
            <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-center">
              <p className="text-sm text-gray-500 mb-3 font-medium">Định dạng chuẩn: A(Tên), B(Nội dung Kh), C(Nghĩa VN), D(Từ vựng)</p>
              <p className="text-[10px] text-gray-400 mb-4">Cột D định dạng: từ1=nghĩa1=phiênâm1 | từ2=nghĩa2=phiênâm2</p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-bold cursor-pointer hover:bg-purple-700 transition-all">
                <Plus size={18} /> Chọn file Excel Truyện
                <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleExcelStories} />
              </label>
            </div>
          </div>
        </div>

        {/* Right Col - Results */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-120px)]">
          {/* Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button 
              onClick={() => setActiveTab("vocab")}
              className={cn("flex-1 py-2 rounded-lg font-bold text-sm transition-all", activeTab === "vocab" ? "bg-white shadow-sm text-blue-600" : "text-gray-500")}
            >
              Từ vựng ({ocrResults.length})
            </button>
            <button 
              onClick={() => setActiveTab("stories")}
              className={cn("flex-1 py-2 rounded-lg font-bold text-sm transition-all", activeTab === "stories" ? "bg-white shadow-sm text-purple-600" : "text-gray-500")}
            >
              Truyện ({stories.length})
            </button>
          </div>

          {activeTab === "vocab" ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black flex items-center gap-2">
                  <Database className="text-blue-500" /> Từ vựng trích xuất
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {ocrResults.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <FileText size={64} className="mb-4 opacity-20" />
                    <p>Chưa có dữ liệu từ vựng.</p>
                  </div>
                ) : (
                  ocrResults.map((item, idx) => (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                      key={idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex flex-col gap-2 relative group">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded uppercase">
                          {item.type === 'grammar' ? 'Ngữ pháp' : 'Từ vựng'}
                        </span>
                        <button 
                          onClick={() => {
                            import("@/lib/utils").then(m => m.playTTS(item.khmerWord || item.title));
                          }}
                          className="p-1 text-blue-500 hover:bg-blue-100 rounded-full transition-colors"
                          title="Nghe phát âm"
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                        </button>
                      </div>
                      
                      {item.type === 'grammar' ? (
                        <>
                          <input type="text" value={item.title} onChange={e => {
                            const newArr = [...ocrResults]; newArr[idx].title = e.target.value; setOcrResults(newArr);
                          }} className="font-khmer text-xl font-bold bg-transparent border-b border-transparent focus:border-blue-500 outline-none" placeholder="Cấu trúc ngữ pháp" />
                          <input type="text" value={item.content} onChange={e => {
                            const newArr = [...ocrResults]; newArr[idx].content = e.target.value; setOcrResults(newArr);
                          }} className="text-sm text-gray-600 bg-transparent border-b border-transparent focus:border-blue-500 outline-none" placeholder="Giải thích ngữ pháp" />
                        </>
                      ) : (
                        <>
                          <input type="text" value={item.khmerWord} onChange={e => {
                            const newArr = [...ocrResults]; newArr[idx].khmerWord = e.target.value; setOcrResults(newArr);
                          }} className="font-khmer text-xl font-bold bg-transparent border-b border-transparent focus:border-blue-500 outline-none" placeholder="Từ tiếng Khmer" />
                          <input type="text" value={item.meaningVi} onChange={e => {
                            const newArr = [...ocrResults]; newArr[idx].meaningVi = e.target.value; setOcrResults(newArr);
                          }} className="text-sm text-gray-600 bg-transparent border-b border-transparent focus:border-blue-500 outline-none" placeholder="Nghĩa tiếng Việt" />
                          <input type="text" value={item.phoneticVi} onChange={e => {
                            const newArr = [...ocrResults]; newArr[idx].phoneticVi = e.target.value; setOcrResults(newArr);
                          }} className="text-xs text-gray-400 bg-transparent border-b border-transparent focus:border-blue-500 outline-none" placeholder="Phiên âm" />
                        </>
                      )}
                      
                      <button onClick={() => setOcrResults(ocrResults.filter((_, i) => i !== idx))}
                        className="absolute right-4 top-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">Xoá</button>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Lesson Selection Section */}
              {ocrResults.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                      <Book size={18} className="text-blue-500" /> Chọn chủ đề lưu vào:
                    </h3>
                    <button 
                      onClick={() => setIsCreatingNewLesson(!isCreatingNewLesson)}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      {isCreatingNewLesson ? "Chọn chủ đề hiện có" : "+ Tạo chủ đề mới"}
                    </button>
                  </div>

                  {!isCreatingNewLesson ? (
                    <select 
                      value={selectedLessonId}
                      onChange={(e) => setSelectedLessonId(e.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    >
                      {lessons.map(l => (
                        <option key={l.id} value={l.id}>{l.title} ({l.titleKh})</option>
                      ))}
                    </select>
                  ) : (
                    <div className="space-y-3 bg-blue-50 p-4 rounded-xl">
                      <input 
                        type="text" 
                        placeholder="Tên chủ đề (VN): Ví dụ: Động vật"
                        value={newLessonData.title}
                        onChange={e => setNewLessonData({...newLessonData, title: e.target.value})}
                        className="w-full p-2 rounded-lg border border-blue-100 outline-none"
                      />
                      <input 
                        type="text" 
                        placeholder="Tên chủ đề (Khmer): Ví dụ: សត្វ"
                        value={newLessonData.titleKh}
                        onChange={e => setNewLessonData({...newLessonData, titleKh: e.target.value})}
                        className="w-full p-2 rounded-lg border border-blue-100 outline-none font-khmer"
                      />
                      <select 
                        value={newLessonData.categoryId}
                        onChange={e => setNewLessonData({...newLessonData, categoryId: e.target.value})}
                        className="w-full p-2 rounded-lg border border-blue-100 outline-none"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              <button 
                onClick={handleAddToDatabase}
                disabled={ocrResults.length === 0}
                className="w-full mt-4 py-4 rounded-xl bg-green-500 text-white font-black text-lg disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-green-600 transition-colors shadow-lg"
              >
                <Plus size={24} /> Lưu vào Cơ Sở Dữ Liệu
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black flex items-center gap-2">
                  <Languages className="text-purple-500" /> Danh sách Truyện đã nhập
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {stories.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <Book size={64} className="mb-4 opacity-20" />
                    <p>Chưa có dữ liệu truyện. Vui lòng tải Excel Truyện.</p>
                  </div>
                ) : (
                  stories.map((story, idx) => (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                      key={idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex flex-col gap-2 relative group">
                      <div className="flex items-center justify-between">
                        <p className="font-khmer text-lg font-bold text-green-600">{story.titleKh}</p>
                        <span className="text-xs font-bold text-gray-400">{Object.keys(story.wordMeanings).length} từ vựng</span>
                      </div>
                      <p className="text-sm font-black text-gray-800">{story.titleVi}</p>
                      <div className="bg-white p-2 rounded-lg border border-gray-100">
                        <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Nội dung Khmer:</p>
                        <p className="font-khmer text-xs line-clamp-2">{story.contentKh}</p>
                      </div>
                      <button onClick={() => setStories(stories.filter((_, i) => i !== idx))}
                        className="absolute right-4 top-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">Xoá</button>
                    </motion.div>
                  ))
                )}
              </div>

              <button 
                onClick={handleSaveStories}
                disabled={stories.length === 0}
                className="w-full mt-4 py-4 rounded-xl bg-purple-600 text-white font-black text-lg disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors shadow-lg"
              >
                <Plus size={24} /> Lưu Truyện vào Firestore
              </button>
            </>
          )}
        </div>

      </main>
    </div>
  );
}
