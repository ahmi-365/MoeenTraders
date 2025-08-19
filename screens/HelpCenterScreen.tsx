import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator'; // Adjust the path if needed

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HelpCenterScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleContactPress = () => {
    navigation.navigate('ContactUs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Help Center</Text>
        <Text style={styles.content}>
          Welcome to the Help Center!{'\n\n'}
          Here's where you can find answers to the most common questions we get from users. If you can't find the answer you're looking for, feel free to contact us via the button at the bottom.
          {'\n\n'}1. How to create an account?
          {'\n'}→ Go to the Sign Up page and fill in your details.
          {'\n\n'}2. How to reset your password?
          {'\n'}→ Tap on "Forgot Password" on the login screen.
          {'\n\n'}3. How to report a problem?
          {'\n'}→ Visit the "Contact Us" section and describe your issue.
          {'\n\n'}4. How to bid on auctions?
          {'\n'}→ Browse available listings, click on a product, and hit "Place Bid".
          {'\n\n'}5. Is there buyer protection?
          {'\n'}→ Yes, we offer dispute resolution in case of fraud.
          {'\n\n'}6. Can I delete my account?
          {'\n'}→ Yes, go to account settings and select "Delete Account".
          {'\n\n'}7. How to update your profile?
          {'\n'}→ Go to "My Account" and press "Edit".
          {'\n\n'}8. Is customer support available 24/7?
          {'\n'}→ No, support hours are 9AM–6PM Monday to Saturday.
          {'\n\n'}... (you can keep adding more if needed)

        </Text>

        <TouchableOpacity style={styles.button} onPress={handleContactPress}>
          <Text style={styles.buttonText}>Contact Us</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#232D3E',
    marginTop: 20,
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: '#444',
    lineHeight: 26,
  },
  button: {
    backgroundColor: '#FFB800',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HelpCenterScreen;
