import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Image, StyleSheet, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData'); // for registered login
        const guestStatus = await AsyncStorage.getItem('userStatus'); // for guest login

        setTimeout(() => {
          if (userData || guestStatus === 'guest') {
            navigation.replace('MainTabs');
          } else {
            navigation.replace('Login');
          }
        }, 1000); // delay to show splash briefly
      } catch (error) {
        console.error('Splash check error:', error);
        navigation.replace('Login');
      }
    };

    checkLoginStatus();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/goldenx.png')} style={styles.logo} />
      <ActivityIndicator size="large" color="#DAA520" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // clean white background
    justifyContent: 'center',
    alignItems: 'center', 
  },
  logo: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
    marginBottom: 20,
  },
});
