import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Theme } from '@react-navigation/native';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import Colors from '../../constants/Colors';

interface OptionType {
    icon?: IconProp;
    label: string;
    value: string;
    description?: string;
}

interface SelectorProps {
    onSelect: (value: string) => void;
    options: OptionType[];
    selectedValue?: string;
    theme: Theme;
    variant?: 'horizontal' | 'vertical';
}

export const Selector: React.FC<SelectorProps> = ({
    onSelect,
    options,
    selectedValue,
    theme,
    variant,
}) => {
    // Determine effective variant based on platform if not explicitly set
    const effectiveVariant = variant || (Platform.OS === 'web' ? 'horizontal' : 'vertical');
    const styles = stylesFn(theme, effectiveVariant);

    return (
        <View style={styles.optionsContainer}>
            {options.map((option, index) => (
                <Pressable
                    key={index}
                    style={[
                        styles.option,
                        selectedValue === option.value && styles.selectedOption,
                    ]}
                    onPress={() => onSelect(option.value)}
                >
                    {option.icon && (
                        <FontAwesomeIcon
                            icon={option.icon}
                            size={24}
                            color={Colors(theme).primary}
                        />
                    )}
                    <Text style={styles.optionText}>{option.label}</Text>
                    {option.description && (
                        <Text style={styles.descriptionText}>{option.description}</Text>
                    )}
                </Pressable>
            ))}
        </View>
    );
};

const stylesFn = (theme: Theme, variant: 'horizontal' | 'vertical') => StyleSheet.create({
    optionsContainer: {
        flexDirection: variant === 'vertical' ? 'column' : 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    option: {
        flex: variant === 'horizontal' ? 3 : undefined,
        backgroundColor: Colors(theme).background,
        borderRadius: 8,
        padding: 10,
        // alignItems: 'center',
        // justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors(theme).lightgray,
        gap: 8,
    },
    selectedOption: {
        backgroundColor: theme.dark ? Colors(theme).card : Colors(theme).aliceBlue,
        borderColor: Colors(theme).primary,
    },
    optionText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.dark ? Colors(theme).white : Colors(theme).gray300,
        // textAlign: 'center',
    },
    descriptionText: {
        fontSize: 12,
        color: theme.dark ? Colors(theme).gray300 : Colors(theme).gray300,
        // textAlign: 'center',
        marginTop: 4,
    },
});
