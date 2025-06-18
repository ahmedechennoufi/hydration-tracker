import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { NeubrutColors } from '../constants/Colors';
import { NeubrutTextStyles } from '../constants/Typography';
import { NeubrutButton } from '../components/NeubrutButton';
import { NeubrutCard } from '../components/NeubrutCard';

interface OnboardingScreenProps {
  navigation: any;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps = [
    {
      title: 'STAY HYDRATED',
      description: 'Track your daily water intake with our neubrutalism-style hydration tracker.',
      emoji: '💧',
    },
    {
      title: 'SET YOUR GOALS',
      description: 'Customize your daily hydration goals and get reminders throughout the day.',
      emoji: '🎯',
    },
    {
      title: 'TRACK PROGRESS',
      description: 'Monitor your hydration habits with beautiful charts and progress tracking.',
      emoji: '📊',
    },
  ];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.navigate('SleepSchedule');
    }
  };

  const handleSkip = () => {
    navigation.navigate('SleepSchedule');
  };

  const step = onboardingSteps[currentStep];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <NeubrutCard style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.emoji}>{step.emoji}</Text>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.description}>{step.description}</Text>
          </View>
        </NeubrutCard>

        <View style={styles.pagination}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentStep && styles.activeDot,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <NeubrutButton
          title="SKIP"
          onPress={handleSkip}
          backgroundColor={NeubrutColors.white}
          style={styles.skipButton}
        />
        <NeubrutButton
          title={currentStep === onboardingSteps.length - 1 ? 'GET STARTED' : 'NEXT'}
          onPress={handleNext}
          backgroundColor={NeubrutColors.electricBlue}
          style={styles.nextButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NeubrutColors.background,
    padding: 20,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    marginBottom: 40,
  },
  cardContent: {
    alignItems: 'center',
    padding: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    ...NeubrutTextStyles.heading1,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    ...NeubrutTextStyles.bodyLarge,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: NeubrutColors.black,
    marginHorizontal: 6,
    opacity: 0.3,
  },
  activeDot: {
    opacity: 1,
    backgroundColor: NeubrutColors.electricBlue,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  skipButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
  },
});