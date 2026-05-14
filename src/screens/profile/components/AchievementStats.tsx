import React from "react";
import { StyleSheet, Text, View } from "react-native";

const AchievementStats: React.FC = () => {
  const stats = [
    { value: "124", label: "TASKS" },
    { value: "🔥 21", label: "BEST STREAK" },
    { value: "89", label: "HABITS" },
  ];

  return (
    <View style={styles.row}>
      {stats.map((stat, index) => (
        <View
          key={index}
          style={[styles.card, index < stats.length - 1 && styles.cardMargin]}
        >
          <Text style={styles.value}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  card: {
    flex: 1,
    backgroundColor: "#111118",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  cardMargin: {
    marginRight: 8,
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "monospace",
  },
  label: {
    fontSize: 9,
    color: "#555555",
    textTransform: "uppercase",
    marginTop: 4,
    letterSpacing: 1,
  },
});

export default AchievementStats;
