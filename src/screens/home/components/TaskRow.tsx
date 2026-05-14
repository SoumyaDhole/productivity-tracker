import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { darkColors } from "../../../constants/colors";

interface TaskRowProps {
  id: string;
  title: string;
  completed: boolean;
  dueTime: string;
  category: string;
  priority: "high" | "medium" | "low" | "done";
  onToggle?: (id: string) => void;
  showBorder?: boolean;
}

const TaskRow: React.FC<TaskRowProps> = ({
  id,
  title,
  completed,
  dueTime,
  category,
  priority,
  onToggle,
  showBorder = true,
}) => {
  const getPriorityStyle = (p: string): { bg: string; text: string } => {
    switch (p) {
      case "high":
        return { bg: "#450A0A", text: "#FCA5A5" };
      case "medium":
        return { bg: "#451A03", text: "#FCD34D" };
      case "low":
        return { bg: "#1A3A20", text: "#86EFAC" };
      case "done":
        return { bg: "#14532D", text: "#86EFAC" };
      default:
        return { bg: "#1E1E2A", text: "#A78BFA" };
    }
  };

  const priorityStyle = getPriorityStyle(priority);
  const priorityLabel =
    priority === "done"
      ? "DONE"
      : priority === "high"
        ? "HIGH"
        : priority === "medium"
          ? "MED"
          : "LOW";

  return (
    <View style={[styles.container, showBorder && styles.withBorder]}>
      <TouchableOpacity style={styles.checkbox} onPress={() => onToggle?.(id)}>
        {completed ? (
          <View style={styles.checkboxChecked}>
            <Ionicons
              name="checkmark"
              size={14}
              color={darkColors.textPrimary}
            />
          </View>
        ) : (
          <View style={styles.checkboxEmpty} />
        )}
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[styles.title, completed && styles.titleCompleted]}>
          {title}
        </Text>
        <Text style={styles.subtitle}>
          Due {dueTime} · {category}
        </Text>
      </View>

      <View
        style={[styles.priorityPill, { backgroundColor: priorityStyle.bg }]}
      >
        <Text style={[styles.priorityText, { color: priorityStyle.text }]}>
          {priorityLabel}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
  },
  withBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: darkColors.border,
  },
  checkbox: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: darkColors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxEmpty: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: darkColors.primary,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    color: darkColors.textPrimary,
    fontWeight: "500",
  },
  titleCompleted: {
    textDecorationLine: "line-through",
    color: "#444",
  },
  subtitle: {
    fontSize: 10,
    color: darkColors.textSecondary,
    marginTop: 2,
  },
  priorityPill: {
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "600",
  },
});

export default TaskRow;
