import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Theme } from '@react-navigation/native';

import { SelectItem } from '.';
import stylesFn from '../../styles/select/SelectGroup.styles';

interface SelectGroupProps {
  items: SelectItem[];
  onValueChange: (selectedItem: SelectItem) => void;
  selectedItem: SelectItem;
  theme: Theme;
}

const SelectGroup: React.FC<SelectGroupProps> = ({
  items,
  onValueChange,
  selectedItem,
  theme,
}) => {
  const styles = stylesFn(theme);

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <Pressable
          key={item.value}
          style={[
            styles.option,
            selectedItem.value === item.value && styles.selectedOption,
            index > 0 && styles.optionMargin,
          ]}
          onPress={() => onValueChange(item)}
        >
          <Text
            style={[
              styles.optionText,
              selectedItem.value === item.value && styles.selectedOptionText,
            ]}
          >
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default SelectGroup;
