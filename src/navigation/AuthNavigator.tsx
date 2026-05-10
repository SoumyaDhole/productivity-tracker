import type { RelativePathString } from "expo-router";

export const AuthRoutes: Readonly<{
  Welcome: RelativePathString;
  Login: RelativePathString;
  Signup: RelativePathString;
  Onboarding: RelativePathString;
}> = {
  Welcome: "..",
  Login: "./login",
  Signup: "./signup",
  Onboarding: "./onboarding",
} as const;

export type AuthRouteName = keyof typeof AuthRoutes;

export const AuthNavigator = {
  routes: AuthRoutes,
};
