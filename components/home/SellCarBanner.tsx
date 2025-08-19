import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const SellCarBanner = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Ready to Sell Your Car?</Text>
      <Text style={styles.subheading}>
        Get the best value fast – simple, secure, and hassle-free.
      </Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sell Your Car Now</Text>
        <Feather name="arrow-up-right" size={22} color="#D97706" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFBF8', // The very light, off-white background
    paddingHorizontal: 24,
    borderRadius: 32,
    paddingVertical: 32,
    width: '100%',
    alignItems: 'flex-start', // Aligns all text to the left
  },
  heading: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#1A2B48', // Dark navy blue
    marginBottom: 16,
  },
  subheading: {
    fontSize: 18,
    color: '#4A5568', // Softer, gray-blue color
    lineHeight: 26, // Improves readability for wrapped text
    marginBottom: 28,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centers the text and icon inside the button
    backgroundColor: '#FEECE2', // Light peachy/orange background
    paddingVertical: 16,
    borderRadius: 50, // Creates the pill shape
    width: '100%', // Makes the button span the full width of the container
  },
  buttonText: {
    color: '#D97706', // A rich, golden-orange color for text
    fontSize: 17,
    fontWeight: '600',
    marginRight: 8, // Space between text and icon
  },
});

export default SellCarBanner;