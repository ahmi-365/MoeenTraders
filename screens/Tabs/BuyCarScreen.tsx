// src/screens/BuyCarScreen.js

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  StatusBar,
} from 'react-native';

import { forSaleCarsData } from '../../components/data/data';
import AuctionCard from '../../components/Auctions/AuctionCard';
import AuctionHeader from '../../components/Auctions/AuctionHeader';
import AuctionControls from '../../components/Auctions/AuctionControls';
import Pagination from '../../components/Pagination';
import FilterModal from '../../components/Auctions/FilterModal';

const BuyCarScreen = () => {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar translucent backgroundColor="#f8f9fa" barStyle="dark-content" />
      <View style={styles.container}>
        <FlatList
          key={viewMode}
          data={forSaleCarsData}
          renderItem={({ item }) => <AuctionCard {...item} viewMode={viewMode} />}
          keyExtractor={(item) => item.id}
          numColumns={viewMode === 'grid' ? 2 : 1}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
<AuctionHeader title="Cars for Sale" onFilterPress={() => setFiltersVisible(true)} />
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
    paddingHorizontal: 4,
  },
  listContainer: {
    paddingHorizontal: 0,
  },
});

export default BuyCarScreen;
