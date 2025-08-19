// src/components/details/ImageCarousel.js
import React from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => (
  <FlatList
    data={images}
    horizontal
    pagingEnabled
    showsHorizontalScrollIndicator={false}
    keyExtractor={(item, index) => `${item}-${index}`}
    renderItem={({ item }) => (
      <View style={styles.imageContainer}>
        <Image source={require('../assets/images/placeholder.jpg')} style={styles.image} />
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  imageContainer: { width: width, height: 250 },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
});

export default ImageCarousel;