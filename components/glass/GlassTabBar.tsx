import Colors from "@/shared-uis/constants/Colors";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useTheme } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import React, { useMemo } from "react";
import {
    Animated,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

const TAB_BAR_HEIGHT = 64;
const TAB_BAR_RADIUS = 24;
const TAB_BAR_MARGIN_H = 16;
const TAB_BAR_MARGIN_B = 24;
const BLUR_INTENSITY = 80;
const INDICATOR_SIZE = 5;

const GlassTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const theme = useTheme();
    const colors = Colors(theme);

    const styles = useMemo(
        () =>
            StyleSheet.create({
                wrapper: {
                    position: "absolute",
                    bottom: TAB_BAR_MARGIN_B,
                    left: TAB_BAR_MARGIN_H,
                    right: TAB_BAR_MARGIN_H,
                    borderRadius: TAB_BAR_RADIUS,
                    borderWidth: 1,
                    borderColor: colors.glassTabBarBorder,
                    shadowColor: colors.glassTabBarWrapperShadow,
                    shadowOpacity: 1,
                    shadowRadius: 20,
                    shadowOffset: { width: 0, height: 6 },
                    elevation: 16,
                },
                surface: {
                    height: TAB_BAR_HEIGHT,
                    borderRadius: TAB_BAR_RADIUS,
                    overflow: "hidden",
                    backgroundColor: colors.glassTabBarSurface,
                },
                tabRow: {
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                    paddingHorizontal: 4,
                },
                tab: {
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 3,
                    paddingVertical: 6,
                },
                labelBase: {
                    fontSize: 10,
                    letterSpacing: 0.2,
                },
                labelFocused: {
                    color: colors.primary,
                    fontWeight: "700",
                    opacity: 1,
                },
                labelUnfocused: {
                    color: colors.text,
                    fontWeight: "400",
                    opacity: 0.65,
                },
                indicator: {
                    width: INDICATOR_SIZE,
                    height: INDICATOR_SIZE,
                    borderRadius: INDICATOR_SIZE / 2,
                    marginTop: 2,
                    backgroundColor: colors.primary,
                },
            }),
        [colors]
    );

    const content = (
        <View style={styles.tabRow}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.title ?? route.name;
                const isFocused = state.index === index;

                const color = isFocused ? colors.primary : colors.text;

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });
                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: "tabLongPress",
                        target: route.key,
                    });
                };

                const icon = options.tabBarIcon?.({
                    focused: isFocused,
                    color,
                    size: 22,
                });

                return (
                    <Pressable
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tab}
                    >
                        {icon}
                        <Text
                            numberOfLines={1}
                            style={[
                                styles.labelBase,
                                isFocused ? styles.labelFocused : styles.labelUnfocused,
                            ]}
                        >
                            {label}
                        </Text>
                        {isFocused ? <View style={styles.indicator} /> : null}
                    </Pressable>
                );
            })}
        </View>
    );

    const isAndroid = Platform.OS === "android";

    return (
        <Animated.View style={styles.wrapper}>
            {isAndroid ? <View style={styles.surface}>{content}</View> : null}
            {!isAndroid ? (
                <BlurView
                    intensity={BLUR_INTENSITY}
                    tint={theme.dark ? "dark" : "light"}
                    style={styles.surface}
                >
                    {content}
                </BlurView>
            ) : null}
        </Animated.View>
    );
};

export default GlassTabBar;
