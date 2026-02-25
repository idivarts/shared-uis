import { Theme } from "@react-navigation/native";
import React, { PropsWithChildren, useMemo } from "react";

import { StyleProp, StyleSheet, TextStyle } from "react-native";
import Colors from "../../constants/Colors";
import { Text, View } from "../theme/Themed";

interface ContentWrapperProps extends PropsWithChildren {
    description?: string;
    rightAction?: React.ReactNode;
    rightText?: string;
    theme: Theme;
    title?: string;
    titleStyle?: StyleProp<TextStyle>;
}

const ContentWrapper: React.FC<ContentWrapperProps> = ({
    children,
    description,
    rightAction = null,
    rightText,
    theme,
    title,
    titleStyle,
}) => {
    const styles = useMemo(() => StyleSheet.create({
        outer: { gap: 12 },
        headerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10,
            alignItems: 'center',
        },
        title: { fontSize: 20, fontWeight: 'bold' },
        description: {
            fontSize: 14,
            color: theme.dark ? Colors(theme).text : Colors(theme).gray300,
        },
    }), [theme]);
    return (
        <View style={styles.outer}>
            <View style={styles.headerRow}>
                {
                    title && (
                        <Text
                            style={[styles.title, titleStyle]}
                        >
                            {title}
                        </Text>
                    )
                }
                {
                    rightAction ? (
                        rightAction
                    ) : (
                        <Text>
                            {rightText}
                        </Text>
                    )
                }
            </View>
            {children}
            {
                description && (
                    <Text style={styles.description}>
                        {description}
                    </Text>
                )
            }
        </View>
    );
};

export default ContentWrapper;
