import { Theme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Pressable, Text, View } from 'react-native';

import Colors from "../../constants/Colors";
import { SelectItem } from '.';

const useStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: theme.dark ? Colors(theme).card : Colors(theme).tag,
        borderRadius: 8,
        padding: 4,
    },
    option: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    selectedOption: {
        backgroundColor: Colors(theme).primary,
        shadowColor: Colors(theme).black,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
    optionMargin: {
        marginLeft: 4,
    },
    optionText: {
        textAlign: 'center',
        fontSize: 14,
        color: Colors(theme).text,
    },
    selectedOptionText: {
        color: Colors(theme).white,
    },
});

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
    const styles = useStyles(theme);

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
