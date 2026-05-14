import type { StreakRow, StreakUpdate, TaskPriority } from "@/src/types/database";
import {
  levelFromTotalXp,
  TASK_XP_BY_PRIORITY,
} from "@/src/constants/xp";
import { addDaysYmd } from "@/src/utils/dateYmd";
import { fetchProfile, updateProfile } from "./profileService";
import { fetchStreak, updateStreak } from "./streakService";

/** In-session dedupe: one reward application per user/task/calendar day. */
const completionRewardIssued = new Set<string>();

function rewardDedupeKey(
  userId: string,
  taskId: string,
  activityYmd: string,
): string {
  return `${userId}|${taskId}|${activityYmd}`;
}

function computeStreakUpdate(
  prev: StreakRow | null,
  activityYmd: string,
): StreakUpdate | null {
  if (!prev) {
    return null;
  }
  const last = prev.last_active_date;
  if (last === activityYmd) {
    return null;
  }
  const yesterday = addDaysYmd(activityYmd, -1);
  let nextCurrent = 1;
  if (last === yesterday) {
    nextCurrent = prev.current_streak + 1;
  } else if (last == null || last === "") {
    nextCurrent = 1;
  } else {
    nextCurrent = 1;
  }
  const nextLongest = Math.max(prev.longest_streak, nextCurrent);
  return {
    current_streak: nextCurrent,
    longest_streak: nextLongest,
    last_active_date: activityYmd,
  };
}

/**
 * Side effects when a task transitions to completed: XP + level on profile,
 * optional streak row update. Safe to call after `tasks.completed` is persisted.
 * Idempotent per user/task/local day for this app session (see `completionRewardIssued`).
 */
export async function applyTaskCompletionRewards(
  userId: string,
  taskId: string,
  priority: TaskPriority,
  activityYmd: string,
): Promise<void> {
  const dedupeKey = rewardDedupeKey(userId, taskId, activityYmd);
  if (completionRewardIssued.has(dedupeKey)) {
    return;
  }
  completionRewardIssued.add(dedupeKey);
  try {
    const profile = await fetchProfile(userId);
    const delta = TASK_XP_BY_PRIORITY[priority];
    const newXp = profile.xp + delta;
    const newLevel = levelFromTotalXp(newXp);
    await updateProfile(userId, {
      xp: newXp,
      level: newLevel,
    });

    const streak = await fetchStreak(userId);
    const streakPatch = computeStreakUpdate(streak, activityYmd);
    if (streak && streakPatch) {
      await updateStreak(userId, streakPatch);
    }
  } catch (err) {
    completionRewardIssued.delete(dedupeKey);
    throw err;
  }
}
