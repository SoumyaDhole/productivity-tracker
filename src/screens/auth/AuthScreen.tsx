import React from "react";
import { StyleSheet, Text, View } from "react-native";

const AuthScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Auth Screen</Text>
      <Text style={styles.subtitle}>
        Sign in, sign up, and manage authentication here.
      </Text>
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
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default AuthScreen;
