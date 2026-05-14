import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Task {
  id: string;
  title: string;
  subtitle: string;
  priority: "High" | "Med" | "Low" | "Done";
  completed: boolean;
}

interface TaskRowProps {
  task: Task;
  isLast?: boolean;
}

const TaskRow: React.FC<TaskRowProps> = ({ task, isLast = false }) => {
  const priorityStyles = {
    High: { backgroundColor: "#450A0A", color: "#FCA5A5" },
    Med: { backgroundColor: "#451A03", color: "#FCD34D" },
    Low: { backgroundColor: "#1A3A20", color: "#86EFAC" },
    Done: { backgroundColor: "#14532D", color: "#86EFAC" },
  };

  return (
    <View style={[styles.row, !isLast && styles.border]}>
      <TouchableOpacity style={styles.checkbox}>
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
      <View
        style={[
          styles.priorityPill,
          { backgroundColor: priorityStyles[task.priority].backgroundColor },
        ]}
      >
        <Text
          style={[
            styles.priorityText,
            { color: priorityStyles[task.priority].color },
          ]}
        >
          {task.priority}
        </Text>
      </View>
    </View>
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
export type { Task };
