import { StatusBar, View, ActivityIndicator } from "react-native";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import AppNavigator from "./navigation/AppNavigator";
import { useUserStore } from "./stores/userStore"; 
import { MonthYearProvider } from "./context/MonthYearContext";  

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const [currentRouteName, setCurrentRouteName] = useState<string | undefined>();
  const [isAppReady, setIsAppReady] = useState(false);
//FF8F3C,183284
  useEffect(() => {
    const init = async () => {
      try {
        await useUserStore.getState().loadUser();
      } catch (e) {
        console.error("Error restoring user:", e);
      } finally {
        setIsAppReady(true);
      }
    };
    init();
  }, []);

  if (!isAppReady) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa",
        }}
      >
        <ActivityIndicator size="large" color="#2c3e50" />
      </View>
    );
  }

  return (
    <MonthYearProvider>
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
    </MonthYearProvider>
  );
}
