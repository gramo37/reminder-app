import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Reminder = ({ item }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Reminder</Text>
      <View style={styles.content}>
        <Text style={styles.label}>Sr No:</Text>
        <Text style={styles.value}>{item.srNo}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{item.name}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Contact:</Text>
        <Text style={styles.value}>{item.contactNo}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>{item.address}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Next Visit:</Text>
        <Text style={styles.value}>{item.nextVisitDate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  content: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontWeight: "600",
    color: "#555",
    width: 100,
  },
  value: {
    color: "#000",
    flex: 1,
  },
});

export default Reminder;
