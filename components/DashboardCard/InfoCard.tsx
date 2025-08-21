// InfoCard.tsx
import React from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

interface InfoCardProps {
  number: number | string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string; // accent color for icon
}

const InfoCard: React.FC<InfoCardProps> = ({ number, label, icon, color }) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ marginVertical: 4, flex: 1, marginHorizontal: 4 }}
    >
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        {/* Icon */}
        <LinearGradient
          colors={[color + "33", color + "55"]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.iconContainer}
        >
          <Ionicons name={icon} size={24} color={color} />
        </LinearGradient>

        {/* Text */}
        <View style={styles.textContainer}>
          <Text style={[styles.cardLabel, { color: "#000" }]} numberOfLines={1}>
            {label}
          </Text>
          <Text style={[styles.cardNumber, { color: "#000" }]}>
            {typeof number === "number" ? number.toFixed(2) : number}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default InfoCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white", // original color
    borderRadius: 12,
    paddingVertical: 10, // previous padding
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  cardLabel: {
    fontSize: 10, 
    fontWeight: "600",
    marginBottom: 2,
  },
  cardNumber: {
    fontSize: 14, 
    fontWeight: "400",
  },
});
