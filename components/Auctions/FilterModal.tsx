import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilterModalProps } from '@/types/types';

const years = Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i);
const makes = ['Porsche', 'Ferrari', 'Lamborghini', 'BMW', 'Mercedes-Benz'];
const mileageOptions = [
  'Under 10,000 miles',
  '10,000 - 25,000 miles',
  '25,000 - 50,000 miles',
  'Over 50,000 miles',
];
const auctionOptions = ['Live Auction', 'Ending Soon', 'Reserve Met', 'Buy It Now'];

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose }) => {
  const [minPrice, setMinPrice] = useState('50000');
  const [maxPrice, setMaxPrice] = useState('500000');
  const [selectedMakes, setSelectedMakes] = useState<string[]>(['BMW']);
  const [selectedYear, setSelectedYear] = useState<string>('Any Year');
  const [selectedMileage, setSelectedMileage] = useState<string | null>(null);
  const [selectedAuction, setSelectedAuction] = useState<string[]>([]);

  const toggleMultiSelect = (value: string, state: string[], setter: Function) => {
    if (state.includes(value)) {
      setter(state.filter((v) => v !== value));
    } else {
      setter([...state, value]);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
  <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalBackdrop}>

        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={28} color="#ccc" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Price Range */}
            <Text style={styles.filterSectionTitle}>Price Range</Text>
            <View style={styles.priceInputs}>
              <TextInput
                style={styles.inputField}
                value={minPrice}
                onChangeText={setMinPrice}
                keyboardType="numeric"
                placeholder="Min"
              />
              <TextInput
                style={styles.inputField}
                value={maxPrice}
                onChangeText={setMaxPrice}
                keyboardType="numeric"
                placeholder="Max"
              />
            </View>

            {/* Make */}
            <Text style={styles.filterSectionTitle}>Make</Text>
            {makes.map((make) => (
              <TouchableOpacity
                key={make}
                onPress={() => toggleMultiSelect(make, selectedMakes, setSelectedMakes)}
              >
                <Text
                  style={
                    selectedMakes.includes(make)
                      ? styles.filterOptionSelected
                      : styles.filterOption
                  }
                >
                  {selectedMakes.includes(make) ? '✓ ' : ''} {make}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Year */}
            <Text style={styles.filterSectionTitle}>Year</Text>
            <ScrollView style={styles.yearDropdown} nestedScrollEnabled>
              <TouchableOpacity onPress={() => setSelectedYear('Any Year')}>
                <Text
                  style={
                    selectedYear === 'Any Year'
                      ? styles.filterOptionSelected
                      : styles.filterOption
                  }
                >
                  {selectedYear === 'Any Year' ? '✓ ' : ''} Any Year
                </Text>
              </TouchableOpacity>
              {years.map((year) => (
                <TouchableOpacity key={year} onPress={() => setSelectedYear(year.toString())}>
                  <Text
                    style={
                      selectedYear === year.toString()
                        ? styles.filterOptionSelected
                        : styles.filterOption
                    }
                  >
                    {selectedYear === year.toString() ? '✓ ' : ''} {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Mileage */}
            <Text style={styles.filterSectionTitle}>Mileage</Text>
            {mileageOptions.map((option) => (
              <TouchableOpacity key={option} onPress={() => setSelectedMileage(option)}>
                <Text
                  style={
                    selectedMileage === option
                      ? styles.filterOptionSelected
                      : styles.filterOption
                  }
                >
                  {selectedMileage === option ? '✓ ' : ''} {option}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Auction Status */}
            <Text style={styles.filterSectionTitle}>Auction Status</Text>
            {auctionOptions.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => toggleMultiSelect(option, selectedAuction, setSelectedAuction)}
              >
                <Text
                  style={
                    selectedAuction.includes(option)
                      ? styles.filterOptionSelected
                      : styles.filterOption
                  }
                >
                  {selectedAuction.includes(option) ? '✓ ' : ''} {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.applyButton} onPress={onClose}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
        </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0D2034',
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  priceInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    width: '48%',
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  filterOption: {
    fontSize: 16,
    color: '#555',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterOptionSelected: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFB800',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  yearDropdown: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  applyButton: {
    backgroundColor: '#FFB800',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    color: '#0D2034',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FilterModal;
