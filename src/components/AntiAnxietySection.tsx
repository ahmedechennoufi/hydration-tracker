import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NeubrutColors } from '../constants/Colors';
import { NeubrutTextStyles } from '../constants/Typography';

interface AntiAnxietySectionProps {
  onPrevious: () => void;
  onNext: () => void;
  onMore: () => void;
}

const wellnessContent = [
  {
    title: "BREATHING EXERCISE",
    content: "Take a deep breath in for 4 counts, hold for 4, then exhale for 6. Repeat 3 times to calm your mind.",
    icon: "air" as keyof typeof MaterialIcons.glyphMap,
  },
  {
    title: "HYDRATION TIP",
    content: "Drink water mindfully. Each sip is a moment to pause and reconnect with yourself.",
    icon: "water-drop" as keyof typeof MaterialIcons.glyphMap,
  },
  {
    title: "MINDFUL MOMENT",
    content: "Notice 3 things you can see, 2 things you can hear, and 1 thing you can feel right now.",
    icon: "psychology" as keyof typeof MaterialIcons.glyphMap,
  },
  {
    title: "POSITIVE AFFIRMATION",
    content: "I am taking care of my body and mind by staying hydrated. Every glass counts.",
    icon: "favorite" as keyof typeof MaterialIcons.glyphMap,
  },
];

export const AntiAnxietySection: React.FC<AntiAnxietySectionProps> = ({
  onPrevious,
  onNext,
  onMore,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : wellnessContent.length - 1;
    setCurrentIndex(newIndex);
    onPrevious();
  };

  const handleNext = () => {
    const newIndex = currentIndex < wellnessContent.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    onNext();
  };

  const currentContent = wellnessContent[currentIndex];

  return (
    <View style={styles.container}>
      {/* Header with navigation */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.navButton} onPress={handlePrevious}>
          <MaterialIcons name="chevron-left" size={20} color={NeubrutColors.black} />
        </TouchableOpacity>
        
        <Text style={styles.title}>ANTI-ANXIETY</Text>
        
        <TouchableOpacity style={styles.navButton} onPress={handleNext}>
          <MaterialIcons name="chevron-right" size={20} color={NeubrutColors.black} />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content area */}
      <ScrollView 
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons 
            name={currentContent.icon} 
            size={48} 
            color={NeubrutColors.electricBlue} 
          />
        </View>
        
        <Text style={styles.contentTitle}>{currentContent.title}</Text>
        <Text style={styles.contentText}>{currentContent.content}</Text>

        {/* Progress dots */}
        <View style={styles.dotsContainer}>
          {wellnessContent.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot
              ]}
            />
          ))}
        </View>
      </ScrollView>

      {/* More button */}
      <TouchableOpacity style={styles.moreButton} onPress={onMore}>
        <Text style={styles.moreText}>MORE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: NeubrutColors.white,
    borderWidth: 3,
    borderColor: NeubrutColors.black,
    padding: 20,
    height: 280,
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
    borderWidth: 2,
    borderColor: NeubrutColors.black,
    backgroundColor: NeubrutColors.white,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  title: {
    ...NeubrutTextStyles.heading2,
    fontWeight: '900',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scrollContent: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: NeubrutColors.background,
    borderWidth: 3,
    borderColor: NeubrutColors.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  contentTitle: {
    ...NeubrutTextStyles.heading3,
    fontWeight: '800',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    color: NeubrutColors.black,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contentText: {
    ...NeubrutTextStyles.bodyMedium,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: NeubrutColors.black,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: NeubrutColors.background,
    borderWidth: 2,
    borderColor: NeubrutColors.black,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: NeubrutColors.electricBlue,
  },
  moreButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: NeubrutColors.yellow,
    borderWidth: 3,
    borderColor: NeubrutColors.black,
    alignSelf: 'center',
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    marginTop: 8,
  },
  moreText: {
    ...NeubrutTextStyles.bodyMedium,
    fontWeight: '800',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});