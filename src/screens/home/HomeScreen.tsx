import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { darkColors } from "../../constants/colors";
import { useAuth } from "../../hooks/useAuth";
import { fetchDayActivities } from "../../services/analyticsService";
import { useHabitStore } from "../../store/useHabitStore";
import { useProfileStore } from "../../store/useProfileStore";
import { useStreakStore } from "../../store/useStreakStore";
import { useTaskStore } from "../../store/useTaskStore";
import type {
  DayActivity,
  HabitWithStreak,
  TaskPriority,
  TaskWithGoal,
} from "../../types/database";
import HabitsCard from "./components/HabitsCard";
import HomeHeader from "./components/HomeHeader";
import QuoteCard from "./components/QuoteCard";
import StatsRow from "./components/StatsRow";
import StreakCard from "./components/StreakCard";
import TasksCard from "./components/TasksCard";
import {
  localTodayYmd,
  mondaySundayOfWeekContaining,
} from "../../utils/dateYmd";

function mapDbPriorityToRow(
  priority: TaskPriority,
  completed: boolean,
): "high" | "medium" | "low" | "done" {
  if (completed) {
    return "done";
  }
  if (priority === "High") {
    return "high";
  }
  if (priority === "Low") {
    return "low";
  }
  return "medium";
}

function formatDueTime(due: string | null): string {
  if (due == null || due.trim() === "") {
    return "Anytime";
  }
  return due;
}

interface HomeTaskRow {
  id: string;
  title: string;
  completed: boolean;
  dueTime: string;
  category: string;
  priority: "high" | "medium" | "low" | "done";
}

function mapTaskToHomeRow(task: TaskWithGoal): HomeTaskRow {
  return {
    id: task.id,
    title: task.title,
    completed: task.completed,
    dueTime: formatDueTime(task.due_time),
    category: task.goal?.title ?? "General",
    priority: mapDbPriorityToRow(task.priority, task.completed),
  };
}

interface HomeHabitRow {
  id: string;
  emoji: string;
  name: string;
  completed: boolean;
}

function mapHabitToHomeRow(habit: HabitWithStreak): HomeHabitRow {
  return {
    id: habit.id,
    emoji: habit.emoji,
    name: habit.name,
    completed: habit.completedToday,
  };
}

