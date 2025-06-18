import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { NeubrutColors } from '../constants/Colors';
import { NeubrutTextStyles } from '../constants/Typography';
import { CircularProgress } from '../components/CircularProgress';
import { WeeklyCalendar } from '../components/WeeklyCalendar';
import { ProgressCard } from '../components/ProgressCard';
import { AntiAnxietySection } from '../components/AntiAnxietySection';
import { TodaysRecords } from '../components/TodaysRecords';
import { NeubrutButton } from '../components/NeubrutButton';
import { HydrationService } from '../services/HydrationService';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentAmount, setCurrentAmount] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2500);
  const [refreshing, setRefreshing] = useState(false);
  const [weeklyData, setWeeklyData] = useState<Record<string, number>>({});

  const loadData = async () => {
    try {
      const settings = await HydrationService.getSettings();
      const weekData = await HydrationService.getWeeklyData();
      const selectedDateTotal = await HydrationService.getTotalForDate(selectedDate);
      
      setDailyGoal(settings.dailyGoal);
      setWeeklyData(weekData);
      setCurrentAmount(selectedDateTotal);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleDataChanged = () => {
    loadData();
  };

  const loadSelectedDateData = async (date: Date) => {
    try {
      const selectedDateTotal = await HydrationService.getTotalForDate(date);
      setCurrentAmount(selectedDateTotal);
    } catch (error) {
      console.error('Error loading selected date data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  useEffect(() => {
    loadSelectedDateData(selectedDate);
  }, [selectedDate]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const progress = dailyGoal > 0 ? currentAmount / dailyGoal : 0;
  const progressPercentage = Math.round(progress * 100);

  const isToday = HydrationService.isSameDay(selectedDate, new Date());

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const handleAntiAnxietyPrevious = () => {
    // Handle previous anxiety exercise
    console.log('Previous anxiety exercise');
  };

  const handleAntiAnxietyNext = () => {
    // Handle next anxiety exercise
    console.log('Next anxiety exercise');
  };

  const handleAntiAnxietyMore = () => {
    // Navigate to anxiety exercises
    console.log('More anxiety exercises');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleSettingsPress}
        >
          <MaterialIcons name="settings" size={24} color={NeubrutColors.black} />
        </TouchableOpacity>
      </View>

      {/* Weekly Calendar */}
      <View style={styles.section}>
        <WeeklyCalendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          weeklyData={weeklyData}
        />
      </View>

      {/* Main Content */}
      <View style={styles.section}>
        <View style={styles.mainContent}>
          {/* Circular Progress */}
          <View style={styles.progressContainer}>
            <CircularProgress
              progress={progress}
              current={currentAmount}
              goal={dailyGoal}
              size={200}
              strokeWidth={20}
              animated={true}
            />
          </View>

          {/* Progress Cards */}
          <View style={styles.cardsContainer}>
            <ProgressCard
              title="PROGRESS"
              value={`${progressPercentage}%`}
              type="progress"
            />
            <View style={styles.cardSpacing} />
            <ProgressCard
              title="DAILY TARGET"
              value={`${dailyGoal} mL`}
              type="target"
            />
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.section}>
        <View style={styles.actionButtonsContainer}>
          <NeubrutButton
            title="ADD BEVERAGE"
            onPress={() => navigation.navigate('AddBeverage')}
            backgroundColor={NeubrutColors.electricBlue}
            style={styles.addBeverageButton}
          />
          <NeubrutButton
            title="GET HEALTHIER"
            onPress={handleAntiAnxietyMore}
            backgroundColor={NeubrutColors.limeGreen}
            style={styles.getHealthierButton}
          />
        </View>
      </View>

      {/* Today's Records */}
      <View style={styles.section}>
        <TodaysRecords
          selectedDate={selectedDate}
          onDataChanged={handleDataChanged}
        />
      </View>

      {/* Anti-Anxiety Section */}
      <View style={styles.section}>
        <AntiAnxietySection
          onPrevious={handleAntiAnxietyPrevious}
          onNext={handleAntiAnxietyNext}
          onMore={handleAntiAnxietyMore}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NeubrutColors.background,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: 20,
    paddingTop: 8,
  },
  settingsButton: {
    padding: 12,
    backgroundColor: NeubrutColors.white,
    borderWidth: 3,
    borderColor: NeubrutColors.black,
    borderRadius: 50,
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  section: {
    marginBottom: 20,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  progressContainer: {
    flex: 2.5,
    alignItems: 'center',
    paddingRight: 12,
  },
  cardsContainer: {
    flex: 1.5,
    justifyContent: 'flex-start',
  },
  cardSpacing: {
    height: 12,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  addBeverageButton: {
    flex: 1,
    paddingVertical: 16,
  },
  getHealthierButton: {
    flex: 1,
    paddingVertical: 16,
  },
});