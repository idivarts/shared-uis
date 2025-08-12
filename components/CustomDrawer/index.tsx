// import DrawerMenuContent from "@/components/drawer-layout/DrawerMenuContent";
// import BackButton from "@/components/ui/back-button/BackButton";
import useBreakpoints from "@/shared-libs/utils/use-breakpoints";
import React from "react";
// import { Drawer } from "expo-router/drawer";

import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Subject } from "rxjs";
import { View } from "../theme/Themed";

const SCREEN_WIDTH = Dimensions.get("window").width;

export const OpenDrawerSubject = new Subject<boolean | undefined>()

const CustomDrawerWrapper = ({ children, DrawerContent, isFixed }: { children: React.ReactNode, DrawerContent: any, isFixed: boolean }) => {

    const { xl } = useBreakpoints()
    const theme = useTheme()

    const DRAWER_WIDTH = xl ? 320 : SCREEN_WIDTH * 0.75;

    const [drawerVisible, setDrawerVisible] = useState(xl);
    const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: drawerVisible ? 0 : -DRAWER_WIDTH,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [drawerVisible]);

    useEffect(() => {
        OpenDrawerSubject.subscribe((open = true) => {
            setDrawerVisible(open)
        })
    }, [])

    return (
        <>
            <View style={{ flex: 1, marginLeft: xl ? DRAWER_WIDTH : 0 }}>
                {children}
            </View>

            {(drawerVisible && !xl) && (
                <TouchableWithoutFeedback onPress={() => setDrawerVisible(false)}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}
            <Animated.View style={[styles.drawer, { width: DRAWER_WIDTH, transform: [{ translateX: slideAnim }], borderRightWidth: 1, borderRightColor: Colors(theme).border }]}>
                {DrawerContent}
            </Animated.View>
            {/* </View> */}
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    drawer: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        // width: DRAWER_WIDTH,
        backgroundColor: "white",
        zIndex: 9999,
    },
});

export default CustomDrawerWrapper;