import { Slot } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { AuthProvider, useAuth } from "../src/contexts/AuthContext";

function RootLayout() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return <Slot />;
}

export default function Layout() {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}
