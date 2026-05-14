import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const SummaryStats: React.FC = () => {
  const stats = [
    {
      icon: "checkmark-circle-outline",
      iconColor: "#10B981",
      value: "24",
      label: "TASKS DONE",
    },
    {
      icon: "flame-outline",
      iconColor: "#F59E0B",
      value: "🔥 12",
      label: "BEST STREAK",
    },
    {
      icon: "star-outline",
      iconColor: "#7C3AED",
      value: "1,240",
      label: "TOTAL XP",
    },
    {
      icon: "trending-up-outline",
      iconColor: "#3B82F6",
      value: "87%",
      label: "CONSISTENCY",
    },
  ];

  return (
    <View style={styles.grid}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.topRow}>
            <Ionicons
              name={stat.icon as any}
              size={20}
              color={stat.iconColor}
            />
            <Text style={styles.value}>{stat.value}</Text>
          </View>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  card: {
    width: "48%",
    backgroundColor: "#111118",
    borderRadius: 16,
    padding: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "monospace",
    color: "#FFFFFF",
  },
  label: {
    fontSize: 11,
    color: "#555555",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});

export default SummaryStats;
