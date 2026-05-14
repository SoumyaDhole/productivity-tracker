import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";

interface CompletionRingProps {
  done: number;
  total: number;
}

const CompletionRing: React.FC<CompletionRingProps> = ({ done, total }) => {
  const size = 110;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = done / total;
  const dashArray = circumference * progress;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1E1A3A"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#7C3AED"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dashArray} ${circumference - dashArray}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {/* Center text */}
        <SvgText
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dy="8"
          fontSize="26"
          fill="#FFFFFF"
          fontFamily="monospace"
          fontWeight="bold"
        >
          {done}/{total}
        </SvgText>
      </Svg>
      <Text style={styles.label}>habits done today</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
  label: {
    fontSize: 13,
    color: "#555555",
    marginTop: 8,
    textAlign: "center",
  },
});

export default CompletionRing;
