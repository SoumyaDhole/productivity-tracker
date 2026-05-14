import React from "react";
import { StyleSheet, Text, View } from "react-native";

const HabitConsistency: React.FC = () => {
  const habits = [
    { name: "Study DSA", percentage: 85, color: "#7C3AED" },
    { name: "Build App", percentage: 70, color: "#3B82F6" },
    { name: "Workout", percentage: 60, color: "#10B981" },
    { name: "Meditation", percentage: 90, color: "#F59E0B" },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Habit Completion</Text>
      <Text style={styles.subtitle}>This week</Text>
      {habits.map((habit, index) => (
        <View key={index} style={styles.habitRow}>
          <Text style={styles.habitName}>{habit.name}</Text>
          <Text style={[styles.percentage, { color: habit.color }]}>
            {habit.percentage}%
          </Text>
          <View style={styles.barContainer}>
            <View style={styles.barTrack} />
            <View
              style={[
                styles.barFill,
                { width: `${habit.percentage}%`, backgroundColor: habit.color },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111118",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 11,
    color: "#555555",
    marginTop: 4,
  },
  habitRow: {
    marginTop: 12,
  },
  habitName: {
    fontSize: 12,
    color: "#FFFFFF",
    marginBottom: 6,
  },
  percentage: {
    fontSize: 12,
    fontWeight: "bold",
    position: "absolute",
    right: 0,
    top: 0,
  },
  barContainer: {
    position: "relative",
    height: 6,
    marginVertical: 6,
  },
  barTrack: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 6,
    borderRadius: 99,
    backgroundColor: "#1E1E2A",
  },
  barFill: {
    position: "absolute",
    left: 0,
    height: 6,
    borderRadius: 99,
  },
});

export default HabitConsistency;
