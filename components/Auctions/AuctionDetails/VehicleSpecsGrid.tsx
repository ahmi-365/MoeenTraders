// src/components/details/VehicleSpecsGrid.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Ionicons icon names are strings
type IoniconsName = keyof typeof Ionicons.glyphMap; // ✅ This restricts to valid names

type SpecItemProps = {
  icon: IoniconsName;
  label: string;
  value: string | number;
};

const SpecItem: React.FC<SpecItemProps> = ({ icon, label, value }) => (
  <View style={styles.specItem}>
    <Ionicons name={icon} size={28} color="#FFB800" />
    <View style={styles.specTextContainer}>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  </View>
);

type VehicleSpecsGridProps = {
  specs: SpecItemProps[];
};

const VehicleSpecsGrid: React.FC<VehicleSpecsGridProps> = ({ specs }) => (
  <View style={styles.container}>
    {specs.map(spec => <SpecItem key={spec.label} {...spec} />)}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    marginTop: 10
  },
  specItem: {
    width: '48%', // Two columns with a small gap
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  specTextContainer: { marginLeft: 12 },
  specLabel: { fontSize: 14, color: '#888' },
  specValue: { fontSize: 16, fontWeight: '600', color: '#111' },
});

export default VehicleSpecsGrid;