import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Animated,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface TopBarProps {
  scrollY: Animated.Value;
  textColor?: string;
}

const TopBar: React.FC<TopBarProps> = ({ scrollY }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  scrollY.addListener(({ value }) => {
    if (value > 40 && !scrolled) setScrolled(true);
    if (value <= 40 && scrolled) setScrolled(false);
  });

  const backgroundColor = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: ["transparent", "rgba(13, 32, 52, 0.9)"],
    extrapolate: "clamp",
  });

  return (
    <>
      <Animated.View style={[styles.topBar, { backgroundColor }]}>
        <Image
          source={require("../assets/images/goldenx.png")} // ✅ Adjust path as needed
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1000,
  },
  logoImage: {
    width: 120,
    height: 40,
  },
});

export default TopBar;
