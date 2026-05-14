import { create } from "zustand";

import { ServiceError } from "@/src/services/errors";
import {
  createHabit,
  deleteHabit,
  fetchHabitsWithStreaks,
  setHabitDayCompletion,
  updateHabit,
} from "@/src/services/habitsService";
import type { HabitInsert, HabitUpdate, HabitWithStreak } from "@/src/types/database";

function formatError(err: unknown): string {
  if (err instanceof ServiceError) {
    return err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "Request failed";
}

function todayLocalYmd(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

interface HabitState {
  habits: HabitWithStreak[];
  loading: boolean;
  error: string | null;
  /** Loads habits with streak metrics for the device-local calendar day. */
  loadHabits: (userId: string, todayYmd?: string) => Promise<void>;
  addHabit: (insert: HabitInsert) => Promise<void>;
  editHabit: (habitId: string, userId: string, updates: HabitUpdate) => Promise<void>;
  removeHabit: (habitId: string, userId: string) => Promise<void>;
  setCompletionForDay: (
    habitId: string,
    userId: string,
    dateYmd: string,
    completed: boolean,
  ) => Promise<void>;
  reset: () => void;
}

export const useHabitStore = create<HabitState>((set) => ({
  habits: [],
  loading: false,
  error: null,

  loadHabits: async (userId: string, todayYmd?: string) => {
    const day = todayYmd ?? todayLocalYmd();
    set({ loading: true, error: null });
    try {
      const habits = await fetchHabitsWithStreaks(userId, day);
      set({ habits, loading: false, error: null });
    } catch (err) {
      set({ habits: [], loading: false, error: formatError(err) });
    }
  },

  addHabit: async (insert: HabitInsert) => {
    const userId = insert.user_id;
    const day = todayLocalYmd();
    set({ loading: true, error: null });
    try {
      await createHabit(insert);
      const habits = await fetchHabitsWithStreaks(userId, day);
      set({ habits, loading: false, error: null });
    } catch (err) {
      set((s) => ({ ...s, loading: false, error: formatError(err) }));
    }
  },

  editHabit: async (habitId: string, userId: string, updates: HabitUpdate) => {
    const day = todayLocalYmd();
    set({ loading: true, error: null });
    try {
      await updateHabit(habitId, userId, updates);
      const habits = await fetchHabitsWithStreaks(userId, day);
      set({ habits, loading: false, error: null });
    } catch (err) {
      set((s) => ({ ...s, loading: false, error: formatError(err) }));
    }
  },

  removeHabit: async (habitId: string, userId: string) => {
    const day = todayLocalYmd();
    set({ loading: true, error: null });
    try {
      await deleteHabit(habitId, userId);
      const habits = await fetchHabitsWithStreaks(userId, day);
      set({ habits, loading: false, error: null });
    } catch (err) {
      set((s) => ({ ...s, loading: false, error: formatError(err) }));
    }
  },

  setCompletionForDay: async (
    habitId: string,
    userId: string,
    dateYmd: string,
    completed: boolean,
  ) => {
    const day = todayLocalYmd();
    set({ loading: true, error: null });
    try {
      await setHabitDayCompletion(habitId, userId, dateYmd, completed);
      const habits = await fetchHabitsWithStreaks(userId, day);
      set({ habits, loading: false, error: null });
    } catch (err) {
      set((s) => ({ ...s, loading: false, error: formatError(err) }));
    }
  },

  reset: () => {
    set({ habits: [], loading: false, error: null });
  },
}));
