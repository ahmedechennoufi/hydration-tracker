import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NeubrutColors } from '../constants/Colors';
import { NeubrutTextStyles } from '../constants/Typography';

interface WeeklyCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  weeklyData?: Record<string, number>;
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  selectedDate,
  onDateSelect,
  weeklyData = {},
}) => {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date());

  useEffect(() => {
    // Get the start of the current week (Monday)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust for Monday start
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + diff);
    weekStart.setHours(0, 0, 0, 0);
    setCurrentWeekStart(weekStart);
  }, []);

  const getWeekDates = () => {
    const dates = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      dates.push({
        date,
        dayName: dayNames[i],
        dayNumber: date.getDate(),
      });
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const hasProgress = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    return weeklyData[dateKey] && weeklyData[dateKey] > 0;
  };

  const getDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.container}>
        {weekDates.map(({ date, dayName, dayNumber }, index) => {
          const isSelectedDay = isSelected(date);
          const isTodayDay = isToday(date);
          const hasData = hasProgress(date);
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayContainer,
                isTodayDay && styles.todayDay,
                isSelectedDay && styles.selectedDay,
                hasData && !isSelectedDay && styles.hasProgressDay
              ]}
              onPress={() => onDateSelect(date)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.dayText, 
                (isTodayDay || isSelectedDay) && styles.selectedText
              ]}>
                {dayName}
              </Text>
              <Text style={[
                styles.numberText, 
                (isTodayDay || isSelectedDay) && styles.selectedText
              ]}>
                {dayNumber}
              </Text>
              {hasData && !isSelectedDay && !isTodayDay && (
                <View style={styles.progressIndicator} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 8,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: NeubrutColors.white,
    borderWidth: 3,
    borderColor: NeubrutColors.black,
    padding: 16,
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    minWidth: 350,
  },
  dayContainer: {
    width: 42,
    height: 64,
    backgroundColor: NeubrutColors.white,
    borderWidth: 2,
    borderColor: NeubrutColors.black,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginHorizontal: 2,
  },
  todayDay: {
    backgroundColor: NeubrutColors.electricBlue,
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  selectedDay: {
    backgroundColor: NeubrutColors.electricBlue,
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  hasProgressDay: {
    backgroundColor: NeubrutColors.limeGreen,
  },
  dayText: {
    ...NeubrutTextStyles.bodyMedium,
    fontWeight: '600',
    fontSize: 11,
    color: NeubrutColors.black,
  },
  numberText: {
    ...NeubrutTextStyles.bodyLarge,
    fontWeight: 'bold',
    marginTop: 2,
    fontSize: 16,
    color: NeubrutColors.black,
  },
  selectedText: {
    color: NeubrutColors.black,
  },
  progressIndicator: {
    position: 'absolute',
    bottom: 2,
    width: 6,
    height: 6,
    backgroundColor: NeubrutColors.electricBlue,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: NeubrutColors.black,
  },
});