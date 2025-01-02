import React from 'react';
import { View } from 'react-native';
import { Theme } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';

import Colors from '@/shared-uis/constants/Colors';

interface StarProps {
  filled: boolean;
  size?: number;
  theme: Theme;
}

const Star = ({
  filled,
  size = 24,
  theme,
}: StarProps) => {
  return (
    <View
      style={{
        width: size,
        height: size,
      }}
    >
      {
        filled ? (
          <FontAwesomeIcon
            icon={faStarSolid}
            color={Colors(theme).primary}
            size={size}
          />
        ) : (
          <FontAwesomeIcon
            icon={faStar}
            color={Colors(theme).primary}
            size={size}
          />
        )
      }
    </View>
  );
};

export default Star;
