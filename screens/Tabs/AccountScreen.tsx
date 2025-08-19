import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const AccountScreen = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<NavigationProp>();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  // Load user data on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser({ name: parsed.name, email: parsed.email });
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  const handlePress = (label: string) => {
    if (label === 'Sign In' || label === 'Login') {
      navigation.navigate('Login');
    } else if (label === 'Help Center') {
      navigation.navigate('HelpCenter');
    } else {
      console.log(`${label} Pressed`);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Logged Out', 'You have been logged out.');
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    { icon: 'person-outline', label: 'Sign In' },
    { icon: 'help-circle-outline', label: 'Help Center' },
    { icon: 'information-circle-outline', label: 'About Us' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <StatusBar translucent backgroundColor="#f8f9fa" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroTextContainer}>
         <Image
  source={require('../../assets/images/placeholderman.jpg')}
  style={styles.avatar}
  resizeMode="cover"
/>

          {user && (
            <>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.email}>{user.email}</Text>
            </>
          )}
        </View>

        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuButton}
            onPress={() => handlePress(item.label)}
          >
            <Ionicons name={item.icon as any} size={22} color="#232D3E" style={styles.icon} />
            <Text style={styles.menuText}>{item.label}</Text>
          </TouchableOpacity>
        ))}

        {/* 🚪 Logout Button */}
        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: '#ffe6e6' }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color="#D32F2F" style={styles.icon} />
          <Text style={[styles.menuText, { color: '#D32F2F' }]}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    paddingBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  heroTextContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232D3E',
  },
  email: {
    fontSize: 14,
    color: '#555',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#232D3E',
    fontWeight: '500',
  },
});

export default AccountScreen;
