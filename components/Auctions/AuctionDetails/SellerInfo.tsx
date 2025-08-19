import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Seller {
  avatarUrl: string;
  name: string;
  rating: number;
  reviews: number;
  description: string;
  carsSold: number;
  positiveFeedback: number;
}

interface SellerInfoProps {
  seller: Seller | null;
}

const SellerInfo: React.FC<SellerInfoProps> = ({ seller }) => {
  if (!seller) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
         <Image
  source={require('../../../assets/images/placeholderman.jpg')}
  style={styles.avatar}
  resizeMode="cover"
/>    
    <View style={styles.headerText}>
          <Text style={styles.name}>{seller.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" color="#f0ad4e" size={16} />
            <Text style={styles.rating}>
              {seller.rating}/5 - {seller.reviews} reviews
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.bio}>{seller.description}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{seller.carsSold}</Text>
          <Text style={styles.statLabel}>Cars Sold</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{seller.positiveFeedback}</Text>
          <Text style={styles.statLabel}>Positive Feedback</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  headerText: { marginLeft: 12 },
  name: { fontSize: 18, fontWeight: 'bold' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  rating: { marginLeft: 4, color: '#6c757d' },
  bio: { fontSize: 14, color: '#495057', lineHeight: 20, marginBottom: 16 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#e9ecef', paddingTop: 16 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#f0ad4e' },
  statLabel: { fontSize: 12, color: '#6c757d', marginTop: 4 },
});

export default SellerInfo;
