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
import { AuthRoutes } from "../../navigation/AuthNavigator";

export const SignupScreen = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = () => {
    console.log("Signup submitted", { name, email, password, confirmPassword });
  };

  const handleLogin = () => {
    router.push({ pathname: AuthRoutes.Login });
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
          <Input placeholder="Full name" value={name} onChangeText={setName} />
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
          <Input
            placeholder="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <Button title="Sign Up" onPress={handleSignup} />
          <Pressable onPress={handleLogin} style={styles.loginLink}>
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
  loginLink: {
    marginTop: spacing.md,
  },
  loginText: {
    color: colors.primary,
    textAlign: "center",
  },
});
