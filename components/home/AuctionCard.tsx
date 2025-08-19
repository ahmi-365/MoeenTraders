import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuctionCardProps } from '../../types/types';
import { toggleFavorite, isFavorite } from '../../Service/favoriteService';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigationTypes';

const AuctionCard: React.FC<AuctionCardProps> = ({
  id,
  subtitle,
  price,
  mileage,
  endsIn,
  bids,
  type,
  tagText,
  tagColor,
  title,
}) => {
  const [isFav, setIsFav] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const checkFavorite = async () => {
      if (id) {
        const favStatus = await isFavorite(id);
        setIsFav(favStatus);
      }
    };
    checkFavorite();
  }, [id]);

  const handleFavoriteToggle = async (e: any) => {
    e.stopPropagation();
    const updated = await toggleFavorite({
      id,
      subtitle,
      price,
      mileage,
      endsIn,
      bids,
      type,
      tagText,
      tagColor,
      title,
    });
    setIsFav(updated);
  };

  const goToDetails = () => {
    navigation.navigate('AuctionDetail', { auctionId: id });
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={goToDetails} activeOpacity={0.9}>
        <ImageBackground
          source={require('../../assets/images/placeholder.jpg')}
          style={styles.cardImage}
          imageStyle={styles.imageStyle}
        >
         {(tagText === "HOT BID" || tagText === "HOT DEAL") && (
  <View style={[styles.hotBidTag, { borderColor: tagColor || '#000' }]}>
    <Text style={styles.hotBidIcon}>🔥</Text>
    <Text style={[styles.hotBidText, { color: tagColor }]}>{tagText}</Text>
  </View>
)}

          <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoriteToggle}>
            <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={18} color={isFav ? '#FF3B30' : '#000'} />
          </TouchableOpacity>
        </ImageBackground>

        <View style={styles.infoContainer}>
          <Text style={styles.titleText} numberOfLines={1}>{subtitle}</Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailPill}>
              <Ionicons name="speedometer-outline" size={14} color="#555" />
              <Text style={styles.detailText}>{mileage}</Text>
            </View>
            <View style={styles.detailPill}>
              <Ionicons name="time-outline" size={14} color="#555" />
              <Text style={styles.detailText}>{endsIn}</Text>
            </View>
            <View style={styles.detailPill}>
              <Ionicons name="person-outline" size={14} color="#555" />
              <Text style={styles.detailText}>{bids}</Text>
            </View>
          </View>

          <View style={styles.bidContainer}>
            <Text style={styles.currentBidLabel}>Current Bid:</Text>
            <Text style={styles.currentBidValue}>{price}</Text>
          </View>

          <TouchableOpacity style={styles.viewDetailButton} onPress={goToDetails}>
            <Text style={styles.viewDetailButtonText}>View Detail</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 8,
    marginBottom: 10, // tighter spacing
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 3,
    width: 280, // slightly reduced
  },
  cardImage: {
    height: 160, // reduced from 180
  },
  imageStyle: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  hotBidTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  hotBidIcon: {
    fontSize: 11,
    marginRight: 4,
  },
  hotBidText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  infoContainer: {
    padding: 8,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 6,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    gap: 4,
  },
  detailPill: {
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  detailText: {
    marginLeft: 4,
    fontSize: 10,
    color: '#4A5568',
    fontWeight: '500',
  },
  bidContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  currentBidLabel: {
    fontSize: 13,
    color: '#4A5568',
    fontWeight: '500',
  },
  currentBidValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EAB308',
  },
  viewDetailButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  viewDetailButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2D3748',
  },
});

export default AuctionCard;