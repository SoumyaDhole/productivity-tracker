import type { GoalRow, TaskWithGoal } from "@/src/types/database";
import type { Task } from "../components/TaskRow";

export type TaskListFilter = "Today" | "This Week" | "All" | "Done";

export function filterTasksForList(
  tasks: TaskWithGoal[],
  filter: TaskListFilter,
  todayYmd: string,
  weekMonYmd: string,
  weekSunYmd: string,
): TaskWithGoal[] {
  switch (filter) {
    case "Today":
      return tasks.filter((t) => t.date === todayYmd);
    case "This Week":
      return tasks.filter(
        (t) => t.date >= weekMonYmd && t.date <= weekSunYmd,
      );
    case "Done":
      return tasks.filter((t) => t.completed);
    case "All":
    default:
      return [...tasks];
  }
}

export function mapTaskWithGoalToRow(task: TaskWithGoal): Task {
  const due = task.due_time?.trim();
  const subtitle = due && due.length > 0 ? `Due ${due}` : "Due anytime";
  const priority: Task["priority"] = task.completed
    ? "Done"
    : task.priority;

  return {
    id: task.id,
    title: task.title,
    subtitle,
    priority,
    completed: task.completed,
  };
}

export interface GoalSectionView {
  goalId: string;
  goalName: string;
  dotColor: string;
  progress: string;
  tasks: Task[];
}

const FALLBACK_DOT = "#555555";

export function buildGoalSections(
  goals: GoalRow[],
  filteredTasks: TaskWithGoal[],
): GoalSectionView[] {
  const byGoal = new Map<string | null, TaskWithGoal[]>();
  for (const t of filteredTasks) {
    const key = t.goal_id;
    const list = byGoal.get(key) ?? [];
    list.push(t);
    byGoal.set(key, list);
  }

  const sections: GoalSectionView[] = [];

  for (const g of goals) {
    const list = byGoal.get(g.id) ?? [];
    if (list.length === 0) {
      continue;
    }
    const done = list.filter((t) => t.completed).length;
    sections.push({
      goalId: g.id,
      goalName: g.title,
      dotColor: g.color,
      progress: `${done}/${list.length} done`,
      tasks: list.map(mapTaskWithGoalToRow),
    });
  }

  const ungrouped = byGoal.get(null) ?? [];
  if (ungrouped.length > 0) {
    const done = ungrouped.filter((t) => t.completed).length;
    sections.push({
      goalId: "__ungrouped__",
      goalName: "General",
      dotColor: FALLBACK_DOT,
      progress: `${done}/${ungrouped.length} done`,
      tasks: ungrouped.map(mapTaskWithGoalToRow),
    });
  }

  return sections;
}
