import React from "react";
import { StyleSheet, Text, View } from "react-native";

const badges = [
  { emoji: "🔥", label: "First Streak", earned: true },
  { emoji: "⚡", label: "7 Day Legend", earned: true },
  { emoji: "✅", label: "100 Tasks", earned: true },
  { emoji: "🏆", label: "21 Day Beast", earned: true },
  { emoji: "🌙", label: "Night Owl", earned: false },
  { emoji: "🚀", label: "Streak Master", earned: false },
  { emoji: "💎", label: "XP Champion", earned: false },
  { emoji: "🎯", label: "Goal Crusher", earned: false },
  { emoji: "👑", label: "Productivity King", earned: false },
];

const BadgesGrid: React.FC = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Badges Earned</Text>
      <View style={styles.grid}>
        {badges.map((badge, index) => (
          <View key={index} style={styles.badgeCard}>
            <Text style={[styles.emoji, !badge.earned && styles.lockedEmoji]}>
              {badge.emoji}
            </Text>
            <Text style={badge.earned ? styles.badgeLabel : styles.lockedLabel}>
              {badge.earned ? badge.label : "Locked"}
            </Text>
          </View>
        ))}
      </View>
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
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  badgeCard: {
    width: "30%",
    backgroundColor: "#0E0E1A",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  emoji: {
    fontSize: 28,
  },
  lockedEmoji: {
    opacity: 0.25,
  },
  badgeLabel: {
    fontSize: 10,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 6,
  },
  lockedLabel: {
    fontSize: 9,
    color: "#444444",
    textAlign: "center",
    marginTop: 6,
  },
});

export default BadgesGrid;
