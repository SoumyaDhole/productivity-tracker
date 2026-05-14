import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { darkColors } from "../../../constants/colors";

interface HabitRowProps {
  id: string;
  emoji: string;
  name: string;
  completed: boolean;
  onToggle?: (id: string) => void;
}

const HabitRow: React.FC<HabitRowProps> = ({
  id,
  emoji,
  name,
  completed,
  onToggle,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.emojiBox}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
        <Text style={styles.name}>{name}</Text>
      </View>

      <TouchableOpacity
        style={styles.checkCircle}
        onPress={() => onToggle?.(id)}
      >
        {completed ? (
          <View style={styles.checkCircleActive}>
            <Ionicons
              name="checkmark"
              size={13}
              color={darkColors.textPrimary}
              weight="bold"
            />
          </View>
        ) : (
          <View style={styles.checkCircleEmpty} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  emojiBox: {
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
  name: {
    fontSize: 12,
    color: darkColors.textPrimary,
    fontWeight: "500",
  },
  checkCircle: {
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  checkCircleActive: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: darkColors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  checkCircleEmpty: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: darkColors.primary,
  },
});

export default HabitRow;
