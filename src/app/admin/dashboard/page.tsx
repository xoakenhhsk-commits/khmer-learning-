import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, FileText, Database, Plus, LogOut, Loader2, Book, FileSpreadsheet, Languages, AlignLeft, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useStore } from "@/store/useStore"; 
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { LESSONS, CATEGORIES } from "@/lib/data";

// ===== DỮ LIỆU MẪU 3 CÂU CHUYỆN KHMER =====
const SAMPLE_STORIES = [
  {
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
      "នឹករលឹក": { vi: "Nhớ", phonetic: "nung-ro-lung" },
      "ផឹក": { vi: "Uống", phonetic: "phoek" },
      "កាហ្វេ": { vi: "Cà phê", phonetic: "ka-fe" },
      "ថ្ងៃស្អែក": { vi: "Ngày mai", phonetic: "tngai-saek" },
      "ហាង": { vi: "Quán / Cửa hàng", phonetic: "hang" },
      "ម៉ោង": { vi: "Giờ (đồng hồ)", phonetic: "maong" },
      "ប្រាំ": { vi: "Năm", phonetic: "pram" },
      "យើង": { vi: "Chúng ta", phonetic: "yeung" }
    }
  },
  {
    titleKh: "ព្រឹកព្រហាម",
    titleVi: "Buổi Sáng Gia Đình",
    contentKh: `ព្រឹកព្រហាម ម្តាយ ក្រោកឡើងជាមុន ហើយចំអិនអាហារ។
ក្លិនបាយ ដូចជាប្រាប់ ឱ្យក្រោក ពីដំណេក។
ឪពុក ត្រៀមខ្លួន ទៅធ្វើការ ហើយពាក់សម្លៀកបំពាក់ ស្ស្អាត។
កូន ពីរ នាក់ ក្រោកឡើង ហើយ ដើរ ទៅ បន្ទប់ ទឹក ។
គ្រួសារ ទាំងមូល អង្គុយ ញ៉ាំ អាហារ ព្រឹក ជាមួយ គ្នា ។
ម្តាយ ធ្វើ បាយ ស្ករ និង ស៊ុបបន្លែ ឆ្ងាញ់ ណាស់ ។
បន្ទាប់ ពី ញ៉ាំ ចប់ គ្រួសារ ចាក ចេញ ក្នុង ថ្ងៃ ថ្មី ។`,
    meaningVi: `Buổi sáng sớm, mẹ dậy trước và nấu cơm.
Mùi cơm như báo hiệu mọi người thức dậy.
Bố chuẩn bị đi làm và mặc quần áo gọn gàng.
Hai đứa con thức dậy rồi đi vào phòng tắm.
Cả gia đình ngồi ăn bữa sáng cùng nhau.
Mẹ nấu cháo ngọt và canh rau rất ngon.
Sau khi ăn xong, gia đình bắt đầu một ngày mới.`,
    wordMeanings: {
      "ព្រឹកព្រហាម": { vi: "Sáng sớm", phonetic: "proek-pro-ham" },
      "ម្តាយ": { vi: "Mẹ", phonetic: "m-day" },
      "ក្រោក": { vi: "Thức dậy", phonetic: "kraok" },
      "ចំអិន": { vi: "Nấu nướng", phonetic: "chom-aen" },
      "អាហារ": { vi: "Thức ăn / Bữa ăn", phonetic: "a-har" },
      "ក្លិន": { vi: "Mùi hương", phonetic: "klen" },
      "បាយ": { vi: "Cơm", phonetic: "bay" },
      "ឪពុក": { vi: "Bố / Cha", phonetic: "ow-puk" },
      "ត្រៀម": { vi: "Chuẩn bị", phonetic: "triem" },
      "ធ្វើការ": { vi: "Đi làm", phonetic: "tveu-kar" },
      "សម្លៀកបំពាក់": { vi: "Quần áo", phonetic: "som-liek-bom-peak" },
      "កូន": { vi: "Con cái", phonetic: "koun" },
      "គ្រួសារ": { vi: "Gia đình", phonetic: "krou-sar" },
      "អង្គុយ": { vi: "Ngồi", phonetic: "ong-kuy" },
      "ញ៉ាំ": { vi: "Ăn", phonetic: "nyam" },
      "ស៊ុប": { vi: "Canh / Súp", phonetic: "soup" },
      "បន្លែ": { vi: "Rau củ", phonetic: "bon-lae" },
      "ឆ្ងាញ់": { vi: "Ngon", phonetic: "chhnganyh" }
    }
  },
  {
    titleKh: "ទៅផ្សារ",
    titleVi: "Đi Chợ Buổi Sáng",
    contentKh: `ព្រឹក ម្លេះ ម្តាយ ហៅ ខ្ញុំ ទៅ ផ្សារ ជាមួយ ។
ផ្សារ នៅ ជិត ផ្ទះ ខ្ញុំ ដើរ ប្រហែល ដប់ នាទី ។
បន្លែ ស្រស់ ៗ ជួរ ដែរ ព្រម ២ ្ម ត្រី ផ្សេង ៗ ។
ម្តាយ ចូលចិត្ត ទិញ ត្រី ព្រោះ ធ្វើ ម្ហូប ឆ្ងាញ់ ។
តើ ត្រី នេះ ថ្លៃ ប៉ុន្មាន ? ខ្ញុំ សួរ ម្ចាស់ ហាង ។
ដប់ ពាន់ រៀល ក្នុង មួយ គីឡូ ។ លោក ម្ចាស់ ហាង ឆ្លើយ ។
ម្តាយ ទិញ ត្រី មួយ គីឡូ ហើយ ថែម ផ្លែ ឈើ ផ្សេង ទៀត ។
យើង វិល ត្រ ឡប់ ផ្ទះ ស្រួល ចិត្ត ។`,
    meaningVi: `Sáng sớm mẹ gọi tôi đi chợ cùng.
Chợ ở gần nhà, đi bộ khoảng mười phút.
Rau tươi xếp hàng cùng với các loại cá khác nhau.
Mẹ thích mua cá vì nấu món ăn rất ngon.
Cá này giá bao nhiêu? Tôi hỏi người bán hàng.
Mười nghìn riel một ký. Chủ hàng trả lời.
Mẹ mua một ký cá và thêm các loại trái cây.
Chúng tôi trở về nhà với tâm trạng vui vẻ.`,
    wordMeanings: {
      "ផ្សារ": { vi: "Chợ", phonetic: "psar" },
      "ជិត": { vi: "Gần", phonetic: "chet" },
      "ផ្ទះ": { vi: "Nhà", phonetic: "pteah" },
      "ដើរ": { vi: "Đi bộ", phonetic: "daer" },
      "ដប់": { vi: "Mười", phonetic: "dop" },
      "នាទី": { vi: "Phút", phonetic: "nea-tee" },
      "ស្រស់": { vi: "Tươi", phonetic: "sros" },
      "ត្រី": { vi: "Cá", phonetic: "trey" },
      "ចូលចិត្ត": { vi: "Thích", phonetic: "joul-jit" },
      "ទិញ": { vi: "Mua", phonetic: "tinh" },
      "ម្ហូប": { vi: "Món ăn", phonetic: "mhoup" },
      "ថ្លៃ": { vi: "Đắt / Giá tiền", phonetic: "thlai" },
      "សួរ": { vi: "Hỏi", phonetic: "sour" },
      "រៀល": { vi: "Riel (tiền tệ)", phonetic: "riel" },
      "គីឡូ": { vi: "Kilogram", phonetic: "kee-lo" },
      "ឆ្លើយ": { vi: "Trả lời", phonetic: "chhlaey" },
      "ផ្លែឈើ": { vi: "Trái cây", phonetic: "plae-chher" },
      "ស្រួល": { vi: "Thoải mái", phonetic: "sruol" },
      "ចិត្ត": { vi: "Tâm trạng / Lòng", phonetic: "jet" }
    }
  }
];

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
      setLessons(LESSONS);
      setCategories(CATEGORIES);
      if (LESSONS && LESSONS.length > 0) {
        setSelectedLessonId(LESSONS[0].id);
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

              const titleRaw = String(row[0] || "");
              const titleParts = titleRaw.split(/[,|\-|/]/);

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

  const handleSeedSampleStories = async () => {
    const toastId = toast.loading("Đang tạo 3 câu chuyện mẫu...");
    try {
      for (const story of SAMPLE_STORIES) {
        await addDoc(collection(db, "stories"), {
          ...story,
          createdAt: new Date().toISOString(),
          serverTimestamp: serverTimestamp()
        });
      }
      toast.success("✅ Đã tạo 3 câu chuyện mẫu thành công!", { id: toastId });
    } catch (err: any) {
      toast.error("Lỗi: " + err.message, { id: toastId });
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

          {/* Seed Sample Stories */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-sm border-2 border-amber-200">
            <h2 className="text-lg font-black mb-2 flex items-center gap-2">
              <Sparkles className="text-amber-500" /> Truyện Mẫu Có Sẵn
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Tạo ngay <strong>3 câu chuyện đầy đủ</strong> với từ vựng có thể click được:
              <br />
              <span className="text-xs text-gray-500">📖 Gặp Gỡ Bạn Bè &nbsp;|&nbsp; 🏠 Buổi Sáng Gia Đình &nbsp;|&nbsp; 🛒 Đi Chợ</span>
            </p>
            <button
              onClick={handleSeedSampleStories}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              <Sparkles size={20} /> Tạo 3 Truyện Mẫu Ngay
            </button>
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
