import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';

const ContactUsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Contact Us</Text>
      <Text style={styles.subtext}>Feel free to ask any questions or report an issue below.</Text>

      <TextInput
        placeholder="Your Name"
        style={styles.input}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Your Email"
        style={styles.input}
        placeholderTextColor="#999"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Your Message"
        style={[styles.input, styles.textArea]}
        placeholderTextColor="#999"
        multiline
        numberOfLines={5}
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#232D3E',
  },
  subtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    color: '#000',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#FFB800',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ContactUsScreen;
