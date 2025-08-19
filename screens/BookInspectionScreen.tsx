import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  Easing,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Feather from "react-native-vector-icons/Feather";
import {
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import SuccessModal from "@/components/SuccessMessage";

// --- Interfaces ---
interface FormData {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  vehicleType: string;
  preferredDate: Date | null;
  preferredTime: string;
  location: string;
  modelYear: string;
  make: string;
  model: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

const BookInspectionScreen = () => {
  // --- State Management ---
  const initialFormState: FormData = {
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    vehicleType: "",
    preferredDate: null,
    preferredTime: "",
    location: "",
    modelYear: "",
    make: "",
    model: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [submittedData, setSubmittedData] = useState<Partial<FormData>>({});

  // Animation values
  const [scaleValue] = useState(new Animated.Value(0));
  const [fadeValue] = useState(new Animated.Value(0));

  // --- Data Arrays ---
  const vehicleTypes = [
    "Select vehicle type",
    "Car",
    "Motorcycle",
    "Truck",
    "SUV",
    "Van",
    "Bus",
  ];
  const timeSlots = [
    "Select time",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  // --- Handlers & Logic ---
  const updateFormData = (
    field: keyof FormData,
    value: string | Date | null
  ) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      updateFormData("preferredDate", selectedDate);
    }
  };

  // const validateForm = (): boolean => {
  //   const newErrors: FormErrors = {};
  //   if (!formData.fullName) newErrors.fullName = "Full name is required";
  //   if (!formData.phoneNumber)
  //     newErrors.phoneNumber = "Phone number is required";
  //   else if (!/^[0-9+\-\s()]+$/.test(formData.phoneNumber))
  //     newErrors.phoneNumber = "Please enter a valid phone number";

  //   if (!formData.emailAddress) newErrors.emailAddress = "Email is required";
  //   else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress))
  //     newErrors.emailAddress = "Please enter a valid email";

  //   if (!formData.vehicleType || formData.vehicleType === "Select vehicle type")
  //     newErrors.vehicleType = "Please select a vehicle type";
  //   if (!formData.preferredDate)
  //     newErrors.preferredDate = "Please select a date";
  //   if (!formData.preferredTime || formData.preferredTime === "Select time")
  //     newErrors.preferredTime = "Please select a time";
  //   if (!formData.location) newErrors.location = "Location is required";

  //   // *** CHANGE: Added validation for required vehicle details ***
  //   if (!formData.modelYear) newErrors.modelYear = "Model year is required";
  //   if (!formData.make) newErrors.make = "Vehicle make is required";
  //   if (!formData.model) newErrors.model = "Vehicle model is required";

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const handleSubmit = () => {
    // if (validateForm()) {
      setIsLoading(true);
      setSubmittedData({ ...formData });

      setTimeout(() => {
        setIsLoading(false);
        setShowSuccess(true);

        Animated.parallel([
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 500,
            easing: Easing.elastic(1.2),
            useNativeDriver: true,
          }),
          Animated.timing(fadeValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();

        setFormData(initialFormState);
      }, 1500);
    // }
  };
  const closeSuccessModal = () => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSuccess(false);
      scaleValue.setValue(0);
      fadeValue.setValue(0);
      setSubmittedData({});
    });
  };

  const renderInput = (
    field: keyof FormData,
    label: string,
    placeholder: string,
    iconName: string,
    keyboardType:
      | "default"
      | "phone-pad"
      | "email-address"
      | "numeric" = "default"
  ) => (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          errors[field] ? styles.errorInput : null,
        ]}
      >
        <Feather
          name={iconName}
          size={20}
          color={errors[field] ? "#d32f2f" : "#666"}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={formData[field] as string}
          onChangeText={(text) => updateFormData(field, text)}
          keyboardType={keyboardType}
          placeholderTextColor="#999"
          autoCapitalize={field === "emailAddress" ? "none" : "words"}
        />
      </View>
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
<SafeAreaView style={styles.safeArea}>
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20} // Adjust if needed
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1 }}>
          {/* HEADER SECTION */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Book an Inspection</Text>
            <Text style={styles.headerSubtitle}>
              Fast, reliable, and right at your doorstep. Fill out the
              details below to schedule your appointment.
            </Text>
          </View>

         <View style={styles.formContainer}>
                  {/* --- Personal Information --- */}
                  <Text style={styles.sectionTitle}>Your Information</Text>
                  <View style={styles.row}>
                    <View style={styles.halfWidth}>
                      {renderInput("fullName", "Full Name", "John Doe", "user")}
                    </View>
                    <View style={styles.halfWidth}>
                      {renderInput(
                        "phoneNumber",
                        "Phone Number",
                        "+93 700 000 ",
                        "phone",
                        "phone-pad"
                      )}
                    </View>
                  </View>
                  {renderInput(
                    "emailAddress",
                    "Email Address",
                    "you@example.com",
                    "mail",
                    "email-address"
                  )}

                  {/* --- Appointment Details --- */}
                  <Text style={styles.sectionTitle}>Appointment Details</Text>
                  <View style={styles.row}>
                    <View style={styles.halfWidth}>
                      <Text style={styles.label}>Preferred Date</Text>
                      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <View
                          style={[
                            styles.inputContainer,
                            styles.datePickerButton,
                            errors.preferredDate ? styles.errorInput : null,
                          ]}
                        >
                          <Feather
                            name="calendar"
                            size={20}
                            color={errors.preferredDate ? "#d32f2f" : "#666"}
                            style={styles.icon}
                          />
                          <Text
                            style={[
                              styles.input,
                              formData.preferredDate
                                ? styles.dateText
                                : styles.datePlaceholder,
                            ]}
                          >
                            {formData.preferredDate
                              ? formData.preferredDate.toLocaleDateString()
                              : "Select a date"}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      {errors.preferredDate && (
                        <Text style={styles.errorText}>
                          {errors.preferredDate}
                        </Text>
                      )}
                    </View>

                    <View style={styles.halfWidth}>
                      <Text style={styles.label}>Preferred Time</Text>
                      <View
                        style={[
                          styles.pickerContainer,
                          errors.preferredTime ? styles.errorInput : null,
                        ]}
                      >
                        <Picker
                          selectedValue={formData.preferredTime}
                          onValueChange={(itemValue) =>
                            updateFormData("preferredTime", itemValue)
                          }
                        >
                          {timeSlots.map((time) => (
                            <Picker.Item key={time} label={time} value={time} />
                          ))}
                        </Picker>
                      </View>
                      {errors.preferredTime && (
                        <Text style={styles.errorText}>
                          {errors.preferredTime}
                        </Text>
                      )}
                    </View>
                  </View>

                  {renderInput(
                    "location",
                    "Location / Address",
                    "Your full address",
                    "map-pin"
                  )}

                  {/* --- Vehicle Details --- */}
                  <Text style={styles.sectionTitle}>Vehicle Details</Text>
                  <View style={styles.row}>
                    <View style={styles.thirdWidth}>
                      {renderInput(
                        "modelYear",
                        "Year",
                        "2022",
                        "hash",
                        "numeric"
                      )}
                    </View>
                    <View style={styles.thirdWidth}>
                      {renderInput("make", "Make", "Toyota", "shield")}
                    </View>
                    <View style={styles.thirdWidth}>
                      {renderInput("model", "Model", "Corolla", "truck")}
                    </View>
                  </View>

                  {/* --- Submit Button --- */}
                  <TouchableOpacity
                    style={styles.submitButton}

                    onPress={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.submitButtonText}>Book Now</Text>
                    )}
                  </TouchableOpacity>
                </View>

          {/* Date Picker Modal */}
          {showDatePicker && (
            <DateTimePicker
              value={formData.preferredDate || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {/* Success Modal */}
          <SuccessModal
            visible={showSuccess}
            onClose={closeSuccessModal}
            date={
              submittedData.preferredDate
                ? new Date(submittedData.preferredDate).toLocaleDateString()
                : ""
            }
            time={submittedData.preferredTime || ""}
            location={submittedData.location || ""}
          />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
</SafeAreaView>

  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f0f4f8" },
  container: { flex: 1 },
  header: {
    backgroundColor: "#FFB800",
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 70,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 24,
  },
  formContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    padding: 25,
    borderRadius: 16,
    marginTop: -50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#FFB800",
    paddingLeft: 10,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  halfWidth: { width: "48%" },
  thirdWidth: { width: "32%" },
  inputWrapper: { marginBottom: 20, width: "100%" },
  label: { fontSize: 14, fontWeight: "600", color: "#444", marginBottom: 8 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  icon: { paddingLeft: 4, paddingRight: 2 },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    fontSize: 15,
    color: "#333",
  },
  datePickerButton: { paddingVertical: 2, paddingHorizontal: 0 },
  dateText: { color: "#333" },
  datePlaceholder: { color: "#999" },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
  },
  picker: { color: "#333", height: 50 },
  errorInput: { borderColor: "#d32f2f" },
  errorText: { color: "#d32f2f", fontSize: 12, marginTop: 4, marginLeft: 2 },
  submitButton: {
    backgroundColor: "#FFB800",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#FFB800",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: { backgroundColor: "#a0c7ff" },
  submitButtonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  successModal: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: "100%",
    maxWidth: 350,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#28a745",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    transform: [{ translateY: -60 }],
    borderWidth: 5,
    borderColor: "#fff",
  },
  successTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginTop: -40,
    marginBottom: 15,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 25,
  },
  successDetails: {
    backgroundColor: "#f0f4f8",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginBottom: 25,
  },
  successDetailText: {
    fontSize: 15,
    color: "#333",
    marginBottom: 8,
    textAlign: "left",
  },
  successButton: {
    backgroundColor: "#28a745",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: "#28a745",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  successButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

export default BookInspectionScreen;
