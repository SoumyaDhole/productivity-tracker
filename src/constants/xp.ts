import type { TaskPriority } from "@/src/types/database";

/** XP granted when a task is marked complete (first transition to completed) */
export const TASK_XP_BY_PRIORITY: Record<TaskPriority, number> = {
  High: 30,
  Med: 20,
  Low: 10,
};

/** Linear level curve: level = floor(xp / XP_PER_LEVEL) + 1 */
export const XP_PER_LEVEL = 500;

export function levelFromTotalXp(xp: number): number {
  if (!Number.isFinite(xp) || xp < 0) {
    return 1;
  }
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}
