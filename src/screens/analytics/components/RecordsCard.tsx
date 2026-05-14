import React from "react";
import { StyleSheet, Text, View } from "react-native";

const RecordsCard: React.FC = () => {
  const records = [
    { label: "Best streak ever", value: "21 days 🔥" },
    { label: "Most tasks in a day", value: "8 tasks" },
    { label: "Most productive day", value: "Tuesday" },
    { label: "Total habits completed", value: "89" },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Personal Records 🏆</Text>
      {records.map((record, index) => (
        <View key={index}>
          <View style={styles.recordRow}>
            <Text style={styles.label}>{record.label}</Text>
            <Text style={styles.value}>{record.value}</Text>
          </View>
          {index < records.length - 1 && <View style={styles.separator} />}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0E0E1A",
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
  recordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  label: {
    fontSize: 12,
    color: "#555555",
  },
  value: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  separator: {
    height: 0.5,
    backgroundColor: "#1E1E2A",
  },
});

export default RecordsCard;
