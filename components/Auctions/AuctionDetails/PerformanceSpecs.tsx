import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Spec = {
  id?: string | number;
  label: string;
  value: string | number;
};

type PerformanceSpecsProps = {
  title: string;
  specs: Spec[];
};

const PerformanceSpecs: React.FC<PerformanceSpecsProps> = ({ title, specs }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.grid}>
       {specs.map((spec, index) => (
  <View key={spec.id || index} style={styles.specRow}>
    <Text style={styles.label}>{spec.label}</Text>
    <Text style={styles.value}>{spec.value}</Text>
  </View>
))}

    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f1f1' },
  label: { fontSize: 14, color: '#6c757d' },
  value: { fontSize: 14, fontWeight: 'bold' },
});

export default PerformanceSpecs;