import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), "src", "lib", "data.ts");
    const fileContent = fs.readFileSync(dataPath, "utf-8");

    // Extract LESSONS array using regex (simple version)
    const lessonsMatch = fileContent.match(/export const LESSONS = (\[[\s\S]*?\]);/);
    const categoriesMatch = fileContent.match(/export const CATEGORIES = (\[[\s\S]*?\]);/);

    // Note: This is a hacky way since it's a TS file, but works for this specific setup
    // A better way would be importing but that doesn't work well with dynamic FS writes in the same session
    return NextResponse.json({ 
      lessons: lessonsMatch ? eval(lessonsMatch[1]) : [],
      categories: categoriesMatch ? eval(categoriesMatch[1]) : []
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { items, lessonId, newLesson } = await req.json();
    
    const dataPath = path.join(process.cwd(), "src", "lib", "data.ts");
    let fileContent = fs.readFileSync(dataPath, "utf-8");

    let targetLessonId = lessonId;

    // 1. If new lesson, add it to LESSONS array
    if (newLesson && !lessonId) {
      const lessonsMarker = "export const LESSONS = [";
      const newLessonId = `l_ocr_${Date.now()}`;
      targetLessonId = newLessonId;

      const newLessonStr = `  {
    id: "${newLessonId}", title: "${newLesson.title}", titleKh: "${newLesson.titleKh}",
    description: "${newLesson.description || 'Bài học mới từ OCR'}",
    level: 1, xpReward: 20, order: 10, isLocked: false, categoryId: "${newLesson.categoryId || '1'}",
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400",
  },\n`;

      fileContent = fileContent.replace(lessonsMarker, lessonsMarker + "\n" + newLessonStr);
    }

    // 2. Add vocab to VOCABULARY array
    // We'll perform a simple duplication check using regex to find if the word already exists in the file
    const vocabToAdd = items.filter((item: any) => {
      if (item.type !== "vocab") return false;
      
      // Simple but effective: check if the word + lessonId combination already exists as a string in the file
      // This is safer than parsing the whole array in a live dev file
      const searchPattern = new RegExp(`lessonId:\\s*["']${targetLessonId}["'].*khmerWord:\\s*["']${item.khmerWord}["']`, 'i');
      const isDuplicate = searchPattern.test(fileContent);
      
      return !isDuplicate;
    });

    const skippedCount = items.filter(i => i.type === 'vocab').length - vocabToAdd.length;

    if (vocabToAdd.length > 0) {
      const vocabMarker = "export const VOCABULARY: VocabItem[] = [";
      if (fileContent.includes(vocabMarker)) {
        let newItemsStr = `\n  // --- MỚI THÊM TỪ OCR CHO LESSON: ${targetLessonId} (Đã lọc trùng) ---\n`;
        vocabToAdd.forEach((item: any, i: number) => {
          const newId = `v_ocr_${Date.now()}_${i}`;
          newItemsStr += `  { id: "${newId}", lessonId: "${targetLessonId}", khmerWord: "${item.khmerWord}", phoneticVi: "${item.phoneticVi}", meaningVi: "${item.meaningVi}", difficulty: 2 },\n`;
        });
        newItemsStr += "  // ----------------------\n";

        fileContent = fileContent.replace(vocabMarker, vocabMarker + newItemsStr);
      }
    }

    // Write back
    fs.writeFileSync(dataPath, fileContent, "utf-8");

    return NextResponse.json({ 
      success: true, 
      added: vocabToAdd.length, 
      skipped: skippedCount,
      lessonId: targetLessonId 
    });
  } catch (error: any) {
    console.error("Save Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