const HomeScreen = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const profile = useProfileStore((s) => s.profile);
  const streak = useStreakStore((s) => s.streak);
  const tasks = useTaskStore((s) => s.tasks);
  const habits = useHabitStore((s) => s.habits);

  const [weekActivities, setWeekActivities] = useState<DayActivity[]>([]);
  const [initialBusy, setInitialBusy] = useState(Boolean(userId));
  const [refreshing, setRefreshing] = useState(false);
  const [aggregateError, setAggregateError] = useState<string | null>(null);

  const hasLoadedOnceRef = useRef(false);
  const loadGenerationRef = useRef(0);
  const lastUserIdRef = useRef<string | undefined>(undefined);

  const loadAll = useCallback(
    async (opts: {
      signal?: AbortSignal;
      isRefresh?: boolean;
      silent?: boolean;
    }) => {
      if (!userId) {
        return;
      }
      const gen = ++loadGenerationRef.current;
      const silent = opts.silent ?? false;

      if (opts.isRefresh) {
        setRefreshing(true);
      } else if (!silent && !hasLoadedOnceRef.current) {
        setInitialBusy(true);
      }

      const todayYmd = localTodayYmd();
      const { mon, sun } = mondaySundayOfWeekContaining(new Date());

      try {
        await Promise.all([
          useProfileStore.getState().loadProfile(userId),
          useStreakStore.getState().loadStreak(userId),
          useTaskStore.getState().refreshTaskData(userId),
          useHabitStore.getState().loadHabits(userId, todayYmd),
        ]);

        if (opts.signal?.aborted || gen !== loadGenerationRef.current) {
          return;
        }

        let weekActs: DayActivity[] = [];
        try {
          weekActs = await fetchDayActivities(userId, mon, sun);
        } catch {
          weekActs = [];
        }

        if (opts.signal?.aborted || gen !== loadGenerationRef.current) {
          return;
        }

        setWeekActivities(weekActs);

        const errs = [
          useProfileStore.getState().error,
          useStreakStore.getState().error,
          useTaskStore.getState().error,
          useHabitStore.getState().error,
        ].filter((x): x is string => Boolean(x));
        setAggregateError(errs[0] ?? null);
      } finally {
        if (gen === loadGenerationRef.current && !opts.signal?.aborted) {
          hasLoadedOnceRef.current = true;
          setInitialBusy(false);
          setRefreshing(false);
        }
      }
    },
    [userId],
  );

  useFocusEffect(
    useCallback(() => {
      if (!userId) {
        lastUserIdRef.current = undefined;
        hasLoadedOnceRef.current = false;
        setInitialBusy(false);
        setWeekActivities([]);
        setAggregateError(null);
        return undefined;
      }
      if (lastUserIdRef.current !== userId) {
        hasLoadedOnceRef.current = false;
        lastUserIdRef.current = userId;
      }
      const silent = hasLoadedOnceRef.current;
      const ac = new AbortController();
      void loadAll({ signal: ac.signal, silent });
      return () => {
        ac.abort();
      };
    }, [userId, loadAll]),
  );

  const displayName = useMemo(() => {
    const fromProfile =
      profile?.full_name?.trim() || profile?.username?.trim() || "";
    if (fromProfile) {
      return fromProfile;
    }
    const fromEmail = user?.email?.split("@")[0];
    return fromEmail ?? "there";
  }, [profile?.full_name, profile?.username, user?.email]);

  const homeTasks = useMemo((): HomeTaskRow[] => {
    const today = localTodayYmd();
    return tasks
      .filter((t) => t.date === today)
      .map(mapTaskToHomeRow);
  }, [tasks]);

  const homeHabits = useMemo((): HomeHabitRow[] => {
    return habits.map(mapHabitToHomeRow);
  }, [habits]);

  const weekActiveCount = useMemo(
    () => weekActivities.filter((d) => d.hasActivity).length,
    [weekActivities],
  );

  const streakRingProgress = useMemo(
    () => Math.min(100, Math.round((weekActiveCount / 7) * 100)),
    [weekActiveCount],
  );

  const statsChips = useMemo(() => {
    const today = localTodayYmd();
    const todayTasks = tasks.filter((t) => t.date === today);
    const totalToday = todayTasks.length;
    const doneToday = todayTasks.filter((t) => t.completed).length;
    const levelVal = profile?.level ?? 1;
    const xpVal = profile?.xp ?? 0;
    const xpDisplay = xpVal.toLocaleString("en-US");

    const tasksLabel =
      totalToday === 0 ? "0/0" : `${doneToday}/${totalToday}`;

    return [
      {
        icon: "checkmark",
        iconColor: "#10B981",
        value: tasksLabel,
        label: "TASKS",
      },
      {
        icon: "flash",
        iconColor: "#F59E0B",
        value: xpDisplay,
        label: "XP TODAY",
      },
      {
        icon: "time",
        iconColor: "#A78BFA",
        value: "1h45",
        label: "FOCUS",
      },
      {
        icon: "flame",
        iconColor: "#EF4444",
        value: `L${levelVal}`,
        label: "LEVEL",
      },
    ];
  }, [tasks, profile?.level, profile?.xp]);

  const handleTaskToggle = useCallback(
    (taskId: string) => {
      if (!userId) {
        return;
      }
      const row = useTaskStore.getState().tasks.find((t) => t.id === taskId);
      if (!row) {
        return;
      }
      void useTaskStore.getState().toggleTask(taskId, userId, !row.completed);
    },
    [userId],
  );

  const handleHabitToggle = useCallback(
    (habitId: string) => {
      if (!userId) {
        return;
      }
      const todayYmd = localTodayYmd();
      const row = useHabitStore.getState().habits.find((h) => h.id === habitId);
      if (!row) {
        return;
      }
      void useHabitStore
        .getState()
        .setCompletionForDay(habitId, userId, todayYmd, !row.completedToday);
    },
    [userId],
  );

  const onRefresh = useCallback(() => {
    void loadAll({ isRefresh: true, silent: true });
  }, [loadAll]);

  const currentStreak = streak?.current_streak ?? 0;
  const longestStreak = streak?.longest_streak ?? 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      {initialBusy && userId ? (
        <View style={styles.loadingOverlay} pointerEvents="box-none">
          <ActivityIndicator size="large" color={darkColors.primary} />
        </View>
      ) : null}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={darkColors.primary}
            colors={[darkColors.primary]}
          />
        }
      >
        {aggregateError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{aggregateError}</Text>
          </View>
        ) : null}

        <HomeHeader name={displayName} />

        <StreakCard
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          thisWeek={weekActiveCount}
          progress={streakRingProgress}
        />

        <StatsRow stats={statsChips} />

        <TasksCard tasks={homeTasks} onTaskToggle={handleTaskToggle} />

        <HabitsCard habits={homeHabits} onHabitToggle={handleHabitToggle} />

        <QuoteCard />

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: darkColors.background,
  },
  scrollView: {
    flex: 1,
    backgroundColor: darkColors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  bottomPadding: {
    height: 40,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(8, 8, 8, 0.65)",
    zIndex: 10,
  },
  errorBanner: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#2A1515",
    borderWidth: 1,
    borderColor: darkColors.danger,
  },
  errorText: {
    color: darkColors.danger,
    fontSize: 13,
    textAlign: "center",
  },
});

export default HomeScreen;
