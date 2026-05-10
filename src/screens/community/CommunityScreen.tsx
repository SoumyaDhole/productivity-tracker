import React from "react";
import { StyleSheet, Text, View } from "react-native";

const CommunityScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Community Screen</Text>
      <Text style={styles.body}>
        Connect, share updates, and collaborate with other users here.
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

export default CommunityScreen;
