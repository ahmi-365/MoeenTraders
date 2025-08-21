import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Pagination = () => (
  <View style={styles.paginationContainer}>
    <TouchableOpacity style={styles.paginationButton}>
      <Ionicons name="chevron-back" size={18} color="#888" />
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.paginationButton, styles.paginationActive]}
    >
      <Text style={styles.paginationTextActive}>1</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.paginationButton}>
      <Text style={styles.paginationText}>2</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.paginationButton}>
      <Text style={styles.paginationText}>3</Text>
    </TouchableOpacity>
    <Text style={styles.paginationText}>...</Text>
    <TouchableOpacity style={styles.paginationButton}>
      <Text style={styles.paginationText}>21</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.paginationButton}>
      <Ionicons name="chevron-forward" size={18} color="#333" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 60, // space for the FAB
  },
  paginationButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  paginationActive: { backgroundColor: "#4CAF50" },
  paginationText: { fontSize: 14, color: "#333", fontWeight: "600" },
  paginationTextActive: { fontSize: 14, color: "#0D2034", fontWeight: "bold" },
});

export default Pagination;
