import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import React, { useMemo } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    View,
    type StyleProp,
    type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
    GLASS_APP_BAR_BOTTOM_GAP,
    GLASS_APP_BAR_TOP_GAP,
    GLASS_BAR_MIN_HEIGHT,
    GLASS_CHROME_BLUR_INTENSITY,
    GLASS_CHROME_MARGIN_H,
    GLASS_CHROME_RADIUS,
} from "./glassChromeConstants";

export type GlassAppBarProps = {
    title: string;
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
    /** Use when the header is not inside SafeAreaView (e.g. tab navigator header, full-screen modal). */
    applyTopSafeArea?: boolean;
    wrapperStyle?: StyleProp<ViewStyle>;
};

const GlassAppBar = ({
    title,
    leading,
    trailing,
    applyTopSafeArea = false,
    wrapperStyle,
}: GlassAppBarProps) => {
    const theme = useTheme();
    const colors = Colors(theme);
    const insets = useSafeAreaInsets();
    const isAndroid = Platform.OS === "android";
    const isWeb = Platform.OS === "web";

    const topPad = (applyTopSafeArea ? insets.top : 0) + GLASS_APP_BAR_TOP_GAP;

    const hasLeading = Boolean(leading);

    const styles = useMemo(
        () =>
            StyleSheet.create({
                outer: {
                    paddingTop: topPad,
                    paddingBottom: GLASS_APP_BAR_BOTTOM_GAP,
                    paddingHorizontal: GLASS_CHROME_MARGIN_H,
                    backgroundColor: colors.transparent,
                },
                chrome: {
                    borderRadius: GLASS_CHROME_RADIUS,
                    borderWidth: 1,
                    borderColor: colors.glassTabBarBorder,
                    shadowColor: colors.glassTabBarWrapperShadow,
                    shadowOpacity: 1,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 10,
                    overflow: "hidden",
                },
                surface: {
                    minHeight: GLASS_BAR_MIN_HEIGHT,
                    borderRadius: GLASS_CHROME_RADIUS,
                    backgroundColor: colors.glassTabBarSurface,
                },
                row: {
                    flexDirection: "row",
                    alignItems: "center",
                    minHeight: GLASS_BAR_MIN_HEIGHT,
                    paddingLeft: hasLeading ? 4 : 12,
                    paddingRight: 8,
                    paddingVertical: 4,
                },
                leadingSlot: {
                    justifyContent: "center",
                    alignItems: "flex-start",
                    minWidth: 40,
                },
                title: {
                    flex: 1,
                    marginLeft: 4,
                    fontSize: 20,
                    fontWeight: "700",
                    letterSpacing: -0.3,
                    color: colors.text,
                },
                trailingSlot: {
                    justifyContent: "center",
                    alignItems: "flex-end",
                    minWidth: 40,
                },
            }),
        [colors, topPad, hasLeading]
    );

    const row = (
        <View style={styles.row}>
            {leading ? <View style={styles.leadingSlot}>{leading}</View> : null}
            <Text style={styles.title} numberOfLines={1}>
                {title}
            </Text>
            <View style={styles.trailingSlot}>{trailing ?? null}</View>
        </View>
    );

    const surface = isAndroid || isWeb ? (
        <View style={styles.surface}>{row}</View>
    ) : (
        <BlurView
            intensity={GLASS_CHROME_BLUR_INTENSITY}
            tint={theme.dark ? "dark" : "light"}
            style={styles.surface}
        >
            {row}
        </BlurView>
    );

    return (
        <View style={[styles.outer, wrapperStyle]}>
            <View style={styles.chrome}>{surface}</View>
        </View>
    );
};

export default GlassAppBar;
