import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { Button } from "../../components/ui/Button";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import { typography } from "../../constants/typography";

const features = [
  "Track daily habits and review progress",
  "Set goals and stay focused with reminders",
  "Build consistent routines for better productivity",
];

export const OnboardingScreen = () => {
  const router = useRouter();

  const handleContinue = () => {
    router.replace("/auth/login");
  };

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to your productivity hub</Text>
        <Text style={styles.subtitle}>
          Get things done with simple tracking, goals, and routines designed for
          busy days.
        </Text>
        <View style={styles.features}>
          {features.map((feature, index) => (
            <View key={feature} style={styles.featureItem}>
              <Text style={styles.featureIndex}>{index + 1}</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
        <Button title="Continue" onPress={handleContinue} />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  title: {
    ...typography.heading,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  features: {
    marginBottom: spacing.xl,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  featureIndex: {
    ...typography.subheading,
    color: colors.primary,
    marginTop: 2,
    marginRight: spacing.sm,
  },
  featureText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
});
