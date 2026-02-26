import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Theme } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { View } from 'react-native';

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
    const containerStyle = useMemo(() => ({ width: size, height: size }), [size]);
    return (
        <View style={containerStyle}>
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
