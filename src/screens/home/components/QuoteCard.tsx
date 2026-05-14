import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { darkColors } from "../../../constants/colors";

interface QuoteCardProps {
  quote?: string;
  author?: string;
}

const QuoteCard: React.FC<QuoteCardProps> = ({
  quote = "Discipline is choosing between what you want now and what you want most.",
  author = "ABRAHAM LINCOLN",
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.quote}>{quote}</Text>
      <Text style={styles.author}>— {author}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkColors.streakCard,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  quote: {
    fontSize: 11,
    fontStyle: "italic",
    color: "#333",
    lineHeight: 18,
    fontWeight: "500",
  },
  author: {
    marginTop: 10,
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#333",
    fontWeight: "600",
  },
});

export default QuoteCard;
