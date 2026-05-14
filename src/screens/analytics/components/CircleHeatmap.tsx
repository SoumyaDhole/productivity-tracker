import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";

const CircleHeatmap: React.FC = () => {
  // Generate 30 random values
  const generateData = () => {
    const data = [];
    for (let i = 0; i < 30; i++) {
      if (i < 10) {
        data.push(Math.floor(Math.random() * 3)); // 0-2
      } else if (i < 20) {
        data.push(Math.floor(Math.random() * 3) + 2); // 2-4
      } else {
        data.push(Math.floor(Math.random() * 4) + 5); // 5-8
      }
    }
    return data;
  };

  const data = generateData();

  const getColor = (value: number) => {
    if (value === 0) return "#111118";
    if (value <= 2) return "#2D1B69";
    if (value <= 4) return "#4C1D95";
    if (value <= 6) return "#7C3AED";
    return "#A78BFA";
  };

  const circleSize = 28;
  const gap = 6;
  const cellSize = circleSize + gap;
  const svgWidth = 6 * cellSize - gap;
  const svgHeight = 5 * cellSize - gap;

  const legendColors = [0, 1, 3, 5, 7].map(getColor);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Activity — Last 30 Days</Text>
      <Svg width={svgWidth} height={svgHeight + 40}>
        {/* Grid */}
        {data.map((value, index) => {
          const row = Math.floor(index / 6);
          const col = index % 6;
          const cx = col * cellSize + circleSize / 2;
          const cy = row * cellSize + circleSize / 2;
          return (
            <Circle
              key={index}
              cx={cx}
              cy={cy}
              r={circleSize / 2}
              fill={getColor(value)}
            />
          );
        })}
        {/* Legend */}
        <SvgText x={0} y={svgHeight + 15} fontSize="9" fill="#444444">
          Less
        </SvgText>
        {legendColors.map((color, index) => (
          <Circle
            key={index}
            cx={40 + index * 20}
            cy={svgHeight + 10}
            r={6}
            fill={color}
          />
        ))}
        <SvgText
          x={svgWidth - 30}
          y={svgHeight + 15}
          fontSize="9"
          fill="#444444"
        >
          More
        </SvgText>
      </Svg>
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
});

export default CircleHeatmap;
