import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import Colors from "@/shared-uis/constants/Colors";

const GlassBackground = () => {
    const theme = useTheme();
    const colors = Colors(theme);

    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: {
                    ...StyleSheet.absoluteFillObject,
                },
                surface: {
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: colors.background,
                },
            }),
        [colors]
    );

    return (
        <View style={styles.container} pointerEvents="none">
            <View style={styles.surface} />
        </View>
    );
};

export default GlassBackground;
