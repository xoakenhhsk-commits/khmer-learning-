export interface KhmerConsonant {
  id: string;
  char: string;
  subscript: string;
  phonetic: string;
  series: "A" | "O";
  meaning: string;
}

export interface KhmerVowel {
  id: string;
  char: string;
  name: string;
  phoneticA: string;
  phoneticO: string;
}

export const khmerConsonants: KhmerConsonant[] = [
  // Nhóm 1 (K)
  { id: "c1", char: "ក", subscript: "្ក", phonetic: "kâ", series: "A", meaning: "Cái cổ" },
  { id: "c2", char: "ខ", subscript: "្ខ", phonetic: "khâ", series: "A", meaning: "Cái khiên" },
  { id: "c3", char: "គ", subscript: "្គ", phonetic: "kô", series: "O", meaning: "Con bò" },
  { id: "c4", char: "ឃ", subscript: "្ឃ", phonetic: "khô", series: "O", meaning: "Cái cồng" },
  { id: "c5", char: "ង", subscript: "្ង", phonetic: "ngô", series: "O", meaning: "Bóng tối" },
  // Nhóm 2 (C)
  { id: "c6", char: "ច", subscript: "្ច", phonetic: "châ", series: "A", meaning: "Con chó" },
  { id: "c7", char: "ឆ", subscript: "្ឆ", phonetic: "chhâ", series: "A", meaning: "Cái chập cheng" },
  { id: "c8", char: "ជ", subscript: "្ជ", phonetic: "chô", series: "O", meaning: "Cái cuốc" },
  { id: "c9", char: "ឈ", subscript: "្ឈ", phonetic: "chhô", series: "O", meaning: "Cây xanh" },
  { id: "c10", char: "ញ", subscript: "្ញ", phonetic: "nhô", series: "O", meaning: "Cái búa" },
  // Nhóm 3 (D)
  { id: "c11", char: "ដ", subscript: "្ដ", phonetic: "dâ", series: "A", meaning: "Quả vú sữa" },
  { id: "c12", char: "ឋ", subscript: "្ឋ", phonetic: "thâ", series: "A", meaning: "Cái bệ" },
  { id: "c13", char: "ឌ", subscript: "្ឌ", phonetic: "dô", series: "O", meaning: "Con rùa" },
  { id: "c14", char: "ឍ", subscript: "្ឍ", phonetic: "thô", series: "O", meaning: "Ông lão" },
  { id: "c15", char: "ណ", subscript: "្ណ", phonetic: "nâ", series: "A", meaning: "Quái vật" },
  // Nhóm 4 (T)
  { id: "c16", char: "ត", subscript: "្ត", phonetic: "tâ", series: "A", meaning: "Con rùa (nhỏ)" },
  { id: "c17", char: "ថ", subscript: "្ថ", phonetic: "thâ", series: "A", meaning: "Cái bình" },
  { id: "c18", char: "ទ", subscript: "្ទ", phonetic: "tô", series: "O", meaning: "Lá cờ" },
  { id: "c19", char: "ធ", subscript: "្ធ", phonetic: "thô", series: "O", meaning: "Răng" },
  { id: "c20", char: "ន", subscript: "្ន", phonetic: "nô", series: "O", meaning: "Con giun" },
  // Nhóm 5 (P)
  { id: "c21", char: "ប", subscript: "្ប", phonetic: "bâ", series: "A", meaning: "Tờ giấy" },
  { id: "c22", char: "ផ", subscript: "្ផ", phonetic: "phâ", series: "A", meaning: "Mặt trời" },
  { id: "c23", char: "ព", subscript: "្ព", phonetic: "pô", series: "O", meaning: "Cái phễu" },
  { id: "c24", char: "ភ", subscript: "្ភ", phonetic: "phô", series: "O", meaning: "Quả dưa hấu" },
  { id: "c25", char: "ម", subscript: "្ម", phonetic: "mô", series: "O", meaning: "Cái miệng" },
  // Nhóm 6 (Mức linh tinh)
  { id: "c26", char: "យ", subscript: "្យ", phonetic: "yô", series: "O", meaning: "Cái mỏ neo" },
  { id: "c27", char: "រ", subscript: "្រ", phonetic: "rô", series: "O", meaning: "Lá cọ" },
  { id: "c28", char: "ល", subscript: "្ល", phonetic: "lô", series: "O", meaning: "Khỉ" },
  { id: "c29", char: "វ", subscript: "្វ", phonetic: "vô", series: "O", meaning: "Cái quạt" },
  { id: "c30", char: "ស", subscript: "្ស", phonetic: "sâ", series: "A", meaning: "Tóc" },
  { id: "c31", char: "ហ", subscript: "្ហ", phonetic: "hâ", series: "A", meaning: "Cái kèn" },
  { id: "c32", char: "ឡ", subscript: "្ឡ", phonetic: "lâ", series: "A", meaning: "Ngọn đuốc (không có chân)" },
  { id: "c33", char: "អ", subscript: "្អ", phonetic: "â", series: "A", meaning: "Con bò" }
];

