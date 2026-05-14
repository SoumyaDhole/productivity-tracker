import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { darkColors } from "../../../constants/colors";
import ProgressRing from "./ProgressRing";

interface StreakCardProps {
  currentStreak?: number;
  longestStreak?: number;
  thisWeek?: number;
  progress?: number;
}

const StreakCard: React.FC<StreakCardProps> = ({
  currentStreak = 12,
  longestStreak = 21,
  thisWeek = 5,
  progress = 70,
}) => {
  const daysOfWeek = Array(7)
    .fill(0)
    .map((_, i) => i < thisWeek);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        {/* Left side: Text info */}
        <View style={styles.left}>
          <Text style={styles.label}>CURRENT STREAK</Text>
          <Text style={styles.streakNumber}>{currentStreak}</Text>
          <Text style={styles.daysLabel}>DAYS</Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statLabel}>LONGEST</Text>
              <Text style={styles.statValue}>{longestStreak}</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>THIS WEEK</Text>
              <Text style={styles.statValue}>{thisWeek}/7</Text>
            </View>
          </View>

          {/* Week progress bars */}
          <View style={styles.weekBarsContainer}>
            {daysOfWeek.map((active, i) => (
              <View
                key={i}
                style={[
                  styles.weekBar,
                  {
                    backgroundColor: active ? darkColors.primary : "#1E1A3A",
                  },
                ]}
              />
            ))}
          </View>

          <Text style={styles.helperText}>Don&apos;t break the chain</Text>
        </View>

        {/* Right side: Progress ring */}
        <View style={styles.right}>
          <ProgressRing progress={progress} size={70} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkColors.streakCard,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  left: {
    flex: 1,
  },
  right: {
    marginLeft: 12,
  },
  label: {
    fontSize: 10,
    textTransform: "uppercase",
    color: darkColors.textSecondary,
    letterSpacing: 1,
    fontWeight: "600",
  },
  streakNumber: {
    fontSize: 64,
    fontWeight: "800",
    color: darkColors.textPrimary,
    fontFamily: "Menlo",
  },
  daysLabel: {
    fontSize: 13,
    textTransform: "uppercase",
    fontWeight: "700",
    color: darkColors.primary,
    marginTop: -8,
  },
  statsRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 9,
    textTransform: "uppercase",
    color: darkColors.textSecondary,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 16,
    fontFamily: "Menlo",
    color: "#777",
    fontWeight: "600",
    marginTop: 2,
  },
  weekBarsContainer: {
    flexDirection: "row",
    gap: 4,
    marginTop: 8,
  },
  weekBar: {
    width: 28,
    height: 4,
    borderRadius: 2,
  },
  helperText: {
    fontSize: 9,
    color: "#444",
    marginTop: 8,
  },
});

export default StreakCard;
