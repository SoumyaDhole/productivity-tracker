import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SettingsListProps {
  onLogout: () => void;
}

const settings = [
  { icon: "notifications-outline", label: "Notifications" },
  { icon: "moon-outline", label: "Appearance" },
  { icon: "shield-outline", label: "Data & Privacy" },
  { icon: "help-circle-outline", label: "Help & Feedback" },
];

const SettingsList: React.FC<SettingsListProps> = ({ onLogout }) => {
  return (
    <>
      <View style={styles.card}>
        {settings.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.row,
              index < settings.length - 1 && styles.rowBorder,
            ]}
          >
            <Ionicons name={item.icon as any} size={18} color="#555555" />
            <Text style={styles.label}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color="#333333" />
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.logoutCard} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111118",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderColor: "#1E1E2A",
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 12,
  },
  logoutCard: {
    backgroundColor: "#111118",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 14,
    color: "#EF4444",
    fontWeight: "600",
  },
});

export default SettingsList;
