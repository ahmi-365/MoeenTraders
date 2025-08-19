import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface BuyNowCardProps {
 price: number;
}

const formatCurrency = (value: number): string => {
 return `$${new Intl.NumberFormat('en-US').format(value)}`;
};

const BuyNowCard = ({ price }: BuyNowCardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Buy It Now</Text>
      <Text style={styles.price}>{formatCurrency(price)}</Text>
      <Text style={styles.subtitle}>Skip the auction and purchase immediately</Text>
       <TouchableOpacity style={styles.buyButton}>
        <Text style={styles.buttonText}>Buy It Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    card: { backgroundColor: '#f0ad4e', borderRadius: 8, padding: 20, alignItems: 'center', marginBottom: 16 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#212529'},
    price: { fontSize: 32, fontWeight: 'bold', color: '#212529', marginVertical: 8 },
    subtitle: { fontSize: 14, color: '#495057', marginBottom: 16, textAlign: 'center' },
    buyButton: { backgroundColor: '#212529', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 4, width: '100%'},
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
});

export default BuyNowCard;