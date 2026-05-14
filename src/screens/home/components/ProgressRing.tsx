import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { darkColors } from "../../../constants/colors";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress = 70,
  size = 70,
}) => {
  const rotation = (progress / 100) * 360;

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      {/* Background circle indicator */}
      <View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 3,
            borderColor: darkColors.border,
          },
        ]}
      />

      {/* Progress overlay */}
      <View
        style={[
          styles.progressRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 3,
            borderColor: darkColors.primary,
            borderRightColor: "transparent",
            borderBottomColor: "transparent",
            transform: [{ rotate: `${rotation}deg` }],
          },
        ]}
      />

      {/* Center text */}
      <View style={styles.centerText}>
        <Text style={styles.progressText}>{progress}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  ring: {
    position: "absolute",
  },
  progressRing: {
    position: "absolute",
  },
  centerText: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    fontSize: 13,
    fontFamily: "Menlo",
    color: darkColors.primaryLight,
    fontWeight: "600",
  },
});

export default ProgressRing;
