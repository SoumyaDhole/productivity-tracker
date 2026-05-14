import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { darkColors } from "../../../constants/colors";

interface StatChip {
  icon: string;
  iconColor: string;
  value: string;
  label: string;
}

interface StatsRowProps {
  stats?: StatChip[];
}

const defaultStats: StatChip[] = [
  {
    icon: "checkmark",
    iconColor: "#10B981",
    value: "6/8",
    label: "TASKS",
  },
  {
    icon: "flash",
    iconColor: "#F59E0B",
    value: "+240",
    label: "XP TODAY",
  },
  {
    icon: "time",
    iconColor: "#A78BFA",
    value: "1h45",
    label: "FOCUS",
  },
  {
    icon: "flame",
    iconColor: "#EF4444",
    value: "L7",
    label: "LEVEL",
  },
];

const StatsRow: React.FC<StatsRowProps> = ({ stats = defaultStats }) => {
  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.chip}>
          <Ionicons name={stat.icon as any} size={15} color={stat.iconColor} />
          <Text style={styles.value}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  chip: {
    flex: 1,
    backgroundColor: darkColors.surface,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: 16,
    fontFamily: "Menlo",
    fontWeight: "700",
    color: darkColors.textPrimary,
    marginTop: 6,
  },
  label: {
    fontSize: 9,
    textTransform: "uppercase",
    color: darkColors.textSecondary,
    marginTop: 2,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

export default StatsRow;
