import { useRouter } from "expo-router";
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
import { signIn } from "../../services/auth";

export const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);

    // Validate inputs
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn({ email, password });
      console.log("Login successful", result);
      // Auth layout will redirect once the Supabase session is restored.
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      console.error("Login error:", message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    router.replace("/auth/signup");
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
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
          <Button
            title="Login"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
          />
          <Pressable
            onPress={handleSignup}
            style={styles.signupLink}
            disabled={loading}
          >
            <Text style={styles.signupText}>
              Don&apos;t have an account? Sign up
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
  errorText: {
    color: colors.error || "#e53e3e",
    marginBottom: spacing.md,
    textAlign: "center",
    fontSize: 14,
  },
  signupLink: {
    marginTop: spacing.md,
  },
  signupText: {
    color: colors.primary,
    textAlign: "center",
  },
});
