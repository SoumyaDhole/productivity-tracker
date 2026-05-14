import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { darkColors } from "../../../constants/colors";
import HabitRow from "./HabitRow";

interface Habit {
  id: string;
  emoji: string;
  name: string;
  completed: boolean;
}

interface HabitsCardProps {
  habits?: Habit[];
  onHabitToggle?: (id: string) => void;
}

const defaultHabits: Habit[] = [
  {
    id: "1",
    emoji: "📚",
    name: "Study DSA",
    completed: true,
  },
  {
    id: "2",
    emoji: "💻",
    name: "Build App",
    completed: false,
  },
  {
    id: "3",
    emoji: "🏋️",
    name: "Workout",
    completed: false,
  },
];

const HabitsCard: React.FC<HabitsCardProps> = ({
  habits = defaultHabits,
  onHabitToggle,
}) => {
  const [localHabits, setLocalHabits] = useState(habits);

  useEffect(() => {
    setLocalHabits(habits);
  }, [habits]);

  const handleToggle = (id: string) => {
    setLocalHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit,
      ),
    );
    onHabitToggle?.(id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>HABIT CHECK — TODAY</Text>

      {localHabits.map((habit) => (
        <HabitRow key={habit.id} {...habit} onToggle={handleToggle} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkColors.streakCard,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  header: {
    fontSize: 11,
    textTransform: "uppercase",
    color: "#444",
    letterSpacing: 1,
    fontWeight: "600",
    marginBottom: 4,
  },
});

export default HabitsCard;
