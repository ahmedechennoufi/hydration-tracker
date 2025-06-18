export interface DrinkType {
  id: string;
  name: string;
  milliliters: number;
  icon: string;
  color: string;
  category: 'water' | 'coffee' | 'tea' | 'juice' | 'soft-drink' | 'sports' | 'milk' | 'other';
}

export interface HydrationEntry {
  id: string;
  dateTime: Date;
  drinkType: string; // Changed to string reference to DrinkType.id
  milliliters: number;
}

export type UnitSystem = 'metric' | 'imperial';
export type Gender = 'male' | 'female';
export type ActivityLevel = 'not-very-active' | 'lightly-active' | 'active' | 'highly-active';

export interface UserProfile {
  gender: Gender;
  weight: number; // in kg for metric, lbs for imperial
  activityLevel: ActivityLevel;
  unitSystem: UnitSystem;
  wakeUpTime: string; // HH:MM format
  bedTime: string; // HH:MM format
  hasCompletedOnboarding: boolean;
}

export interface UserSettings {
  dailyGoal: number; // calculated based on profile
  notificationsEnabled: boolean;
  reminderInterval: number; // in hours
  soundEnabled: boolean;
  profile: UserProfile;
}

export interface OnboardingData {
  wakeUpTime: string;
  bedTime: string;
  unitSystem: UnitSystem;
  gender: Gender;
  weight: number;
  activityLevel: ActivityLevel;
}

export const defaultDrinkTypes: DrinkType[] = [
  // Water category
  { id: '1', name: 'Water', milliliters: 250, icon: 'water-drop', color: '#00D4FF', category: 'water' },
  { id: '2', name: 'Sparkling Water', milliliters: 250, icon: 'bubble-chart', color: '#00D4FF', category: 'water' },
  { id: '3', name: 'Flavored Water', milliliters: 300, icon: 'water-drop', color: '#00D4FF', category: 'water' },

  // Coffee category
  { id: '4', name: 'Espresso', milliliters: 30, icon: 'coffee', color: '#8B4513', category: 'coffee' },
  { id: '5', name: 'Americano', milliliters: 200, icon: 'coffee', color: '#8B4513', category: 'coffee' },
  { id: '6', name: 'Cappuccino', milliliters: 150, icon: 'coffee', color: '#8B4513', category: 'coffee' },
  { id: '7', name: 'Latte', milliliters: 240, icon: 'coffee', color: '#8B4513', category: 'coffee' },
  { id: '8', name: 'Cold Brew', milliliters: 350, icon: 'ac-unit', color: '#8B4513', category: 'coffee' },

  // Tea category
  { id: '9', name: 'Green Tea', milliliters: 200, icon: 'local-cafe', color: '#8AC926', category: 'tea' },
  { id: '10', name: 'Black Tea', milliliters: 200, icon: 'local-cafe', color: '#654321', category: 'tea' },
  { id: '11', name: 'Herbal Tea', milliliters: 200, icon: 'local-cafe', color: '#9ACD32', category: 'tea' },
  { id: '12', name: 'Iced Tea', milliliters: 300, icon: 'ac-unit', color: '#8AC926', category: 'tea' },

  // Juice category
  { id: '13', name: 'Orange Juice', milliliters: 200, icon: 'local-drink', color: '#FF8500', category: 'juice' },
  { id: '14', name: 'Apple Juice', milliliters: 200, icon: 'local-drink', color: '#FFFF00', category: 'juice' },
  { id: '15', name: 'Grape Juice', milliliters: 200, icon: 'local-drink', color: '#800080', category: 'juice' },
  { id: '16', name: 'Cranberry Juice', milliliters: 200, icon: 'local-drink', color: '#DC143C', category: 'juice' },
  { id: '17', name: 'Pineapple Juice', milliliters: 200, icon: 'local-drink', color: '#FFD700', category: 'juice' },
  { id: '18', name: 'Tomato Juice', milliliters: 200, icon: 'local-drink', color: '#FF6347', category: 'juice' },

  // Soft drinks category
  { id: '19', name: 'Cola', milliliters: 330, icon: 'local-bar', color: '#8B4513', category: 'soft-drink' },
  { id: '20', name: 'Lemon-Lime Soda', milliliters: 330, icon: 'local-bar', color: '#32CD32', category: 'soft-drink' },
  { id: '21', name: 'Energy Drink', milliliters: 250, icon: 'flash-on', color: '#FFD60A', category: 'soft-drink' },

  // Sports drinks category
  { id: '22', name: 'Sports Drink', milliliters: 500, icon: 'fitness-center', color: '#00CED1', category: 'sports' },
  { id: '23', name: 'Electrolyte Water', milliliters: 500, icon: 'fitness-center', color: '#00D4FF', category: 'sports' },

  // Milk category
  { id: '24', name: 'Dairy Milk', milliliters: 250, icon: 'local-cafe', color: '#F5F5DC', category: 'milk' },
  { id: '25', name: 'Almond Milk', milliliters: 250, icon: 'local-cafe', color: '#DDBEA9', category: 'milk' },
  { id: '26', name: 'Soy Milk', milliliters: 250, icon: 'local-cafe', color: '#F5DEB3', category: 'milk' },
  { id: '27', name: 'Oat Milk', milliliters: 250, icon: 'local-cafe', color: '#F4A460', category: 'milk' },

  // Other category
  { id: '28', name: 'Smoothie', milliliters: 400, icon: 'blender', color: '#7B2CBF', category: 'other' },
  { id: '29', name: 'Coconut Water', milliliters: 330, icon: 'local-drink', color: '#F5F5DC', category: 'other' },
  { id: '30', name: 'Kombucha', milliliters: 250, icon: 'local-drink', color: '#8FBC8F', category: 'other' },
];