import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

interface FilterPillsProps {
  options: string[];
  active: string;
  onSelect: (option: string) => void;
}

const FilterPills: React.FC<FilterPillsProps> = ({
  options,
  active,
  onSelect,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.pill,
            active === option ? styles.activePill : styles.inactivePill,
          ]}
          onPress={() => onSelect(option)}
        >
          <Text
            style={[
              styles.pillText,
              active === option ? styles.activeText : styles.inactiveText,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  pill: {
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
  },
  activePill: {
    backgroundColor: "#7C3AED",
  },
  inactivePill: {
    backgroundColor: "#111118",
  },
  pillText: {
    fontSize: 11,
    fontWeight: "600",
  },
  activeText: {
    color: "#FFFFFF",
  },
  inactiveText: {
    color: "#555555",
  },
});

export default FilterPills;
