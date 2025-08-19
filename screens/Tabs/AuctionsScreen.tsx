// src/screens/AuctionsScreen.js

import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, TouchableOpacity, Text, StatusBar } from 'react-native';

// Import Data
import { auctionData } from '../../components/data/data';
import AuctionCard from '../../components/Auctions/AuctionCard';
import AuctionHeader from '../../components/Auctions/AuctionHeader';
import AuctionControls from '../../components/Auctions/AuctionControls';
import Pagination from '../../components/Pagination';
import FilterModal from '../../components/Auctions/FilterModal';

const AuctionsScreen = () => {
  const [filtersVisible, setFiltersVisible] = useState(false);
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    
    <SafeAreaView style={styles.safeArea}>
         <StatusBar
  translucent
  backgroundColor="#f8f9fa"
  barStyle="dark-content"
/>
      <View style={styles.container}>
        <FlatList
          key={viewMode} 
          data={auctionData}
          renderItem={({ item }) => <AuctionCard {...item} viewMode={viewMode} />}
          keyExtractor={(item) => item.id}
          numColumns={viewMode === 'grid' ? 2 : 1}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <AuctionHeader onFilterPress={() => setFiltersVisible(true)} />
              <AuctionControls viewMode={viewMode} setViewMode={setViewMode} />
            </>
          }
          ListFooterComponent={<Pagination />}
          contentContainerStyle={viewMode === 'grid' ? styles.gridContainer : styles.listContainer}
        />        
        <FilterModal visible={filtersVisible} onClose={() => setFiltersVisible(false)} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  container: {
    flex: 1,
    marginTop: 30,
  },
  gridContainer: {
    paddingHorizontal: 10,
  },
  listContainer: {
    paddingHorizontal: 0,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6A5AE0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  fabText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AuctionsScreen;