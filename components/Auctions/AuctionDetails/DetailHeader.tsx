import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isFavorite, toggleFavorite } from '../../../Service/favoriteService';
import { AuctionCardProps as AuctionItem } from '../../../types/types';

type DetailHeaderProps = {
  title: string;
  tags: string[];
  id: string;
  item: AuctionItem;
};

const DetailHeader: React.FC<DetailHeaderProps> = ({ title, tags, id, item }) => {
  const [favorited, setFavorited] = useState<boolean>(false);

  useEffect(() => {
    const checkFavorite = async () => {
      const fav = await isFavorite(id);
      setFavorited(fav);
    };
    checkFavorite();
  }, [id]);

  const handleToggleFavorite = async () => {
    const newState = await toggleFavorite(item);
    setFavorited(newState);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.tagsContainer}>
        {tags.map(tag => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={handleToggleFavorite}>
          <Ionicons
            name={favorited ? 'heart' : 'heart-outline'}
            size={24}
            color={favorited ? '#e63946' : '#555'}
          />
        </TouchableOpacity>

        <TouchableOpacity style={{ marginLeft: 15 }}>
          <Ionicons name="share-social-outline" size={24} color="#555" />
        </TouchableOpacity>

        <TouchableOpacity style={{ marginLeft: 15 }}>
          <Ionicons name="print-outline" size={24} color="#555" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    margin: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  tag: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#495057',
    fontWeight: '600',
    fontSize: 12,
  },
  iconContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 55,
    right: 0,
    marginTop: 80,
  },
});

export default DetailHeader;
