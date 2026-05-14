import { supabase } from "@/src/lib/supabase";
import type {
  GoalInsert,
  GoalRow,
  GoalUpdate,
  TaskInsert,
  TaskPriority,
  TaskRow,
  TaskUpdate,
  TaskWithGoal,
} from "@/src/types/database";
import { ServiceError, toServiceError } from "./errors";

const GOAL_COLUMNS = "id, user_id, title, color, created_at" as const;
const TASK_COLUMNS =
  "id, user_id, goal_id, title, due_time, priority, completed, date, created_at" as const;

export interface ListTasksFilters {
  /** YYYY-MM-DD inclusive */
  dateFrom?: string;
  /** YYYY-MM-DD inclusive */
  dateTo?: string;
  goalId?: string;
  completed?: boolean;
}

export async function fetchGoals(userId: string): Promise<GoalRow[]> {
  const { data, error } = await supabase
    .from("goals")
    .select(GOAL_COLUMNS)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    throw toServiceError("fetchGoals", error);
  }
  return (data as GoalRow[]) ?? [];
}

export async function createGoal(insert: GoalInsert): Promise<GoalRow> {
  const { data, error } = await supabase
    .from("goals")
    .insert(insert)
    .select(GOAL_COLUMNS)
    .single();

  if (error) {
    throw toServiceError("createGoal", error);
  }
  if (!data) {
    throw new ServiceError("createGoal: no row returned");
  }
  return data as GoalRow;
}

export async function updateGoal(
  goalId: string,
  userId: string,
  updates: GoalUpdate,
): Promise<GoalRow> {
  const { data, error } = await supabase
    .from("goals")
    .update(updates)
    .eq("id", goalId)
    .eq("user_id", userId)
    .select(GOAL_COLUMNS)
    .single();

  if (error) {
    throw toServiceError("updateGoal", error);
  }
  if (!data) {
    throw new ServiceError("updateGoal: no row returned");
  }
  return data as GoalRow;
}

export async function deleteGoal(goalId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", goalId)
    .eq("user_id", userId);

  if (error) {
    throw toServiceError("deleteGoal", error);
  }
}

export async function fetchTasks(
  userId: string,
  filters: ListTasksFilters = {},
): Promise<TaskRow[]> {
  let query = supabase
    .from("tasks")
    .select(TASK_COLUMNS)
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters.dateFrom) {
    query = query.gte("date", filters.dateFrom);
  }
  if (filters.dateTo) {
    query = query.lte("date", filters.dateTo);
  }
  if (filters.goalId) {
    query = query.eq("goal_id", filters.goalId);
  }
  if (filters.completed !== undefined) {
    query = query.eq("completed", filters.completed);
  }

  const { data, error } = await query;

  if (error) {
    throw toServiceError("fetchTasks", error);
  }
  return (data as TaskRow[]) ?? [];
}

function normalizeEmbeddedGoal(
  raw: unknown,
): Pick<GoalRow, "id" | "title" | "color"> | null {
  if (raw == null) {
    return null;
  }
  const candidate = Array.isArray(raw) ? raw[0] : raw;
  if (
    candidate &&
    typeof candidate === "object" &&
    "id" in candidate &&
    "title" in candidate &&
    "color" in candidate
  ) {
    const g = candidate as { id: string; title: string; color: string };
    return { id: g.id, title: g.title, color: g.color };
  }
  return null;
}

type RawTaskGoalRow = TaskRow & { goal: unknown };

export async function fetchTasksWithGoals(
  userId: string,
  filters: ListTasksFilters = {},
): Promise<TaskWithGoal[]> {
  let query = supabase
    .from("tasks")
    .select(
      `${TASK_COLUMNS}, goal:goals ( id, title, color )`,
    )
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters.dateFrom) {
    query = query.gte("date", filters.dateFrom);
  }
  if (filters.dateTo) {
    query = query.lte("date", filters.dateTo);
  }
  if (filters.goalId) {
    query = query.eq("goal_id", filters.goalId);
  }
  if (filters.completed !== undefined) {
    query = query.eq("completed", filters.completed);
  }

  const { data, error } = await query;

  if (error) {
    throw toServiceError("fetchTasksWithGoals", error);
  }

  const rows = (data ?? []) as unknown as RawTaskGoalRow[];
  return rows.map((row) => {
    const { goal: rawGoal, ...task } = row;
    return {
      ...task,
      goal: normalizeEmbeddedGoal(rawGoal),
    };
  });
}

export async function createTask(insert: TaskInsert): Promise<TaskRow> {
  const priority: TaskPriority = insert.priority ?? "Med";
  const payload = {
    user_id: insert.user_id,
    title: insert.title,
    goal_id: insert.goal_id ?? null,
    due_time: insert.due_time ?? null,
    priority,
    completed: insert.completed ?? false,
    date: insert.date ?? new Date().toISOString().slice(0, 10),
  };

  const { data, error } = await supabase
    .from("tasks")
    .insert(payload)
    .select(TASK_COLUMNS)
    .single();

  if (error) {
    throw toServiceError("createTask", error);
  }
  if (!data) {
    throw new ServiceError("createTask: no row returned");
  }
  return data as TaskRow;
}

export async function updateTask(
  taskId: string,
  userId: string,
  updates: TaskUpdate,
): Promise<TaskRow> {
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", taskId)
    .eq("user_id", userId)
    .select(TASK_COLUMNS)
    .single();

  if (error) {
    throw toServiceError("updateTask", error);
  }
  if (!data) {
    throw new ServiceError("updateTask: no row returned");
  }
  return data as TaskRow;
}

export async function deleteTask(taskId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("user_id", userId);

  if (error) {
    throw toServiceError("deleteTask", error);
  }
}

export async function setTaskCompleted(
  taskId: string,
  userId: string,
  completed: boolean,
): Promise<TaskRow> {
  return updateTask(taskId, userId, { completed });
}
