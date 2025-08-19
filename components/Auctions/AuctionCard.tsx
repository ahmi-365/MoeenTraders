import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { AuctionCardProps } from '../../types/types';
import { toggleFavorite, isFavorite } from '../../Service/favoriteService';

type RootStackParamList = {
  Home: undefined;
  AuctionDetail: { auctionId: string }; 
};
type NavigationProp = StackNavigationProp<RootStackParamList, 'AuctionDetail'>;

const AuctionCard = ({
  tagText,
  tagColor,
  title,
  subtitle,
  price,
  mileage,
  endsIn,
  bids,
  type,
  viewMode,
  ...item
}: AuctionCardProps) => {
  const navigation = useNavigation<NavigationProp>();
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, []);

  const checkFavoriteStatus = async () => {
    const status = await isFavorite(item.id);
    setFavorited(status);
  };

  const handleFavoriteToggle = async () => {
    const newStatus = await toggleFavorite({
      tagText,
      tagColor,
      title,
      subtitle,
      price,
      mileage,
      endsIn,
      bids,
      type,
      viewMode,
      ...item,
    });
    setFavorited(newStatus);
  };

  const goToDetails = () => {
    // console.log('Navigating to details for:', item.id);
    navigation.navigate('AuctionDetail', { auctionId: item.id });
  };

  const FavoriteIcon = favorited ? 'heart' : 'heart-outline';

  // -- List View --
  if (viewMode === 'list') {
    return (
      <TouchableOpacity onPress={goToDetails} style={[styles.cardContainer, styles.listContainer]}>
        <ImageBackground
          source={require('../../assets/images/placeholder.jpg')}
          style={styles.listImage}
          imageStyle={{ borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}
        >
        
        </ImageBackground>
       <View style={styles.listInfo}>
  <View style={styles.listHeader}>
    <Text style={styles.cardSubtitle} numberOfLines={1}>{subtitle}</Text>
    <TouchableOpacity style={styles.listFavoriteIcon} onPress={handleFavoriteToggle}>
      <Ionicons name={FavoriteIcon} size={22} color={favorited ? 'red' : '#555'} />
    </TouchableOpacity>
  </View>
  <View style={styles.priceTagRow}>
    <Text style={styles.cardPrice}>{price}</Text>
    <View style={[styles.inlineTag, { backgroundColor: tagColor }]}>
      <Text style={styles.cardTagText}>{tagText}</Text>
    </View>
  </View>
  
  <View style={styles.cardDetails}>
    <Text style={styles.cardDetailText}><Ionicons name="speedometer-outline" size={14} /> {mileage}</Text>
    <Text style={styles.cardDetailText}><Ionicons name="time-outline" size={14} /> {endsIn}</Text>
    <Text style={styles.cardDetailText}><Ionicons name="hammer-outline" size={14} /> {bids}</Text>
  </View>
  {/* <TouchableOpacity style={[styles.cardButton, styles.watchButton]}>
    <Text style={styles.watchButtonText}>Watch</Text>
  </TouchableOpacity> */}
</View>

      </TouchableOpacity>
    );
  }

  // -- Grid View --
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={goToDetails}>
      <ImageBackground
        source={require('../../assets/images/placeholder.jpg')}
        style={styles.cardImage}
        imageStyle={{ borderRadius: 12 }}
      >
        <View style={styles.cardImageOverlay}>
          <View style={[styles.cardTag, { backgroundColor: tagColor }]}>
            <Text style={styles.cardTagText}>{tagText}</Text>
          </View>
          <TouchableOpacity style={styles.favoriteIcon} onPress={handleFavoriteToggle}>
            <Ionicons name={FavoriteIcon} size={24} color={favorited ? 'red' : '#fff'} />
          </TouchableOpacity>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
      </ImageBackground>

     <View style={styles.cardInfo}>
  <Text style={styles.cardSubtitle}>{subtitle}</Text>
  <Text style={styles.cardPrice}>{price}</Text>
 <View style={styles.cardDetails}>
  <View style={styles.detailColumn}>
    <Ionicons name="speedometer-outline" size={18} color="#777" />
    <Text style={styles.detailText}>{mileage}</Text>
  </View>
  <View style={styles.detailColumn}>
    <Ionicons name="time-outline" size={18} color="#777" />
    <Text style={styles.detailText}>{endsIn}</Text>
  </View>
 <View style={styles.detailColumn}>
  <Ionicons
    name={bids === 'For Sale' ? 'pricetag-outline' : 'hammer-outline'} 
    size={18}
    color="#777"
  />
  <Text style={styles.detailText}>{bids}</Text>
</View>

</View>

  {/* <TouchableOpacity style={[styles.cardButton, styles.watchButton]}>
    <Text style={styles.watchButtonText}>Watch</Text>
  </TouchableOpacity> */}
</View>

    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
detailColumn: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 0,         
  marginHorizontal: 0,
},
priceTagRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 4,
  marginBottom: 2,
},

inlineTag: {
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 6,
},

detailText: {
  fontSize: 10,
  color: '#777',
  marginTop: 2,
  textAlign: 'center',
},
  cardContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardImage: {
    height: 100,
    justifyContent: 'space-between',
  },
  cardImageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 6,
    justifyContent: 'flex-end',
  },
  cardTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardTagText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 5,
    borderRadius: 15,
  },
  cardTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
cardInfo: {
  padding: 10,
  flex: 1,
  justifyContent: 'space-between',
}, 
cardSubtitle: {
  fontSize: 12, // reduced from 13
  fontWeight: '600',
  color: '#333',
  flexShrink: 1,
  marginBottom: 2, // add to control space below
},
cardPrice: {
  fontSize: 13, // slightly reduced from 14
  fontWeight: 'bold',
  color: '#FFB800',
  marginVertical: 2, // reduced vertical spacing
},
cardDetails: {
  flexDirection: 'row',
  justifyContent: 'space-around', // ✅ Changed from 'space-between'
  paddingVertical: 6,             // ✅ Reduce vertical space
  paddingHorizontal: 0,           // ✅ Remove horizontal padding
  borderTopWidth: 1,
  borderTopColor: '#eee',
},



cardDetailText: {
  fontSize: 10,
  color: '#777',
  flexShrink: 1,
  marginRight: 3, // tighter spacing between icons
},
  cardButton: {
    marginTop: 6,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  watchButton: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#FFB800',
  },
  watchButtonText: {
    color: '#FFB800',
    fontWeight: 'bold',
    fontSize: 12,
  },
  listContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  listImage: {
    width: 120,
    height: '100%',
  },
listInfo: {
  flex: 1,
  paddingVertical: 8, // reduced from 12
  paddingHorizontal: 10, // optional: smaller horizontal padding
  justifyContent: 'space-between',
},

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  listFavoriteIcon: {
    paddingLeft: 10,
  },
});

export default AuctionCard;
