import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useMemo } from "react";
import { Pressable, StyleSheet } from "react-native";
import { View } from "../../theme/Themed";

interface PlayOverlayProps {
    backdropColor: string;
    iconColor: string;
    onPress: () => void;
}

function PlayOverlay({ backdropColor, iconColor, onPress }: PlayOverlayProps) {
    const styles = useMemo(() => createStyles(backdropColor), [backdropColor]);
    return (
        <View pointerEvents="box-none" style={styles.overlay}>
            <Pressable onPress={onPress} style={styles.button}>
                <FontAwesomeIcon icon={faPlay} size={20} color={iconColor} />
            </Pressable>
        </View>
    );
}

function createStyles(backdropColor: string) {
    return StyleSheet.create({
        overlay: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "transparent",
            alignItems: "center",
            justifyContent: "center",
        },
        button: {
            height: 52,
            width: 52,
            borderRadius: 26,
            backgroundColor: backdropColor,
            alignItems: "center",
            justifyContent: "center",
        },
    });
}

export default PlayOverlay;
