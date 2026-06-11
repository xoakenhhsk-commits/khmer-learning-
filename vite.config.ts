import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'admin-save-api',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/api/admin/save' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
              try {
                const { items, lessonId, newLesson } = JSON.parse(body);
                const dataPath = path.join(process.cwd(), "src", "lib", "data.ts");
                let fileContent = fs.readFileSync(dataPath, "utf-8");
                let targetLessonId = lessonId;

                if (newLesson && !lessonId) {
                  const lessonsMarker = "export const LESSONS = [";
                  const newLessonId = `l_ocr_${Date.now()}`;
                  targetLessonId = newLessonId;
                  const newLessonStr = `  {\n    id: "${newLessonId}", title: "${newLesson.title}", titleKh: "${newLesson.titleKh}",\n    description: "${newLesson.description || 'Bài học mới từ OCR'}",\n    level: 1, xpReward: 20, order: 10, isLocked: false, categoryId: "${newLesson.categoryId || '1'}",\n    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400",\n  },\n`;
                  fileContent = fileContent.replace(lessonsMarker, lessonsMarker + "\n" + newLessonStr);
                }

                const vocabToAdd = items.filter((item: any) => {
                  if (item.type !== "vocab") return false;
                  const searchPattern = new RegExp(`lessonId:\\s*["']${targetLessonId}["'].*khmerWord:\\s*["']${item.khmerWord}["']`, 'i');
                  return !searchPattern.test(fileContent);
                });

                const skippedCount = items.filter((i: any) => i.type === 'vocab').length - vocabToAdd.length;

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

                fs.writeFileSync(dataPath, fileContent, "utf-8");
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, added: vocabToAdd.length, skipped: skippedCount, lessonId: targetLessonId }));
              } catch (error: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, error: error.message }));
              }
            });
            return;
          }
          next();
        });
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api/tts': {
        target: 'https://translate.google.com',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost');
          const text = url.searchParams.get('text') || '';
          const lang = url.searchParams.get('lang') || 'km';
          return `/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=gtx`;
        },
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            proxyReq.setHeader('Referer', 'https://translate.google.com/');
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
          });
        },
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
