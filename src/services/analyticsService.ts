import { supabase } from "@/src/lib/supabase";
import type { DayActivity } from "@/src/types/database";
import { ServiceError, toServiceError } from "./errors";
import { fetchProfile } from "./profileService";
import { fetchStreak } from "./streakService";

export interface WeeklyTaskPoint {
  /** YYYY-MM-DD */
  date: string;
  /** Tasks marked completed that calendar day */
  completedCount: number;
}

export interface AnalyticsSummary {
  /** Tasks completed in the requested window */
  tasksCompletedInRange: number;
  /** Tasks scheduled in the window (all completion states) */
  tasksTotalInRange: number;
  /** Distinct days in range where the user completed at least one task */
  activeTaskDays: number;
  /** Distinct days in range with at least one habit log */
  activeHabitDays: number;
  /** Number of days in the inclusive range */
  rangeDayCount: number;
  /** 0–100, share of days in range with any activity */
  consistencyPercent: number;
  /** From `profiles.xp` */
  totalXp: number;
  /** From `streaks.longest_streak` (falls back to current if needed) */
  bestStreak: number;
}

function parseYmd(ymd: string): Date {
  const [y, m, d] = ymd.split("-").map((v) => Number.parseInt(v, 10));
  if (!y || !m || !d) {
    throw new ServiceError(`parseYmd: invalid date "${ymd}"`);
  }
  return new Date(y, m - 1, d);
}

function addDaysYmd(ymd: string, deltaDays: number): string {
  const dt = parseYmd(ymd);
  dt.setDate(dt.getDate() + deltaDays);
  return dt.toISOString().slice(0, 10);
}

function enumerateInclusiveDates(startYmd: string, endYmd: string): string[] {
  if (startYmd > endYmd) {
    return [];
  }
  const days: string[] = [];
  let cursor = startYmd;
  const guardMax = 800;
  for (let i = 0; i < guardMax; i += 1) {
    days.push(cursor);
    if (cursor === endYmd) {
      break;
    }
    cursor = addDaysYmd(cursor, 1);
  }
  return days;
}

interface TaskDayRow {
  date: string;
  completed: boolean;
}

interface HabitLogDayRow {
  completed_at: string;
  habit_id: string;
}

export async function fetchDayActivities(
  userId: string,
  rangeStartYmd: string,
  rangeEndYmd: string,
): Promise<DayActivity[]> {
  const days = enumerateInclusiveDates(rangeStartYmd, rangeEndYmd);
  if (days.length === 0) {
    return [];
  }

  const [{ data: tasksData, error: tasksError }, { data: logsData, error: logsError }, habitsCountRes] =
    await Promise.all([
      supabase
        .from("tasks")
        .select("date, completed")
        .eq("user_id", userId)
        .gte("date", rangeStartYmd)
        .lte("date", rangeEndYmd),
      supabase
        .from("habit_logs")
        .select("completed_at, habit_id")
        .eq("user_id", userId)
        .gte("completed_at", rangeStartYmd)
        .lte("completed_at", rangeEndYmd),
      supabase
        .from("habits")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
    ]);

  if (tasksError) {
    throw toServiceError("fetchDayActivities.tasks", tasksError);
  }
  if (logsError) {
    throw toServiceError("fetchDayActivities.habit_logs", logsError);
  }
  if (habitsCountRes.error) {
    throw toServiceError("fetchDayActivities.habits", habitsCountRes.error);
  }

  const tasks = (tasksData as TaskDayRow[] | null) ?? [];
  const logs = (logsData as HabitLogDayRow[] | null) ?? [];
  const habitsTotal = habitsCountRes.count ?? 0;

  const taskAgg = new Map<string, { total: number; completed: number }>();
  for (const row of tasks) {
    const cur = taskAgg.get(row.date) ?? { total: 0, completed: 0 };
    cur.total += 1;
    if (row.completed) {
      cur.completed += 1;
    }
    taskAgg.set(row.date, cur);
  }

  const habitAgg = new Map<string, Set<string>>();
  for (const row of logs) {
    const set = habitAgg.get(row.completed_at) ?? new Set<string>();
    set.add(row.habit_id);
    habitAgg.set(row.completed_at, set);
  }

  return days.map((date) => {
    const t = taskAgg.get(date) ?? { total: 0, completed: 0 };
    const habitIds = habitAgg.get(date);
    const habitsCompleted = habitIds ? habitIds.size : 0;
    const hasActivity = t.completed > 0 || habitsCompleted > 0;

    return {
      date,
      tasksCompleted: t.completed,
      tasksTotal: t.total,
      habitsCompleted,
      habitsTotal,
      hasActivity,
    };
  });
}

export async function fetchWeeklyTaskCompletion(
  userId: string,
  weekEndYmd: string,
): Promise<WeeklyTaskPoint[]> {
  const weekStartYmd = addDaysYmd(weekEndYmd, -6);
  const { data, error } = await supabase
    .from("tasks")
    .select("date, completed")
    .eq("user_id", userId)
    .eq("completed", true)
    .gte("date", weekStartYmd)
    .lte("date", weekEndYmd);

  if (error) {
    throw toServiceError("fetchWeeklyTaskCompletion", error);
  }

  const rows = (data as TaskDayRow[] | null) ?? [];
  const byDate = new Map<string, number>();
  for (const row of rows) {
    if (!row.completed) {
      continue;
    }
    byDate.set(row.date, (byDate.get(row.date) ?? 0) + 1);
  }

  const days = enumerateInclusiveDates(weekStartYmd, weekEndYmd);
  return days.map((date) => ({
    date,
    completedCount: byDate.get(date) ?? 0,
  }));
}

export async function fetchAnalyticsSummary(
  userId: string,
  rangeStartYmd: string,
  rangeEndYmd: string,
): Promise<AnalyticsSummary> {
  const [profile, streak, activities] = await Promise.all([
    fetchProfile(userId),
    fetchStreak(userId),
    fetchDayActivities(userId, rangeStartYmd, rangeEndYmd),
  ]);

  let tasksCompletedInRange = 0;
  let tasksTotalInRange = 0;
  const taskActiveDays = new Set<string>();
  const habitActiveDays = new Set<string>();

  for (const day of activities) {
    tasksCompletedInRange += day.tasksCompleted;
    tasksTotalInRange += day.tasksTotal;
    if (day.tasksCompleted > 0) {
      taskActiveDays.add(day.date);
    }
    if (day.habitsCompleted > 0) {
      habitActiveDays.add(day.date);
    }
  }

  const rangeDayCount = activities.length;
  const anyActiveDays = new Set<string>([
    ...taskActiveDays,
    ...habitActiveDays,
  ]);
  const consistencyPercent =
    rangeDayCount === 0
      ? 0
      : Math.round((anyActiveDays.size / rangeDayCount) * 100);

  const bestStreak = streak
    ? Math.max(streak.longest_streak, streak.current_streak)
    : 0;

  return {
    tasksCompletedInRange,
    tasksTotalInRange,
    activeTaskDays: taskActiveDays.size,
    activeHabitDays: habitActiveDays.size,
    rangeDayCount,
    consistencyPercent,
    totalXp: profile.xp,
    bestStreak,
  };
}
