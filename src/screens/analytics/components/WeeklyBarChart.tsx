import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Line, Rect, Text as SvgText } from "react-native-svg";

const WeeklyBarChart: React.FC = () => {
  const data = [6, 8, 5, 7, 0, 0, 0];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const chartWidth = 280;
  const chartHeight = 120;
  const gap = 8;
  const barWidth = (chartWidth - gap * 6) / 7;
  const maxValue = 8;

  const getBarColor = (index: number) => {
    if (index === 3) return "#7C3AED"; // Today Thu
    if (index < 3) return "#3730A3"; // Past
    return "#1E1E2A"; // Future
  };

  const yLines = [0, 2, 4, 6, 8];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Tasks This Week</Text>
      <Svg width={chartWidth} height={140}>
        {/* Y axis lines */}
        {yLines.map((value) => {
          const y = chartHeight - (value / maxValue) * chartHeight;
          return (
            <Line
              key={value}
              x1={0}
              y1={y}
              x2={chartWidth}
              y2={y}
              stroke="#1E1E2A"
              strokeWidth={0.5}
            />
          );
        })}
        {/* Bars */}
        {data.map((value, index) => {
          const x = index * (barWidth + gap);
          const barHeight = (value / maxValue) * chartHeight;
          const y = chartHeight - barHeight;
          return (
            <React.Fragment key={index}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={getBarColor(index)}
              />
              {/* Value text */}
              <SvgText
                x={x + barWidth / 2}
                y={y - 4}
                textAnchor="middle"
                fontSize="9"
                fill="#777777"
              >
                {value}
              </SvgText>
              {/* Day label */}
              <SvgText
                x={x + barWidth / 2}
                y={chartHeight + 12}
                textAnchor="middle"
                fontSize="9"
                fill="#444444"
              >
                {days[index]?.toUpperCase()}
              </SvgText>
            </React.Fragment>
          );
        })}
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

export default WeeklyBarChart;
