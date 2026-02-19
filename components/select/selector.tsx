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

interface SelectorPropsBase {
    options: OptionType[];
    theme: Theme;
    variant?: 'horizontal' | 'vertical';
}

interface SelectorPropsSingle extends SelectorPropsBase {
    multiSelect?: false;
    onSelect: (value: string) => void;
    selectedValue?: string;
}

interface SelectorPropsMulti extends SelectorPropsBase {
    multiSelect: true;
    onToggle: (value: string) => void;
    selectedValues?: string[];
}

type SelectorProps = SelectorPropsSingle | SelectorPropsMulti;

export const Selector: React.FC<SelectorProps> = (props) => {
    const { options, theme, variant } = props;
    const effectiveVariant = variant || (Platform.OS === 'web' ? 'horizontal' : 'vertical');
    const styles = stylesFn(theme, effectiveVariant);

    const isSelected = (value: string) =>
        props.multiSelect
            ? (props.selectedValues ?? []).includes(value)
            : props.selectedValue === value;

    const handlePress = (value: string) =>
        props.multiSelect ? props.onToggle(value) : props.onSelect(value);

    return (
        <View style={styles.optionsContainer}>
            {options.map((option, index) => (
                <Pressable
                    key={index}
                    style={[
                        styles.option,
                        isSelected(option.value) && styles.selectedOption,
                    ]}
                    onPress={() => handlePress(option.value)}
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
