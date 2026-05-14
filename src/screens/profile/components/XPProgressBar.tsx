import React from "react";
import { StyleSheet, Text, View } from "react-native";

const XPProgressBar: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.levelLabel}>Level 7</Text>
        <Text style={styles.levelLabel}>Level 8</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>
      <Text style={styles.progressText}>1,240 / 1,500 XP to next level</Text>
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
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  levelLabel: {
    fontSize: 12,
    color: "#555555",
  },
  progressTrack: {
    height: 8,
    borderRadius: 99,
    backgroundColor: "#1E1E2A",
    marginVertical: 8,
    overflow: "hidden",
  },
  progressFill: {
    width: "82%",
    height: "100%",
    borderRadius: 99,
    backgroundColor: "#7C3AED",
  },
  progressText: {
    fontSize: 11,
    color: "#555555",
    textAlign: "center",
  },
});

export default XPProgressBar;
