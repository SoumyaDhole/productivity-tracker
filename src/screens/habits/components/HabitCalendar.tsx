import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface HabitCalendarProps {
  weekData: boolean[];
  days: string[];
  currentStreak: number;
  longestStreak: number;
}

const HabitCalendar: React.FC<HabitCalendarProps> = ({
  weekData,
  days,
  currentStreak,
  longestStreak,
}) => {
  const getCircleStyle = (isDone: boolean, isToday: boolean) => {
    if (isToday) {
      return isDone ? styles.done : styles.pending;
    }
    return isDone ? styles.done : styles.missed;
  };

  return (
    <View style={styles.container}>
      {/* Days labels */}
      <View style={styles.daysRow}>
        {days.map((day, index) => (
          <Text key={index} style={styles.dayLabel}>
            {day.toUpperCase()}
          </Text>
        ))}
      </View>
      {/* Circles */}
      <View style={styles.circlesRow}>
        {weekData.map((isDone, index) => (
          <View
            key={index}
            style={[styles.circle, getCircleStyle(isDone, index === 6)]}
          />
        ))}
      </View>
      {/* Streaks */}
      <View style={styles.streaksRow}>
        <View style={styles.streakItem}>
          <Text style={styles.streakLabel}>LONGEST</Text>
          <Text style={[styles.streakValue, styles.longestValue]}>
            {longestStreak}
          </Text>
        </View>
        <View style={styles.streakItem}>
          <Text style={styles.streakLabel}>CURRENT</Text>
          <Text style={[styles.streakValue, styles.currentValue]}>
            {currentStreak}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  dayLabel: {
    fontSize: 8,
    color: "#444444",
    textAlign: "center",
    width: 28,
  },
  circlesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  done: {
    backgroundColor: "#7C3AED",
  },
  pending: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#7C3AED",
  },
  missed: {
    backgroundColor: "#1C1C2E",
    borderWidth: 0.5,
    borderColor: "#2a2a2a",
  },
  streaksRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  streakItem: {
    alignItems: "center",
  },
  streakLabel: {
    fontSize: 9,
    color: "#444444",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  streakValue: {
    fontSize: 14,
    fontFamily: "monospace",
  },
  longestValue: {
    color: "#777777",
  },
  currentValue: {
    color: "#A78BFA",
  },
});

export default HabitCalendar;
