import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HabitCalendar from "./HabitCalendar";

interface HabitCardProps {
  emoji: string;
  name: string;
  streak: number;
  completed: boolean;
  weekData: boolean[];
  longest: number;
}

const HabitCard: React.FC<HabitCardProps> = ({
  emoji,
  name,
  streak,
  completed,
  weekData,
  longest,
}) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.leftSide}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{emoji}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.streakText}>🔥 {streak} day streak</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.completionCircle}>
          {completed ? (
            <View style={styles.completedCircle}>
              <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            </View>
          ) : (
            <View style={styles.pendingCircle} />
          )}
        </TouchableOpacity>
      </View>
      <HabitCalendar
        weekData={weekData}
        days={days}
        currentStreak={streak}
        longestStreak={longest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0E0E1A",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSide: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  emojiContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#1A1030",
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 14,
  },
  info: {},
  name: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  streakText: {
    fontSize: 11,
    color: "#555555",
    marginTop: 2,
  },
  completionCircle: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  completedCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#7C3AED",
    justifyContent: "center",
    alignItems: "center",
  },
  pendingCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: "#7C3AED",
  },
});

export default HabitCard;
