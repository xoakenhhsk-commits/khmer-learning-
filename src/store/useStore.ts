import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  xp: number;
  level: number;
  streakDays: number;
  hearts: number;
  role: "USER" | "ADMIN";
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  hearts: number;
  currentLesson: string | null;
  completedLessons: string[];
  dailyXP: number;
  theme: "light" | "dark";

  setUser: (user: User | null) => void;
  setAuthenticated: (val: boolean) => void;
  loseHeart: () => void;
  gainHeart: () => void;
  addXP: (amount: number) => void;
  setCurrentLesson: (id: string | null) => void;
  completeLesson: (id: string) => void;
  toggleTheme: () => void;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hearts: 5,
      currentLesson: null,
      completedLessons: [],
      dailyXP: 0,
      theme: "light",

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (val) => set({ isAuthenticated: val }),
      loseHeart: () =>
        set((state) => ({ hearts: Math.max(0, state.hearts - 1) })),
      gainHeart: () =>
        set((state) => ({ hearts: Math.min(5, state.hearts + 1) })),
      addXP: (amount) =>
        set((state) => ({
          dailyXP: state.dailyXP + amount,
          user: state.user
            ? { ...state.user, xp: state.user.xp + amount }
            : null,
        })),
      setCurrentLesson: (id) => set({ currentLesson: id }),
      completeLesson: (id) =>
        set((state) => ({
          completedLessons: [...new Set([...state.completedLessons, id])],
        })),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          hearts: 5,
          currentLesson: null,
          completedLessons: [], // Xóa sạch danh sách bài học đã hoàn thành
          dailyXP: 0,
        }),
    }),
    { name: "khmer-learn-store" }
  )
);