export const khmerVowels: KhmerVowel[] = [
  { id: "v1", char: "◌", name: "Inherent", phoneticA: "â", phoneticO: "ô" },
  { id: "v2", char: "◌ា", name: "Srak A", phoneticA: "aa", phoneticO: "éav" },
  { id: "v3", char: "◌ិ", name: "Srak E", phoneticA: "ĕ", phoneticO: "ĭ" },
  { id: "v4", char: "◌ី", name: "Srak Ei", phoneticA: "ei", phoneticO: "ī" },
  { id: "v5", char: "◌ึ", name: "Srak Oe", phoneticA: "œ̆", phoneticO: "ŭœ" },
  { id: "v6", char: "◌ឺ", name: "Srak Oeu", phoneticA: "œ", phoneticO: "ư̄" },
  { id: "v7", char: "◌ុ", name: "Srak O", phoneticA: "ŏ", phoneticO: "ŭ" },
  { id: "v8", char: "◌ូ", name: "Srak Oo", phoneticA: "o", phoneticO: "u" },
  { id: "v9", char: "◌ួ", name: "Srak Ua", phoneticA: "uŏ", phoneticO: "uŏ" },
  { id: "v10", char: "ើ", name: "Srak Oeu", phoneticA: "aeu", phoneticO: "eu" },
  { id: "v11", char: "ឿ", name: "Srak Oea", phoneticA: "uœa", phoneticO: "uœa" },
  { id: "v12", char: "ៀ", name: "Srak Ie", phoneticA: "iĕa", phoneticO: "iĕa" },
  { id: "v13", char: "េ", name: "Srak E", phoneticA: "é", phoneticO: "ê" },
  { id: "v14", char: "ែ", name: "Srak Ae", phoneticA: "ê", phoneticO: "ê" },
  { id: "v15", char: "ៃ", name: "Srak Ay", phoneticA: "ay", phoneticO: "ey" },
  { id: "v16", char: "ោ", name: "Srak Ao", phoneticA: "ao", phoneticO: "ô" },
  { id: "v17", char: "ៅ", name: "Srak Au", phoneticA: "au", phoneticO: "ŏv" },
  { id: "v18", char: "ុំ", name: "Srak Om", phoneticA: "om", phoneticO: "um" },
  { id: "v19", char: "ំ", name: "Srak Am", phoneticA: "âm", phoneticO: "um" },
  { id: "v20", char: "ាំ", name: "Srak Am", phoneticA: "ăm", phoneticO: "oâm" },
  { id: "v21", char: "ះ", name: "Srak Ah", phoneticA: "ăh", phoneticO: "eăh" },
  { id: "v22", char: "ុះ", name: "Srak Oh", phoneticA: "ŏh", phoneticO: "ŭh" },
  { id: "v23", char: "េះ", name: "Srak Eh", phoneticA: "éh", phoneticO: "ĭh" },
  { id: "v24", char: "ោះ", name: "Srak Oh", phoneticA: "ŏah", phoneticO: "uŏh" },
  { id: "v25", char: "ៈ", name: "Srak Ak", phoneticA: "ăʔ", phoneticO: "eăʔ" }
];
