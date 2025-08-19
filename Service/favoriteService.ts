// src/services/favoriteService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  AuctionCardProps as AuctionItem } from '../types/types';

const FAVORITES_KEY = 'favorites';

export const getFavorites = async (): Promise<AuctionItem[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
   
  } catch (e) {
    console.error('Error reading favorites:', e);
    return [];
  }
};

export const toggleFavorite = async (item: AuctionItem): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    const exists = favorites.some(fav => fav.id === item.id);

    let updatedFavorites;
    if (exists) {
      updatedFavorites = favorites.filter(fav => fav.id !== item.id);
    } else {
      updatedFavorites = [item, ...favorites];
    }
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return !exists; // returns true if item is now favorited
  } catch (e) {
    console.error('Error toggling favorite:', e);
    return false;
  }
};

export const isFavorite = async (id: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.some(fav => fav.id === id);
  } catch (e) {
    console.error('Error checking favorite:', e);
    return false;
  }
};
