import ImageComponent from "@/shared-uis/components/image-component";
import { Zoomable } from "@likashefqet/react-native-image-zoom";
import React from "react";
import { Platform } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import type { MediaItem, MediaShape, MediaSize } from "./types";

interface ImageMediaItemProps {
    item: MediaItem;
    frameHeight: number;
    frameWidth: number | string;
    shape: MediaShape;
    size: MediaSize;
    mediaStyle: any;
    onLoadEnd: () => void;
    gesture: any;
    loadingCircle: React.ReactNode;
}

function ImageMediaItem({
    item,
    frameHeight,
    frameWidth,
    shape,
    size,
    mediaStyle,
    onLoadEnd,
    gesture,
    loadingCircle,
}: ImageMediaItemProps) {
    const imageBody = (
        <ImageComponent
            url={item.url}
            altText="Media"
            style={[
                mediaStyle,
                {
                    height: frameHeight,
                    width: frameWidth,
                },
            ]}
            shape={shape}
            size={size}
            resizeMode="cover"
            resizeMethod="resize"
            onLoadEnd={onLoadEnd}
        />
    );

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={{ position: "relative" }}>
                {Platform.OS === "web" ? imageBody : <Zoomable maxPanPointers={2}>{imageBody}</Zoomable>}
                {loadingCircle}
            </Animated.View>
        </GestureDetector>
    );
}

export default ImageMediaItem;
