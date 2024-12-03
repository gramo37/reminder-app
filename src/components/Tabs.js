import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

const Tabs = ({ filter, setFilter }) => {
  const handleTabChange = (tab) => {
    setFilter(tab);
  };

  return (
    <View style={styles.tabs}>
      {/* Active Tab */}
      <TouchableOpacity
        style={[
          styles.tab,
          filter === "active" && styles.activeTab,
        ]}
        onPress={() => handleTabChange("active")}
        accessibilityRole="button"
      >
        <Text
          style={[
            styles.tabText,
            filter === "active" && styles.activeTabText,
          ]}
        >
          Active
        </Text>
      </TouchableOpacity>

      {/* Deleted Tab */}
      <TouchableOpacity
        style={[
          styles.tab,
          filter === "deleted" && styles.activeTab,
        ]}
        onPress={() => handleTabChange("deleted")}
        accessibilityRole="button"
      >
        <Text
          style={[
            styles.tabText,
            filter === "deleted" && styles.activeTabText,
          ]}
        >
          Deleted
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Tabs;

const colors = {
  primary: "#007BFF",
  secondary: "#ddd",
  background: "#f9f9f9",
  text: "#333",
};

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: colors.secondary,
    backgroundColor: colors.background,
    paddingVertical: 5,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: "transparent",
    backgroundColor: colors.background,
  },
  activeTab: {
    borderColor: colors.primary,
    backgroundColor: "#e8f4ff", // Light highlight
  },
  tabText: {
    fontSize: 16,
    color: colors.text,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: "bold",
  },
});
