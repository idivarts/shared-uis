import useBreakpoints from "@/shared-libs/utils/use-breakpoints";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ErrorBoundaryProps } from "expo-router";
import { Link } from "expo-router";
import React, { useMemo } from "react";
import {
    Linking,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ERROR_CODE = "500";
const SUPPORT_EMAIL = "support@trendly.com";

/**
 * Renders the actual error UI. Must be used inside ThemeProvider so that
 * useTheme(), Colors(theme), and useBreakpoints() work.
 */
function GlobalErrorFallbackContent({
    error,
    retry,
}: {
    error: Error;
    retry: () => void;
}) {
    const theme = useTheme();
    const colors = Colors(theme);
    const { xl, width } = useBreakpoints();
    const styles = useMemo(
        () => createStyles(colors, xl, width),
        [colors, xl, width]
    );

    const handleContactSupport = () => {
        Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(() => {});
    };

    return (
        <SafeAreaView
            style={styles.safeArea}
            edges={["top", "left", "right", "bottom"]}
        >
            <View style={styles.container}>
                <Text style={styles.brandTitle}>Trendly - System Error</Text>
                <View style={styles.iconWrap}>
                    <MaterialCommunityIcons
                        name="cloud-off"
                        size={xl ? 56 : 48}
                        color={colors.textSecondary}
                    />
                </View>
                <Text style={styles.errorCode}>Error Code: {ERROR_CODE}</Text>
                <Text style={styles.title}>Something went wrong</Text>
                <Text style={styles.message}>
                    We're sorry for the inconvenience. Our team has been
                    notified, and this issue will be reported to the company and
                    resolved as soon as possible.
                </Text>

                <View style={styles.actionsRow}>
                    <Link href="/" asChild>
                        <Pressable
                            style={({ pressed }) => [
                                styles.secondaryButton,
                                pressed && styles.secondaryButtonPressed,
                            ]}
                            accessibilityRole="link"
                            accessibilityLabel="Back to Dashboard"
                        >
                            {/* <MaterialCommunityIcons
                                name="view-dashboard"
                                size={20}
                                color={colors.tint}
                                style={styles.buttonIcon}
                            /> */}
                            <Text style={styles.secondaryButtonText}>
                                Back to Dashboard
                            </Text>
                        </Pressable>
                    </Link>
                    <Pressable
                        onPress={retry}
                        style={({ pressed }) => [
                            styles.primaryButton,
                            pressed && styles.primaryButtonPressed,
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel="Try again"
                    >
                        <MaterialCommunityIcons
                            name="refresh"
                            size={20}
                            color={colors.onPrimary}
                            style={styles.buttonIcon}
                        />
                        <Text style={styles.primaryButtonText}>Try Again</Text>
                    </Pressable>
                </View>

                <View style={styles.supportSection}>
                    <Text style={styles.supportHeading}>
                        Need urgent assistance?
                    </Text>
                    <View style={styles.supportLinks}>
                        <Pressable
                            onPress={handleContactSupport}
                            style={({ pressed }) => [
                                styles.supportLink,
                                pressed && styles.supportLinkPressed,
                            ]}
                            accessibilityRole="button"
                            accessibilityLabel="Contact Support"
                        >
                            <MaterialCommunityIcons
                                name="face-agent"
                                size={18}
                                color={colors.tint}
                                style={styles.supportLinkIcon}
                            />
                            <Text style={styles.supportLinkText}>
                                Contact Support
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => {}}
                            style={({ pressed }) => [
                                styles.supportLink,
                                pressed && styles.supportLinkPressed,
                            ]}
                            accessibilityRole="button"
                            accessibilityLabel="System Status"
                        >
                            <MaterialCommunityIcons
                                name="check-circle"
                                size={18}
                                color={colors.tint}
                                style={styles.supportLinkIcon}
                            />
                            <Text style={styles.supportLinkText}>
                                System Status
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

/**
 * Global error fallback screen. Renders outside the app's ThemeProvider when
 * the root ErrorBoundary catches an error, so it provides its own theme
 * using useColorScheme() and wraps content in ThemeProvider.
 */
export function GlobalErrorFallback({ error, retry }: ErrorBoundaryProps) {
    const colorScheme = useColorScheme();
    const navigationTheme =
        colorScheme === "dark" ? DarkTheme : DefaultTheme;

    return (
        <ThemeProvider value={navigationTheme}>
            <GlobalErrorFallbackContent error={error} retry={retry} />
        </ThemeProvider>
    );
}

function createStyles(
    colors: ReturnType<typeof Colors>,
    xl: boolean,
    width: number
) {
    const isNarrow = !xl && width < 640;
    return StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: colors.background,
        },
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: isNarrow ? 24 : 48,
            paddingVertical: 32,
        },
        brandTitle: {
            fontSize: isNarrow ? 13 : 14,
            color: colors.textSecondary,
            textAlign: "center",
            marginBottom: 16,
            textTransform: "uppercase",
            letterSpacing: 0.5,
        },
        iconWrap: {
            marginBottom: 16,
        },
        errorCode: {
            fontSize: isNarrow ? 13 : 14,
            color: colors.textSecondary,
            textAlign: "center",
            marginBottom: 8,
        },
        title: {
            fontSize: isNarrow ? 22 : 26,
            fontWeight: "700",
            color: colors.text,
            textAlign: "center",
            marginBottom: 12,
        },
        message: {
            fontSize: isNarrow ? 15 : 16,
            color: colors.textSecondary,
            textAlign: "center",
            lineHeight: 22,
            maxWidth: 400,
            marginBottom: 28,
        },
        actionsRow: {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
            marginBottom: 32,
        },
        primaryButton: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.primary,
            paddingVertical: 14,
            paddingHorizontal: 24,
            borderRadius: 12,
            minWidth: 140,
            ...Platform.select({
                web: {},
                default: {
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 8,
                    elevation: 4,
                },
            }),
        },
        primaryButtonPressed: {
            opacity: 0.9,
            transform: [{ scale: 0.98 }],
        },
        primaryButtonText: {
            fontSize: 16,
            fontWeight: "600",
            color: colors.onPrimary,
        },
        secondaryButton: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.glassSurface ?? "transparent",
            borderWidth: 1,
            borderColor: colors.outline,
            paddingVertical: 14,
            paddingHorizontal: 24,
            borderRadius: 12,
            minWidth: 140,
        },
        secondaryButtonPressed: {
            opacity: 0.9,
            transform: [{ scale: 0.98 }],
        },
        secondaryButtonText: {
            fontSize: 16,
            fontWeight: "600",
            color: colors.tint,
        },
        buttonIcon: {
            marginRight: 8,
        },
        supportSection: {
            alignItems: "center",
            paddingTop: 24,
            borderTopWidth: 1,
            borderTopColor: colors.outline,
            minWidth: 280,
        },
        supportHeading: {
            fontSize: isNarrow ? 14 : 15,
            color: colors.textSecondary,
            marginBottom: 12,
            fontWeight: "500",
        },
        supportLinks: {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 20,
        },
        supportLink: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 8,
            paddingHorizontal: 12,
        },
        supportLinkPressed: {
            opacity: 0.8,
        },
        supportLinkIcon: {
            marginRight: 6,
        },
        supportLinkText: {
            fontSize: 15,
            color: colors.tint,
            fontWeight: "500",
        },
    });
}
