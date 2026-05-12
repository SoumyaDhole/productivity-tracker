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
import { signUp } from "../../services/auth";

export const SignupScreen = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    setError(null);

    // Validate inputs
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const result = await signUp({ email, password });
      console.log("Signup successful", result);
      // Auth layout will redirect once the Supabase session is restored.
    } catch (err) {
      const message = err instanceof Error ? err.message : "Signup failed";
      setError(message);
      console.error("Signup error:", message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    router.replace("/auth/login");
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScreenContainer scrollable>
        <Header
          title="Create your account"
          subtitle="Start building stronger productivity habits with a quick setup."
        />
        <View style={styles.form}>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Input
            placeholder="Full name"
            value={name}
            onChangeText={setName}
            editable={!loading}
          />
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
          <Input
            placeholder="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!loading}
          />
          <Button
            title="Sign Up"
            onPress={handleSignup}
            loading={loading}
            disabled={loading}
          />
          <Pressable
            onPress={handleLogin}
            style={styles.loginLink}
            disabled={loading}
          >
            <Text style={styles.loginText}>Already have an account? Login</Text>
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
  loginLink: {
    marginTop: spacing.md,
  },
  loginText: {
    color: colors.primary,
    textAlign: "center",
  },
});
