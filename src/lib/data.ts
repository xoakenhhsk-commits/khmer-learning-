export type VocabItem = {
  id: string;
  lessonId: string;
  khmerWord: string;
  phoneticVi: string;
  meaningVi: string;
  meaningEn?: string;
  exampleKh?: string;
  exampleVi?: string;
  audioUrl?: string;
  imageUrl?: string;
  difficulty: number;
};

export type Story = {
  id: string;
  titleKh: string;
  titleVi: string;
  contentKh: string;
  meaningVi: string;
  wordMeanings: { [word: string]: { vi: string; phonetic: string } };
  author?: string;
  createdAt?: string;
};

export const CATEGORIES = [
  { id: "1", name: "Greetings", nameKh: "ការស្វាគមន៍", icon: "👋", color: "#58CC02", order: 1 },
  { id: "2", name: "Numbers", nameKh: "លេខ", icon: "🔢", color: "#FF9600", order: 2 },
  { id: "3", name: "Colors", nameKh: "ពណ៌", icon: "🎨", color: "#CE82FF", order: 3 },
  { id: "4", name: "Family", nameKh: "គ្រួសារ", icon: "👨‍👩‍👧", color: "#FF4B4B", order: 4 },
  { id: "5", name: "Food", nameKh: "អាហារ", icon: "🍜", color: "#FF9600", order: 5 },
  { id: "6", name: "Animals", nameKh: "សត្វ", icon: "🐘", color: "#1CB0F6", order: 6 },
  { id: "7", name: "Body", nameKh: "រាងកាយ", icon: "🧠", color: "#FF4B4B", order: 7 },
  { id: "8", name: "Travel", nameKh: "ការដំណើរ", icon: "✈️", color: "#58CC02", order: 8 },
];

export const LESSONS = [
  {
    id: "l1", title: "Basic Greetings", titleKh: "ការស្វាគមន៍មូលដ្ឋាន",
    description: "Học cách chào hỏi và tạm biệt bằng tiếng Khmer",
    level: 1, xpReward: 20, order: 1, isLocked: false, categoryId: "1",
    imageUrl: "https://images.unsplash.com/photo-1527383418406-f85a3b146d7e?w=400",
  },
  {
    id: "l2", title: "Numbers 1-10", titleKh: "លេខ ១ ដល់ ១០",
    description: "Đếm số từ 1 đến 10 bằng tiếng Khmer",
    level: 1, xpReward: 20, order: 2, isLocked: false, categoryId: "2",
    imageUrl: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=400",
  },
  {
    id: "l3", title: "Colors", titleKh: "ពណ៌",
    description: "Học các màu sắc cơ bản bằng tiếng Khmer",
    level: 2, xpReward: 25, order: 3, isLocked: true, categoryId: "3",
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400",
  },
  {
    id: "l4", title: "Family Members", titleKh: "សមាជិកគ្រួសារ",
    description: "Học các từ về thành viên gia đình",
    level: 2, xpReward: 25, order: 4, isLocked: true, categoryId: "4",
    imageUrl: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=400",
  },
  {
    id: "l5", title: "Khmer Food", titleKh: "អាហារខ្មែរ",
    description: "Khám phá từ vựng ẩm thực Khmer truyền thống",
    level: 3, xpReward: 30, order: 5, isLocked: true, categoryId: "5",
    imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400",
  },
  {
    id: "l6", title: "Animals", titleKh: "សត្វ",
    description: "Học tên các loài động vật phổ biến",
    level: 3, xpReward: 30, order: 6, isLocked: true, categoryId: "6",
    imageUrl: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400",
  },
  {
    id: "l7", title: "Human Body", titleKh: "រាងកាយ",
    description: "Các bộ phận trên cơ thể người",
    level: 4, xpReward: 35, order: 7, isLocked: true, categoryId: "7",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400",
  },
];

