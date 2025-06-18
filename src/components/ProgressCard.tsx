import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NeubrutColors } from '../constants/Colors';
import { NeubrutTextStyles } from '../constants/Typography';

interface ProgressCardProps {
  title: string;
  value: string;
  type?: 'progress' | 'target';
  backgroundColor?: string;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  value,
  type = 'progress',
  backgroundColor,
}) => {
  const getBackgroundColor = () => {
    if (backgroundColor) return backgroundColor;
    return type === 'progress' ? NeubrutColors.limeGreen : NeubrutColors.yellow;
  };

  const getValueColor = () => {
    return type === 'progress' ? NeubrutColors.black : NeubrutColors.black;
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, { color: getValueColor() }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 3,
    borderColor: NeubrutColors.black,
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    minHeight: 85,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...NeubrutTextStyles.bodyMedium,
    color: NeubrutColors.black,
    fontWeight: '700',
    fontSize: 11,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    ...NeubrutTextStyles.heading2,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 6,
    textAlign: 'center',
    color: NeubrutColors.black,
  },
});