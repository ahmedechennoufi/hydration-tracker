import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NeubrutColors } from '../constants/Colors';
import { NeubrutTextStyles } from '../constants/Typography';
import { NeubrutButton } from '../components/NeubrutButton';
import { HydrationService } from '../services/HydrationService';

interface WelcomeIntroScreenProps {
  navigation: any;
  route: any;
}

export const WelcomeIntroScreen: React.FC<WelcomeIntroScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { 
    wakeUpTime, 
    bedTime, 
    unitSystem, 
    gender, 
    weight, 
    activityLevel, 
    calculatedGoal 
  } = route.params;

  const handleComplete = async () => {
    try {
      // Save user profile and settings
      await HydrationService.completeOnboarding({
        wakeUpTime,
        bedTime,
        unitSystem,
        gender,
        weight,
        activityLevel,
        calculatedGoal,
      });

      // Navigate to main app
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Dots */}
      <View style={styles.header}>
        <View style={styles.progressDots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Water Drop Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.dropContainer}>
            <MaterialIcons name="water-drop" size={100} color={NeubrutColors.electricBlue} />
          </View>
        </View>

        <Text style={styles.title}>Always hydrate</Text>
        <Text style={styles.subtitle}>
          Stay healthy and energized by drinking enough water throughout the day. 
          Your personalized goal will help you maintain optimal hydration.
        </Text>

        {/* Goal Summary */}
        <View style={styles.goalSummary}>
          <Text style={styles.goalLabel}>Your daily goal</Text>
          <Text style={styles.goalValue}>
            {calculatedGoal} {unitSystem === 'metric' ? 'mL' : 'fl oz'}
          </Text>
        </View>

        {/* Get Started Button */}
        <View style={styles.buttonContainer}>
          <NeubrutButton
            title="GET STARTED"
            onPress={handleComplete}
            backgroundColor={NeubrutColors.electricBlue}
            style={styles.getStartedButton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NeubrutColors.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: NeubrutColors.background,
    borderWidth: 2,
    borderColor: NeubrutColors.black,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: NeubrutColors.electricBlue,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationContainer: {
    marginBottom: 60,
  },
  dropContainer: {
    width: 140,
    height: 140,
    backgroundColor: NeubrutColors.white,
    borderWidth: 3,
    borderColor: NeubrutColors.black,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  title: {
    ...NeubrutTextStyles.heading1,
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 20,
    color: NeubrutColors.black,
  },
  subtitle: {
    ...NeubrutTextStyles.bodyLarge,
    fontSize: 16,
    textAlign: 'center',
    color: NeubrutColors.black,
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  goalSummary: {
    backgroundColor: NeubrutColors.limeGreen,
    borderWidth: 3,
    borderColor: NeubrutColors.black,
    padding: 24,
    alignItems: 'center',
    marginBottom: 60,
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    minWidth: 200,
  },
  goalLabel: {
    ...NeubrutTextStyles.bodyMedium,
    fontSize: 14,
    fontWeight: '700',
    color: NeubrutColors.black,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  goalValue: {
    ...NeubrutTextStyles.heading1,
    fontSize: 28,
    fontWeight: '900',
    color: NeubrutColors.black,
    marginTop: 8,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 40,
  },
  getStartedButton: {
    width: '100%',
    paddingVertical: 20,
  },
});