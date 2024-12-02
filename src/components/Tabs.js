import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

const Tabs = ({ filter, setFilter }) => {
  const handleTabChange = (tab) => {
    setFilter(tab);
  };

  return (
    <View style={styles.tabs}>
      <TouchableOpacity
        style={[styles.tab, filter === "active" && styles.activeTab]}
        onPress={() => handleTabChange("active")}
      >
        <Text style={styles.tabText}>Active</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, filter === "deleted" && styles.activeTab]}
        onPress={() => handleTabChange("deleted")}
      >
        <Text style={styles.tabText}>Deleted</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Tabs;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 2,
    borderColor: "transparent",
  },
  activeTab: {
    borderColor: "#007BFF",
  },
  tabText: {
    fontSize: 16,
    color: "#007BFF",
  },
  noteItem: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
