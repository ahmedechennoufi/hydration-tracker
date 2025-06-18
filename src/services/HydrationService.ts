import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  HydrationEntry, 
  UserSettings, 
  defaultDrinkTypes, 
  DrinkType,
  UserProfile,
  OnboardingData,
  UnitSystem,
  Gender,
  ActivityLevel
} from '../types';

const ENTRIES_KEY = 'hydration_entries';
const SETTINGS_KEY = 'user_settings';
const PROFILE_KEY = 'user_profile';

export class HydrationService {
  static async getEntries(): Promise<HydrationEntry[]> {
    try {
      const entriesJson = await AsyncStorage.getItem(ENTRIES_KEY);
      if (!entriesJson) return [];
      
      const entries = JSON.parse(entriesJson);
      return entries.map((entry: any) => ({
        ...entry,
        dateTime: new Date(entry.dateTime),
      }));
    } catch (error) {
      console.error('Error loading entries:', error);
      return [];
    }
  }

  static async addEntry(entry: Omit<HydrationEntry, 'id'>): Promise<void> {
    try {
      const entries = await this.getEntries();
      const newEntry: HydrationEntry = {
        ...entry,
        id: Date.now().toString(),
      };
      entries.push(newEntry);
      await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  }

  static async getEntriesForDate(targetDate: Date): Promise<HydrationEntry[]> {
    const entries = await this.getEntries();
    
    return entries.filter(entry => {
      const entryDate = new Date(entry.dateTime);
      return (
        entryDate.getDate() === targetDate.getDate() &&
        entryDate.getMonth() === targetDate.getMonth() &&
        entryDate.getFullYear() === targetDate.getFullYear()
      );
    });
  }

  static async getTotalForDate(targetDate: Date): Promise<number> {
    const dayEntries = await this.getEntriesForDate(targetDate);
    let total = 0;
    for (const entry of dayEntries) {
      total += entry.milliliters;
    }
    return total;
  }

  static async getTodayEntries(): Promise<HydrationEntry[]> {
    const today = new Date();
    return this.getEntriesForDate(today);
  }

  static async getTodayTotal(): Promise<number> {
    const today = new Date();
    return this.getTotalForDate(today);
  }

  static async getWeeklyData(weekStartDate?: Date): Promise<Record<string, number>> {
    const entries = await this.getEntries();
    
    // If no weekStartDate provided, calculate current week starting from Monday
    let weekStart = weekStartDate;
    if (!weekStart) {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust for Monday start
      weekStart = new Date(now);
      weekStart.setDate(now.getDate() + diff);
      weekStart.setHours(0, 0, 0, 0);
    }

    const weeklyData: Record<string, number> = {};

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];

      const dayTotal = await this.getTotalForDate(date);
      weeklyData[dateKey] = dayTotal;
    }

