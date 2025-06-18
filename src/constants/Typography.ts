import { TextStyle } from 'react-native';
import { NeubrutColors } from './Colors';

export const NeubrutTextStyles: Record<string, TextStyle> = {
  heading1: {
    fontSize: 32,
    fontWeight: '900',
    color: NeubrutColors.black,
    letterSpacing: -0.5,
  },
  heading2: {
    fontSize: 24,
    fontWeight: '800',
    color: NeubrutColors.black,
    letterSpacing: -0.3,
  },
  heading3: {
    fontSize: 20,
    fontWeight: '700',
    color: NeubrutColors.black,
    letterSpacing: -0.2,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '600',
    color: NeubrutColors.black,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500',
    color: NeubrutColors.black,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    color: NeubrutColors.black,
  },
  button: {
    fontSize: 16,
    fontWeight: '700',
    color: NeubrutColors.black,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
};