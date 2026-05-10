import React from "react";
import { StyleSheet, Text, View } from "react-native";

const AnalyticsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analytics Screen</Text>
      <Text style={styles.body}>
        View trends, progress charts, and productivity insights here.
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
    marginBottom: 10,
  },
  body: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default AnalyticsScreen;
