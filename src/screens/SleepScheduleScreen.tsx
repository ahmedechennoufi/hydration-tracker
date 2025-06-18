import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NeubrutColors } from '../constants/Colors';
import { NeubrutTextStyles } from '../constants/Typography';
import { NeubrutButton } from '../components/NeubrutButton';

interface SleepScheduleScreenProps {
  navigation: any;
  route: any;
}

export const SleepScheduleScreen: React.FC<SleepScheduleScreenProps> = ({ navigation }) => {
  const [wakeUpTime, setWakeUpTime] = useState('08:00');
  const [bedTime, setBedTime] = useState('22:00');

  const handleTimeChange = (type: 'wake' | 'bed', increment: number) => {
    const time = type === 'wake' ? wakeUpTime : bedTime;
    const [hours, minutes] = time.split(':').map(Number);
    
    let newHours = hours + increment;
    if (newHours < 0) newHours = 23;
    if (newHours > 23) newHours = 0;
    
    const newTime = `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    
    if (type === 'wake') {
      setWakeUpTime(newTime);
    } else {
      setBedTime(newTime);
    }
  };

  const handleNext = () => {
    navigation.navigate('HydrationPlan', {
      wakeUpTime,
      bedTime,
    });
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
        
        <View style={styles.progressDots}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        
        <TouchableOpacity 
          style={styles.forwardButton}
          onPress={handleNext}
        >
          <MaterialIcons name="arrow-forward" size={24} color={NeubrutColors.black} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Sleep Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.moonContainer}>
            <MaterialIcons name="bedtime" size={80} color={NeubrutColors.electricBlue} />
          </View>
        </View>

        <Text style={styles.title}>When do you sleep?</Text>
        <Text style={styles.subtitle}>
          We won't disturb you while you sleep
        </Text>

        {/* Time Pickers */}
        <View style={styles.timePickersContainer}>
          {/* Bedtime */}
          <View style={styles.timePicker}>
            <Text style={styles.timeLabel}>Bedtime</Text>
            <View style={styles.timeControls}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => handleTimeChange('bed', -1)}
              >
                <MaterialIcons name="remove" size={24} color={NeubrutColors.black} />
              </TouchableOpacity>
              
              <View style={styles.timeDisplay}>
                <Text style={styles.timeText}>{bedTime}</Text>
              </View>
              
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => handleTimeChange('bed', 1)}
              >
                <MaterialIcons name="add" size={24} color={NeubrutColors.black} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Wake up time */}
          <View style={styles.timePicker}>
            <Text style={styles.timeLabel}>Wake-up time</Text>
            <View style={styles.timeControls}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => handleTimeChange('wake', -1)}
              >
                <MaterialIcons name="remove" size={24} color={NeubrutColors.black} />
              </TouchableOpacity>
              
              <View style={styles.timeDisplay}>
                <Text style={styles.timeText}>{wakeUpTime}</Text>
              </View>
              
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => handleTimeChange('wake', 1)}
              >
                <MaterialIcons name="add" size={24} color={NeubrutColors.black} />
              </TouchableOpacity>
            </View>
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
    alignItems: 'center',
  },
  illustrationContainer: {
    marginTop: 40,
    marginBottom: 40,
  },
  moonContainer: {
    width: 120,
    height: 120,
    backgroundColor: NeubrutColors.white,
    borderWidth: 3,
    borderColor: NeubrutColors.black,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  title: {
    ...NeubrutTextStyles.heading1,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    ...NeubrutTextStyles.bodyLarge,
    fontSize: 16,
    textAlign: 'center',
    color: NeubrutColors.black,
    marginBottom: 60,
  },
  timePickersContainer: {
    width: '100%',
    marginBottom: 60,
  },
  timePicker: {
    marginBottom: 40,
    alignItems: 'center',
  },
  timeLabel: {
    ...NeubrutTextStyles.heading3,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  timeControls: {
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
  timeButton: {
    padding: 16,
    borderRightWidth: 3,
    borderColor: NeubrutColors.black,
  },
  timeDisplay: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  timeText: {
    ...NeubrutTextStyles.heading2,
    fontSize: 24,
    fontWeight: '900',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 40,
  },
  continueButton: {
    width: '100%',
  },
});