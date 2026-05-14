import { create } from "zustand";

import { applyTaskCompletionRewards } from "@/src/services/gamificationService";
import { ServiceError } from "@/src/services/errors";
import {
  createGoal,
  createTask,
  deleteGoal,
  deleteTask,
  fetchGoals,
  fetchTasksWithGoals,
  type ListTasksFilters,
  setTaskCompleted,
  updateGoal,
  updateTask,
} from "@/src/services/tasksService";
import { localTodayYmd } from "@/src/utils/dateYmd";
import type {
  GoalInsert,
  GoalRow,
  GoalUpdate,
  TaskInsert,
  TaskUpdate,
  TaskWithGoal,
} from "@/src/types/database";

import { useProfileStore } from "./useProfileStore";
import { useStreakStore } from "./useStreakStore";

function formatError(err: unknown): string {
  if (err instanceof ServiceError) {
    return err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "Request failed";
}

export interface RefreshTaskDataOptions {
  /** When false, list stays visible (no full-screen loading from this refresh). Default true. */
  showLoading?: boolean;
}

interface TaskState {
  goals: GoalRow[];
  tasks: TaskWithGoal[];
  loading: boolean;
  error: string | null;
  loadGoals: (userId: string) => Promise<void>;
  loadTasksWithGoals: (userId: string, filters?: ListTasksFilters) => Promise<void>;
  refreshTaskData: (
    userId: string,
    filters?: ListTasksFilters,
    options?: RefreshTaskDataOptions,
  ) => Promise<void>;
  addGoal: (insert: GoalInsert) => Promise<void>;
  editGoal: (goalId: string, userId: string, updates: GoalUpdate) => Promise<void>;
  removeGoal: (goalId: string, userId: string) => Promise<void>;
  addTask: (insert: TaskInsert) => Promise<void>;
  editTask: (taskId: string, userId: string, updates: TaskUpdate) => Promise<void>;
  removeTask: (taskId: string, userId: string) => Promise<void>;
  toggleTask: (taskId: string, userId: string, completed: boolean) => Promise<void>;
  reset: () => void;
}

const silentRefresh = { showLoading: false } satisfies RefreshTaskDataOptions;

export const useTaskStore = create<TaskState>((set, get) => ({
  goals: [],
  tasks: [],
  loading: false,
  error: null,

  loadGoals: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const goals = await fetchGoals(userId);
      set({ goals, loading: false, error: null });
    } catch (err) {
      set({ goals: [], loading: false, error: formatError(err) });
    }
  },

  loadTasksWithGoals: async (userId: string, filters?: ListTasksFilters) => {
    set({ loading: true, error: null });
    try {
      const tasks = await fetchTasksWithGoals(userId, filters);
      set({ tasks, loading: false, error: null });
    } catch (err) {
      set({ tasks: [], loading: false, error: formatError(err) });
    }
  },

  refreshTaskData: async (
    userId: string,
    filters?: ListTasksFilters,
    options?: RefreshTaskDataOptions,
  ) => {
    const showLoading = options?.showLoading ?? true;
    if (showLoading) {
      set({ loading: true, error: null });
    } else {
      set({ error: null });
    }
    try {
      const [goals, tasks] = await Promise.all([
        fetchGoals(userId),
        fetchTasksWithGoals(userId, filters),
      ]);
      set({ goals, tasks, loading: false, error: null });
    } catch (err) {
      set((s) => ({
        ...s,
        loading: false,
        error: formatError(err),
      }));
    }
  },

  addGoal: async (insert: GoalInsert) => {
    const userId = insert.user_id;
    set({ error: null });
    try {
      await createGoal(insert);
      await get().refreshTaskData(userId, undefined, silentRefresh);
    } catch (err) {
      set((s) => ({ ...s, error: formatError(err) }));
    }
  },

  editGoal: async (goalId: string, userId: string, updates: GoalUpdate) => {
    set({ error: null });
    try {
      await updateGoal(goalId, userId, updates);
      await get().refreshTaskData(userId, undefined, silentRefresh);
    } catch (err) {
      set((s) => ({ ...s, error: formatError(err) }));
    }
  },

  removeGoal: async (goalId: string, userId: string) => {
    set({ error: null });
    try {
      await deleteGoal(goalId, userId);
      await get().refreshTaskData(userId, undefined, silentRefresh);
    } catch (err) {
      set((s) => ({ ...s, error: formatError(err) }));
    }
  },

  addTask: async (insert: TaskInsert) => {
    const userId = insert.user_id;
    set({ error: null });
    try {
      await createTask(insert);
      await get().refreshTaskData(userId, undefined, silentRefresh);
    } catch (err) {
      const msg = formatError(err);
      set((s) => ({ ...s, error: msg }));
      throw new Error(msg);
    }
  },

  editTask: async (taskId: string, userId: string, updates: TaskUpdate) => {
    set({ error: null });
    try {
      await updateTask(taskId, userId, updates);
      await get().refreshTaskData(userId, undefined, silentRefresh);
    } catch (err) {
      set((s) => ({ ...s, error: formatError(err) }));
    }
  },

  removeTask: async (taskId: string, userId: string) => {
    const snapshot = get().tasks;
    set({
      tasks: snapshot.filter((t) => t.id !== taskId),
      error: null,
    });
    try {
      await deleteTask(taskId, userId);
      await get().refreshTaskData(userId, undefined, silentRefresh);
    } catch (err) {
      set({
        tasks: snapshot,
        error: formatError(err),
      });
    }
  },

  toggleTask: async (taskId: string, userId: string, completed: boolean) => {
    set({ error: null });
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task) {
      return;
    }
    const wasCompleted = task.completed;
    try {
      await setTaskCompleted(taskId, userId, completed);
      if (completed && !wasCompleted) {
        try {
          await applyTaskCompletionRewards(
            userId,
            taskId,
            task.priority,
            localTodayYmd(),
          );
          await Promise.all([
            useProfileStore.getState().loadProfile(userId),
            useStreakStore.getState().loadStreak(userId),
          ]);
        } catch (rewardErr) {
          if (__DEV__) {
            console.warn("[gamification]", rewardErr);
          }
        }
      }
      await get().refreshTaskData(userId, undefined, silentRefresh);
    } catch (err) {
      set((s) => ({ ...s, error: formatError(err) }));
    }
  },

  reset: () => {
    set({ goals: [], tasks: [], loading: false, error: null });
  },
}));
