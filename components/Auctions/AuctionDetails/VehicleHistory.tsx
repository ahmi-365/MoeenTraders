import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type VehicleHistoryItem = {
  title: string;
  details: string;
  icon: string; // e.g., "cart-outline"
  statusTag: string;
  date?: string;
};

type VehicleHistoryProps = {
  title: string;
  items: VehicleHistoryItem[];
};

const VehicleHistory: React.FC<VehicleHistoryProps> = ({ title, items }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <View style={styles.timeline}>
            <Ionicons name={item.icon as any} size={24} color="#f0ad4e" />
            {index < items.length - 1 && <View style={styles.line} />}
          </View>
          <View style={styles.content}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            {!!item.details && <Text style={styles.itemDetails}>{item.details}</Text>}
            <View style={styles.tag}>
              <Text style={styles.tagText}>{item.statusTag}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  itemContainer: { flexDirection: 'row', marginBottom: 16 },
  timeline: { alignItems: 'center' },
  line: {   height: 70, // or whatever distance between items
 width: 2, backgroundColor: '#e9ecef', marginTop: 4 },
  content: { flex: 1, marginLeft: 16 },
  itemTitle: { fontSize: 16, fontWeight: 'bold' },
  itemDetails: { fontSize: 14, color: '#6c757d', marginVertical: 4 },
  tag: { backgroundColor: '#e9ecef', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start' },
  tagText: { fontSize: 12, fontWeight: '500' },
});

export default VehicleHistory;
