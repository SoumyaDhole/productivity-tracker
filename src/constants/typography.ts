import { TextStyle } from "react-native";

export const typography: Readonly<{
  title: TextStyle;
  heading: TextStyle;
  subheading: TextStyle;
  body: TextStyle;
  caption: TextStyle;
  small: TextStyle;
}> = {
  title: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  heading: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
    letterSpacing: 0.15,
  },
  subheading: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    letterSpacing: 0.15,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
    letterSpacing: 0.5,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    letterSpacing: 0.4,
  },
  small: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "400",
    letterSpacing: 0.4,
  },
};
