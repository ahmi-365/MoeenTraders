import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
 Modal,
 Pressable,
 StyleSheet,
 Text,
 TextInput,
 TouchableOpacity,
 View,
} from "react-native";
import { ScrollView } from 'react-native';

const makes = ["All Makes", "Porsche", "Ferrari", "Lamborghini", "Aston Martin", "Bentley", "McLaren", "Mercedes-Benz", "BMW", "Audi"];
const models = ["All Models", "911", "Cayman", "Boxster"];
const years = Array.from({ length: 31 }, (_, i) => (1995 + i).toString());
const prices = ["5000", "10000", "20000", "50000", "100000", "200000", "500000", "1000000"];


const FilterCard = () => {
  const [selectedMake, setSelectedMake] = useState("All Makes");
  const [selectedModel, setSelectedModel] = useState("All Models");
  const [makeModalVisible, setMakeModalVisible] = useState(false);
  const [modelModalVisible, setModelModalVisible] = useState(false);

  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
const [yearFromModalVisible, setYearFromModalVisible] = useState(false);
const [yearToModalVisible, setYearToModalVisible] = useState(false);
const [priceMinModalVisible, setPriceMinModalVisible] = useState(false);
const [priceMaxModalVisible, setPriceMaxModalVisible] = useState(false);


  const resetFilters = () => {
    setSelectedMake("All Makes");
    setSelectedModel("All Models");
    setYearFrom("");
    setYearTo("");
    setPriceMin("");
    setPriceMax("");
  };

  const chunkArray = (arr: string[], size: number) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );

  return (
    <View style={styles.filterCard}>
     

      {/* Dropdowns */}
      <View style={styles.filterRow}>
        <View style={styles.filterItem}>
          <Text style={styles.label}>Make</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setMakeModalVisible(true)}
          >
            <Text style={styles.dropdownText}>{selectedMake}</Text>
            <Ionicons name="chevron-down" size={20} color="#555" />
          </TouchableOpacity>
        </View>
        <View style={styles.filterItem}>
          <Text style={styles.label}>Model</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setModelModalVisible(true)}
          >
            <Text style={styles.dropdownText}>{selectedModel}</Text>
            <Ionicons name="chevron-down" size={20} color="#555" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Year */}
     {/* Year Dropdowns */}
<View style={styles.filterItem}>
  <Text style={styles.label}>Year</Text>
  <View style={styles.dualInput}>
    <TouchableOpacity
      style={[styles.dropdown, styles.halfDropdown]}
      onPress={() => setYearFromModalVisible(true)}
    >
      <Text style={styles.dropdownText}>{yearFrom || "From"}</Text>
      <Ionicons name="chevron-down" size={20} color="#555" />
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.dropdown, styles.halfDropdown]}
      onPress={() => setYearToModalVisible(true)}
    >
      <Text style={styles.dropdownText}>{yearTo || "To"}</Text>
      <Ionicons name="chevron-down" size={20} color="#555" />
    </TouchableOpacity>
  </View>
</View>

{/* Price Range Dropdowns */}
<View style={styles.filterItem}>
  <Text style={styles.label}>Price Range</Text>
  <View style={styles.dualInput}>
    <TouchableOpacity
      style={[styles.dropdown, styles.halfDropdown]}
      onPress={() => setPriceMinModalVisible(true)}
    >
      <Text style={styles.dropdownText}>{priceMin || "Min"}</Text>
      <Ionicons name="chevron-down" size={20} color="#555" />
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.dropdown, styles.halfDropdown]}
      onPress={() => setPriceMaxModalVisible(true)}
    >
      <Text style={styles.dropdownText}>{priceMax || "Max"}</Text>
      <Ionicons name="chevron-down" size={20} color="#555" />
    </TouchableOpacity>
  </View>
</View>


      {/* Buttons */}
      <View style={styles.filterButtons}>
        <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
          <Ionicons name="refresh-outline" size={18} color="#555" />
          <Text style={styles.resetButtonText}> Reset Filters</Text>
        </TouchableOpacity>
       <TouchableOpacity style={styles.searchButton}>
  <Ionicons name="search" size={24} color="#0D2034" />
