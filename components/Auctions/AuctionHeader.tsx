import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuctionHeaderProps {
  onFilterPress: () => void;
  title?: string; // <-- new prop
}

const AuctionHeader: React.FC<AuctionHeaderProps> = ({ onFilterPress, title = 'Auctions' }) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>{title}</Text>
    <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
      <Ionicons name="filter" size={20} color="#333" />
      <Text style={styles.filterButtonText}>Filters</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#0D2034' },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  filterButtonText: { marginLeft: 6, fontSize: 14, fontWeight: '600', color: '#333' },
});

export default AuctionHeader;
