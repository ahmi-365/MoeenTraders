// FileName: StepContent.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Import reusable components and styles
import { CustomDropdown, EnhancedInput, styles } from './FormComponents';

// Configuration for each step of the form
export const steps = [
  { title: 'Personal Details', icon: 'person-outline' },
  { title: 'Vehicle Details', icon: 'car-sport-outline' },
  { title: 'Upload Images', icon: 'camera-outline' },
];

// Dropdown data
const carBrands = [
  'Toyota', 'Honda', 'Nissan', 'Hyundai', 'Suzuki', 'Kia', 'Mercedes-Benz',
  'BMW', 'Audi', 'Volkswagen', 'Ford', 'Chevrolet', 'Mazda', 'Mitsubishi'
];

const carModels: Record<string, string[]> = {
  'Toyota': ['Corolla', 'Camry', 'Prius', 'RAV4', 'Highlander', 'Land Cruiser'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit', 'HR-V'],
  'Nissan': ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Frontier', 'Titan'],
  'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Genesis', 'Accent'],
  'Suzuki': ['Swift', 'Vitara', 'Jimny', 'Baleno', 'Cultus', 'Wagon R'],
  'Default': ['Select Brand First']
};

const commonQuestions = [
  'Why are you selling this car?',
  'Has the car been in any accidents?',
  'What is the service history?',
  'Are there any mechanical issues?',
  'Is the car still under warranty?',
  'How many previous owners?'
];

// ==========================
// ✅ Type Declarations
// ==========================
export type FormDataType = {
  fullName: string;
  contactNumber: string;
  email: string;
  brand: string;
  model: string;
  mileage: string;
  specification: string;
  commonQuestion: string;
  additionalNotes: string;
};

export type ImageAsset = {
  uri: string;
  [key: string]: any;
};

type CommonProps = {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
};

type ImageUploadProps = {
  images: ImageAsset[];
  setImages: React.Dispatch<React.SetStateAction<ImageAsset[]>>;
};

// ==========================
// ✅ Step 1: Personal Details
// ==========================
export const PersonalDetails: React.FC<CommonProps> = ({ formData, setFormData }) => (
  <View style={styles.stepContent}>
    <EnhancedInput
      label="Full Name"
      value={formData.fullName}
      onChangeText={(text) => setFormData({ ...formData, fullName: text })}
      placeholder="Enter your full name"
    />
    <EnhancedInput
      label="Contact Number"
      value={formData.contactNumber}
      onChangeText={(text) => setFormData({ ...formData, contactNumber: text })}
      placeholder="Enter your contact number"
      keyboardType="phone-pad"
    />
    <EnhancedInput
      label="Email Address"
      value={formData.email}
      onChangeText={(text) => setFormData({ ...formData, email: text })}
      placeholder="Enter your email address"
      keyboardType="email-address"
    />
  </View>
);

// ==========================
// ✅ Step 2: Vehicle Details
// ==========================
export const VehicleDetails: React.FC<CommonProps> = ({ formData, setFormData }) => (
  <View style={styles.stepContent}>
    <CustomDropdown
      label="Brand"
      value={formData.brand}
      onSelect={(brand: string) => setFormData({ ...formData, brand, model: '' })}
      options={carBrands}
      placeholder="Select Vehicle Brand"
    />
    <CustomDropdown
      label="Model"
      value={formData.model}
      onSelect={(model: string) => setFormData({ ...formData, model })}
      options={carModels[formData.brand] || carModels.Default}
      placeholder="Select Vehicle Model"
    />
    <EnhancedInput
      label="Mileage (in km)"
      value={formData.mileage}
      onChangeText={(text) => setFormData({ ...formData, mileage: text })}
      placeholder="e.g., 35,000"
      keyboardType="numeric"
    />
    <EnhancedInput
      label="Specification"
      value={formData.specification}
      onChangeText={(text) => setFormData({ ...formData, specification: text })}
      placeholder="e.g., Automatic, Petrol, VXI"
    />
    <CustomDropdown
      label="Common Question"
      value={formData.commonQuestion}
      onSelect={(question: string) => setFormData({ ...formData, commonQuestion: question })}
      options={commonQuestions}
      placeholder="Select a common question"
    />
    <EnhancedInput
      label="Additional Notes"
      value={formData.additionalNotes}
      onChangeText={(text) => setFormData({ ...formData, additionalNotes: text })}
      placeholder="Any additional notes about your vehicle..."
      multiline={true}
    />
  </View>
);

// ==========================
// ✅ Step 3: Upload Images
// ==========================
export const ImageUploadSection: React.FC<ImageUploadProps> = ({ images, setImages }) => {
  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access photos');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      aspect: [4, 3],
    });
    if (!result.canceled) {
      setImages([...images, ...result.assets]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access camera');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      aspect: [4, 3],
    });
    if (!result.canceled) {
      setImages([...images, ...result.assets]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const showImageOptions = () => {
    Alert.alert('Select Image', 'Choose an option', [
      { text: 'Camera', onPress: takePhoto },
      { text: 'Gallery', onPress: pickImages },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.uploadSection}>
      <TouchableOpacity style={styles.uploadButton} onPress={showImageOptions}>
        <Ionicons name="cloud-upload-outline" size={50} color="#E6B357" />
        <Text style={styles.uploadText}>Upload Vehicle Images</Text>
        <Text style={styles.uploadSubText}>PNG, JPG up to 10MB each</Text>
      </TouchableOpacity>

      {images.length > 0 && (
        <View style={styles.imagePreviewContainer}>
          <Text style={styles.previewTitle}>Selected Images ({images.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((image, index) => (
              <View key={index} style={styles.imagePreview}>
                <Image source={{ uri: image.uri }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color="#FF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};
