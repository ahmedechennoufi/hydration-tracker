import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { NeubrutColors } from '../constants/Colors';

interface NeubrutCardProps {
  children: React.ReactNode;
  backgroundColor?: string;
  style?: ViewStyle;
  onPress?: () => void;
  shadowOffset?: { x: number; y: number };
}

export const NeubrutCard: React.FC<NeubrutCardProps> = ({
  children,
  backgroundColor = NeubrutColors.white,
  style,
  onPress,
  shadowOffset = { x: 6, y: 6 },
}) => {
  const cardStyle: ViewStyle = {
    backgroundColor,
    borderWidth: 3,
    borderColor: NeubrutColors.black,
    padding: 16,
    ...style,
  };

  const shadowStyle: ViewStyle = {
    backgroundColor: NeubrutColors.black,
    position: 'absolute',
    top: shadowOffset.y,
    left: shadowOffset.x,
    right: -shadowOffset.x,
    bottom: -shadowOffset.y,
    zIndex: -1,
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <View style={{ position: 'relative' }}>
      <View style={shadowStyle} />
      <Container style={cardStyle} onPress={onPress} activeOpacity={0.8}>
        {children}
      </Container>
    </View>
  );
};