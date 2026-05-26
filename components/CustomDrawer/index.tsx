import useBreakpoints from "@/shared-libs/utils/use-breakpoints";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Subject } from "rxjs";
import { View } from "../theme/Themed";

export const OpenDrawerSubject = new Subject<boolean | undefined>();

const CustomDrawerWrapper = ({
    children,
    DrawerContent,
    isFixed,
    drawerWidth: drawerWidthProp,
}: {
    children: React.ReactNode;
    DrawerContent: any;
    isFixed: boolean;
    drawerWidth?: number;
}) => {
    const { xl, width: screenWidth } = useBreakpoints();
    const theme = useTheme();
    const styles = useStyles(theme);

    const DRAWER_WIDTH = drawerWidthProp ?? (xl ? 280 : screenWidth * 0.75);

    const [drawerVisible, setDrawerVisible] = useState(xl);
    const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
    const animatedWidth = useRef(new Animated.Value(DRAWER_WIDTH)).current;
    const animatedMargin = useRef(new Animated.Value(xl ? DRAWER_WIDTH : 0)).current;

    // Animate drawer slide in/out (mobile toggle)
    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: drawerVisible ? 0 : -DRAWER_WIDTH,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [drawerVisible]);

    // Animate width + margin when collapsed/expanded (desktop only)
    const prevWidth = useRef(DRAWER_WIDTH);
    useEffect(() => {
        if (prevWidth.current === DRAWER_WIDTH) return;
        prevWidth.current = DRAWER_WIDTH;
        Animated.parallel([
            Animated.timing(animatedWidth, {
                toValue: DRAWER_WIDTH,
                duration: 250,
                useNativeDriver: false,
            }),
            Animated.timing(animatedMargin, {
                toValue: xl ? DRAWER_WIDTH : 0,
                duration: 250,
                useNativeDriver: false,
            }),
        ]).start();
    }, [DRAWER_WIDTH, xl]);

    useEffect(() => {
        const subs = OpenDrawerSubject.subscribe((open = true) => {
            setDrawerVisible(open);
        });
        return () => subs.unsubscribe();
    }, []);

    return (
        <>
            <Animated.View style={{ flex: 1, marginLeft: xl ? animatedMargin : 0 }}>
                {children}
            </Animated.View>

            {drawerVisible && !xl && (
                <TouchableWithoutFeedback onPress={() => setDrawerVisible(false)}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}
            <Animated.View
                style={[
                    styles.drawer,
                    { width: animatedWidth, transform: [{ translateX: slideAnim }] },
                ]}
            >
                {DrawerContent}
            </Animated.View>
        </>
    );
};

const useStyles = (theme: Parameters<typeof Colors>[0]) => {
    const colors = Colors(theme);
    return StyleSheet.create({
        overlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: colors.backdrop,
        },
        drawer: {
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 9999,
        },
    });
};

export default CustomDrawerWrapper;
