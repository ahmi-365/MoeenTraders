import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuctionControlsProps } from '@/types/types';

const AuctionControls: React.FC<AuctionControlsProps> = ({ viewMode, setViewMode }) =>  (
  <View style={styles.controlsContainer}>
    <View style={styles.viewOptions}>
      <TouchableOpacity
        style={[styles.viewOptionButton, viewMode === 'grid' && styles.viewOptionActive]}
        onPress={() => setViewMode('grid')}
      >
        <Ionicons name="grid" size={20} color={viewMode === 'grid' ? '#0D2034' : '#a0a0a0'} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.viewOptionButton, viewMode === 'list' && styles.viewOptionActive]}
        onPress={() => setViewMode('list')}
      >
        <Ionicons name="list" size={20} color={viewMode === 'list' ? '#0D2034' : '#a0a0a0'} />
      </TouchableOpacity>
    </View>
    <View style={styles.sortContainer}>
      <Text style={styles.sortText}>Sort by: </Text>
      <TouchableOpacity style={styles.sortSelector}>
        <Text style={styles.sortSelectorText}>Ending Soon</Text>
        <Ionicons name="chevron-down" size={16} color="#333" />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    viewOptions: { flexDirection: 'row', backgroundColor: '#EAEFF5', borderRadius: 8 },
    viewOptionButton: { padding: 8 },
    viewOptionActive: { backgroundColor: '#fff', borderRadius: 6, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
    sortContainer: { flexDirection: 'row', alignItems: 'center' },
    sortText: { fontSize: 14, color: '#666' },
    sortSelector: { flexDirection: 'row', alignItems: 'center' },
    sortSelectorText: { fontSize: 14, fontWeight: '600', color: '#0D2034', marginRight: 4 },
});

export default AuctionControls;