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
  onPress?: () => void; // Optional onPress handler
}

const InfoCard: React.FC<InfoCardProps> = ({ number, label, icon, color, onPress }) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={{ 
        marginVertical: 4, 
        flex: 1, 
        marginHorizontal: 4,
        opacity: onPress ? 1 : 0.9 // Slightly dim cards without onPress
      }}
      disabled={!onPress} // Disable interaction if no onPress provided
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

        {/* Navigation indicator for clickable cards */}
        {onPress && (
          <View style={styles.navigationIndicator}>
            <Ionicons name="chevron-forward-outline" size={16} color="#999" />
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

export default InfoCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    position: "relative",
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
  navigationIndicator: {
    position: "absolute",
    right: 8,
    top: 8,
    opacity: 0.6,
    marginTop: 5,
  },
});