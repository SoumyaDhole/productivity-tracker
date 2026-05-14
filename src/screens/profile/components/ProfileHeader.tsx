import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ProfileHeader: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.initials}>SD</Text>
      </View>
      <Text style={styles.name}>Soumya Dhole</Text>
      <View style={styles.levelBadge}>
        <Text style={styles.levelText}>⚡ Level 7 · Hustler</Text>
      </View>
      <Text style={styles.memberText}>Member since May 2025</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3730A3",
    borderWidth: 3,
    borderColor: "#7C3AED",
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 12,
  },
  levelBadge: {
    marginTop: 8,
    backgroundColor: "#1E1030",
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  levelText: {
    fontSize: 13,
    color: "#A78BFA",
    fontWeight: "600",
  },
  memberText: {
    fontSize: 11,
    color: "#444444",
    marginTop: 6,
  },
});

export default ProfileHeader;
