import { supabase } from "@/src/lib/supabase";
import type {
  HabitInsert,
  HabitLogRow,
  HabitRow,
  HabitUpdate,
  HabitWithStreak,
} from "@/src/types/database";
import { ServiceError, toServiceError } from "./errors";

const HABIT_COLUMNS = "id, user_id, name, emoji, color, created_at" as const;
const HABIT_LOG_COLUMNS = "id, habit_id, user_id, completed_at" as const;

function toYmd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function parseYmd(ymd: string): Date {
  const [y, m, day] = ymd.split("-").map((v) => Number.parseInt(v, 10));
  if (!y || !m || !day) {
    throw new ServiceError(`parseYmd: invalid date "${ymd}"`);
  }
  return new Date(y, m - 1, day);
}

function addDaysYmd(ymd: string, deltaDays: number): string {
  const d = parseYmd(ymd);
  d.setDate(d.getDate() + deltaDays);
  return toYmd(d);
}

function longestConsecutiveStreak(sortedAscYmd: string[]): number {
  if (sortedAscYmd.length === 0) {
    return 0;
  }
  let best = 1;
  let run = 1;
  for (let i = 1; i < sortedAscYmd.length; i += 1) {
    const prev = sortedAscYmd[i - 1];
    const cur = sortedAscYmd[i];
    if (!prev || !cur) {
      continue;
    }
    const diffMs = parseYmd(cur).getTime() - parseYmd(prev).getTime();
    const diffDays = Math.round(diffMs / 86_400_000);
    if (diffDays === 1) {
      run += 1;
      best = Math.max(best, run);
    } else if (diffDays === 0) {
      // duplicate day — ignore
    } else {
      run = 1;
    }
  }
  return best;
}

function currentStreakFromToday(
  sortedDescUniqueYmd: string[],
  todayYmd: string,
): number {
  const set = new Set(sortedDescUniqueYmd);
  let streak = 0;
  let cursor = todayYmd;
  const maxIterations = 366 * 5;
  for (let i = 0; i < maxIterations; i += 1) {
    if (set.has(cursor)) {
      streak += 1;
      cursor = addDaysYmd(cursor, -1);
    } else {
      break;
    }
  }
  return streak;
}

export async function fetchHabits(userId: string): Promise<HabitRow[]> {
  const { data, error } = await supabase
    .from("habits")
    .select(HABIT_COLUMNS)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    throw toServiceError("fetchHabits", error);
  }
  return (data as HabitRow[]) ?? [];
}

export async function fetchHabitLogsForUser(
  userId: string,
  options?: { from?: string; to?: string },
): Promise<HabitLogRow[]> {
  let query = supabase
    .from("habit_logs")
    .select(HABIT_LOG_COLUMNS)
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });

  if (options?.from) {
    query = query.gte("completed_at", options.from);
  }
  if (options?.to) {
    query = query.lte("completed_at", options.to);
  }

  const { data, error } = await query;

  if (error) {
    throw toServiceError("fetchHabitLogsForUser", error);
  }
  return (data as HabitLogRow[]) ?? [];
}

export async function fetchHabitLogsForHabit(
  habitId: string,
  userId: string,
  options?: { from?: string; to?: string },
): Promise<HabitLogRow[]> {
  let query = supabase
    .from("habit_logs")
    .select(HABIT_LOG_COLUMNS)
    .eq("habit_id", habitId)
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });

  if (options?.from) {
    query = query.gte("completed_at", options.from);
  }
  if (options?.to) {
    query = query.lte("completed_at", options.to);
  }

  const { data, error } = await query;

  if (error) {
    throw toServiceError("fetchHabitLogsForHabit", error);
  }
  return (data as HabitLogRow[]) ?? [];
}

export async function createHabit(insert: HabitInsert): Promise<HabitRow> {
  const { data, error } = await supabase
    .from("habits")
    .insert(insert)
    .select(HABIT_COLUMNS)
    .single();

  if (error) {
    throw toServiceError("createHabit", error);
  }
  if (!data) {
    throw new ServiceError("createHabit: no row returned");
  }
  return data as HabitRow;
}

export async function updateHabit(
  habitId: string,
  userId: string,
  updates: HabitUpdate,
): Promise<HabitRow> {
  const { data, error } = await supabase
    .from("habits")
    .update(updates)
    .eq("id", habitId)
    .eq("user_id", userId)
    .select(HABIT_COLUMNS)
    .single();

  if (error) {
    throw toServiceError("updateHabit", error);
  }
  if (!data) {
    throw new ServiceError("updateHabit: no row returned");
  }
  return data as HabitRow;
}

export async function deleteHabit(habitId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", habitId)
    .eq("user_id", userId);

  if (error) {
    throw toServiceError("deleteHabit", error);
  }
}

export async function setHabitDayCompletion(
  habitId: string,
  userId: string,
  dateYmd: string,
  completed: boolean,
): Promise<void> {
  if (completed) {
    const { error } = await supabase.from("habit_logs").upsert(
      {
        habit_id: habitId,
        user_id: userId,
        completed_at: dateYmd,
      },
      { onConflict: "habit_id,completed_at" },
    );
    if (error) {
      throw toServiceError("setHabitDayCompletion", error);
    }
    return;
  }

  const { error } = await supabase
    .from("habit_logs")
    .delete()
    .eq("habit_id", habitId)
    .eq("user_id", userId)
    .eq("completed_at", dateYmd);

  if (error) {
    throw toServiceError("setHabitDayCompletion", error);
  }
}

export async function fetchHabitsWithStreaks(
  userId: string,
  todayYmd: string,
): Promise<HabitWithStreak[]> {
  const habits = await fetchHabits(userId);
  if (habits.length === 0) {
    return [];
  }

  const habitIds = habits.map((h) => h.id);
  const { data, error } = await supabase
    .from("habit_logs")
    .select(HABIT_LOG_COLUMNS)
    .eq("user_id", userId)
    .in("habit_id", habitIds);

  if (error) {
    throw toServiceError("fetchHabitsWithStreaks", error);
  }

  const logs = (data as HabitLogRow[]) ?? [];
  const logsByHabit = new Map<string, string[]>();

  for (const log of logs) {
    const list = logsByHabit.get(log.habit_id) ?? [];
    list.push(log.completed_at);
    logsByHabit.set(log.habit_id, list);
  }

  return habits.map((habit) => {
    const datesRaw = logsByHabit.get(habit.id) ?? [];
    const uniqueSortedAsc = [...new Set(datesRaw)].sort((a, b) =>
      a.localeCompare(b),
    );
    const uniqueSortedDesc = [...uniqueSortedAsc].reverse();

    const completedToday = uniqueSortedAsc.includes(todayYmd);
    const currentStreak = currentStreakFromToday(uniqueSortedDesc, todayYmd);
    const longestStreak = longestConsecutiveStreak(uniqueSortedAsc);

    return {
      ...habit,
      currentStreak,
      longestStreak,
      completedToday,
    };
  });
}
