import { useTheme } from "@react-navigation/native";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import {
    ContractStatus,
    CONTRACT_STATUS_LABELS,
    getContractStatusDescription,
    normalizeStatus,
    type ContractStatusActor,
} from "../../../shared-constants/contract-status";
import { Text } from "../theme/Themed";
import Colors from "../../constants/Colors";

export interface ContractStatusViewProps {
    /** Contract status (0–10). Matches Firestore. */
    status: number;
    /** Who is viewing: brand or influencer (different copy). */
    actor: ContractStatusActor;
    /** Optional: scheduled release date (timestamp) for RELEASE_SCHEDULED. */
    scheduledReleaseAt?: number;
    /** If true, show short description below the label. */
    showDescription?: boolean;
    /** Override label (e.g. for legacy "Active" when status is 1). */
    overrideLabel?: string;
    /** Override description when provided. */
    overrideDescription?: string;
}

/**
 * Shared contract status display. Use in Trendly Brands and Trendly Users apps.
 * Uses theme and Colors; responsive-safe (no Dimensions).
 */
const ContractStatusView: React.FC<ContractStatusViewProps> = ({
    status,
    actor,
    scheduledReleaseAt,
    showDescription = true,
    overrideLabel,
    overrideDescription,
}) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = useMemo(() => createStyles(colors), [colors]);

    const normalizedStatus = normalizeStatus(status);
    const label = overrideLabel ?? CONTRACT_STATUS_LABELS[normalizedStatus] ?? `Status ${status}`;
    const description = overrideDescription ?? getContractStatusDescription(normalizedStatus, actor);
    const isPaymentFailed = normalizedStatus === ContractStatus.PaymentFailed;
    const isReleaseScheduled =
        normalizedStatus === ContractStatus.PostingPending && !!scheduledReleaseAt;

    const releaseDateText =
        isReleaseScheduled && scheduledReleaseAt
            ? new Date(scheduledReleaseAt).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
              })
            : null;

    return (
        <View style={styles.root}>
            <View style={[styles.badge, isPaymentFailed && styles.badgeError]}>
                <Text style={[styles.label, isPaymentFailed && styles.labelError]}>{label}</Text>
            </View>
            {showDescription && description ? (
                <Text style={styles.description}>{description}</Text>
            ) : null}
            {releaseDateText ? (
                <Text style={styles.releaseDate}>
                    {actor === "brand" ? "Release scheduled for: " : "Video scheduled for release on: "}
                    {releaseDateText}
                </Text>
            ) : null}
        </View>
    );
};

function createStyles(colors: ReturnType<typeof Colors>) {
    return StyleSheet.create({
        root: {
            backgroundColor: "transparent",
            paddingVertical: 8,
            paddingHorizontal: 0,
        },
        badge: {
            alignSelf: "flex-start",
            backgroundColor: colors.gold,
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 8,
        },
        badgeError: {
            backgroundColor: colors.errorBannerBg ?? colors.red,
        },
        label: {
            fontSize: 14,
            fontWeight: "600",
            color: colors.text,
        },
        labelError: {
            color: colors.errorBannerText ?? colors.text,
        },
        description: {
            marginTop: 8,
            fontSize: 14,
            lineHeight: 20,
            color: colors.gray300,
        },
        releaseDate: {
            marginTop: 6,
            fontSize: 14,
            color: colors.text,
        },
    });
}

export default ContractStatusView;
