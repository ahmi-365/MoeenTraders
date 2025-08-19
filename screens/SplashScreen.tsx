import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Image, StyleSheet, View, ActivityIndicator } from "react-native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useUserStore } from "../stores/userStore";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export default function SplashScreen({ navigation }: Props) {
  const { loadUser, user, status } = useUserStore();

  useEffect(() => {
    const init = async () => {
      await loadUser();

      setTimeout(() => {
        if (user || status === "guest") {
          navigation.replace("MainTabs");
        } else {
          navigation.replace("Login");
        }
      }, 1000);
    };

    init();
  }, [navigation, loadUser, user, status]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/moeentraders.png")}
        style={styles.logo}
      />
      <ActivityIndicator size="large" color="#DAA520" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 130,
    height: 130,
    resizeMode: "contain",
    marginBottom: 20,
  },
});
