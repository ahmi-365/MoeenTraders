import { StatusBar, View } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import React, {  useState } from 'react';
import AppNavigator from './navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const [currentRouteName, setCurrentRouteName] = useState<string | undefined>();
// useEffect(() => {
//   const logAllAsyncStorage = async () => {
//     try {
//       const keys = await AsyncStorage.getAllKeys();
//       const stores = await AsyncStorage.multiGet(keys);

//       console.log('🧾 AsyncStorage Contents:');
//       stores.forEach(([key, value]) => {
//         console.log(`${key}:`, value);
//       });
//     } catch (e) {
//       console.error('Error reading AsyncStorage:', e);
//     }
//   };

//   logAllAsyncStorage();
// }, []);
  const hideSpeedDialScreens = ['Splash', 'Login', 'Register','BookInspection'];
  return (
    <>
      <StatusBar translucent backgroundColor="#f8f9fa" barStyle="dark-content" />
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          setCurrentRouteName(navigationRef.getCurrentRoute()?.name);
        }}
        onStateChange={() => {
          setCurrentRouteName(navigationRef.getCurrentRoute()?.name);
        }}
      >
        <View style={{ flex: 1 }}>
          <AppNavigator />
        </View>
      </NavigationContainer>
    </>
  );
}
