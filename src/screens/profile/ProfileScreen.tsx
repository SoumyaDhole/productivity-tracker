import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

const ProfileScreen = () => {
  const { signOut, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace("/auth");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      <Text style={styles.body}>
        Manage your profile, settings, and personal productivity stats.
      </Text>
      {user && <Text style={styles.email}>Logged in as: {user.email}</Text>}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },
  body: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  email: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default ProfileScreen;
