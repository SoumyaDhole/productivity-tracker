import { create } from "zustand";

import { ServiceError } from "@/src/services/errors";
import { fetchStreak, updateStreak } from "@/src/services/streakService";
import type { StreakRow, StreakUpdate } from "@/src/types/database";

function formatError(err: unknown): string {
  if (err instanceof ServiceError) {
    return err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "Failed to load streak";
}

interface StreakState {
  streak: StreakRow | null;
  loading: boolean;
  error: string | null;
  loadStreak: (userId: string) => Promise<void>;
  patchStreak: (userId: string, updates: StreakUpdate) => Promise<void>;
  reset: () => void;
}

export const useStreakStore = create<StreakState>((set) => ({
  streak: null,
  loading: false,
  error: null,

  loadStreak: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const streak = await fetchStreak(userId);
      set({ streak, loading: false, error: null });
    } catch (err) {
      set({
        streak: null,
        loading: false,
        error: formatError(err),
      });
    }
  },

  patchStreak: async (userId: string, updates: StreakUpdate) => {
    set({ loading: true, error: null });
    try {
      const streak = await updateStreak(userId, updates);
      set({ streak, loading: false, error: null });
    } catch (err) {
      set((s) => ({
        ...s,
        loading: false,
        error: formatError(err),
      }));
    }
  },

  reset: () => {
    set({ streak: null, loading: false, error: null });
  },
}));
