import React from 'react';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Animated, Easing } from 'react-native';

const Container = styled.View`
  padding: 40px 20px;
  background-color: #f8f9fa;
  border-radius: 15px;
  margin: 10px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 5;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: #1a1a2e;
  text-align: center;
  margin-bottom: 30px;
  letter-spacing: 0.5px;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
`;

const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const FeatureCard = styled(Animated.View)`
  width: 48%;
  align-items: center;
  margin-bottom: 25px;
  padding: 15px 10px;
  border-radius: 12px;
  background-color: #ffffff;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.08;
  shadow-radius: 4px;
  elevation: 2;
`;

const GradientContainer = styled(LinearGradient)`
  width: 70px;
  height: 70px;
  border-radius: 35px;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 3px;
  elevation: 3;
`;

const FeatureTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1a1a2e;
  margin-bottom: 8px;
  text-align: center;
  letter-spacing: 0.3px;
`;

const FeatureText = styled.Text`
  font-size: 14px;
  color: #6c757d;
  text-align: center;
  line-height: 20px;
  letter-spacing: 0.2px;
`;

// Define gradient colors for each feature card
const gradients = [
  ['#4facfe', '#00f2fe'], // Blue gradient
  ['#ff9a9e', '#fad0c4'], // Pink gradient
  ['#a1c4fd', '#c2e9fb'], // Light blue gradient
  ['#ffecd2', '#fcb69f'], // Orange gradient
];

const features = [
  { icon: 'cash-fast', title: 'Instant Offers', text: 'Our advanced valuation system provides you with an accurate, competitive quote in just seconds – no waiting, no haggling, and absolutely no pressure.' },
  { icon: 'truck-delivery-outline', title: 'Free Nationwide Collection', text: 'We come to you – wherever you are. Our professional team will collect your vehicle at a time and place that suits you, completely free of charge.' },
  { icon: 'shield-check-outline', title: 'No Hidden Fees, Ever', text: 'What we offer is what you get. We believe in full transparency – no admin costs, no service charges, and no unexpected deductions.' },
  { icon: 'account-group-outline', title: 'Trusted by many Sellers', text: 'Join the growing community of satisfied customers who’ve successfully sold their cars through our platform. We’re known for fair pricing, fast payouts, and exceptional service.' },
];

const WhyUs = () => {
  // Create animated values for each feature card
  const animatedValues = React.useRef(features.map(() => new Animated.Value(0))).current;
  
  React.useEffect(() => {
    // Animate each card with a staggered delay
    animatedValues.forEach((value, index) => {
      Animated.timing(value, {
        toValue: 1,
        duration: 600,
        delay: index * 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
  }, []);
  
  return (
  <Container>
    <Title>Why Sell With Us?</Title>
    <Grid>
      {features.map((feature, index) => {
        // Create animations for each card
        const animatedStyle = {
          opacity: animatedValues[index],
          transform: [
            {
              translateY: animatedValues[index].interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        };
        
        return (
          <FeatureCard key={index} style={animatedStyle}>
            <GradientContainer
              colors={gradients[index]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name={feature.icon} size={35} color="#ffffff" />
            </GradientContainer>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureText>{feature.text}</FeatureText>
          </FeatureCard>
        );
      })}
    </Grid>
  </Container>
  );
};

export default WhyUs;