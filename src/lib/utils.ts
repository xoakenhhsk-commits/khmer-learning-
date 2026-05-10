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

    // Strategy 1: Google Proxy (Bypass CORS)
    const tryProxy = (): Promise<boolean> => {
      return new Promise((res) => {
        const url = `/api/tts?text=${encodeURIComponent(text)}&lang=${lang}&v=${Date.now()}`;
        console.log("TTS: Trying Proxy...");
        const audio = new Audio(url);
        currentAudio = audio;
        const t = setTimeout(() => { audio.pause(); res(false); }, 7000);
        audio.onended = () => { clearTimeout(t); resolve(); res(true); };
        audio.onerror = () => { clearTimeout(t); res(false); };
        audio.play().catch(() => { clearTimeout(t); res(false); });
      });
    };

    // Strategy 2: Google Direct (gtx)
    const tryDirect = (domain = "com"): Promise<boolean> => {
      return new Promise((res) => {
        const url = `https://translate.google.${domain}/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=gtx`;
        console.log(`TTS: Trying Direct (.${domain})...`);
        const audio = new Audio(url);
        currentAudio = audio;
        const t = setTimeout(() => { audio.pause(); res(false); }, 7000);
        audio.onended = () => { clearTimeout(t); resolve(); res(true); };
        audio.onerror = () => { clearTimeout(t); res(false); };
        audio.play().catch(() => { clearTimeout(t); res(false); });
      });
    };

    // Strategy 3: ResponsiveVoice
    const tryRV = (retries = 3): Promise<boolean> => {
      return new Promise((res) => {
        const rv = (window as any).responsiveVoice;
        if (!rv) {
          if (retries > 0) {
            console.log("TTS: Waiting for RV...");
            setTimeout(() => res(tryRV(retries - 1)), 1500);
          } else res(false);
          return;
        }
        console.log("TTS: Trying RV...");
        rv.speak(text, "Khmer Male", {
          onend: () => { resolve(); res(true); },
          onerror: () => res(false)
        });
      });
    };

    // Strategy 4: Web Speech
    const tryWeb = (): Promise<boolean> => {
      return new Promise((res) => {
        if (typeof window === "undefined" || !window.speechSynthesis) return res(false);
        const ut = new SpeechSynthesisUtterance(text);
        ut.lang = "km-KH";
        const v = window.speechSynthesis.getVoices().find(v => v.lang.includes("km"));
        if (v) ut.voice = v;
        ut.onend = () => { resolve(); res(true); };
        ut.onerror = () => res(false);
        console.log("TTS: Trying Web Speech...");
        window.speechSynthesis.speak(ut);
      });
    };

    (async () => {
      if (await tryProxy()) return;
      if (await tryDirect("com")) return;
      if (await tryDirect("com.vn")) return;
      if (await tryRV()) return;
      if (await tryWeb()) return;
      console.error("TTS Failed");
      resolve();
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
