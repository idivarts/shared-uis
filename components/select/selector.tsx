import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Theme } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Colors from '../../constants/Colors';

export type OptionType = {
    label: string;
    value: string;
    icon?: IconDefinition;
    description?: string;
};

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
    variant = 'horizontal',
}) => {
    const styles = stylesFn(theme);
    const hasDescriptions = options.some(opt => opt.description);

    return (
        <View style={[styles.optionsContainer, variant === 'vertical' && styles.verticalContainer]}>
            {options.map((option, index) => (
                <Pressable
                    key={index}
                    style={[
                        styles.option,
                        selectedValue === option.value && styles.selectedOption,
                        hasDescriptions && styles.optionWithDescription,
                        variant === 'vertical' && styles.verticalOption,
                    ]}
                    onPress={() => onSelect(option.value)}
                >
                    {option.icon != null && (
                        <FontAwesomeIcon
                            icon={option.icon}
                            size={14}
                            color={theme.colors.text}
                        />
                    )}

                    <Text style={styles.optionText}>{option.label}</Text>
                    {option.description && (
                        <Text style={styles.optionDescription}>{option.description}</Text>
                    )}
                </Pressable>
            ))}
        </View>
    );
};

const stylesFn = (theme: Theme) => StyleSheet.create({
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    verticalContainer: {
        flexDirection: 'column',
    },
    option: {
        flex: 1,
        backgroundColor: Colors(theme).background,
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors(theme).lightgray,
        gap: 8,
    },
    optionWithDescription: {
        paddingVertical: 12,
        paddingHorizontal: 12,
        alignItems: 'flex-start',
    },
    verticalOption: {
        alignItems: 'flex-start',
    },
    selectedOption: {
        backgroundColor: theme.dark ? Colors(theme).card : Colors(theme).aliceBlue,
        borderColor: Colors(theme).primary,
    },
    optionText: {
        fontSize: 14,
        color: theme.dark ? Colors(theme).white : Colors(theme).gray300,
        marginTop: 4,
        fontWeight: '600',
    },
    optionDescription: {
        fontSize: 12,
        color: theme.dark ? Colors(theme).gray300 : Colors(theme).gray400,
        marginTop: 4,
        lineHeight: 16,
    },
});
