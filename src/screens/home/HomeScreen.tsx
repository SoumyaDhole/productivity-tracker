import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { darkColors } from "../../constants/colors";
import { useAuth } from "../../hooks/useAuth";
import HabitsCard from "./components/HabitsCard";
import HomeHeader from "./components/HomeHeader";
import QuoteCard from "./components/QuoteCard";
import StatsRow from "./components/StatsRow";
import StreakCard from "./components/StreakCard";
import TasksCard from "./components/TasksCard";

const HomeScreen = () => {
  const { user } = useAuth();

  // Extract display name from user email or use default
  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Soumya";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <HomeHeader name={displayName} />

        {/* Streak Card */}
        <StreakCard
          currentStreak={12}
          longestStreak={21}
          thisWeek={5}
          progress={70}
        />

        {/* Stats Row */}
        <StatsRow />

        {/* Tasks Card */}
        <TasksCard />

        {/* Habits Card */}
        <HabitsCard />

        {/* Quote Card */}
        <QuoteCard />

        {/* Bottom padding for tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: darkColors.background,
  },
  scrollView: {
    flex: 1,
    backgroundColor: darkColors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  bottomPadding: {
    height: 40,
  },
});

export default HomeScreen;
