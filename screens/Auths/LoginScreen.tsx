import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthService from '../../Service/AuthService'; 
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Animation values
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const cardScaleAnim = useRef(new Animated.Value(0.95)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  
  // Small elements animations
  const floatingDot1 = useRef(new Animated.Value(0)).current;
  const floatingDot2 = useRef(new Animated.Value(0)).current;
  const floatingDot3 = useRef(new Animated.Value(0)).current;
  const bubble1 = useRef(new Animated.Value(0)).current;
  const bubble2 = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  // Input animation values
  const emailLabelAnim = useRef(new Animated.Value(0)).current;
  const passwordLabelAnim = useRef(new Animated.Value(0)).current;
  const emailIconAnim = useRef(new Animated.Value(0)).current;
  const passwordIconAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial entrance animations
    Animated.parallel([
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(cardScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating dots animations - more subtle
    const createFloatingAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 4000 + delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 4000 + delay,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createFloatingAnimation(floatingDot1, 0).start();
    createFloatingAnimation(floatingDot2, 500).start();
    createFloatingAnimation(floatingDot3, 1000).start();

    // Bubble animations with different patterns - more subtle
    createFloatingAnimation(bubble1, 800).start();
    createFloatingAnimation(bubble2, 1200).start();

    // Sparkle animation - reduced intensity
    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Wave background animation - slower
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
      })
    ).start();

    // Glow animation - much more subtle
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const animateLabel = (animValue: Animated.Value, iconAnim: Animated.Value, focused: boolean) => {
    Animated.parallel([
      Animated.timing(animValue, {
        toValue: focused ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(iconAnim, {
        toValue: focused ? 1 : 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.spring(buttonScaleAnim, {
        toValue: 0.95,
        tension: 100,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const shakeAnimation = () => {
    Vibration.vibrate(100);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleEmailFocus = () => {
    setEmailFocused(true);
    animateLabel(emailLabelAnim, emailIconAnim, true);
  };

  const handleEmailBlur = () => {
    setEmailFocused(false);
    if (!email) animateLabel(emailLabelAnim, emailIconAnim, false);
  };

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
    animateLabel(passwordLabelAnim, passwordIconAnim, true);
  };

  const handlePasswordBlur = () => {
    setPasswordFocused(false);
    if (!password) animateLabel(passwordLabelAnim, passwordIconAnim, false);
  };

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      shakeAnimation();
      Alert.alert("Required Fields", "Please enter both email and password");
      return;
    }

    animateButtonPress();
    setIsLoading(true);

    try {
      const { token } = await AuthService.login(email, password);
      // Success animation before navigation
      Animated.spring(cardScaleAnim, {
        toValue: 1.02,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }).start(() => {
        navigation.navigate('MainTabs');
      });

    } catch (error: unknown) {
      shakeAnimation();
      if (error instanceof Error) {
        Alert.alert("Login Failed", error.message);
      } else {
        Alert.alert("Login Failed", "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Animated values interpolations
  const dot1Y = floatingDot1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  const dot2Y = floatingDot2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const dot3Y = floatingDot3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const bubble1Y = bubble1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const bubble1Opacity = bubble1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.4, 0.7, 0.4],
  });

  const bubble2Y = bubble2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const bubble2Scale = bubble2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1],
  });

  const sparkleRotate = sparkleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const sparkleScale = sparkleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.9, 1.05, 0.9],
  });

  const waveTranslateX = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.3],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="#183284" barStyle="light-content" />
      
      {/* Animated Background Elements */}
      <View style={styles.backgroundElements}>
        <Animated.View 
          style={[
            styles.wave,
            {
              transform: [{ translateX: waveTranslateX }],
              opacity: glowOpacity,
            }
          ]} 
        />
        <Animated.View style={[styles.floatingDot, styles.dot1, { transform: [{ translateY: dot1Y }] }]} />
        <Animated.View style={[styles.floatingDot, styles.dot2, { transform: [{ translateY: dot2Y }] }]} />
        <Animated.View style={[styles.floatingDot, styles.dot3, { transform: [{ translateY: dot3Y }] }]} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={true}>
          
          {/* Header Section - Now scrollable */}
          <Animated.View 
            style={[
              styles.headerSection,
              {
                opacity: fadeInAnim,
                transform: [{ translateY: slideUpAnim }]
              }
            ]}>
            <View style={styles.brandContainer}>
              <View style={styles.logoPlaceholder}>
                 <View style={styles.logoIcon}>
      <Image
        source={require('../../assets/images/icon.png')} 
        style={styles.logoImage}
        resizeMode="contain"
      />
    </View>
                <Animated.View 
                  style={[
                    styles.sparkle,
                    {
                      transform: [
                        { rotate: sparkleRotate },
                        { scale: sparkleScale }
                      ]
                    }
                  ]}>
                  <View style={styles.sparkleIcon} />
                </Animated.View>
              </View>
              <Animated.Text style={[styles.brandName, { opacity: fadeInAnim }]}>
                MoeenTraders
              </Animated.Text>
              <Animated.Text style={[styles.brandTagline, { opacity: fadeInAnim }]}>
                Premium Beverages
              </Animated.Text>
            </View>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeInAnim,
                transform: [
                  { translateY: slideUpAnim },
                  { translateX: shakeAnim }
                ]
              }
            ]}>
            
            {/* Welcome Section with bubbles */}
            <View style={styles.welcomeSection}>
              {/* Welcome bubbles positioned at top left */}
              <Animated.View 
                style={[
                  styles.welcomeBubble1,
                  { 
                    transform: [{ translateY: bubble1Y }],
                    opacity: bubble1Opacity,
                  }
                ]} 
              />
              <Animated.View 
                style={[
                  styles.welcomeBubble2,
                  { 
                    transform: [
                      { translateY: bubble2Y },
                      { scale: bubble2Scale }
                    ],
                  }
                ]} 
              />
              
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to access your dashboard
              </Text>
            </View>

            {/* Animated Form Card */}
            <Animated.View 
              style={[
                styles.formCard,
                {
                  transform: [{ scale: cardScaleAnim }]
                }
              ]}>
              
              {/* Email Input with Ionicons */}
              <View style={styles.inputContainer}>
                <View style={styles.labelRow}>
                  <Animated.View
                    style={[
                      styles.inputIconContainer,
                      {
                        transform: [
                          {
                            scale: emailIconAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [1, 1.2],
                            }),
                          },
                        ],
                      },
                    ]}>

                  </Animated.View>
                  <Animated.Text 
                    style={[
                      styles.floatingLabel,
                      {
                        transform: [
                          {
                            translateY: emailLabelAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, -8],
                            }),
                          },
                          {
                            scale: emailLabelAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [1, 0.85],
                            }),
                          },
                        ],
                        color: emailFocused ? '#FF8F3C' : '#183284',
                      },
                    ]}>
