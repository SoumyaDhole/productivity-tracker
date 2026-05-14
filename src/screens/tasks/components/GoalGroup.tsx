import React from "react";
import { StyleSheet, Text, View } from "react-native";
import TaskRow, { type Task } from "./TaskRow";

interface GoalGroupProps {
  goalName: string;
  dotColor: string;
  progress: string;
  tasks: Task[];
  onToggleTask?: (task: Task) => void;
  onLongPressTask?: (task: Task) => void;
  pendingTaskIds?: ReadonlySet<string>;
}

const GoalGroup: React.FC<GoalGroupProps> = ({
  goalName,
  dotColor,
  progress,
  tasks,
  onToggleTask,
  onLongPressTask,
  pendingTaskIds,
}) => {
  return (
    <View style={styles.groupCard}>
      <View style={styles.headerRow}>
        <View style={styles.leftSide}>
          <View style={[styles.dot, { backgroundColor: dotColor }]} />
          <Text style={styles.goalName}>{goalName}</Text>
        </View>
        <Text style={styles.progress}>{progress}</Text>
      </View>
      {tasks.map((task, index) => (
        <TaskRow
          key={task.id}
          task={task}
          isLast={index === tasks.length - 1}
          onToggle={onToggleTask}
          onLongPress={onLongPressTask}
          disabled={pendingTaskIds?.has(task.id) ?? false}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  groupCard: {
    backgroundColor: "#111118",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 4,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  leftSide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  goalName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  progress: {
    fontSize: 11,
    color: "#555555",
  },
});

export default GoalGroup;
