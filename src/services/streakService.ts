import { supabase } from "@/src/lib/supabase";
import type { StreakRow, StreakUpdate } from "@/src/types/database";
import { ServiceError, toServiceError } from "./errors";

export async function fetchStreak(userId: string): Promise<StreakRow | null> {
  const { data, error } = await supabase
    .from("streaks")
    .select(
      "id, user_id, current_streak, longest_streak, last_active_date, updated_at",
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw toServiceError("fetchStreak", error);
  }

  if (!data) {
    return createStreak(userId);
  }

  return data as StreakRow;
}

export async function createStreak(userId: string): Promise<StreakRow> {
  const insertPayload = {
    user_id: userId,
    current_streak: 0,
    longest_streak: 0,
    last_active_date: null,
  };

  const { data, error } = await supabase
    .from("streaks")
    .insert(insertPayload)
    .select(
      "id, user_id, current_streak, longest_streak, last_active_date, updated_at",
    )
    .single();

  if (error) {
    if (error.code === "23505") {
      const { data: existing, error: existingError } = await supabase
        .from("streaks")
        .select(
          "id, user_id, current_streak, longest_streak, last_active_date, updated_at",
        )
        .eq("user_id", userId)
        .single();

      if (existingError) {
        throw toServiceError("createStreak", existingError);
      }
      if (existing) {
        return existing as StreakRow;
      }
    }
    throw toServiceError("createStreak", error);
  }

  if (!data) {
    throw new ServiceError("createStreak: no row returned");
  }

  return data as StreakRow;
}

export async function updateStreak(
  userId: string,
  updates: StreakUpdate,
): Promise<StreakRow> {
  const { data, error } = await supabase
    .from("streaks")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .select(
      "id, user_id, current_streak, longest_streak, last_active_date, updated_at",
    )
    .single();

  if (error) {
    throw toServiceError("updateStreak", error);
  }
  if (!data) {
    throw new ServiceError("updateStreak: no row returned");
  }
  return data as StreakRow;
}
