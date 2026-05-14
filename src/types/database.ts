/**
 * Supabase public schema types — aligned with SQL migrations.
 * Timestamps and dates are ISO strings as returned by PostgREST.
 */

/** Task priority — matches DB CHECK constraint */
export type TaskPriority = "High" | "Med" | "Low";

// -----------------------------------------------------------------------------
// Row types (SELECT *)
// -----------------------------------------------------------------------------

export interface ProfileRow {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  level: number;
  xp: number;
  created_at: string;
}

export interface GoalRow {
  id: string;
  user_id: string;
  title: string;
  color: string;
  created_at: string;
}

export interface TaskRow {
  id: string;
  user_id: string;
  goal_id: string | null;
  title: string;
  due_time: string | null;
  priority: TaskPriority;
  completed: boolean;
  /** YYYY-MM-DD */
  date: string;
  created_at: string;
}

export interface HabitRow {
  id: string;
  user_id: string;
  name: string;
  emoji: string;
  color: string;
  created_at: string;
}

export interface HabitLogRow {
  id: string;
  habit_id: string;
  user_id: string;
  /** YYYY-MM-DD — completion day */
  completed_at: string;
}

export interface StreakRow {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  /** YYYY-MM-DD or null */
  last_active_date: string | null;
  updated_at: string;
}

// -----------------------------------------------------------------------------
// Insert DTOs (columns you may pass on INSERT)
// -----------------------------------------------------------------------------

export type ProfileInsert = Pick<
  ProfileRow,
  "id" | "username" | "full_name" | "avatar_url"
> &
  Partial<Pick<ProfileRow, "level" | "xp">>;

export type GoalInsert = Pick<GoalRow, "user_id" | "title"> &
  Partial<Pick<GoalRow, "color">>;

export type TaskInsert = Pick<
  TaskRow,
  "user_id" | "title"
> &
  Partial<
    Pick<TaskRow, "goal_id" | "due_time" | "priority" | "completed" | "date">
  >;

export type HabitInsert = Pick<HabitRow, "user_id" | "name"> &
  Partial<Pick<HabitRow, "emoji" | "color">>;

export type HabitLogInsert = Pick<
  HabitLogRow,
  "habit_id" | "user_id" | "completed_at"
>;

export type StreakInsert = Pick<StreakRow, "user_id"> &
  Partial<
    Pick<StreakRow, "current_streak" | "longest_streak" | "last_active_date">
  >;

// -----------------------------------------------------------------------------
// Update DTOs (partial column updates)
// -----------------------------------------------------------------------------

export type ProfileUpdate = Partial<
  Omit<ProfileRow, "id" | "created_at">
>;

export type GoalUpdate = Partial<
  Pick<GoalRow, "title" | "color">
>;

export type TaskUpdate = Partial<
  Pick<TaskRow, "goal_id" | "title" | "due_time" | "priority" | "completed" | "date">
>;

export type HabitUpdate = Partial<
  Pick<HabitRow, "name" | "emoji" | "color">
>;

export type StreakUpdate = Partial<
  Pick<StreakRow, "current_streak" | "longest_streak" | "last_active_date">
>;

// -----------------------------------------------------------------------------
// Composite / helper types
// -----------------------------------------------------------------------------

/** Task joined with its goal (nullable if goal deleted / unset) */
export interface TaskWithGoal extends TaskRow {
  goal: Pick<GoalRow, "id" | "title" | "color"> | null;
}

/** Habit plus streak metrics derived from logs (or streaks table for “global” streak elsewhere) */
export interface HabitWithStreak extends HabitRow {
  /** Consecutive days ending at `asOfDate` (inclusive), based on habit_logs */
  currentStreak: number;
  /** Best consecutive run in the available log history */
  longestStreak: number;
  /** Whether `completedAt` has a log row */
  completedToday: boolean;
}

/** Per-day rollup for analytics / heatmaps */
export interface DayActivity {
  /** YYYY-MM-DD */
  date: string;
  tasksCompleted: number;
  tasksTotal: number;
  habitsCompleted: number;
  habitsTotal: number;
  /** Any productive activity that day */
  hasActivity: boolean;
}

/** Narrow PostgREST error shape we surface to callers */
export interface SupabaseErrorPayload {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}
