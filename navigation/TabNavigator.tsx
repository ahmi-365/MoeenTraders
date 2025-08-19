// navigation/TabNavigator.tsx

import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

import HomeScreen from "../screens/HomeScreen";
import AuctionsScreen from "../screens/Tabs/AuctionsScreen";
import FavoritesScreen from "../screens/Tabs/FavoritesScreen";
import SellCarScreen from "../screens/Tabs/SellCarScreen";
import BuyCarScreen from "../screens/Tabs/BuyCarScreen";
import AccountScreen from "../screens/Tabs/AccountScreen";

export type TabParamList = {
  Home: undefined;
  Auctions: undefined;
  BuyCars: undefined;
  SellCars: undefined;
  Favorites: undefined;
  Account: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#FFB800",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          switch (route.name) {
            case "Home":
              iconName = "home-outline";
              break;
            case "Auctions":
              iconName = "hammer-outline";
              break;
            case "BuyCars":
              iconName = "car-sport-outline";
              break;
            case "SellCars":
              iconName = "cash-outline";
              break;
            case "Favorites":
              iconName = "heart-outline";
              break;
            case "Account":
              iconName = "person-outline";
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Auctions" component={AuctionsScreen} />
      <Tab.Screen name="BuyCars" component={BuyCarScreen} />
      <Tab.Screen name="SellCars" component={SellCarScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
