import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface GoalItemProps {
  name: string;
  progress: string;
}

const GoalItem: React.FC<GoalItemProps> = ({ name, progress }) => (
  <View style={styles.card}>
    <Text style={styles.name}>{name}</Text>
    <Text style={styles.progress}>{progress}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  progress: {
    color: "#4D8FFC",
    fontSize: 14,
  },
});

export default GoalItem;