export const VOCABULARY: VocabItem[] = [
  // --- MỚI THÊM TỪ OCR CHO LESSON: l1 (Đã lọc trùng) ---
  { id: "v_ocr_1778321942124_0", lessonId: "l1", khmerWord: "សួស្តី", phoneticVi: "Suo sdei", meaningVi: "Xin chào (thân mật)", difficulty: 2 },
  { id: "v_ocr_1778321942124_1", lessonId: "l1", khmerWord: "អរុណសួស្តី", phoneticVi: "Arun suo sdei", meaningVi: "Chào buổi sáng", difficulty: 2 },
  { id: "v_ocr_1778321942124_2", lessonId: "l1", khmerWord: "ទិវាសួស្តី", phoneticVi: "Tivea suo sdei", meaningVi: "Chào buổi trưa/chiều", difficulty: 2 },
  { id: "v_ocr_1778321942124_3", lessonId: "l1", khmerWord: "សាយ័ន្តសួស្តី", phoneticVi: "Sayan suo sdei", meaningVi: "Chào buổi tối", difficulty: 2 },
  { id: "v_ocr_1778321942124_4", lessonId: "l1", khmerWord: "រាត្រីសួស្តី", phoneticVi: "Reatrei suo sdei", meaningVi: "Chúc ngủ ngon", difficulty: 2 },
  { id: "v_ocr_1778321942124_5", lessonId: "l1", khmerWord: "តើអ្នកសុខសប្បាយទេ?", phoneticVi: "Tae neak sok sabay te?", meaningVi: "Bạn có khỏe không?", difficulty: 2 },
  { id: "v_ocr_1778321942124_6", lessonId: "l1", khmerWord: "ខ្ញុំសុខសប្បាយ", phoneticVi: "Knhom sok sabay", meaningVi: "Tôi khỏe", difficulty: 2 },
  { id: "v_ocr_1778321942124_7", lessonId: "l1", khmerWord: "ចុះអ្នកវិញ?", phoneticVi: "Choh neak vinh?", meaningVi: "Còn bạn thì sao?", difficulty: 2 },
  { id: "v_ocr_1778321942124_8", lessonId: "l1", khmerWord: "អរគុណច្រើន", phoneticVi: "Orkun chraeun", meaningVi: "Cảm ơn rất nhiều", difficulty: 2 },
  { id: "v_ocr_1778321942124_9", lessonId: "l1", khmerWord: "សូមទោស", phoneticVi: "Som tos", meaningVi: "Xin lỗi / Phiền một chút", difficulty: 2 },
  { id: "v_ocr_1778321942124_10", lessonId: "l1", khmerWord: "មិនអីទេ", phoneticVi: "Min ei te", meaningVi: "Không có gì / Không sao đâu", difficulty: 2 },
  { id: "v_ocr_1778321942124_11", lessonId: "l1", khmerWord: "បាទ", phoneticVi: "Bat", meaningVi: "Vâng / Dạ (Dành cho Nam nói)", difficulty: 2 },
  { id: "v_ocr_1778321942124_12", lessonId: "l1", khmerWord: "ចាស", phoneticVi: "Chas", meaningVi: "Vâng / Dạ (Dành cho Nữ nói)", difficulty: 2 },
  { id: "v_ocr_1778321942124_13", lessonId: "l1", khmerWord: "រីករាយដែលបានស្គាល់អ្នក", phoneticVi: "Rik reay dael ban skoal neak", meaningVi: "Rất vui được gặp bạn", difficulty: 2 },
  { id: "v_ocr_1778321942124_14", lessonId: "l1", khmerWord: "ជួបគ្នាពេលក្រោយ", phoneticVi: "Chuob knea pel kraoy", meaningVi: "Hẹn gặp lại sau", difficulty: 2 },
  // ----------------------

  // ===== Greetings (l1) =====
  { id: "v1", lessonId: "l1", khmerWord: "សួស្ដី", phoneticVi: "Sua-sdei", meaningVi: "Xin chào", meaningEn: "Hello", exampleKh: "សួស្ដី! តើអ្នកសុខសប្បាយទេ?", exampleVi: "Xin chào! Bạn có khỏe không?", difficulty: 1 },
  { id: "v2", lessonId: "l1", khmerWord: "អរគុណ", phoneticVi: "Aw-kun", meaningVi: "Cảm ơn", meaningEn: "Thank you", exampleKh: "អរគុណច្រើន!", exampleVi: "Cảm ơn rất nhiều!", difficulty: 1 },
  { id: "v3", lessonId: "l1", khmerWord: "លាហើយ", phoneticVi: "Lea-heuy", meaningVi: "Tạm biệt", meaningEn: "Goodbye", exampleKh: "លាហើយ! ជួបគ្នាថ្ងៃស្អែក", exampleVi: "Tạm biệt! Gặp nhau ngày mai", difficulty: 1 },
  { id: "v4", lessonId: "l1", khmerWord: "បាទ / ចាស", phoneticVi: "Baat / Chah", meaningVi: "Vâng / Dạ", meaningEn: "Yes", exampleKh: "បាទ, ខ្ញុំយល់ព្រម", exampleVi: "Vâng, tôi đồng ý", difficulty: 1 },
  { id: "v5", lessonId: "l1", khmerWord: "ទេ", phoneticVi: "Teh", meaningVi: "Không", meaningEn: "No", exampleKh: "ទេ, ខ្ញុំមិនយល់ព្រម", exampleVi: "Không, tôi không đồng ý", difficulty: 1 },
  { id: "v6", lessonId: "l1", khmerWord: "សុំទោស", phoneticVi: "Som-toh", meaningVi: "Xin lỗi", meaningEn: "Sorry / Excuse me", exampleKh: "សុំទោស ខ្ញុំមកយឺតក្រ", exampleVi: "Xin lỗi tôi đến muộn", difficulty: 1 },
  { id: "v7", lessonId: "l1", khmerWord: "ជំរាបសួរ", phoneticVi: "Jum-reap-sua", meaningVi: "Kính chào (trang trọng)", meaningEn: "Respectful hello", exampleKh: "ជំរាបសួរ! ខ្ញុំឈ្មោះ ដារ៉ា", exampleVi: "Kính chào! Tôi tên Dara", difficulty: 2 },
  { id: "v8", lessonId: "l1", khmerWord: "ជំរាបលា", phoneticVi: "Jum-reap-lea", meaningVi: "Kính chào tạm biệt", meaningEn: "Respectful goodbye", exampleKh: "ជំរាបលា!", exampleVi: "Kính chào tạm biệt!", difficulty: 2 },
  { id: "v9", lessonId: "l1", khmerWord: "សុខសប្បាយ", phoneticVi: "Sok-sab-bay", meaningVi: "Khỏe mạnh / Bình an", meaningEn: "Well / Fine", exampleKh: "ខ្ញុំសុខសប្បាយ", exampleVi: "Tôi khỏe mạnh", difficulty: 1 },
  { id: "v10", lessonId: "l1", khmerWord: "ឈ្មោះ", phoneticVi: "Chhmuoh", meaningVi: "Tên", meaningEn: "Name", exampleKh: "តើអ្នកឈ្មោះអ្វី?", exampleVi: "Bạn tên gì?", difficulty: 2 },

  // ===== Numbers (l2) =====
  { id: "v11", lessonId: "l2", khmerWord: "មួយ", phoneticVi: "Muoy", meaningVi: "Một", meaningEn: "One", exampleKh: "ខ្ញុំមានសៀវភៅមួយ", exampleVi: "Tôi có một cuốn sách", difficulty: 1 },
  { id: "v12", lessonId: "l2", khmerWord: "ពីរ", phoneticVi: "Pi", meaningVi: "Hai", meaningEn: "Two", exampleKh: "ខ្ញុំមានដៃពីរ", exampleVi: "Tôi có hai bàn tay", difficulty: 1 },
  { id: "v13", lessonId: "l2", khmerWord: "បី", phoneticVi: "Bei", meaningVi: "Ba", meaningEn: "Three", exampleKh: "មានកៅអីបី", exampleVi: "Có ba chiếc ghế", difficulty: 1 },
  { id: "v14", lessonId: "l2", khmerWord: "បួន", phoneticVi: "Buan", meaningVi: "Bốn", meaningEn: "Four", exampleKh: "ឆ្កែបួននឹម", exampleVi: "Bốn con chó", difficulty: 1 },
  { id: "v15", lessonId: "l2", khmerWord: "ប្រាំ", phoneticVi: "Pram", meaningVi: "Năm", meaningEn: "Five", exampleKh: "ផ្លែប៉ោមប្រាំ", exampleVi: "Năm quả táo", difficulty: 1 },
  { id: "v16", lessonId: "l2", khmerWord: "ប្រាំមួយ", phoneticVi: "Pram-muoy", meaningVi: "Sáu", meaningEn: "Six", exampleKh: "ខ្ញុំអាយុប្រាំមួយឆ្នាំ", exampleVi: "Tôi sáu tuổi", difficulty: 1 },
  { id: "v17", lessonId: "l2", khmerWord: "ប្រាំពីរ", phoneticVi: "Pram-pi", meaningVi: "Bảy", meaningEn: "Seven", exampleKh: "ស្ប៉ែតប្រាំពីរ", exampleVi: "Bảy ngày", difficulty: 1 },
  { id: "v18", lessonId: "l2", khmerWord: "ប្រាំបី", phoneticVi: "Pram-bei", meaningVi: "Tám", meaningEn: "Eight", exampleKh: "ម៉ោងប្រាំបី", exampleVi: "Tám giờ", difficulty: 1 },
  { id: "v19", lessonId: "l2", khmerWord: "ប្រាំបួន", phoneticVi: "Pram-buan", meaningVi: "Chín", meaningEn: "Nine", exampleKh: "ខែប្រាំបួន", exampleVi: "Tháng chín", difficulty: 1 },
  { id: "v20", lessonId: "l2", khmerWord: "ដប់", phoneticVi: "Dop", meaningVi: "Mười", meaningEn: "Ten", exampleKh: "ដប់រៀល", exampleVi: "Mười riel", difficulty: 1 },

  // ===== Colors (l3) =====
  { id: "v21", lessonId: "l3", khmerWord: "ក្រហម", phoneticVi: "Kra-hom", meaningVi: "Đỏ", meaningEn: "Red", exampleKh: "ផ្ការក្រហម", exampleVi: "Hoa màu đỏ", difficulty: 2 },
  { id: "v22", lessonId: "l3", khmerWord: "ខៀវ", phoneticVi: "Khieu", meaningVi: "Xanh dương", meaningEn: "Blue", exampleKh: "មេឃខៀវ", exampleVi: "Bầu trời xanh", difficulty: 2 },
  { id: "v23", lessonId: "l3", khmerWord: "បៃតង", phoneticVi: "Bai-tang", meaningVi: "Xanh lá", meaningEn: "Green", exampleKh: "ស្លឹកឈើបៃតង", exampleVi: "Lá cây màu xanh", difficulty: 2 },
  { id: "v24", lessonId: "l3", khmerWord: "លឿង", phoneticVi: "Luong", meaningVi: "Vàng", meaningEn: "Yellow", exampleKh: "ព្រះអាទិត្យលឿង", exampleVi: "Mặt trời vàng", difficulty: 2 },
  { id: "v25", lessonId: "l3", khmerWord: "ស", phoneticVi: "Sor", meaningVi: "Trắng", meaningEn: "White", exampleKh: "ពពកស", exampleVi: "Mây trắng", difficulty: 2 },
  { id: "v26", lessonId: "l3", khmerWord: "ខ្មៅ", phoneticVi: "Khmao", meaningVi: "Đen", meaningEn: "Black", exampleKh: "ឆ្មាខ្មៅ", exampleVi: "Mèo đen", difficulty: 2 },
  { id: "v27", lessonId: "l3", khmerWord: "ទឹកក្រូច", phoneticVi: "Teuk-krouch", meaningVi: "Cam", meaningEn: "Orange", exampleKh: "ក្រូចទឹកក្រូច", exampleVi: "Quả cam màu cam", difficulty: 2 },
  { id: "v28", lessonId: "l3", khmerWord: "ស្វាយ", phoneticVi: "Svay", meaningVi: "Tím", meaningEn: "Purple", exampleKh: "ផ្កាស្វាយ", exampleVi: "Hoa màu tím", difficulty: 2 },

  // ===== Family (l4) =====
  { id: "v29", lessonId: "l4", khmerWord: "ម្តាយ", phoneticVi: "M-day", meaningVi: "Mẹ", meaningEn: "Mother", exampleKh: "ម្តាយខ្ញុំស្រស់ស្អាត", exampleVi: "Mẹ tôi đẹp lắm", difficulty: 2 },
  { id: "v30", lessonId: "l4", khmerWord: "ឪពុក", phoneticVi: "Ow-puk", meaningVi: "Cha", meaningEn: "Father", exampleKh: "ឪពុកខ្ញុំធ្វើការ", exampleVi: "Cha tôi đi làm", difficulty: 2 },
  { id: "v31", lessonId: "l4", khmerWord: "បងប្រុស", phoneticVi: "Bong-bros", meaningVi: "Anh trai", meaningEn: "Elder brother", exampleKh: "បងប្រុសខ្ញុំចូលចិត្តកីឡា", exampleVi: "Anh trai tôi thích thể thao", difficulty: 2 },
  { id: "v32", lessonId: "l4", khmerWord: "បងស្រី", phoneticVi: "Bong-srey", meaningVi: "Chị gái", meaningEn: "Elder sister", exampleKh: "បងស្រីខ្ញុំចូលចិត្តចម្អិនអាហារ", exampleVi: "Chị gái tôi thích nấu ăn", difficulty: 2 },
  { id: "v33", lessonId: "l4", khmerWord: "ប្អូនប្រុស", phoneticVi: "P-oun-bros", meaningVi: "Em trai", meaningEn: "Younger brother", exampleKh: "ប្អូនប្រុសខ្ញុំទៅសាលារៀន", exampleVi: "Em trai tôi đi học", difficulty: 2 },
  { id: "v34", lessonId: "l4", khmerWord: "ប្អូនស្រី", phoneticVi: "P-oun-srey", meaningVi: "Em gái", meaningEn: "Younger sister", exampleKh: "ប្អូនស្រីខ្ញុំគួរសម", exampleVi: "Em gái tôi ngoan", difficulty: 2 },
  { id: "v35", lessonId: "l4", khmerWord: "តា", phoneticVi: "Ta", meaningVi: "Ông nội/ngoại", meaningEn: "Grandfather", exampleKh: "តាខ្ញុំចាស់ហើយ", exampleVi: "Ông tôi già rồi", difficulty: 2 },
  { id: "v36", lessonId: "l4", khmerWord: "យាយ", phoneticVi: "Yeay", meaningVi: "Bà nội/ngoại", meaningEn: "Grandmother", exampleKh: "យាយខ្ញុំចម្អិនអាហារឆ្ងាញ់", exampleVi: "Bà tôi nấu ăn ngon", difficulty: 2 },

  // ===== Food (l5) =====
  { id: "v37", lessonId: "l5", khmerWord: "បាយ", phoneticVi: "Bay", meaningVi: "Cơm", meaningEn: "Rice (cooked)", exampleKh: "ខ្ញុំចូលចិត្តបាយ", exampleVi: "Tôi thích ăn cơm", difficulty: 3 },
  { id: "v38", lessonId: "l5", khmerWord: "ទឹក", phoneticVi: "Teuk", meaningVi: "Nước", meaningEn: "Water", exampleKh: "ខ្ញុំផឹកទឹក", exampleVi: "Tôi uống nước", difficulty: 3 },
  { id: "v39", lessonId: "l5", khmerWord: "សាច់", phoneticVi: "Sach", meaningVi: "Thịt", meaningEn: "Meat", exampleKh: "សាច់មាន់", exampleVi: "Thịt gà", difficulty: 3 },
  { id: "v40", lessonId: "l5", khmerWord: "ត្រី", phoneticVi: "Trey", meaningVi: "Cá", meaningEn: "Fish", exampleKh: "ត្រីអំពិល", exampleVi: "Cá tamarind", difficulty: 3 },
  { id: "v41", lessonId: "l5", khmerWord: "បន្លែ", phoneticVi: "Bon-lae", meaningVi: "Rau củ", meaningEn: "Vegetables", exampleKh: "ខ្ញុំចូលចិត្តបន្លែ", exampleVi: "Tôi thích rau củ", difficulty: 3 },
  { id: "v42", lessonId: "l5", khmerWord: "ផ្លែឈើ", phoneticVi: "Plae-cheuh", meaningVi: "Trái cây", meaningEn: "Fruit", exampleKh: "ផ្លែឈើតែបន្តិច", exampleVi: "Một ít trái cây", difficulty: 3 },
  { id: "v43", lessonId: "l5", khmerWord: "នំ", phoneticVi: "Nom", meaningVi: "Bánh / Kẹo", meaningEn: "Cake / Snack", exampleKh: "នំប៉័ង", exampleVi: "Bánh mì", difficulty: 3 },
  { id: "v44", lessonId: "l5", khmerWord: "ហាបច្ចេករស", phoneticVi: "Ha-bak-chek-ros", meaningVi: "Ngon", meaningEn: "Delicious", exampleKh: "អាហារនេះហាបច្ចេករស", exampleVi: "Món ăn này ngon lắm", difficulty: 3 },
  
  // ===== Animals (l6) =====
  { id: "v45", lessonId: "l6", khmerWord: "ឆ្កែ", phoneticVi: "Ch-ke", meaningVi: "Con chó", meaningEn: "Dog", exampleKh: "ឆ្កែខ្ញុំឆ្លាតណាស់", exampleVi: "Chó của tôi rất thông minh", difficulty: 2 },
  { id: "v46", lessonId: "l6", khmerWord: "ឆ្មា", phoneticVi: "Chhmar", meaningVi: "Con mèo", meaningEn: "Cat", exampleKh: "ឆ្មាដេកលើសាឡុង", exampleVi: "Con mèo đang ngủ trên sofa", difficulty: 2 },
  { id: "v47", lessonId: "l6", khmerWord: "ដំរី", phoneticVi: "Dom-rei", meaningVi: "Con voi", meaningEn: "Elephant", exampleKh: "ដំរីមានមាឌធំ", exampleVi: "Con voi có kích thước lớn", difficulty: 2 },
  { id: "v48", lessonId: "l6", khmerWord: "មាន់", phoneticVi: "Moan", meaningVi: "Con gà", meaningEn: "Chicken", exampleKh: "សាច់មាន់ឆ្ងាញ់", exampleVi: "Thịt gà rất ngon", difficulty: 2 },
  { id: "v49", lessonId: "l6", khmerWord: "ត្រី", phoneticVi: "Trey", meaningVi: "Con cá", meaningEn: "Fish", exampleKh: "ខ្ញុំចូលចិត្តញ៉ាំត្រី", exampleVi: "Tôi thích ăn cá", difficulty: 2 },

  // ===== Body (l7) =====
  { id: "v50", lessonId: "l7", khmerWord: "ក្បាល", phoneticVi: "Kbal", meaningVi: "Đầu", meaningEn: "Head", exampleKh: "ក្បាលខ្ញុំឈឺ", exampleVi: "Đầu tôi bị đau", difficulty: 3 },
  { id: "v51", lessonId: "l7", khmerWord: "ភ្នែក", phoneticVi: "Phnek", meaningVi: "Mắt", meaningEn: "Eye", exampleKh: "ភ្នែកខ្មៅ", exampleVi: "Đôi mắt đen", difficulty: 3 },
  { id: "v52", lessonId: "l7", khmerWord: "ច្រមុះ", phoneticVi: "Chro-moh", meaningVi: "Mũi", meaningEn: "Nose", exampleKh: "ច្រមុះស្រួច", exampleVi: "Mũi cao (nhọn)", difficulty: 3 },
  { id: "v53", lessonId: "l7", khmerWord: "មាត់", phoneticVi: "Moat", meaningVi: "Miệng", meaningEn: "Mouth", exampleKh: "ហាមាត់", exampleVi: "Há miệng ra", difficulty: 3 },
  { id: "v54", lessonId: "l7", khmerWord: "ដៃ", phoneticVi: "Dai", meaningVi: "Tay", meaningEn: "Hand/Arm", exampleKh: "លាងដៃ", exampleVi: "Rửa tay", difficulty: 3 },
  { id: "v55", lessonId: "l7", khmerWord: "ជើង", phoneticVi: "Cheung", meaningVi: "Chân", meaningEn: "Leg/Foot", exampleKh: "ឈឺជើង", exampleVi: "Đau chân", difficulty: 3 },
];