UserName                  </Animated.Text>
                </View>
                <TextInput
                  style={[
                    styles.input,
                    emailFocused && styles.inputFocused,
                    email && styles.inputFilled
                  ]}
                  placeholder="UserName or Email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={handleEmailFocus}
                  onBlur={handleEmailBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  editable={!isLoading}
                />
              </View>

              {/* Password Input with Ionicons */}
              <View style={styles.inputContainer}>
                <View style={styles.labelRow}>
                  <Animated.View
                    style={[
                      styles.inputIconContainer,
                      {
                        transform: [
                          {
                            scale: passwordIconAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [1, 1.2],
                            }),
                          },
                        ],
                      },
                    ]}>
                   
                  </Animated.View>
                  <Animated.Text 
                    style={[
                      styles.floatingLabel,
                      {
                        transform: [
                          {
                            translateY: passwordLabelAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, -8],
                            }),
                          },
                          {
                            scale: passwordLabelAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [1, 0.85],
                            }),
                          },
                        ],
                        color: passwordFocused ? '#FF8F3C' : '#183284',
                      },
                    ]}>
                    Password
                  </Animated.Text>
                </View>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.passwordInput,
                      passwordFocused && styles.inputFocused,
                      password && styles.inputFilled
                    ]}
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    onFocus={handlePasswordFocus}
                    onBlur={handlePasswordBlur}
                    secureTextEntry={!showPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleSignIn}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}>
                    <Ionicons 
                      name={showPassword ? "eye-outline" : "eye-off-outline"} 
                      size={22} 
                      color={passwordFocused ? '#FF8F3C' : '#64748B'} 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Animated Sign In Button */}
              <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
                <TouchableOpacity
                  style={[
                    styles.signInButton,
                    isLoading && styles.signInButtonDisabled
                  ]}
                  onPress={handleSignIn}
                  disabled={isLoading}
                  activeOpacity={0.8}>
                  <Animated.View 
                    style={[
                      styles.buttonGlow,
                      { opacity: glowOpacity }
                    ]} 
                  />
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#ffffff" />
                      <Text style={styles.loadingText}>Signing In...</Text>
                    </View>
                  ) : (
                    <View style={styles.buttonContent}>
                      <Text style={styles.signInButtonText}>Sign In to Dashboard</Text>
                      <Animated.View 
                        style={[
                          styles.buttonIconContainer,
                          {
                            transform: [
                              {
                                translateX: glowAnim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0, 5],
                                }),
                              },
                            ],
                          },
                        ]}>
                       
                      </Animated.View>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  wave: {
    position: 'absolute',
    top: '30%',
    left: -width,
    width: width * 2,
    height: 100,
    backgroundColor: 'rgba(255, 143, 60, 0.1)',
    borderRadius: 50,
    transform: [{ rotate: '15deg' }],
  },
  floatingDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 143, 60, 0.4)',
  },
  dot1: {
    top: '20%',
    left: '10%',
  },
  dot2: {
    top: '40%',
    right: '15%',
    backgroundColor: 'rgba(24, 50, 132, 0.3)',
  },
  dot3: {
    top: '70%',
    left: '20%',
    backgroundColor: 'rgba(255, 143, 60, 0.6)',
  },
  keyboardAvoid: {
    flex: 1,
    zIndex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerSection: {
    backgroundColor: '#183284',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 35,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#183284',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  brandContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  logoPlaceholder: {
    width: 70,
    height: 70,
    backgroundColor: '#ffffffff',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#FF8F3C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  logoIcon: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    
  },
  glass: {
    width: 20,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ffffff',
    position: 'relative',
    overflow: 'hidden',
  },
  liquidTop: {
    position: 'absolute',
    top: 4,
    left: 2,
    right: 2,
    height: 6,
    backgroundColor: '#ffffff',
    borderRadius: 2,
    opacity: 0.8,
  },
  liquidBottom: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    right: 2,
    height: 10,
    backgroundColor: '#ffffff',
    borderRadius: 2,
    opacity: 0.6,
  },
  straw: {
    position: 'absolute',
    top: -6,
    right: 6,
    width: 2,
    height: 12,
    backgroundColor: '#ffffff',
    borderRadius: 1,
  },
  sparkle: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  sparkleIcon: {
    width: 6,
    height: 6,
    backgroundColor: '#ffffff',
    transform: [{ rotate: '45deg' }],
  },
  brandName: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: 1.2,
  },
  brandTagline: {
    fontSize: 13,
    color: '#FF8F3C',
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  content: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#183284',
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#183284',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 143, 60, 0.1)',
  },
  inputContainer: {
    marginBottom: 24,
    position: 'relative',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputIconContainer: {
    marginRight: 8,
  },
  floatingLabel: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    fontSize: 16,
    color: '#183284',
    fontWeight: '500',
  },
  inputFocused: {
    borderColor: '#FF8F3C',
    backgroundColor: '#ffffff',
    shadowColor: '#FF8F3C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  inputFilled: {
    backgroundColor: '#ffffff',
    borderColor: '#CBD5E1',
  },
  welcomeBubble1: {
    position: 'absolute',
    top: -15,
    left: -10,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 143, 60, 0.15)',
    zIndex: 1,
  },
  welcomeBubble2: {
    position: 'absolute',
    top: -5,
    left: 15,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(24, 50, 132, 0.12)',
    zIndex: 1,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 60,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 12,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInButton: {
    backgroundColor: '#FF8F3C',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 0,
    shadowColor: '#FF8F3C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
  },
  signInButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0.1,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
    textTransform: 'uppercase',
    marginRight: 12,
  },
  buttonIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 12,
    letterSpacing: 0.4,
  },
});