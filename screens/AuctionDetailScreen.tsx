import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { findAuctionById } from '../components/data/data';
import { AuctionItem, VehicleSpec } from '../types/types';

import ImageCarousel from '../components/ImageCarousel';
import DetailHeader from '../components/Auctions/AuctionDetails/DetailHeader';
import VehicleSpecsGrid from '../components/Auctions/AuctionDetails/VehicleSpecsGrid';
import AuctionStatusCard from '../components/Auctions/AuctionDetails/AuctionStatusCard';
import BuyNowCard from '../components/Auctions/AuctionDetails/BuyNowCard';
import PerformanceSpecs from '../components/Auctions/AuctionDetails/PerformanceSpecs';
import FeatureList from '../components/Auctions/AuctionDetails/FeatureList';
import VehicleHistory from '../components/Auctions/AuctionDetails/VehicleHistory';
import SellerInfo from '../components/Auctions/AuctionDetails/SellerInfo';

type RootStackParamList = { AuctionDetail: { auctionId: string } };
type AuctionDetailScreenRouteProp = RouteProp<RootStackParamList, 'AuctionDetail'>;

const AuctionDetailScreen = () => {
  const route = useRoute<AuctionDetailScreenRouteProp>();
  const { auctionId } = route.params;
  const { width } = useWindowDimensions();
  const isTabletOrWeb = width > 768;

  const auction: AuctionItem | undefined = findAuctionById(auctionId);
  if (!auction || !auction.details) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A5AE0" />
        <Text style={styles.errorText}>Auction details not found.</Text>
      </SafeAreaView>
    );
  }

  const { details, type } = auction;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageCarousel images={details.images} />
      <View style={isTabletOrWeb ? styles.leftColumn : {}}>
  <View style={styles.sectionSpacing}>
<DetailHeader
  title={details.title}
  tags={details.tags}
  id={auction.id}
  item={auction}
/>
  </View>

  <View style={styles.sectionSpacing}>
    <VehicleSpecsGrid specs={details.vehicleSpecs as VehicleSpec[]} />
  </View>

  <View style={styles.sectionSpacing}>
    <PerformanceSpecs title="Engine & Performance" specs={details.performanceSpecs || []} />
  </View>

  <View style={styles.sectionSpacing}>
    <FeatureList title="Exterior Features" features={details.exteriorFeatures || []} />
  </View>

  <View style={styles.sectionSpacing}>
    <FeatureList title="Interior Features" features={details.interiorFeatures || []} />
  </View>

  <View style={styles.sectionSpacing}>
    <VehicleHistory title="Vehicle History" items={details.vehicleHistory || []} />
  </View>

  <View style={styles.sectionSpacing}>
    <SellerInfo
      seller={{
        ...details.sellerInfo,
        positiveFeedback: typeof details.sellerInfo.positiveFeedback === 'string'
          ? Number(details.sellerInfo.positiveFeedback)
          : details.sellerInfo.positiveFeedback,
      }}
    />
  </View>
</View>

<View style={isTabletOrWeb ? styles.rightColumn : {}}>
  <View style={styles.sectionSpacing}>
    {type === 'auction' && (
      <AuctionStatusCard
        status={{
          ...details.auctionStatus,
          bidHistory: (details.auctionStatus.bidHistory || []).map(bid => ({
            ...bid,
            amount: typeof bid.amount === 'string' ? Number(bid.amount) : bid.amount,
          })),
        }}
      />
    )}
  </View>

  <View style={styles.sectionSpacing}>
    <BuyNowCard price={details.buyNowPrice} />
  </View>
</View>

      </ScrollView>
     
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { marginTop: 16, fontSize: 16, color: '#6c757d' },
  mainContent: { padding: 16 },
  leftColumn: { flex: 2, marginRight: 16 },
  rightColumn: { flex: 1 },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6A5AE0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 8,
  },
  sectionSpacing: {
  marginBottom: 10,
},

  fabText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default AuctionDetailScreen;
