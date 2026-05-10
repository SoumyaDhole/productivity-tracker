export const AuthRoutes: Readonly<{
  Welcome: string;
  Login: string;
  Signup: string;
  Onboarding: string;
}> = {
  Welcome: "/auth/index",
  Login: "/auth/login",
  Signup: "/auth/signup",
  Onboarding: "/auth/onboarding",
} as const;

export type AuthRouteName = keyof typeof AuthRoutes;

export const AuthNavigator = {
  routes: AuthRoutes,
};