</TouchableOpacity>

      </View>

      {/* Make Modal */}
      <Modal visible={makeModalVisible} transparent animationType="fade">
  <Pressable
    style={styles.modalBackground}
    onPress={() => setMakeModalVisible(false)}
  >
    <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
      {makes.map((make) => (
        <Pressable
          key={make}
          style={styles.modalItem}
          onPress={() => {
            setSelectedMake(make);
            setMakeModalVisible(false);
          }}
        >
          <Text>{make}</Text>
        </Pressable>
      ))}
    </Pressable>
  </Pressable>
</Modal>


      {/* Model Modal */}
    <Modal visible={modelModalVisible} transparent animationType="fade">
  <Pressable
    style={styles.modalBackground}
    onPress={() => setModelModalVisible(false)}
  >
    <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
      {models.map((model) => (
        <Pressable
          key={model}
          style={styles.modalItem}
          onPress={() => {
            setSelectedModel(model);
            setModelModalVisible(false);
          }}
        >
          <Text>{model}</Text>
        </Pressable>
      ))}
    </Pressable>
  </Pressable>
</Modal>
{/* Year From Modal */}
<Modal visible={yearFromModalVisible} transparent animationType="fade">
  <Pressable
    style={styles.modalBackground}
    onPress={() => setYearFromModalVisible(false)}
  >
    <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
    <ScrollView style={{ maxHeight: 250 }}>
  {years.map((year) => (
    <Pressable key={year} style={styles.modalItem} onPress={() => {
      setYearFrom(year);
      setYearFromModalVisible(false);
    }}>
      <Text>{year}</Text>
    </Pressable>
  ))}
</ScrollView>

    </Pressable>
  </Pressable>
</Modal>

{/* Year To Modal */}
<Modal visible={yearToModalVisible} transparent animationType="fade">
  <Pressable
    style={styles.modalBackground}
    onPress={() => setYearToModalVisible(false)}
  >
    <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
     <ScrollView style={{ maxHeight: 250 }}>
  {years.map((year) => (
    <Pressable key={year} style={styles.modalItem} onPress={() => {
      setYearTo(year);
      setYearToModalVisible(false);
    }}>
      <Text>{year}</Text>
    </Pressable>
  ))}
</ScrollView>

    </Pressable>
  </Pressable>
</Modal>

{/* Price Min Modal */}
<Modal visible={priceMinModalVisible} transparent animationType="fade">
  <Pressable
    style={styles.modalBackground}
    onPress={() => setPriceMinModalVisible(false)}
  >
    <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
      {prices.map((price) => (
        <Pressable
          key={price}
          style={styles.modalItem}
          onPress={() => {
            setPriceMin(price);
            setPriceMinModalVisible(false);
          }}
        >
          <Text>{price}</Text>
        </Pressable>
      ))}
    </Pressable>
  </Pressable>
</Modal>

{/* Price Max Modal */}
<Modal visible={priceMaxModalVisible} transparent animationType="fade">
  <Pressable
    style={styles.modalBackground}
    onPress={() => setPriceMaxModalVisible(false)}
  >
    <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
      {prices.map((price) => (
        <Pressable
          key={price}
          style={styles.modalItem}
          onPress={() => {
            setPriceMax(price);
            setPriceMaxModalVisible(false);
          }}
        >
          <Text>{price}</Text>
        </Pressable>
      ))}
    </Pressable>
  </Pressable>
</Modal>

    </View>
  );
};

export default FilterCard;

const styles = StyleSheet.create({
  filterCard: {
    backgroundColor: "#fff",
    marginTop: -60,
    marginHorizontal: 15,
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  filterItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  dropdownText: {
    fontSize: 14,
    color: "#555",
  },
  dualInput: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfDropdown: {
    flex: 1,
    marginRight: 5,
  },
  filterButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  resetButtonText: {
    color: "#555",
    fontWeight: "600",
  },
  searchButton: {
    backgroundColor: "#FFB800",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 3,
  },
  searchButtonText: {
    color: "#0D2034",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  inputBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#f9f9f9",
    fontSize: 14,
    color: "#333",
  },
});
