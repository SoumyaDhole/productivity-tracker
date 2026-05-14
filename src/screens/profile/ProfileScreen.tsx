import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import AchievementStats from "./components/AchievementStats";
import BadgesGrid from "./components/BadgesGrid";
import ProfileHeader from "./components/ProfileHeader";
import SettingsList from "./components/SettingsList";
import XPProgressBar from "./components/XPProgressBar";

const ProfileScreen: React.FC = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace("/auth");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader />
        <XPProgressBar />
        <AchievementStats />
        <BadgesGrid />
        <SettingsList onLogout={handleLogout} />
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
});

export default ProfileScreen;
