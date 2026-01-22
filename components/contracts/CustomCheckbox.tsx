import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { View } from '../theme/Themed';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Colors from '@/shared-uis/constants/Colors';
import { Theme } from '@react-navigation/native';

interface CustomCheckboxProps {
  checked: boolean;
  onPress: () => void;
  theme: Theme;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onPress, theme }) => {
  const styles = stylesFn(theme);

  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          styles.checkbox,
          checked && styles.checkboxChecked,
        ]}
      >
        {checked && (
          <FontAwesomeIcon icon={faCheck} size={12} color="#fff" />
        )}
      </View>
    </Pressable>
  );
};

export default CustomCheckbox;

const stylesFn = (theme: Theme) => StyleSheet.create({
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors(theme).text,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors(theme).primary,
    borderColor: Colors(theme).primary,
  },
});