export const ACHIEVEMENTS = [
  { id: "a1", name: "First Step", nameVi: "Bước Đầu Tiên", description: "Hoàn thành bài học đầu tiên", icon: "🎯", xpReward: 50, requirement: 1, type: "LESSONS_COMPLETED" },
  { id: "a2", name: "Streak 7", nameVi: "Chuỗi 7 Ngày", description: "Học liên tiếp 7 ngày", icon: "🔥", xpReward: 100, requirement: 7, type: "STREAK" },
  { id: "a3", name: "Vocabulary Master", nameVi: "Bậc Thầy Từ Vựng", description: "Học 50 từ vựng", icon: "📚", xpReward: 150, requirement: 50, type: "VOCABULARY_LEARNED" },
  { id: "a4", name: "XP Hunter", nameVi: "Thợ Săn XP", description: "Đạt 500 XP", icon: "⚡", xpReward: 200, requirement: 500, type: "XP" },
  { id: "a5", name: "Perfect Quiz", nameVi: "Quiz Hoàn Hảo", description: "Hoàn thành quiz 100% điểm", icon: "🏆", xpReward: 100, requirement: 1, type: "QUIZ_PERFECT" },
  { id: "a6", name: "Speed Learner", nameVi: "Học Siêu Tốc", description: "Học 3 bài trong 1 ngày", icon: "⚡", xpReward: 75, requirement: 3, type: "DAILY_LESSONS" },
  { id: "a7", name: "Khmer Explorer", nameVi: "Khám Phá Khmer", description: "Mở khóa tất cả danh mục", icon: "🗺️", xpReward: 300, requirement: 8, type: "CATEGORIES_UNLOCKED" },
];

