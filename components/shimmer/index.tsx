import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Dimensions, Easing, DimensionValue } from 'react-native';
import { Theme, useTheme } from '@react-navigation/native';

import { View } from '../theme/Themed';
import Colors from '@/shared-uis/constants/Colors';

const { width } = Dimensions.get('window');

interface ShimmerProps {
  width?: DimensionValue;
  height?: DimensionValue;
}

const Shimmer: React.FC<ShimmerProps> = ({
  width: placeholderWidth = '100%',
  height = 50,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const theme = useTheme();
  const styles = stylesFn(theme);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View
      style={[
        styles.shimmerContainer,
        {
          width: placeholderWidth,
          height
        }
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

const stylesFn = (theme: Theme) => StyleSheet.create({
  shimmerContainer: {
    overflow: 'hidden',
    backgroundColor: Colors(theme).shimmerBackground,
    borderRadius: 10,
  },
  shimmer: {
    flex: 1,
    backgroundColor: Colors(theme).shimmerOverlay,
    opacity: 0.7,
  },
});

export default Shimmer;