    return weeklyData;
  }

  static getDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  static isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  static async getSettings(): Promise<UserSettings> {
    try {
      const settingsJson = await AsyncStorage.getItem(SETTINGS_KEY);
      if (!settingsJson) {
        // Return default settings if none exist
        const defaultProfile: UserProfile = {
          gender: 'male',
          weight: 70,
          activityLevel: 'active',
          unitSystem: 'metric',
          wakeUpTime: '08:00',
          bedTime: '22:00',
          hasCompletedOnboarding: false,
        };
        
        return {
          dailyGoal: 2500,
          notificationsEnabled: true,
          reminderInterval: 2,
          soundEnabled: true,
          profile: defaultProfile,
        };
      }
      
      const settings = JSON.parse(settingsJson);
      
      // Handle migration from old settings format
      if (!settings.profile) {
        const profile = await this.getUserProfile();
        if (profile) {
          settings.profile = profile;
        } else {
          settings.profile = {
            gender: 'male',
            weight: 70,
            activityLevel: 'active',
            unitSystem: 'metric',
            wakeUpTime: '08:00',
            bedTime: '22:00',
            hasCompletedOnboarding: false,
          };
        }
      }
      
      // Ensure all required fields exist
      if (settings.soundEnabled === undefined) {
        settings.soundEnabled = true;
      }
      
      return settings;
    } catch (error) {
      console.error('Error loading settings:', error);
      const defaultProfile: UserProfile = {
        gender: 'male',
        weight: 70,
        activityLevel: 'active',
        unitSystem: 'metric',
        wakeUpTime: '08:00',
        bedTime: '22:00',
        hasCompletedOnboarding: false,
      };
      
      return {
        dailyGoal: 2500,
        notificationsEnabled: true,
        reminderInterval: 2,
        soundEnabled: true,
        profile: defaultProfile,
      };
    }
  }

  static async updateSettings(settings: UserSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ENTRIES_KEY);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }

  static getDrinkTypes() {
    return defaultDrinkTypes;
  }

  // Profile and onboarding methods
  static async completeOnboarding(data: any): Promise<void> {
    try {
      const profile: UserProfile = {
        gender: data.gender,
        weight: data.weight,
        activityLevel: data.activityLevel,
        unitSystem: data.unitSystem,
        wakeUpTime: data.wakeUpTime,
        bedTime: data.bedTime,
        hasCompletedOnboarding: true,
      };

      const settings: UserSettings = {
        dailyGoal: data.calculatedGoal,
        notificationsEnabled: true,
        reminderInterval: 2,
        soundEnabled: true,
        profile,
      };

      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  }

  static async getUserProfile(): Promise<UserProfile | null> {
    try {
      const profileJson = await AsyncStorage.getItem(PROFILE_KEY);
      return profileJson ? JSON.parse(profileJson) : null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  static async updateUserProfile(profile: Partial<UserProfile>): Promise<void> {
    try {
      const currentProfile = await this.getUserProfile();
      if (currentProfile) {
        const updatedProfile = { ...currentProfile, ...profile };
        await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile));
        
        // Recalculate daily goal
        const newGoal = this.calculateDailyGoal(updatedProfile);
        const settings = await this.getSettings();
        settings.dailyGoal = newGoal;
        settings.profile = updatedProfile;
        await this.updateSettings(settings);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  }

  static calculateDailyGoal(profile: UserProfile): number {
    const baseRate = profile.gender === 'male' ? 35 : 31;
    let goal = profile.weight * baseRate;

    const activityMultipliers = {
      'not-very-active': 1.0,
      'lightly-active': 1.1,
      'active': 1.2,
      'highly-active': 1.4,
    };

    goal *= activityMultipliers[profile.activityLevel];

    if (profile.unitSystem === 'imperial') {
      goal = goal / 29.5735; // Convert ml to fl oz
    }

    return Math.round(goal);
  }

  static async deleteEntry(entryId: string): Promise<void> {
    try {
      const entries = await this.getEntries();
      const filteredEntries = entries.filter(entry => entry.id !== entryId);
      await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(filteredEntries));
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  }

  static getDrinkTypeById(id: string): DrinkType | undefined {
    return defaultDrinkTypes.find(drink => drink.id === id);
  }

  static getDrinkTypesByCategory(category: string): DrinkType[] {
    return defaultDrinkTypes.filter(drink => drink.category === category);
  }

  static async addSampleData(): Promise<void> {
    try {
      const now = new Date();
      const sampleEntries = [];

      // Add sample data for the past week
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        
        // Add 2-4 random entries per day
        const entriesPerDay = Math.floor(Math.random() * 3) + 2;
        
        for (let j = 0; j < entriesPerDay; j++) {
          const entryDate = new Date(date);
          entryDate.setHours(8 + (j * 3) + Math.floor(Math.random() * 2));
          entryDate.setMinutes(Math.floor(Math.random() * 60));

          const amounts = [250, 300, 350, 400, 500];
          const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];

          sampleEntries.push({
            milliliters: randomAmount,
            drinkType: '1', // Water
            dateTime: entryDate,
          });
        }
      }

      // Add the sample entries
      for (const entry of sampleEntries) {
        await this.addEntry(entry);
      }
    } catch (error) {
      console.error('Error adding sample data:', error);
    }
  }
}