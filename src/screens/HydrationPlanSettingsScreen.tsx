import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NeubrutColors } from '../constants/Colors';
import { NeubrutTextStyles } from '../constants/Typography';
import { NeubrutButton } from '../components/NeubrutButton';
import { HydrationService } from '../services/HydrationService';
import { UserProfile, Gender, ActivityLevel, UnitSystem } from '../types';

interface HydrationPlanSettingsScreenProps {
  navigation: any;
}

export const HydrationPlanSettingsScreen: React.FC<HydrationPlanSettingsScreenProps> = ({ 
  navigation 
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [calculatedGoal, setCalculatedGoal] = useState(2500);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      const goal = HydrationService.calculateDailyGoal(profile);
      setCalculatedGoal(goal);
    }
  }, [profile]);

  const loadProfile = async () => {
    try {
      const userProfile = await HydrationService.getUserProfile();
      if (userProfile) {
        setProfile(userProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    
    try {
      const updatedProfile = { ...profile, ...updates };
      await HydrationService.updateUserProfile(updates);
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleWeightChange = (increment: number) => {
    if (!profile) return;
    
    const newWeight = profile.weight + increment;
    if (profile.unitSystem === 'metric') {
      if (newWeight >= 30 && newWeight <= 200) {
        updateProfile({ weight: newWeight });
      }
    } else {
      if (newWeight >= 66 && newWeight <= 440) {
        updateProfile({ weight: newWeight });
      }
    }
  };

  const renderExpandableSection = (
    title: string,
    value: string,
    sectionKey: string,
    children: React.ReactNode
  ) => {
    const isExpanded = expandedSection === sectionKey;
    
    return (
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setExpandedSection(isExpanded ? null : sectionKey)}
        >
          <View style={styles.sectionLeft}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Text style={styles.sectionValue}>{value}</Text>
          </View>
          <MaterialIcons 
            name={isExpanded ? "expand-less" : "expand-more"} 
            size={24} 
            color={NeubrutColors.black} 
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.sectionContent}>
            {children}
          </View>
        )}
      </View>
    );
  };

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const weightUnit = profile.unitSystem === 'metric' ? 'kg' : 'lbs';
  const goalUnit = profile.unitSystem === 'metric' ? 'mL' : 'fl oz';

  const activityLabels = {
    'not-very-active': 'Not very active',
    'lightly-active': 'Lightly active',
    'active': 'Active',
    'highly-active': 'Highly active',
  };

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
        <Text style={styles.headerTitle}>Hydration Plan</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Goal Display */}
        <View style={styles.goalContainer}>
          <Text style={styles.goalLabel}>YOUR DAILY GOAL</Text>
          <Text style={styles.goalValue}>{calculatedGoal} {goalUnit}</Text>
          <Text style={styles.goalDescription}>
            Based on your personal profile
          </Text>
        </View>

        {/* Gender Section */}
        {renderExpandableSection(
          'SEX',
          profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1),
          'gender',
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                profile.gender === 'male' && styles.activeGender
              ]}
              onPress={() => updateProfile({ gender: 'male' })}
            >
              <MaterialIcons 
                name="male" 
                size={32} 
                color={profile.gender === 'male' ? NeubrutColors.white : NeubrutColors.black} 
              />
              <Text style={[
                styles.genderText,
                profile.gender === 'male' && styles.activeGenderText
              ]}>
                Male
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.genderButton,
                profile.gender === 'female' && styles.activeGender
              ]}
              onPress={() => updateProfile({ gender: 'female' })}
            >
              <MaterialIcons 
                name="female" 
                size={32} 
                color={profile.gender === 'female' ? NeubrutColors.white : NeubrutColors.black} 
              />
              <Text style={[
                styles.genderText,
                profile.gender === 'female' && styles.activeGenderText
              ]}>
                Female
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Weight Section */}
        {renderExpandableSection(
          'WEIGHT',
          `${profile.weight} ${weightUnit}`,
          'weight',
          <View style={styles.weightContainer}>
            <View style={styles.weightControls}>
              <TouchableOpacity
                style={styles.weightButton}
                onPress={() => handleWeightChange(-1)}
              >
                <MaterialIcons name="remove" size={24} color={NeubrutColors.black} />
              </TouchableOpacity>
              
              <View style={styles.weightDisplay}>
                <Text style={styles.weightText}>{profile.weight}</Text>
                <Text style={styles.weightUnit}>{weightUnit}</Text>
              </View>
              
              <TouchableOpacity
                style={styles.weightButton}
                onPress={() => handleWeightChange(1)}
              >
                <MaterialIcons name="add" size={24} color={NeubrutColors.black} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.buttonContainer}>
              <NeubrutButton
                title="CHOOSE"
                onPress={() => setExpandedSection(null)}
                backgroundColor={NeubrutColors.electricBlue}
                style={styles.chooseButton}
              />
            </View>
          </View>
        )}

        {/* Activity Level Section */}
        {renderExpandableSection(
          'DAILY ACTIVITY',
          activityLabels[profile.activityLevel],
          'activity',
          <View style={styles.activityContainer}>
            {(Object.keys(activityLabels) as ActivityLevel[]).map((activity) => (
              <TouchableOpacity
                key={activity}
                style={[
                  styles.activityButton,
                  profile.activityLevel === activity && styles.activeActivity
                ]}
                onPress={() => updateProfile({ activityLevel: activity })}
              >
                <View style={[
                  styles.activityRadio,
                  profile.activityLevel === activity && styles.activeActivityRadio
                ]} />
                <Text style={[
                  styles.activityText,
                  profile.activityLevel === activity && styles.activeActivityText
                ]}>
                  {activityLabels[activity]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
    marginRight: 16,
  },
  headerTitle: {
    ...NeubrutTextStyles.heading2,
    fontSize: 20,
    fontWeight: '900',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  goalContainer: {
    backgroundColor: NeubrutColors.electricBlue,
    borderWidth: 3,
    borderColor: NeubrutColors.black,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  goalLabel: {
    ...NeubrutTextStyles.bodyMedium,
    fontSize: 12,
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
  goalDescription: {
    ...NeubrutTextStyles.bodyMedium,
    fontSize: 12,
    color: NeubrutColors.black,
    marginTop: 4,
  },
  section: {
    backgroundColor: NeubrutColors.white,
    borderWidth: 3,
    borderColor: NeubrutColors.black,
    marginBottom: 16,
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  sectionLeft: {
    flex: 1,
  },
  sectionTitle: {
    ...NeubrutTextStyles.heading3,
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionValue: {
    ...NeubrutTextStyles.bodyLarge,
    fontSize: 14,
    color: NeubrutColors.black,
    marginTop: 4,
  },
  sectionContent: {
    borderTopWidth: 3,
    borderTopColor: NeubrutColors.black,
    padding: 20,
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
    alignItems: 'center',
  },
  weightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NeubrutColors.white,
    borderWidth: 3,
    borderColor: NeubrutColors.black,
    marginBottom: 20,
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
  buttonContainer: {
    width: '50%',
  },
  chooseButton: {
    width: '100%',
  },
  activityContainer: {
    backgroundColor: NeubrutColors.white,
    borderWidth: 3,
    borderColor: NeubrutColors.black,
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
});