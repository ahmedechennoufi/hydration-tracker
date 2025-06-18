import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { NeubrutColors } from '../constants/Colors';
import { HydrationService } from '../services/HydrationService';

// Screens
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { SleepScheduleScreen } from '../screens/SleepScheduleScreen';
import { HydrationPlanScreen } from '../screens/HydrationPlanScreen';
import { WelcomeIntroScreen } from '../screens/WelcomeIntroScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { AddBeverageScreen } from '../screens/AddBeverageScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { HydrationPlanSettingsScreen } from '../screens/HydrationPlanSettingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Add') {
            iconName = 'add-circle';
          } else if (route.name === 'History') {
            iconName = 'history';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: NeubrutColors.electricBlue,
        tabBarInactiveTintColor: NeubrutColors.black,
        tabBarStyle: {
          backgroundColor: NeubrutColors.white,
          borderTopWidth: 3,
          borderTopColor: NeubrutColors.black,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          textTransform: 'uppercase',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Add"
        component={AddBeverageScreen}
        options={{
          tabBarLabel: 'ADD DRINK',
        }}
      />
      <Tab.Screen name="History" component={HistoryScreen} />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const profile = await HydrationService.getUserProfile();
      if (profile && profile.hasCompletedOnboarding) {
        setInitialRoute('Main');
      } else {
        setInitialRoute('Onboarding');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setInitialRoute('Onboarding');
    }
  };

  if (!initialRoute) {
    return null; // or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="SleepSchedule" component={SleepScheduleScreen} />
        <Stack.Screen name="HydrationPlan" component={HydrationPlanScreen} />
        <Stack.Screen name="WelcomeIntro" component={WelcomeIntroScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="AddBeverage" component={AddBeverageScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="HydrationPlanSettings" component={HydrationPlanSettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};