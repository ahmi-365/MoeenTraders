import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type FeatureListProps = {
  title: string;
  features: string[];
};

const FeatureList: React.FC<FeatureListProps> = ({ title, features }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.grid}>
      {features.map((feature, index) => (
        <View key={index} style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={20} color="#28a745" />
          <Text style={styles.featureText}>{feature}</Text>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  featureItem: { flexDirection: 'row', alignItems: 'center', width: '48%', marginBottom: 12 },
  featureText: { marginLeft: 8, fontSize: 14, color: '#495057' },
});

export default FeatureList;