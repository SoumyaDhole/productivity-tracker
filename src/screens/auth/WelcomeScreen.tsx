import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { Button } from "../../components/ui/Button";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { typography } from "../../constants/typography";

export const WelcomeScreen = () => {
  const handleGetStarted = () => {
    router.push("/auth/onboarding");
  };

  const handleLogin = () => {
    router.push("/auth/login");
  };

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.title}>
          Build better habits and stay productive.
        </Text>
        <Text style={styles.subtitle}>
          Track tasks, set goals, and keep your day moving with focused
          routines.
        </Text>
        <Button title="Get Started" onPress={handleGetStarted} />
        <Pressable onPress={handleLogin} style={styles.loginLink}>
          <Text style={styles.loginText}>Already have an account? Login</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  title: {
    ...typography.title,
    textAlign: "center",
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    maxWidth: 320,
  },
  loginLink: {
    marginTop: spacing.md,
  },
  loginText: {
    ...typography.body,
    color: colors.primary,
    textAlign: "center",
  },
});
