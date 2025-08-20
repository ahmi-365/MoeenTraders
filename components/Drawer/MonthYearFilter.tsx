import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMonthYear } from "../../context/MonthYearContext"; // 👈 import context

const MonthYearFilter = () => {
  const { month, year, setMonth, setYear } = useMonthYear(); // 👈 use context
  const [visible, setVisible] = useState(false);
  const [tempYear, setTempYear] = useState(year);
  const [tempMonth, setTempMonth] = useState(month);

  const months = useMemo(
    () => ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    []
  );

  const openModal = () => {
    setTempMonth(month);
    setTempYear(year);
    setVisible(true);
  };

  const applyFilter = () => {
    setYear(tempYear);   // 👈 update context
    setMonth(tempMonth); // 👈 update context
    setVisible(false);
  };

  const cancelFilter = () => setVisible(false);

  // --- Circular Month Picker ---
  const renderMonthPicker = () => {
    const PICKER_SIZE = Dimensions.get("window").width * 0.7;
    const RADIUS = PICKER_SIZE / 2;
    const MONTH_BUTTON_SIZE = RADIUS * 0.35;

    return (
      <View style={[styles.monthPickerContainer, { width: PICKER_SIZE, height: PICKER_SIZE }]}>
        <View style={[styles.centerCircle, { width: RADIUS * 1.2, height: RADIUS * 1.2 }]}>
          <Text style={styles.centerMonthText}>{months[tempMonth - 1]}</Text>
          <Text style={styles.centerYearText}>{tempYear}</Text>
        </View>

        {months.map((m, index) => {
          const angle = ((index + 1) * 30 - 90) * (Math.PI / 180);
          const x = RADIUS + RADIUS * 0.8 * Math.cos(angle) - MONTH_BUTTON_SIZE / 2;
          const y = RADIUS + RADIUS * 0.8 * Math.sin(angle) - MONTH_BUTTON_SIZE / 2;
          const isSelected = tempMonth === index + 1;

          return (
            <TouchableOpacity
              key={m}
              style={[
                styles.monthButton,
                {
                  width: MONTH_BUTTON_SIZE,
                  height: MONTH_BUTTON_SIZE,
                  borderRadius: MONTH_BUTTON_SIZE / 2,
                  left: x,
                  top: y,
                },
                isSelected && styles.selectedMonthButton,
              ]}
              onPress={() => setTempMonth(index + 1)}
            >
              <Text style={[styles.monthText, isSelected && styles.selectedMonthText]}>
                {m}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <>
      {/* Header Button */}
      <TouchableOpacity style={styles.filterButton} onPress={openModal}>
        <Ionicons name="filter-outline" size={20} color="#FFB800" />
        <Text style={styles.filterText}>{months[month - 1]} {year}</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Year</Text>
            <View style={styles.row}>
              <TouchableOpacity onPress={() => setTempYear(tempYear - 1)} style={styles.smallBtn}>
                <Ionicons name="chevron-back-outline" size={22} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.value}>{tempYear}</Text>
              <TouchableOpacity onPress={() => setTempYear(tempYear + 1)} style={styles.smallBtn}>
                <Ionicons name="chevron-forward-outline" size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalTitle, { marginTop: 25, marginBottom: 10 }]}>
              Select Month
            </Text>

            {renderMonthPicker()}

            <TouchableOpacity style={styles.applyBtn} onPress={applyFilter}>
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>Apply Filter</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={cancelFilter} style={{ padding: 10 }}>
              <Text style={{ color: "#888", marginTop: 10, textAlign: "center" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default MonthYearFilter;


const styles = StyleSheet.create({
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255, 184, 0, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 184, 0, 0.3)",
  },
  filterText: { color: "#FFB800", fontWeight: "600", marginLeft: 8, fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#333" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  smallBtn: { backgroundColor: "#FFB800", borderRadius: 8, padding: 8, marginHorizontal: 15 },
  value: { fontSize: 22, fontWeight: "bold", minWidth: 70, textAlign: "center", color: "#333" },
  applyBtn: {
    backgroundColor: "#FFB800",
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 25,
  },
  monthPickerContainer: { justifyContent: "center", alignItems: "center", position: "relative" },
  centerCircle: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 100,
    borderWidth: 6,
    borderColor: "rgba(255, 184, 0, 0.2)",
  },
  centerMonthText: { fontSize: 28, fontWeight: "bold", color: "#FFB800" },
  centerYearText: { fontSize: 16, color: "#888" },
  monthButton: {
    position: "absolute",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    borderWidth: 1,
    borderColor: "#eee",
  },
  monthText: { fontSize: 14, fontWeight: "600", color: "#555" },
  selectedMonthButton: {
    backgroundColor: "#FFB800",
    borderColor: "rgba(255,255,255,0.5)",
    borderWidth: 2,
    elevation: 5,
  },
  selectedMonthText: { color: "#fff", fontWeight: "bold" },
});
