import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NeubrutColors } from '../constants/Colors';
import { NeubrutTextStyles } from '../constants/Typography';
import { NeubrutButton } from '../components/NeubrutButton';
import { UnitSystem, Gender, ActivityLevel } from '../types';

interface HydrationPlanScreenProps {
  navigation: any;
  route: any;
}

export const HydrationPlanScreen: React.FC<HydrationPlanScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { wakeUpTime, bedTime } = route.params;
  
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [gender, setGender] = useState<Gender>('male');
  const [weight, setWeight] = useState(70);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('active');
  const [calculatedGoal, setCalculatedGoal] = useState(2500);

  const calculateDailyGoal = () => {
    // Base calculation: 35ml per kg for males, 31ml per kg for females
    const baseRate = gender === 'male' ? 35 : 31;
    let goal = weight * baseRate;

    // Activity level adjustments
    const activityMultipliers = {
      'not-very-active': 1.0,
      'lightly-active': 1.1,
      'active': 1.2,
      'highly-active': 1.4,
    };

    goal *= activityMultipliers[activityLevel];

    // Convert to imperial if needed
    if (unitSystem === 'imperial') {
      goal = goal / 29.5735; // Convert ml to fl oz
    }

    setCalculatedGoal(Math.round(goal));
  };

  useEffect(() => {
    calculateDailyGoal();
  }, [gender, weight, activityLevel, unitSystem]);

  const handleWeightChange = (increment: number) => {
    const newWeight = weight + increment;
    if (unitSystem === 'metric') {
      if (newWeight >= 30 && newWeight <= 200) {
        setWeight(newWeight);
      }
    } else {
      if (newWeight >= 66 && newWeight <= 440) { // lbs range
        setWeight(newWeight);
      }
    }
  };

  const handleNext = () => {
    navigation.navigate('WelcomeIntro', {
      wakeUpTime,
      bedTime,
      unitSystem,
      gender,
      weight,
      activityLevel,
      calculatedGoal,
    });
  };

  const weightUnit = unitSystem === 'metric' ? 'kg' : 'lbs';
  const goalUnit = unitSystem === 'metric' ? 'mL' : 'fl oz';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={NeubrutColors.black} />
        </TouchableOpacity>
        
        <View style={styles.progressDots}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
        </View>
        
        <TouchableOpacity 
          style={styles.forwardButton}
          onPress={handleNext}
        >
          <MaterialIcons name="arrow-forward" size={24} color={NeubrutColors.black} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Customize your hydration plan</Text>
        
        {/* Calculated Goal Display */}
        <View style={styles.goalContainer}>
          <Text style={styles.goalLabel}>YOUR DAILY GOAL</Text>
          <Text style={styles.goalValue}>{calculatedGoal} {goalUnit}</Text>
        </View>

        {/* Unit System Toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>UNIT SYSTEM</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                unitSystem === 'metric' && styles.activeToggle
              ]}
              onPress={() => setUnitSystem('metric')}
            >
              <Text style={[
                styles.toggleText,
                unitSystem === 'metric' && styles.activeToggleText
              ]}>
                Metric
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                unitSystem === 'imperial' && styles.activeToggle
              ]}
              onPress={() => setUnitSystem('imperial')}
            >
              <Text style={[
                styles.toggleText,
                unitSystem === 'imperial' && styles.activeToggleText
              ]}>
                Imperial
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Gender Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GENDER</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === 'male' && styles.activeGender
              ]}
              onPress={() => setGender('male')}
            >
              <MaterialIcons 
                name="male" 
                size={32} 
                color={gender === 'male' ? NeubrutColors.white : NeubrutColors.black} 
              />
              <Text style={[
                styles.genderText,
                gender === 'male' && styles.activeGenderText
              ]}>
                Male
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === 'female' && styles.activeGender
              ]}
              onPress={() => setGender('female')}
            >
              <MaterialIcons 
                name="female" 
                size={32} 
                color={gender === 'female' ? NeubrutColors.white : NeubrutColors.black} 
              />
              <Text style={[
                styles.genderText,
                gender === 'female' && styles.activeGenderText
              ]}>
                Female
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weight Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>WEIGHT ({weightUnit})</Text>
          <View style={styles.weightContainer}>
            <TouchableOpacity
              style={styles.weightButton}
              onPress={() => handleWeightChange(-1)}
            >
              <MaterialIcons name="remove" size={24} color={NeubrutColors.black} />
            </TouchableOpacity>
            
            <View style={styles.weightDisplay}>
              <Text style={styles.weightText}>{weight}</Text>
              <Text style={styles.weightUnit}>{weightUnit}</Text>
            </View>
            
            <TouchableOpacity
              style={styles.weightButton}
              onPress={() => handleWeightChange(1)}
            >
              <MaterialIcons name="add" size={24} color={NeubrutColors.black} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Activity Level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DAILY ACTIVITY</Text>
          <View style={styles.activityContainer}>
            {[
              { key: 'not-very-active', label: 'Not very active' },
              { key: 'lightly-active', label: 'Lightly active' },
              { key: 'active', label: 'Active' },
              { key: 'highly-active', label: 'Highly active' },
            ].map((activity) => (
              <TouchableOpacity
                key={activity.key}
                style={[
                  styles.activityButton,
                  activityLevel === activity.key && styles.activeActivity
                ]}
                onPress={() => setActivityLevel(activity.key as ActivityLevel)}
              >
                <View style={[
                  styles.activityRadio,
                  activityLevel === activity.key && styles.activeActivityRadio
                ]} />
                <Text style={[
                  styles.activityText,
                  activityLevel === activity.key && styles.activeActivityText
                ]}>
                  {activity.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <NeubrutButton
            title="CONTINUE"
            onPress={handleNext}
            backgroundColor={NeubrutColors.electricBlue}
            style={styles.continueButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NeubrutColors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    backgroundColor: NeubrutColors.white,
    borderWidth: 2,
    borderColor: NeubrutColors.black,
    borderRadius: 25,
  },
  forwardButton: {
    padding: 8,
    backgroundColor: NeubrutColors.white,
    borderWidth: 2,
    borderColor: NeubrutColors.black,
    borderRadius: 25,
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
  },
  title: {
    ...NeubrutTextStyles.heading1,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 32,
  },
  goalContainer: {
    backgroundColor: NeubrutColors.electricBlue,
    borderWidth: 3,
    borderColor: NeubrutColors.black,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  goalLabel: {
    ...NeubrutTextStyles.bodyMedium,
    fontSize: 14,
    fontWeight: '700',
    color: NeubrutColors.black,
    letterSpacing: 1,
  },
  goalValue: {
    ...NeubrutTextStyles.heading1,
    fontSize: 36,
    fontWeight: '900',
    color: NeubrutColors.black,
    marginTop: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    ...NeubrutTextStyles.heading3,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: NeubrutColors.white,
    borderWidth: 3,
    borderColor: NeubrutColors.black,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRightWidth: 1.5,
    borderColor: NeubrutColors.black,
  },
  activeToggle: {
    backgroundColor: NeubrutColors.electricBlue,
  },
  toggleText: {
    ...NeubrutTextStyles.bodyLarge,
    fontWeight: '600',
    color: NeubrutColors.black,
  },
  activeToggleText: {
    color: NeubrutColors.black,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    backgroundColor: NeubrutColors.white,
    borderWidth: 3,
    borderColor: NeubrutColors.black,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  activeGender: {
    backgroundColor: NeubrutColors.electricBlue,
  },
  genderText: {
    ...NeubrutTextStyles.bodyLarge,
    fontWeight: '600',
    marginTop: 8,
    color: NeubrutColors.black,
  },
  activeGenderText: {
    color: NeubrutColors.white,
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NeubrutColors.white,
    borderWidth: 3,
    borderColor: NeubrutColors.black,
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  weightButton: {
    padding: 20,
    borderRightWidth: 3,
    borderColor: NeubrutColors.black,
  },
  weightDisplay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  weightText: {
    ...NeubrutTextStyles.heading2,
    fontSize: 32,
    fontWeight: '900',
  },
  weightUnit: {
    ...NeubrutTextStyles.bodyMedium,
    fontSize: 14,
    color: NeubrutColors.black,
    marginTop: 4,
  },
  activityContainer: {
    backgroundColor: NeubrutColors.white,
    borderWidth: 3,
    borderColor: NeubrutColors.black,
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  activityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 2,
    borderColor: NeubrutColors.black,
  },
  activeActivity: {
    backgroundColor: NeubrutColors.limeGreen,
  },
  activityRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: NeubrutColors.black,
    marginRight: 16,
  },
  activeActivityRadio: {
    backgroundColor: NeubrutColors.electricBlue,
  },
  activityText: {
    ...NeubrutTextStyles.bodyLarge,
    fontWeight: '600',
  },
  activeActivityText: {
    fontWeight: '700',
  },
  buttonContainer: {
    marginTop: 32,
    marginBottom: 40,
  },
  continueButton: {
    width: '100%',
  },
});