export const LEADERBOARD_MOCK = [
  { rank: 1, name: "Minh Tuấn", avatar: "🦁", xp: 3850, streak: 45, country: "🇻🇳" },
  { rank: 2, name: "Lan Anh", avatar: "🐼", xp: 3200, streak: 32, country: "🇻🇳" },
  { rank: 3, name: "Quang Huy", avatar: "🐯", xp: 2950, streak: 28, country: "🇻🇳" },
  { rank: 4, name: "Phương Linh", avatar: "🦊", xp: 2700, streak: 21, country: "🇻🇳" },
  { rank: 5, name: "Đức Thành", avatar: "🐺", xp: 2400, streak: 18, country: "🇻🇳" },
  { rank: 6, name: "Thu Hà", avatar: "🦅", xp: 2100, streak: 15, country: "🇻🇳" },
  { rank: 7, name: "Bảo Nguyên", avatar: "🐬", xp: 1900, streak: 12, country: "🇻🇳" },
  { rank: 8, name: "Hoàng Nam", avatar: "🦋", xp: 1650, streak: 9, country: "🇻🇳" },
  { rank: 9, name: "Khánh Vy", avatar: "🌟", xp: 1400, streak: 7, country: "🇻🇳" },
  { rank: 10, name: "Thảo My", avatar: "🌸", xp: 1200, streak: 5, country: "🇻🇳" },
];
