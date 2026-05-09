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
  return new Promise((resolve) => {
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    // Strategy 1: Google Translate TTS
    const tryGoogleTTS = (): Promise<boolean> => {
      return new Promise((res) => {
        if (typeof window === "undefined") return res(false);
        const encoded = encodeURIComponent(text);
        const url = `/api/tts?text=${encoded}&lang=${lang}`;
        
        const audio = new Audio(url);
        audio.playbackRate = 0.9;
        currentAudio = audio;

        const timeout = setTimeout(() => {
          audio.pause();
          res(false);
        }, 8000);

        audio.onended = () => {
          clearTimeout(timeout);
          currentAudio = null;
          resolve();
          res(true);
        };

        audio.onerror = () => {
          clearTimeout(timeout);
          currentAudio = null;
          res(false);
        };

        audio.play().catch((err) => {
          if (err.name !== "AbortError") {
            console.warn("Google TTS Error:", err);
          }
          clearTimeout(timeout);
          res(false);
        });
      });
    };

    // Strategy 2: Web Speech API (SpeechSynthesis)
    const tryWebSpeech = (): Promise<boolean> => {
      return new Promise((res) => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) {
          return res(false);
        }

        const speak = () => {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = "km-KH"; // Default Khmer
          utterance.rate = 0.8;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;

          // Find the best Khmer voice
          const voices = window.speechSynthesis.getVoices();
          const khmerVoice = voices.find(v => 
            v.lang.includes("km") || v.lang.includes("khm") || v.name.toLowerCase().includes("khmer")
          );
          
          if (khmerVoice) {
            utterance.voice = khmerVoice;
            utterance.lang = khmerVoice.lang;
          }

          utterance.onend = () => { resolve(); res(true); };
          utterance.onerror = () => res(false);

          window.speechSynthesis.speak(utterance);
        };

        if (window.speechSynthesis.getVoices().length > 0) {
          speak();
        } else {
          window.speechSynthesis.onvoiceschanged = speak;
          // Fallback if event never fires
          setTimeout(speak, 100);
        }
      });
    };

    // Execute strategies
    (async () => {
      try {
        const googleOk = await tryGoogleTTS();
        if (!googleOk) {
          await tryWebSpeech();
        }
      } catch (err) {
        console.error("TTS Error:", err);
        resolve(); // Always resolve to avoid hanging
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
