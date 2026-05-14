import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { darkColors } from "../../../constants/colors";

interface HomeHeaderProps {
  name?: string;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ name = "Soumya" }) => {
  const now = new Date();
  const dayName = now.toLocaleDateString("en-US", {
    weekday: "long",
  });
  const monthDay = now.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
  });
  const dateString = `${dayName}, ${monthDay}`.toUpperCase();

  const getGreeting = () => {
    const hour = now.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.date}>{dateString}</Text>
        <Text style={styles.greeting}>
          {getGreeting()}, {name}
        </Text>
      </View>

      <View style={styles.right}>
        <Ionicons
          name="notifications-outline"
          size={20}
          color={darkColors.textPrimary}
        />

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  left: {
    flex: 1,
  },
  date: {
    fontSize: 11,
    color: darkColors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "600",
  },
  greeting: {
    fontSize: 20,
    fontWeight: "700",
    color: darkColors.textPrimary,
    marginTop: 4,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#3730A3",
    borderWidth: 2,
    borderColor: darkColors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 12,
    fontWeight: "700",
    color: darkColors.textPrimary,
  },
});

export default HomeHeader;
