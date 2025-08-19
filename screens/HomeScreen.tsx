import React, { useRef } from "react";
import {
  Animated,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image, // <-- Add Image import here
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Video, ResizeMode } from "expo-av";
import TopBar from "../components/Topbar";
import {
  featuredForSaleData,
  forSaleCarsData,
  hotBidAuctionsData,
  hotDealForSaleData,
} from "../components/data/data";
import FeaturedAuctions from "../components/home/FeaturedAuctions";
import FeaturedCarsForSale from "../components/home/FeaturedCarsForSale";
import FilterCard from "../components/home/FilterCard";
import type { TabParamList } from "../navigation/TabNavigator";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import ServicesSection from "@/components/home/ServicesSection";
import SellCarBanner from "@/components/home/SellCarBanner";

export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f9fa1" }}>
      <StatusBar
        translucent
        backgroundColor="#f8f9fa"
        barStyle="dark-content"
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 40,
          zIndex: 999,
        }}
      />

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContainer}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* <TopBar scrollY={scrollY} /> */}

        <View style={styles.hero}>
          <Video
            source={require("../assets/images/herovideo.mp4")} // Your local video file
            style={StyleSheet.absoluteFill}
            resizeMode={ResizeMode.COVER}
            isMuted
            isLooping
            shouldPlay
            useNativeControls={false}
          />
                <View style={styles.overlay} />

          <View style={styles.heroTextContainer}>
            <Image
              source={require("../assets/images/goldenx.png")}
              style={styles.heroImage}
              resizeMode="contain"
            />
            <Text style={styles.heading}>Discover Exceptional Automobiles</Text>
            <Text style={styles.subtext}>
              Explore our curated collection of premium vehicles and place your
              bid on automotive excellence.
            </Text>
          </View>
        </View>

        <FilterCard />

        {/* Featured Auctions Section with View All */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Auctions</Text>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => navigation.navigate("Auctions")}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={16}
              color="#FFB800"
            />
          </TouchableOpacity>
        </View>
        <FeaturedAuctions data={hotBidAuctionsData} />

        {/* Featured Cars For Sale Section with View All */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Cars for Sale</Text>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => navigation.navigate("SellCars")}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={16}
              color="#FFB800"
            />
          </TouchableOpacity>
        </View>
        <FeaturedCarsForSale data={hotDealForSaleData} />
        <ServicesSection />
        <SellCarBanner />
      </Animated.ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
   overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
  },
  hero: {
    height: 350,
    width: "100%",
    justifyContent: "flex-end",
    backgroundColor: "#000",
  },
  heroTextContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  heroImage: {
    width: 150,
    height: 150,
    marginBottom: -40,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtext: {
    fontSize: 16,
    color: "#eee",
    marginTop: 10,
    textAlign: "center",
    maxWidth: "90%",
  },
  sectionHeader: {
    marginTop: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#232D3E",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#FFB800",
    paddingBottom: 2,
  },
  viewAllText: {
    fontSize: 14,
    color: "#FFB800",
    fontWeight: "600",
    marginRight: 4,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#6A4EF4",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    elevation: 10,
    shadowColor: "#6A4EF4",
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  fabText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 5,
  },
});
