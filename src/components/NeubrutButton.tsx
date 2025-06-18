import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import { NeubrutColors } from '../constants/Colors';
import { NeubrutTextStyles } from '../constants/Typography';

interface NeubrutButtonProps {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const NeubrutButton: React.FC<NeubrutButtonProps> = ({
  title,
  onPress,
  backgroundColor = NeubrutColors.electricBlue,
  textColor = NeubrutColors.black,
  style,
  textStyle,
  disabled = false,
}) => {
  const buttonStyle: ViewStyle = {
    backgroundColor: disabled ? '#CCCCCC' : backgroundColor,
    borderWidth: 3,
    borderColor: NeubrutColors.black,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: NeubrutColors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    ...style,
  };

  const textStyleCombined: TextStyle = {
    ...NeubrutTextStyles.button,
    color: disabled ? '#666666' : textColor,
    ...textStyle,
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={textStyleCombined}>{title}</Text>
    </TouchableOpacity>
  );
};