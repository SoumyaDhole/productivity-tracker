import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FilterPills from "./components/FilterPills";
import GoalGroup from "./components/GoalGroup";

const TasksScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("Today");

  const filterOptions = ["Today", "This Week", "All", "Done"];

  const goalGroups = [
    {
      goalName: "DSA Prep",
      dotColor: "#7C3AED",
      progress: "2/3 done",
      tasks: [
        {
          id: "1",
          title: "Solve array problems",
          subtitle: "Due 12pm",
          priority: "Done" as const,
          completed: true,
        },
        {
          id: "2",
          title: "Watch binary search video",
          subtitle: "Due 2pm",
          priority: "Done" as const,
          completed: true,
        },
        {
          id: "3",
          title: "Solve 3 LeetCode mediums",
          subtitle: "Due 6pm",
          priority: "High" as const,
          completed: false,
        },
      ],
    },
    {
      goalName: "App Dev",
      dotColor: "#10B981",
      progress: "0/3 done",
      tasks: [
        {
          id: "4",
          title: "Build dashboard screen",
          subtitle: "Due 5pm",
          priority: "High" as const,
          completed: false,
        },
        {
          id: "5",
          title: "Write Supabase schema",
          subtitle: "Due 7pm",
          priority: "Med" as const,
          completed: false,
        },
        {
          id: "6",
          title: "Push code to GitHub",
          subtitle: "Due 10pm",
          priority: "Low" as const,
          completed: false,
        },
      ],
    },
    {
      goalName: "Learning",
      dotColor: "#F59E0B",
      progress: "0/2 done",
      tasks: [
        {
          id: "7",
          title: "Read Zero to One ch.4",
          subtitle: "Due 8pm",
          priority: "Med" as const,
          completed: false,
        },
        {
          id: "8",
          title: "Watch YC startup lecture",
          subtitle: "Due 9pm",
          priority: "Low" as const,
          completed: false,
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Row */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>My Tasks</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="search-outline" size={18} color="#444444" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Pills */}
        <FilterPills
          options={filterOptions}
          active={activeFilter}
          onSelect={setActiveFilter}
        />

        {/* Goal Groups */}
        {goalGroups.map((group) => (
          <GoalGroup
            key={group.goalName}
            goalName={group.goalName}
            dotColor={group.dotColor}
            progress={group.progress}
            tasks={group.tasks}
          />
        ))}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.floatingButton}>
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
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
  headerRight: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
  },
  addButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#7C3AED",
    justifyContent: "center",
    alignItems: "center",
  },
  floatingButton: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#7C3AED",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});

export default TasksScreen;
