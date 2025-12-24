import { Theme } from "@react-navigation/native";
import React, { PropsWithChildren } from "react";

import { StyleProp, TextStyle } from "react-native";
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
    return (
        <View
            style={{
                gap: 12,
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 10,
                    alignItems: 'center',
                }}
            >
                {
                    title && (
                        <Text
                            style={[
                                {
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                },
                                titleStyle,
                            ]}
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
                    <Text
                        style={{
                            fontSize: 14,
                            color: theme.dark ? Colors(theme).text : Colors(theme).gray300,
                        }}
                    >
                        {description}
                    </Text>
                )
            }
        </View>
    );
};

export default ContentWrapper;
