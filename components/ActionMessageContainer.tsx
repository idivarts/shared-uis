import Colors from "@/shared-uis/constants/Colors";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Theme, useTheme } from "@react-navigation/native";
import React, { FC } from "react";
import { Platform, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { Text, View } from "./theme/Themed";

export type ContractStatus =
    | "kyc_pending"
    | "contract_pending"
    | "payment_confirmation_pending"
    | "payment_failed"
    | "shipping_pending"
    | "delivery_pending"
    | "video_pending"
    | "review_pending"
    | "revision_pending"
    | "release_pending"
    | "release_scheduled"
    | "video_posted"
    | "settlement_done";

interface ActionMessageContainerProps {
    status: ContractStatus;
    onActionPress?: () => void;
    onSecondaryActionPress?: () => void;
    isDisabled?: boolean;
    isLoading?: boolean;
}

const ActionMessageContainer: FC<ActionMessageContainerProps> = ({
    status,
    onActionPress,
    onSecondaryActionPress,
    isDisabled = false,
    isLoading = false,
}) => {
    const theme = useTheme();
    const styles = stylesFn(theme);

    const getStatusConfig = () => {
        switch (status) {
            case "kyc_pending":
                return {
                    title: "Influencer KYC Pending",
                    message: "You cannot start the contract with the influencer unless they are verified with us. You can nudge them for the same in the chat.",
                    primaryButton: {
                        label: "Start Contract",
                        disabled: true,
                    },
                    showWarning: true,
                };

            case "contract_pending":
                return {
                    title: "Contract Pending",
                    message: null,
                    primaryButton: {
                        label: "Start Contract",
                        disabled: false,
                    },
                    showWarning: false,
                };

            case "payment_confirmation_pending":
                return {
                    title: "Payment Confirmation Pending",
                    message: "The contract is still not funded. Once you communicate with the influencer and everything aligns you can fund and start the contract.",
                    primaryButton: {
                        label: "Fund Contract",
                        disabled: false,
                    },
                    showWarning: true,
                };

            case "payment_failed":
                return {
                    title: "Payment Failed",
                    message: "Payment was unsuccessful. Please try again.",
                    primaryButton: {
                        label: "Retry Payment",
                        disabled: false,
                    },
                    showWarning: true,
                };

            case "shipping_pending":
                return {
                    title: "Shipping Pending",
                    message: "Please upload shipment image or documents to proceed.",
                    primaryButton: {
                        label: "Upload Shipment",
                        disabled: false,
                    },
                    showWarning: false,
                };

            case "delivery_pending":
                return {
                    title: "Delivery Pending",
                    message: "Waiting for influencer to confirm delivery.",
                    primaryButton: {
                        label: "View Status",
                        disabled: false,
                    },
                    showWarning: false,
                };

            case "video_pending":
                return {
                    title: "Video Pending",
                    message: "Waiting for influencer to upload video/assets.",
                    primaryButton: {
                        label: "View Status",
                        disabled: false,
                    },
                    showWarning: false,
                };

            case "review_pending":
                return {
                    title: "Review Pending",
                    message: "Please review the content uploaded by the influencer.",
                    primaryButton: {
                        label: "Review Content",
                        disabled: false,
                    },
                    secondaryButton: {
                        label: "Ask for Revision",
                        disabled: false,
                    },
                    showWarning: false,
                };

            case "revision_pending":
                return {
                    title: "Revision Pending",
                    message: "Influencer is revising the content. Please wait.",
                    primaryButton: {
                        label: "View Status",
                        disabled: false,
                    },
                    showWarning: false,
                };

            case "release_pending":
                return {
                    title: "Release Pending",
                    message: "Release can only be scheduled for future 30 days after the receipt of the video.",
                    primaryButton: {
                        label: "Schedule Release",
                        disabled: false,
                    },
                    showWarning: true,
                };

            case "release_scheduled":
                return {
                    title: "Release Scheduled",
                    message: "Content is scheduled for release.",
                    primaryButton: {
                        label: "View Schedule",
                        disabled: false,
                    },
                    showWarning: false,
                };

            case "video_posted":
                return {
                    title: "Video Posted",
                    message: "Content has been successfully posted.",
                    primaryButton: {
                        label: "View Content",
                        disabled: false,
                    },
                    showWarning: false,
                };

            case "settlement_done":
                return {
                    title: "Settlement Done",
                    message: "Contract has been completed.",
                    primaryButton: {
                        label: "View Details",
                        disabled: false,
                    },
                    showWarning: false,
                };

            default:
                return {
                    title: "Unknown Status",
                    message: null,
                    primaryButton: {
                        label: "Contact Support",
                        disabled: false,
                    },
                    showWarning: false,
                };
        }
    };

    const config = getStatusConfig();
    const disabled = isDisabled || config.primaryButton.disabled;

    return (
        <View style={styles.container}>
            {/* Warning Message */}
            {config.showWarning && config.message && (
                <View style={styles.warningBox}>
                    <FontAwesomeIcon
                        icon={faExclamationCircle}
                        size={20}
                        color={Colors(theme).warning}
                        style={styles.warningIcon}
                    />
                    <Text style={styles.warningText}>{config.message}</Text>
                </View>
            )}

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    disabled={disabled}
                    loading={isLoading}
                    onPress={onActionPress}
                    style={[styles.primaryButton, disabled && styles.disabledButton]}
                    labelStyle={styles.buttonLabel}
                >
                    {config.primaryButton.label}
                </Button>

                {config.secondaryButton && (
                    <Button
                        mode="outlined"
                        disabled={config.secondaryButton.disabled}
                        onPress={onSecondaryActionPress}
                        style={styles.secondaryButton}
                        labelStyle={styles.buttonLabel}
                    >
                        {config.secondaryButton.label}
                    </Button>
                )}
            </View>
        </View>
    );
};

const stylesFn = (theme: Theme) =>
    StyleSheet.create({
        container: {
            padding: 16,
            gap: 16,
            backgroundColor: Colors(theme).background,
        },
        warningBox: {
            flexDirection: "row",
            alignItems: "flex-start",
            backgroundColor: Colors(theme).warning + "15",
            borderColor: Colors(theme).warning,
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            gap: 12,
        },
        warningIcon: {
            marginTop: 2,
            flexShrink: 0,
        },
        warningText: {
            flex: 1,
            fontSize: 14,
            lineHeight: 20,
            color: Colors(theme).text,
        },
        buttonContainer: {
            flexDirection: Platform.OS === "web" ? "row" : "column",
            gap: 12,
            ...(Platform.OS === "web" && { justifyContent: "flex-start" }),
        },
        primaryButton: {
            flex: Platform.OS === "web" ? 0 : 1,
            minWidth: Platform.OS === "web" ? 140 : "auto",
        },
        disabledButton: {
            opacity: 0.6,
        },
        secondaryButton: {
            flex: Platform.OS === "web" ? 0 : 1,
            minWidth: Platform.OS === "web" ? 140 : "auto",
            borderColor: Colors(theme).primary,
        },
        buttonLabel: {
            fontSize: 14,
            fontWeight: "600",
        },
    });

export default ActionMessageContainer;
