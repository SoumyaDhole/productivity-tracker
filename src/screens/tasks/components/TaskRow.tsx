import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface Task {
  id: string;
  title: string;
  subtitle: string;
  priority: "High" | "Med" | "Low" | "Done";
  completed: boolean;
}

interface TaskRowProps {
  task: Task;
  isLast?: boolean;
  onToggle?: (task: Task) => void;
  onLongPress?: (task: Task) => void;
  disabled?: boolean;
}

const priorityStyles: Record<
  Task["priority"],
  { backgroundColor: string; color: string }
> = {
  High: { backgroundColor: "#450A0A", color: "#FCA5A5" },
  Med: { backgroundColor: "#451A03", color: "#FCD34D" },
  Low: { backgroundColor: "#1A3A20", color: "#86EFAC" },
  Done: { backgroundColor: "#14532D", color: "#86EFAC" },
};

const TaskRow: React.FC<TaskRowProps> = ({
  task,
  isLast = false,
  onToggle,
  onLongPress,
  disabled = false,
}) => {
  const ps = priorityStyles[task.priority];

  return (
    <Pressable
      style={[styles.row, !isLast && styles.border]}
      onLongPress={() => {
        if (!disabled) {
          onLongPress?.(task);
        }
      }}
      delayLongPress={380}
    >
      <TouchableOpacity
        style={[styles.checkbox, disabled && styles.dimmed]}
        onPress={() => {
          if (!disabled) {
            onToggle?.(task);
          }
        }}
        disabled={disabled}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.completed, disabled }}
      >
        {task.completed ? (
          <View style={styles.checkedBox}>
            <Ionicons name="checkmark" size={10} color="#FFFFFF" />
          </View>
        ) : (
          <View style={styles.uncheckedBox} />
        )}
      </TouchableOpacity>
      <View style={styles.center}>
        <Text style={[styles.title, task.completed && styles.completedTitle]}>
          {task.title}
        </Text>
        <Text style={styles.subtitle}>{task.subtitle}</Text>
      </View>
      <View style={[styles.priorityPill, { backgroundColor: ps.backgroundColor }]}>
        <Text style={[styles.priorityText, { color: ps.color }]}>
          {task.priority}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
  },
  border: {
    borderBottomWidth: 0.5,
    borderColor: "#1E1E2A",
  },
  dimmed: {
    opacity: 0.45,
  },
  checkbox: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  checkedBox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#7C3AED",
    justifyContent: "center",
    alignItems: "center",
  },
  uncheckedBox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#7C3AED",
  },
  center: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    color: "#FFFFFF",
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: "#444444",
  },
  subtitle: {
    fontSize: 10,
    color: "#555555",
    marginTop: 1,
  },
  priorityPill: {
    borderRadius: 99,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "600",
  },
});

export default TaskRow;
