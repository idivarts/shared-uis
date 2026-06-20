import React from "react";
import { ActivityIndicator } from "react-native";
import { View } from "../../theme/Themed";

interface LoadingCircleProps {
    visible: boolean;
    color: string;
    frameHeight: number;
    frameWidth: number;
}

function LoadingCircle({ visible, color, frameHeight, frameWidth }: LoadingCircleProps) {
    if (!visible) {
        return null;
    }
    return (
        <View
            style={{
                position: "absolute",
                top: frameHeight / 2,
                left: frameWidth / 2 - 12,
                backgroundColor: "transparent",
            }}
        >
            <ActivityIndicator style={{ backgroundColor: "transparent" }} color={color} />
        </View>
    );
}

export default LoadingCircle;
