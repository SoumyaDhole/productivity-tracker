import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { Button } from "../../components/ui/Button";
import { Header } from "../../components/ui/Header";
import { Input } from "../../components/ui/Input";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";

export const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Login submitted", { email, password });
  };

  const handleSignup = () => {
    router.push("/auth/signup");
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScreenContainer scrollable>
        <Header
          title="Welcome Back"
          subtitle="Log in to keep your productivity streak moving forward."
        />
        <View style={styles.form}>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title="Login" onPress={handleLogin} />
          <Pressable onPress={handleSignup} style={styles.signupLink}>
            <Text style={styles.signupText}>
              Don't have an account? Sign up
            </Text>
          </Pressable>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  form: {
    marginTop: spacing.lg,
  },
  signupLink: {
    marginTop: spacing.md,
  },
  signupText: {
    color: colors.primary,
    textAlign: "center",
  },
});
