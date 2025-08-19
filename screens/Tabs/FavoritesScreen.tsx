import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getFavorites } from '../../Service/favoriteService';
import { AuctionCardProps } from '../../types/types';
import AuctionCard from '../../components/Auctions/AuctionCard';
import { Ionicons } from '@expo/vector-icons';

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState<AuctionCardProps[]>([]);
  const navigation = useNavigation();

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs.filter(item => item.id)); // Ensure no missing IDs
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const renderItem = ({ item }: { item: AuctionCardProps }) => (
    <AuctionCard {...item} viewMode="grid" />
  );

  return (
    <SafeAreaView style={styles.container}>
  <StatusBar
  translucent
  backgroundColor="#f8f9fa"
  barStyle="dark-content"
/> 
               <View style={styles.header}>
        
        <Text style={styles.headerTitle}>My Favorites</Text>
        <View style={{ width: 24 }} /> 
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-dislike-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No favorites yet.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#232D3E',
    marginLeft: 100,
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    paddingTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 10,
    color: '#999',
  },
});
