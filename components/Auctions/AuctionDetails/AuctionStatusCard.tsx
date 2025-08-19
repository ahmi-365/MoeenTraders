// src/components/details/AuctionStatusCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type BidHistoryItem = {
    user: string;
    amount: number;
    time: string;
};

type AuctionStatus = {
    auctionId: string;
    currentBid: number;
    bidCount: number;
    bidHistory: BidHistoryItem[];
    ends: string;
    location: string;
    shipping: string;
};

type AuctionStatusCardProps = {
    status: AuctionStatus;
};

const AuctionStatusCard: React.FC<AuctionStatusCardProps> = ({ status }) => (
  <View style={styles.card}>
    <Text style={styles.header}>Current Auction <Text style={styles.auctionId}>{status.auctionId}</Text></Text>
    
    <Text style={styles.bidLabel}>Current Bid</Text>
    <Text style={styles.bidAmount}>${status.currentBid.toLocaleString()}</Text>
    <Text style={styles.bidCount}>{status.bidCount} bids</Text>

    <View style={styles.historyContainer}>
        {status.bidHistory.map((bid, index) => (
            <View key={index} style={styles.bidRow}>
                <Text style={styles.bidUser}>{bid.user}</Text>
                <Text style={styles.bidHistoryAmount}>{bid.amount}</Text>
                <Text style={styles.bidTime}>{bid.time}</Text>
            </View>
        ))}
    </View>

    <View style={styles.placeBidContainer}>
        <TextInput style={styles.bidInput} keyboardType="numeric" placeholder={(status.currentBid + 1000).toLocaleString()} />
        <Text style={styles.currency}>USD</Text>
    </View>

    <TouchableOpacity style={styles.placeBidButton}>
        <Ionicons name="hammer" size={20} color="#fff"/>
        <Text style={styles.placeBidButtonText}>Place Bid</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.autoBidButton}>
        <Text style={styles.autoBidButtonText}>Auto Bid</Text>
    </TouchableOpacity>

    <View style={styles.infoRow}><Text>Reserve:</Text><Text style={styles.reserveMet}>Met</Text></View>
    <View style={styles.infoRow}><Text>Ends:</Text><Text>{status.ends}</Text></View>
    <View style={styles.infoRow}><Text>Location:</Text><Text>{status.location}</Text></View>
    <View style={styles.infoRow}><Text>Shipping:</Text><Text>{status.shipping}</Text></View>

  </View>
);

const styles = StyleSheet.create({
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#FFB800' },
    header: { fontSize: 18, fontWeight: '600', marginBottom: 15 },
    auctionId: { color: '#888', fontWeight: 'normal' },
    bidLabel: { color: '#888' },
    bidAmount: { fontSize: 36, fontWeight: 'bold', color: '#FFB800', marginVertical: 5 },
    bidCount: { color: '#888', marginBottom: 15 },
    historyContainer: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
    bidRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
    bidUser: { fontWeight: 'bold' },
    bidHistoryAmount: { fontWeight: 'bold', color: '#555' },
    bidTime: { color: '#888' },
    placeBidContainer: { flexDirection: 'row', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginTop: 15, alignItems: 'center' },
    bidInput: { flex: 1, padding: 12, fontSize: 18 },
    currency: { paddingHorizontal: 15, color: '#888', fontWeight: 'bold' },
    placeBidButton: { flexDirection: 'row', backgroundColor: '#FFB800', justifyContent: 'center', alignItems: 'center', padding: 15, borderRadius: 8, marginTop: 10 },
    placeBidButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
    autoBidButton: { borderWidth: 1.5, borderColor: '#FFB800', justifyContent: 'center', alignItems: 'center', padding: 15, borderRadius: 8, marginTop: 10 },
    autoBidButtonText: { color: '#FFB800', fontSize: 18, fontWeight: 'bold' },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    reserveMet: { color: '#43A047', fontWeight: 'bold' },
});

export default AuctionStatusCard;