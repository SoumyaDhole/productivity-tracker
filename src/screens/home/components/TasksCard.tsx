import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { darkColors } from "../../../constants/colors";
import TaskRow from "./TaskRow";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueTime: string;
  category: string;
  priority: "high" | "medium" | "low" | "done";
}

interface TasksCardProps {
  tasks?: Task[];
  onTaskToggle?: (id: string) => void;
  onSeeAll?: () => void;
}

const defaultTasks: Task[] = [
  {
    id: "1",
    title: "Solve 3 LeetCode problems",
    completed: true,
    dueTime: "12pm",
    category: "DSA Prep",
    priority: "done",
  },
  {
    id: "2",
    title: "Build dashboard screen",
    completed: false,
    dueTime: "5pm",
    category: "App Dev",
    priority: "high",
  },
  {
    id: "3",
    title: "Read Zero to One ch.4",
    completed: false,
    dueTime: "8pm",
    category: "Learning",
    priority: "medium",
  },
  {
    id: "4",
    title: "Push code to GitHub",
    completed: false,
    dueTime: "10pm",
    category: "App Dev",
    priority: "low",
  },
];

const TasksCard: React.FC<TasksCardProps> = ({
  tasks = defaultTasks,
  onTaskToggle,
  onSeeAll,
}) => {
  const [localTasks, setLocalTasks] = useState(tasks);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleToggle = (id: string) => {
    setLocalTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              priority: !task.completed ? "done" : task.priority,
            }
          : task,
      ),
    );
    onTaskToggle?.(id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today&apos;s focus</Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAll}>See all →</Text>
        </TouchableOpacity>
      </View>

      {localTasks.map((task, index) => (
        <TaskRow
          key={task.id}
          {...task}
          onToggle={handleToggle}
          showBorder={index < localTasks.length - 1}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkColors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: darkColors.textPrimary,
  },
  seeAll: {
    fontSize: 11,
    color: darkColors.primary,
    fontWeight: "600",
  },
});

export default TasksCard;
