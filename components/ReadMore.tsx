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
    const theme = useTheme()
    const styles = stylesWrapper(theme)
    return (
        <View>
            <Text style={style ? style : styles.text} numberOfLines={expanded ? undefined : lineCount}>
                {text}
            </Text>
            {showReadMore &&
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
});

export default ReadMore;