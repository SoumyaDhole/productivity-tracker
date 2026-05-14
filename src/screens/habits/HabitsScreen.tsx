import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CompletionRing from "./components/CompletionRing";
import HabitCard from "./components/HabitCard";

const HabitsScreen: React.FC = () => {
  const habits = [
    {
      emoji: "📚",
      name: "Study DSA",
      streak: 12,
      completed: true,
      weekData: [true, true, true, true, true, false, false],
      longest: 21,
    },
    {
      emoji: "💻",
      name: "Build App",
      streak: 7,
      completed: false,
      weekData: [true, true, true, true, false, false, false],
      longest: 14,
    },
    {
      emoji: "💪",
      name: "Workout",
      streak: 5,
      completed: false,
      weekData: [true, true, true, false, false, false, false],
      longest: 10,
    },
    {
      emoji: "🧘",
      name: "Meditation",
      streak: 3,
      completed: true,
      weekData: [true, true, false, false, false, false, false],
      longest: 7,
    },
  ];

  const completedCount = habits.filter((h) => h.completed).length;
  const totalHabits = habits.length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Row */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>My Habits</Text>
          <TouchableOpacity>
            <Text style={styles.newHabitText}>+ New Habit</Text>
          </TouchableOpacity>
        </View>

        {/* Completion Ring */}
        <CompletionRing done={completedCount} total={totalHabits} />

        {/* Habit Cards */}
        {habits.map((habit, index) => (
          <HabitCard
            key={index}
            emoji={habit.emoji}
            name={habit.name}
            streak={habit.streak}
            completed={habit.completed}
            weekData={habit.weekData}
            longest={habit.longest}
          />
        ))}

        {/* Drag to Complete Hint */}
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>↑ tap circle to mark complete</Text>
        </View>
      </ScrollView>
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
  newHabitText: {
    fontSize: 13,
    color: "#7C3AED",
    fontWeight: "600",
  },
  hintContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
  },
  hintText: {
    fontSize: 11,
    color: "#333333",
    textAlign: "center",
  },
});

export default HabitsScreen;
