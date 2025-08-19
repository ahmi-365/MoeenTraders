// FileName: SellCarScreen.tsx

import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { styles } from '../../components/SellCar/FormComponents';
import {
  steps,
  PersonalDetails,
  VehicleDetails,
  ImageUploadSection,
  FormDataType,
  ImageAsset,
} from '../../components/SellCar/StepContent';

const SellCarScreen = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [formData, setFormData] = useState<FormDataType>({
    fullName: '',
    contactNumber: '',
    email: '',
    brand: '',
    model: '',
    mileage: '',
    specification: '',
    commonQuestion: '',
    additionalNotes: '',
  });

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      Alert.alert('Success!', 'Your vehicle listing has been submitted successfully.', [
        {
          text: 'OK',
          onPress: () => console.log('Form submitted:', { formData, images }),
        },
      ]);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <PersonalDetails formData={formData} setFormData={setFormData} />;
      case 1:
        return <VehicleDetails formData={formData} setFormData={setFormData} />;
      case 2:
        return <ImageUploadSection images={images} setImages={setImages} />;
      default:
        return null;
    }
  };

  const getStepProgress = () => ((activeStep + 1) / steps.length) * 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.mainTitle}>Sell Your Vehicle</Text>
            <Text style={styles.subtitle}>Step {activeStep + 1} of {steps.length}</Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${getStepProgress()}%` }]} />
            </View>
          </View>

          <View style={styles.stepperContainer}>
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <View style={styles.step}>
                  <TouchableOpacity
                    style={[
                      styles.stepIconContainer,
                      activeStep === index && styles.activeStepIcon,
                      activeStep > index && styles.completedStepIcon,
                    ]}
                    onPress={() => setActiveStep(index)}
                  >
                    {/* <Ionicons
                      name={activeStep > index ? 'checkmark' : step.icon}
                      size={24}
                      color={activeStep >= index ? '#fff' : '#888'}
                    /> */}
                  </TouchableOpacity>
                  <Text style={[styles.stepTitle, activeStep === index && styles.activeStepTitle]}>
                    {step.title}
                  </Text>
                </View>
                {index < steps.length - 1 && (
                  <View style={[styles.connector, activeStep > index && styles.activeConnector]} />
                )}
              </React.Fragment>
            ))}
          </View>

          <View style={styles.formContent}>
            <Text style={styles.contentTitle}>{steps[activeStep].title}</Text>
            {renderStepContent()}
          </View>

          <View style={styles.buttonContainer}>
            {activeStep > 0 && (
              <TouchableOpacity style={styles.previousButton} onPress={handlePrevious} activeOpacity={0.8}>
                <Ionicons name="arrow-back" size={20} color="#333" />
                <Text style={styles.previousButtonText}>Previous</Text>
              </TouchableOpacity>
            )}
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.8}>
              <Text style={styles.nextButtonText}>
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Text>
              <Ionicons 
                name={activeStep === steps.length - 1 ? 'checkmark' : 'arrow-forward'} 
                size={20} 
                color="#fff" 
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SellCarScreen;
