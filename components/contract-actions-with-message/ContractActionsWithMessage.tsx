import { useTheme } from "@react-navigation/native";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import Colors from "../../constants/Colors";
import { Text } from "../theme/Themed";

export type MessageVariant = "warning" | "success" | "error" | "info";

export interface ContractActionButton {
    label: string;
    onPress: () => void;
    disabled?: boolean;
    variant: "outlined" | "contained" | "contained-tonal";
    icon?: React.ReactNode;
}

export interface ContractActionsMessage {
    variant: MessageVariant;
    text: string;
    icon?: React.ReactNode;
}

export interface ContractActionsWithMessageProps {
    /** Zero, one, or two buttons. When one, it takes full width. When zero, only the message box is shown. */
    buttons:
        | []
        | [ContractActionButton]
        | [ContractActionButton, ContractActionButton];
    /** Message box. When buttons are present, shown below them; otherwise stands alone. */
    message: ContractActionsMessage;
}

/**
 * Reusable contract actions + message block for contract details.
 * Row 1: 0, 1, or 2 buttons (primary blue / theme primary). Row 2: message box with variant-based colors.
 * Used in Trendly Brands and Trendly Users for consistent contract UI.
 */
const ContractActionsWithMessage: React.FC<ContractActionsWithMessageProps> = ({
    buttons,
    message,
}) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(() => createStyles(colors, message.variant), [colors, message.variant]);

    const [first, second] = buttons;

    return (
        <View style={styles.root}>
            {buttons.length > 0 && (
                <View style={styles.buttonsRow}>
                    <Button
                        mode={first.variant}
                        onPress={first.onPress}
                        disabled={first.disabled}
                        style={[styles.button, buttons.length === 1 && styles.buttonSingle]}
                        contentStyle={styles.buttonContent}
                        labelStyle={styles.buttonLabel}
                        icon={first.icon as never}
                    >
                        {first.label}
                    </Button>
                    {second ? (
                        <Button
                            mode={second.variant}
                            onPress={second.onPress}
                            disabled={second.disabled}
                            style={styles.button}
                            contentStyle={styles.buttonContent}
                            labelStyle={styles.buttonLabel}
                            icon={second.icon as never}
                        >
                            {second.label}
                        </Button>
                    ) : null}
                </View>
            )}
            <View style={styles.messageBox}>
                {message.icon ? (
                    <View style={styles.messageIconWrap}>{message.icon}</View>
                ) : (
                    <View style={[styles.messageIconWrap, styles.messageIconDefault]} />
                )}
                <Text style={styles.messageText} numberOfLines={0}>
                    {message.text}
                </Text>
            </View>
        </View>
    );
};

function createStyles(
    colors: ReturnType<typeof Colors>,
    messageVariant: MessageVariant
) {
    const messageColors = getMessageColors(colors, messageVariant);
    return StyleSheet.create({
        root: {
            width: "100%",
            backgroundColor: "transparent",
        },
        buttonsRow: {
            flexDirection: "row",
            gap: 12,
            marginBottom: 12,
        },
        button: {
            flex: 1,
            borderRadius: 8,
        },
        buttonSingle: {
            flex: 1,
        },
        buttonContent: {},
        buttonLabel: {
            fontSize: 14,
        },
        messageBox: {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            padding: 16,
            borderRadius: 8,
            backgroundColor: messageColors.bg,
            borderWidth: 1,
            borderColor: messageColors.border,
        },
        messageIconWrap: {
            width: 24,
            height: 24,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
        },
        messageIconDefault: {
            backgroundColor: messageColors.iconBg,
        },
        messageText: {
            flex: 1,
            fontSize: 14,
            lineHeight: 20,
            color: messageColors.text,
        },
    });
}

function getMessageColors(
    colors: ReturnType<typeof Colors>,
    variant: MessageVariant
): { bg: string; border: string; text: string; iconBg: string } {
    switch (variant) {
        case "success":
            return {
                bg: colors.reachCardBg ?? "rgba(157, 213, 134, 0.2)",
                border: colors.reachCardBorder ?? "rgba(157, 213, 134, 0.4)",
                text: colors.savingsGreen ?? colors.green ?? colors.text,
                iconBg: colors.green,
            };
        case "error":
            return {
                bg: colors.errorBannerBg ?? colors.red,
                border: colors.errorBannerBorder ?? colors.errorBorder,
                text: colors.errorBannerText ?? colors.text,
                iconBg: colors.errorBannerText ?? colors.text,
            };
        case "info":
            return {
                bg: colors.primaryLight ?? colors.aliceBlue ?? colors.gold,
                border: colors.budgetCardBorder ?? colors.primary,
                text: colors.text,
                iconBg: colors.primary,
            };
        case "warning":
        default:
            return {
                bg: colors.planBadgeProBg ?? "rgba(236, 214, 148, 0.2)",
                border: colors.budgetCardBorder ?? "rgba(236, 214, 148, 0.5)",
                text: colors.gray100 ?? colors.text,
                iconBg: colors.gold,
            };
    }
}

export default ContractActionsWithMessage;
