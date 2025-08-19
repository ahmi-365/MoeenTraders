import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AuctionCardProps } from '../../types/types'; // Adjust if your path differs
import AuctionCard from './AuctionCard';

interface FeaturedCarsForSaleProps {
  data: AuctionCardProps[];
}

const FeaturedCarsForSale: React.FC<FeaturedCarsForSaleProps> = ({ data }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionSubtitle}>
        Looking for your next ride? Check out our featured cars—great deals on the most popular models, all in one place.
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {data.map((item, index) => (
          <AuctionCard
            key={`sale-${index}`}
            id={item.id}
            tagText={item.tagText}
            tagColor={item.tagColor}
            title={item.title}
            subtitle={item.subtitle}
            price={item.price}
            mileage={item.mileage}
            endsIn={item.endsIn}
            bids={item.bids}
            type={item.type}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 25,
    paddingLeft: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0D2034',
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});

export default FeaturedCarsForSale;
