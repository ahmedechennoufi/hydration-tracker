import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NeubrutColors } from '../constants/Colors';
import { NeubrutTextStyles } from '../constants/Typography';
import { NeubrutCard } from '../components/NeubrutCard';
import { HydrationService } from '../services/HydrationService';
import { UserSettings, UserProfile } from '../types';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [settings, setSettings] = useState<UserSettings>({
    dailyGoal: 2500,
    notificationsEnabled: true,
    reminderInterval: 2,
    soundEnabled: true,
    profile: {
      gender: 'male',
      weight: 70,
      activityLevel: 'active',
      unitSystem: 'metric',
      wakeUpTime: '08:00',
      bedTime: '22:00',
      hasCompletedOnboarding: false,
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const userSettings = await HydrationService.getSettings();
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSettings = async (newSettings: UserSettings) => {
    try {
      await HydrationService.updateSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      Alert.alert('Error', 'Failed to update settings');
    }
  };

  const handleUnitSystemChange = async (unitSystem: 'metric' | 'imperial') => {
    const updatedProfile = { ...settings.profile, unitSystem };
    const updatedSettings = { ...settings, profile: updatedProfile };
    await updateSettings(updatedSettings);
    
    try {
      await HydrationService.updateUserProfile({ unitSystem });
    } catch (error) {
      console.error('Error updating unit system:', error);
    }
  };

  const handleToggleNotifications = async (value: boolean) => {
    const updatedSettings = { ...settings, notificationsEnabled: value };
    await updateSettings(updatedSettings);
  };

  const handleToggleSound = async (value: boolean) => {
    const updatedSettings = { ...settings, soundEnabled: value };
    await updateSettings(updatedSettings);
  };

  const handleRateUs = () => {
    Alert.alert('Rate Us', 'Thank you for your feedback!');
  };

  const handleShareApp = () => {
    Alert.alert('Share App', 'Share this amazing hydration app with your friends!');
  };

  const handleRemoveAds = () => {
    Alert.alert('Remove Ads', 'Upgrade to premium to remove ads!');
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your hydration data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await HydrationService.clearAllData();
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={NeubrutColors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>SETTINGS</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hydration Plan */}
        <TouchableOpacity onPress={() => navigation.navigate('HydrationPlanSettings')}>
          <NeubrutCard style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>HYDRATION PLAN</Text>
                <Text style={styles.settingValue}>{settings.dailyGoal} mL</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={NeubrutColors.black} />
            </View>
          </NeubrutCard>
        </TouchableOpacity>

        {/* Units */}
        <NeubrutCard style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>UNITS</Text>
              <Text style={styles.settingValue}>
                {settings.profile.unitSystem === 'metric' ? 'Metric' : 'Imperial'}
              </Text>
            </View>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  settings.profile.unitSystem === 'metric' && styles.activeToggle
                ]}
                onPress={() => handleUnitSystemChange('metric')}
              >
                <Text style={[
                  styles.toggleText,
                  settings.profile.unitSystem === 'metric' && styles.activeToggleText
                ]}>
                  Metric
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  settings.profile.unitSystem === 'imperial' && styles.activeToggle
                ]}
                onPress={() => handleUnitSystemChange('imperial')}
              >
                <Text style={[
                  styles.toggleText,
                  settings.profile.unitSystem === 'imperial' && styles.activeToggleText
                ]}>
                  Imperial
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </NeubrutCard>

        {/* Reminder */}
        <NeubrutCard style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>REMINDER</Text>
              <Text style={styles.settingValue}>
                {settings.notificationsEnabled ? 'ON' : 'OFF'}
              </Text>
            </View>
            <View style={styles.switchContainer}>
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ 
                  false: NeubrutColors.background, 
                  true: NeubrutColors.electricBlue 
                }}
                thumbColor={NeubrutColors.white}
                ios_backgroundColor={NeubrutColors.background}
              />
            </View>
          </View>
        </NeubrutCard>

        {/* Sound */}
        <NeubrutCard style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>SOUND</Text>
              <Text style={styles.settingValue}>
                {settings.soundEnabled ? 'ON' : 'OFF'}
              </Text>
            </View>
            <View style={styles.switchContainer}>
              <Switch
                value={settings.soundEnabled}
                onValueChange={handleToggleSound}
                trackColor={{ 
                  false: NeubrutColors.background, 
                  true: NeubrutColors.electricBlue 
                }}
                thumbColor={NeubrutColors.white}
                ios_backgroundColor={NeubrutColors.background}
              />
            </View>
          </View>
        </NeubrutCard>

        {/* Remove Ads */}
        <TouchableOpacity onPress={handleRemoveAds}>
          <NeubrutCard style={[styles.settingCard, styles.premiumCard] as any}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, styles.premiumTitle] as any}>REMOVE ADS</Text>
                <Text style={styles.settingValue}>Upgrade to Premium</Text>
              </View>
              <MaterialIcons name="star" size={24} color={NeubrutColors.yellow} />
            </View>
          </NeubrutCard>
        </TouchableOpacity>

        {/* Rate Us */}
        <TouchableOpacity onPress={handleRateUs}>
          <NeubrutCard style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>RATE US</Text>
                <Text style={styles.settingValue}>Share your feedback</Text>
              </View>
              <MaterialIcons name="star-rate" size={24} color={NeubrutColors.yellow} />
            </View>
          </NeubrutCard>
        </TouchableOpacity>

        {/* Share */}
        <TouchableOpacity onPress={handleShareApp}>
          <NeubrutCard style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>SHARE</Text>
                <Text style={styles.settingValue}>Tell your friends</Text>
              </View>
              <MaterialIcons name="share" size={24} color={NeubrutColors.electricBlue} />
            </View>
          </NeubrutCard>
        </TouchableOpacity>

        {/* Danger Zone */}
        <NeubrutCard style={[styles.settingCard, styles.dangerCard] as any}>
          <Text style={styles.settingTitle}>DANGER ZONE</Text>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearData}
          >
            <MaterialIcons name="delete-forever" size={20} color={NeubrutColors.white} />
            <Text style={styles.dangerButtonText}>CLEAR ALL DATA</Text>
          </TouchableOpacity>
        </NeubrutCard>
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
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  title: {
    ...NeubrutTextStyles.heading2,
    fontSize: 20,
    fontWeight: '900',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  settingCard: {
    marginBottom: 16,
    padding: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    ...NeubrutTextStyles.heading3,
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  settingValue: {
    ...NeubrutTextStyles.bodyMedium,
    fontSize: 14,
    color: NeubrutColors.black,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: NeubrutColors.background,
    borderWidth: 2,
    borderColor: NeubrutColors.black,
    borderRadius: 4,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: NeubrutColors.background,
  },
  activeToggle: {
    backgroundColor: NeubrutColors.electricBlue,
  },
  toggleText: {
    ...NeubrutTextStyles.bodyMedium,
    fontSize: 12,
    fontWeight: '600',
    color: NeubrutColors.black,
  },
  activeToggleText: {
    color: NeubrutColors.white,
  },
  switchContainer: {
    marginLeft: 16,
  },
  premiumCard: {
    backgroundColor: NeubrutColors.yellow,
  },
  premiumTitle: {
    color: NeubrutColors.black,
  },
  dangerCard: {
    borderColor: NeubrutColors.hotPink,
    backgroundColor: '#FFE6E6',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NeubrutColors.hotPink,
    borderWidth: 2,
    borderColor: NeubrutColors.black,
    padding: 12,
    marginTop: 12,
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  dangerButtonText: {
    ...NeubrutTextStyles.bodyMedium,
    fontSize: 14,
    fontWeight: '700',
    color: NeubrutColors.white,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});