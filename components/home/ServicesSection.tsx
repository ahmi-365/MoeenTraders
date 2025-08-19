import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';

const services = [
  {
    title: 'Car Rental With\nDriver',
    subtitle: 'Enhance your rental experience with additional options.',
    icon: <FontAwesome5 name="car-side" size={22} color="#0D2034" />,
  },
  {
    title: 'Business Car Rental',
    subtitle: 'Enhance your rental experience with additional options.',
    icon: <MaterialIcons name="business-center" size={22} color="#0D2034" />,
  },
  {
    title: 'Airport Transfer',
    subtitle: 'Enhance your rental experience with additional options.',
    icon: <FontAwesome5 name="plane-departure" size={22} color="#0D2034" />,
  },
  {
    title: 'Chauffeur Services',
    subtitle: 'Enhance your rental experience with additional options.',
    icon: <FontAwesome5 name="user-tie" size={22} color="#0D2034" />,
  },
];

const ServicesSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.mainheading}>
Our Services
      </Text>
      <Text style={styles.heading}>
        Explore our wide range of cars services
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardRow}
      >
        {services.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.iconWrapper}>{item.icon}</View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            <TouchableOpacity style={styles.arrowButton}>
              <Entypo name="arrow-long-right" size={20} color="#F97316" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 48,
    width: '100%',
  },
mainheading: {
  fontSize: 14,
  fontWeight: '600',
  color: '#0D2034',
  backgroundColor: '#FFB800',
  alignSelf: 'center',
  paddingHorizontal: 14,
  paddingVertical: 6,
  borderRadius: 50,
  textAlign: 'center',
  overflow: 'hidden',
  marginBottom: 20,
},

  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E1E1E',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 36,
  },
  cardRow: {
    paddingHorizontal: 20,
    paddingBottom: 10, // For shadow visibility
  },
  card: {
    width: 250,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginRight: 16,
    // iOS shadow
    shadowColor: '#D5C9C5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    // Android shadow
    elevation: 8,
    position: 'relative',
    paddingBottom: 60, // Make space for the absolute positioned button
  },
  iconWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FEECE2',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 8,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B6B6B',
    lineHeight: 20,
  },
  arrowButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#FFEFE5',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ServicesSection;