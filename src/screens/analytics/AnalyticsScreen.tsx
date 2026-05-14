import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CircleHeatmap from "./components/CircleHeatmap";
import HabitConsistency from "./components/HabitConsistency";
import RecordsCard from "./components/RecordsCard";
import SummaryStats from "./components/SummaryStats";
import WeeklyBarChart from "./components/WeeklyBarChart";

const AnalyticsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Row */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <TouchableOpacity style={styles.selector}>
            <Text style={styles.selectorText}>This Week ▾</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Stats */}
        <SummaryStats />

        {/* Weekly Bar Chart */}
        <WeeklyBarChart />

        {/* Habit Consistency */}
        <HabitConsistency />

        {/* Circle Heatmap */}
        <CircleHeatmap />

        {/* Records Card */}
        <RecordsCard />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080808",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  selector: {
    backgroundColor: "#111118",
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  selectorText: {
    fontSize: 12,
    color: "#555555",
  },
});

export default AnalyticsScreen;
