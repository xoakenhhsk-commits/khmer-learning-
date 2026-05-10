import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export { type VocabItem } from "./data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatXP(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return xp.toString();
}

export function getLevelFromXP(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function getXPForNextLevel(xp: number): number {
  const level = getLevelFromXP(xp);
  return level * 100 - xp;
}

export function getProgressPercent(xp: number): number {
  const currentLevelXP = (getLevelFromXP(xp) - 1) * 100;
  return ((xp - currentLevelXP) / 100) * 100;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Play TTS audio for Khmer text.
 * Strategy 1: Google Translate TTS (most natural Khmer voice)
 * Strategy 2: Web Speech API (SpeechSynthesis) with km-KH or km
 */
let currentAudio: HTMLAudioElement | null = null;

export function playTTS(text: string, lang = "km"): Promise<void> {
  if (!text) return Promise.resolve();

  return new Promise((resolve) => {
    if (currentAudio) {
      try { currentAudio.pause(); currentAudio.src = ""; } catch (e) {}
      currentAudio = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    // Strategy 1: Server Proxy (works on both Vite dev & Vercel production)
    const tryProxy = (): Promise<boolean> => {
      return new Promise((res) => {
        const url = `/api/tts?text=${encodeURIComponent(text)}&lang=${lang}&v=${Date.now()}`;
        console.log("TTS: Trying Proxy...");
        const audio = new Audio(url);
        currentAudio = audio;
        const t = setTimeout(() => { audio.pause(); res(false); }, 8000);
        audio.onended = () => { clearTimeout(t); currentAudio = null; resolve(); res(true); };
        audio.onerror = () => { clearTimeout(t); currentAudio = null; res(false); };
        audio.play().then(() => {
          console.log("TTS: Proxy playing ✓");
        }).catch(() => { clearTimeout(t); res(false); });
      });
    };

    // Strategy 2: ResponsiveVoice (loaded via script in index.html)
    const tryRV = (retries = 5): Promise<boolean> => {
      return new Promise((res) => {
        const rv = (window as any).responsiveVoice;
        if (!rv) {
          if (retries > 0) {
            setTimeout(() => res(tryRV(retries - 1)), 800);
          } else res(false);
          return;
        }
        console.log("TTS: Trying ResponsiveVoice...");
        const timeout = setTimeout(() => res(false), 8000);
        rv.speak(text, "Khmer Male", {
          onend: () => { clearTimeout(timeout); resolve(); res(true); },
          onerror: () => { clearTimeout(timeout); res(false); }
        });
      });
    };

    // Strategy 3: Web Speech API (native browser fallback)
    const tryWeb = (): Promise<boolean> => {
      return new Promise((res) => {
        if (typeof window === "undefined" || !window.speechSynthesis) return res(false);
        const ut = new SpeechSynthesisUtterance(text);
        ut.lang = "km-KH";
        ut.rate = 0.9;
        const voices = window.speechSynthesis.getVoices();
        const v = voices.find(v => v.lang.includes("km") || v.name.toLowerCase().includes("khmer"));
        if (v) { ut.voice = v; ut.lang = v.lang; }
        ut.onend = () => { resolve(); res(true); };
        ut.onerror = () => res(false);
        console.log("TTS: Trying Web Speech...");
        window.speechSynthesis.speak(ut);
      });
    };

    (async () => {
      try {
        // 1. Proxy (server-side, bypasses CORS - works on Vercel + localhost)
        console.log(`TTS: Requesting "/api/tts" for: "${text}"`);
        if (await tryProxy()) return;
        
        // 2. ResponsiveVoice (client-side JS library)
        console.log("TTS: Proxy failed, trying ResponsiveVoice...");
        if (await tryRV()) return;
        
        // 3. Web Speech (native browser)
        console.log("TTS: ResponsiveVoice failed, trying Web Speech...");
        if (await tryWeb()) return;
        
        console.error("TTS: All strategies failed for:", text);
      } catch (err) {
        console.error("TTS: Critical error in playTTS:", err);
      } finally {
        resolve();
      }
    })();
  });
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
