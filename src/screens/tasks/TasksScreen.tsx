import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { TaskInsert } from "@/src/types/database";
import { useAuth } from "../../hooks/useAuth";
import { useTaskStore } from "../../store/useTaskStore";
import {
  localTodayYmd,
  mondaySundayOfWeekContaining,
} from "../../utils/dateYmd";
import AddTaskSheet from "./components/AddTaskSheet";
import FilterPills from "./components/FilterPills";
import GoalGroup from "./components/GoalGroup";
import type { Task } from "./components/TaskRow";
import {
  buildGoalSections,
  filterTasksForList,
  type TaskListFilter,
} from "./utils/buildTaskGoalGroups";

const FILTER_OPTIONS: TaskListFilter[] = [
  "Today",
  "This Week",
  "All",
  "Done",
];

const TasksScreen: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const goals = useTaskStore((s) => s.goals);
  const tasks = useTaskStore((s) => s.tasks);
  const loading = useTaskStore((s) => s.loading);
  const error = useTaskStore((s) => s.error);

  const [activeFilter, setActiveFilter] = useState<TaskListFilter>("Today");
  const [refreshing, setRefreshing] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [pendingToggleIds, setPendingToggleIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );

  const hasLoadedRef = useRef(false);
  const lastUserIdRef = useRef<string | undefined>(undefined);

  const todayYmd = localTodayYmd();
  const { mon: weekMon, sun: weekSun } =
    mondaySundayOfWeekContaining(new Date());

  const bootstrapTasks = useCallback(
    async (opts: { silent?: boolean }) => {
      if (!userId) {
        return;
      }
      const silent = opts.silent ?? false;
      if (silent) {
        await useTaskStore
          .getState()
          .refreshTaskData(userId, undefined, { showLoading: false });
      } else {
        await useTaskStore.getState().refreshTaskData(userId);
      }
    },
    [userId],
  );

  useFocusEffect(
    useCallback(() => {
      if (!userId) {
        lastUserIdRef.current = undefined;
        hasLoadedRef.current = false;
        return undefined;
      }
      if (lastUserIdRef.current !== userId) {
        hasLoadedRef.current = false;
        lastUserIdRef.current = userId;
      }
      const silent = hasLoadedRef.current;
      const ac = new AbortController();
      void (async () => {
        await bootstrapTasks({ silent });
        if (!ac.signal.aborted) {
          hasLoadedRef.current = true;
        }
      })();
      return () => {
        ac.abort();
      };
    }, [userId, bootstrapTasks]),
  );

  const filteredTasks = useMemo(
    () =>
      filterTasksForList(tasks, activeFilter, todayYmd, weekMon, weekSun),
    [tasks, activeFilter, todayYmd, weekMon, weekSun],
  );

  const goalSections = useMemo(
    () => buildGoalSections(goals, filteredTasks),
    [goals, filteredTasks],
  );

  const showBlockingLoader =
    Boolean(userId) && loading && tasks.length === 0 && goals.length === 0;
  const showInlineLoader =
    Boolean(userId) && loading && (tasks.length > 0 || goals.length > 0);

  const onRefresh = useCallback(async () => {
    if (!userId) {
      return;
    }
    setRefreshing(true);
    try {
      await bootstrapTasks({ silent: true });
    } finally {
      setRefreshing(false);
    }
  }, [userId, bootstrapTasks]);

  const runToggle = useCallback(
    async (task: Task) => {
      if (!userId) {
        return;
      }
      setPendingToggleIds((prev) => {
        const next = new Set(prev);
        next.add(task.id);
        return next;
      });
      try {
        await useTaskStore
          .getState()
          .toggleTask(task.id, userId, !task.completed);
      } finally {
        setPendingToggleIds((prev) => {
          const next = new Set(prev);
          next.delete(task.id);
          return next;
        });
      }
    },
    [userId],
  );

  const confirmDelete = useCallback(
    (task: Task) => {
      if (!userId) {
        return;
      }
      Alert.alert(
        "Delete task",
        `Remove "${task.title}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              void useTaskStore.getState().removeTask(task.id, userId);
            },
          },
        ],
        { cancelable: true },
      );
    },
    [userId],
  );

  const handleAddSave = useCallback(
    async (insert: TaskInsert) => {
      await useTaskStore.getState().addTask(insert);
    },
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      {showBlockingLoader ? (
        <View style={styles.blockingLoader}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void onRefresh()}
            tintColor="#7C3AED"
            colors={["#7C3AED"]}
          />
        }
      >
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>My Tasks</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="search-outline" size={18} color="#444444" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setAddVisible(true)}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {showInlineLoader ? (
          <View style={styles.inlineLoader}>
            <ActivityIndicator size="small" color="#7C3AED" />
          </View>
        ) : null}

        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <FilterPills
          options={[...FILTER_OPTIONS]}
          active={activeFilter}
          onSelect={(option) => {
            if (
              option === "Today" ||
              option === "This Week" ||
              option === "All" ||
              option === "Done"
            ) {
              setActiveFilter(option);
            }
          }}
        />

        {!userId ? (
          <Text style={styles.emptyTitle}>Sign in to view tasks.</Text>
        ) : null}

        {userId && !loading && !error && goalSections.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No tasks here yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap + to add a task for this view.
            </Text>
          </View>
        ) : null}

        {goalSections.map((group) => (
          <GoalGroup
            key={group.goalId}
            goalName={group.goalName}
            dotColor={group.dotColor}
            progress={group.progress}
            tasks={group.tasks}
            onToggleTask={(t) => void runToggle(t)}
            onLongPressTask={confirmDelete}
            pendingTaskIds={pendingToggleIds}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setAddVisible(true)}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {userId ? (
        <AddTaskSheet
          visible={addVisible}
          onClose={() => setAddVisible(false)}
          userId={userId}
          goals={goals}
          onSave={handleAddSave}
        />
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080808",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerRight: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
  },
  addButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#7C3AED",
    justifyContent: "center",
    alignItems: "center",
  },
  floatingButton: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#7C3AED",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  blockingLoader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(8,8,8,0.55)",
    zIndex: 20,
  },
  inlineLoader: {
    alignItems: "center",
    marginBottom: 8,
  },
  errorBanner: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#2A1515",
    borderWidth: 1,
    borderColor: "#EF4444",
    marginBottom: 12,
  },
  errorText: {
    color: "#FCA5A5",
    fontSize: 13,
    textAlign: "center",
  },
  emptyWrap: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#555555",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 12,
  },
});

export default TasksScreen;
