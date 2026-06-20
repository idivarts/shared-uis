import ImageComponent from "@/shared-uis/components/image-component";
import { Zoomable } from "@likashefqet/react-native-image-zoom";
import React from "react";
import { Platform, type ViewStyle } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import PlayOverlay from "./play-overlay";
import type { MediaItem, MediaShape, MediaSize } from "./types";

interface ReelMediaItemProps {
    item: MediaItem;
    frameHeight: number;
    frameWidth: number | string;
    shape: MediaShape;
    size: MediaSize;
    mediaStyle: any;
    gesture: any;
    loadingCircle: React.ReactNode;
    onLoadEnd: () => void;
    onError: () => void;
    onPlay: () => void;
    playBackdropColor: string;
    playIconColor: string;
}

function ReelMediaItem({
    item,
    frameHeight,
    frameWidth,
    shape,
    size,
    mediaStyle,
    gesture,
    loadingCircle,
    onLoadEnd,
    onError,
    onPlay,
    playBackdropColor,
    playIconColor,
}: ReelMediaItemProps) {
    const reelImageUrl = item.imageUrl || item.url;
    const reelFrameStyle: ViewStyle = {
        width: frameWidth as any,
        height: frameHeight,
        alignSelf: "center",
    };

    const imageBody = (
        <ImageComponent
            url={reelImageUrl}
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
            onError={onError}
        />
    );

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View
                style={{
                    position: "relative",
                    ...reelFrameStyle,
                }}
            >
                {Platform.OS === "web" ? (
                    imageBody
                ) : (
                    <Animated.View style={reelFrameStyle}>
                        <Zoomable maxPanPointers={2}>{imageBody}</Zoomable>
                    </Animated.View>
                )}
                <PlayOverlay
                    onPress={onPlay}
                    backdropColor={playBackdropColor}
                    iconColor={playIconColor}
                />
                {loadingCircle}
            </Animated.View>
        </GestureDetector>
    );
}

export default ReelMediaItem;
