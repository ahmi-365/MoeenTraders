// components/InfoCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

interface InfoCardProps {
  number: number | string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const InfoCard: React.FC<InfoCardProps> = ({ number, label, icon }) => {
  return (
    <View style={styles.card}>
      {/* Light gradient circle for icon */}
      <LinearGradient
        colors={["#fff7e6", "#ffeccc"]}
        style={styles.iconContainer}
      >
        <Ionicons name={icon} size={20} color="#FFB800" />
      </LinearGradient>

      <Text style={styles.cardNumber}>{number}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
};

export default InfoCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "white",
    padding: 12, // smaller padding
    marginHorizontal: 6,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFB800",
    marginBottom: 2,
  },
  cardLabel: {
    fontSize: 13,
    color: "#444",
    textAlign: "center",
  },
});
