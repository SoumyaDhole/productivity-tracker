import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface TaskItemProps {
  title: string;
  description?: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ title, description }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    {description ? <Text style={styles.description}>{description}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  description: {
    color: "#666",
    fontSize: 14,
  },
});

export default TaskItem;
