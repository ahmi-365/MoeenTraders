import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/Auths/LoginScreen'; 
import { StatusBar } from 'react-native';
import DrawerNavigator from "../components/Drawer/DrawerNavigator";
import HomeScreen from '@/screens/HomeScreen';

export type RootStackParamList = {
  Splash: undefined;
  MainTabs: undefined;
  AuctionDetail:undefined;
  Login: undefined;
  HelpCenter: undefined;
  ContactUs: undefined;
  BookInspection: undefined;
  Home: undefined;
};
//     <StatusBar
//   translucent
//   backgroundColor="#f8f9fa"
//   barStyle="dark-content"
// />
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainTabs" component={DrawerNavigator} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
