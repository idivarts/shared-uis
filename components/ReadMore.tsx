import { Theme, useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";
import { Text } from "./theme/Themed";

interface IReadMore {
    text: string,
    style?: any
    lineCount?: number,
    showReadMore?: boolean
}
const ReadMore: React.FC<IReadMore> = ({ text, style, lineCount = 5, showReadMore = true }) => {
    const [expanded, setExpanded] = useState(false);
    const [clampedHeight, setClampedHeight] = useState<number | null>(null);
    const [fullHeight, setFullHeight] = useState<number | null>(null);
    const theme = useTheme()
    const styles = stylesWrapper(theme)
    const textStyle = style ? style : styles.text;

    // Only overflowing when the full text is taller than its clamped version.
    const isOverflowing =
        clampedHeight !== null && fullHeight !== null && fullHeight - clampedHeight > 1;

    return (
        <View>
            <Text style={textStyle} numberOfLines={expanded ? undefined : lineCount}>
                {text}
            </Text>

            {/* Hidden measurers — span the same width as the visible text but
                don't affect layout. Compare clamped vs full height to detect overflow. */}
            <View pointerEvents="none" style={styles.measureContainer} aria-hidden>
                <Text
                    style={textStyle}
                    numberOfLines={lineCount}
                    onLayout={(e) => setClampedHeight(e.nativeEvent.layout.height)}
                >
                    {text}
                </Text>
                <Text
                    style={textStyle}
                    onLayout={(e) => setFullHeight(e.nativeEvent.layout.height)}
                >
                    {text}
                </Text>
            </View>

            {showReadMore && isOverflowing &&
                <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                    <Text style={styles.readMore}>
                        {expanded ? "Read Less" : "Read More"}
                    </Text>
                </TouchableOpacity>}
        </View>
    );
};

const stylesWrapper = (theme: Theme) => StyleSheet.create({
    text: {
        fontSize: 16,
        lineHeight: 22,
        color: Colors(theme).text,
    },
    readMore: {
        fontSize: 14,
        fontWeight: "bold",
        color: Colors(theme).primary,
        paddingVertical: 8
    },
    measureContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        opacity: 0,
        zIndex: -1,
    },
});

export default ReadMore;
