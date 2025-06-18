import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { NeubrutColors } from '../constants/Colors';
import { NeubrutTextStyles } from '../constants/Typography';

interface CircularProgressProps {
  progress: number; // 0 to 1
  current: number;
  goal: number;
  size?: number;
  strokeWidth?: number;
  animated?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  current,
  goal,
  size = 200,
  strokeWidth = 20,
  animated = true,
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setAnimatedProgress(progress);
    }
  }, [progress, animated]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedProgress * circumference);
  
  const progressPercentage = Math.round(progress * 100);

  return (
    <View style={{ 
      width: size, 
      height: size, 
      alignItems: 'center', 
      justifyContent: 'center',
      position: 'relative'
    }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={NeubrutColors.electricBlue}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={{ alignItems: 'center' }}>
        <Text style={[NeubrutTextStyles.heading1, { 
          fontSize: 28, 
          color: NeubrutColors.electricBlue,
          fontWeight: '900',
          marginBottom: 4,
        }]}>
          {current} mL
        </Text>
        <Text style={[NeubrutTextStyles.bodyLarge, { 
          fontSize: 18, 
          color: NeubrutColors.black,
          fontWeight: '700',
        }]}>
          {progressPercentage}%
        </Text>
      </View>
    </View>
  );
};