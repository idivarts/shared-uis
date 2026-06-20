import { useScrollContext } from "@/shared-libs/contexts/scroll-context";
import useBreakpoints from "@/shared-libs/utils/use-breakpoints";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import { Linking } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-worklets";
import {
    ImageMediaItem,
    ReelMediaItem,
    VideoMediaItem,
    type MediaItem,
    type MediaShape,
    type MediaSize,
} from "./components";
import LoadingCircle from "./components/loading-circle";
import { stylesFn } from "../../styles/carousel/RenderMediaItem.styles";
import { View } from "../theme/Themed";

export type { MediaItem } from "./components";

interface RenderMediaItemProps {
    handleImagePress: (item: MediaItem) => void;
    height?: number;
    index: number;
    currentIndex?: number;
    item: MediaItem;
    width?: number;
    cKey?: string;
    shape?: MediaShape;
    size?: MediaSize;
}
let uHeight = 0

function RenderMediaItem({
    handleImagePress,
    height,
    index,
    item,
    currentIndex,
    width,
    shape = "square",
    size = "extraLarge",
}: RenderMediaItemProps) {
    const theme = useTheme();
    const styles = stylesFn(theme);
    const colors = useMemo(() => Colors(theme), [theme]);
    const [isLoading, setIsLoading] = useState(true);
    const { scrollRef, scrollHeight } = useScrollContext();
    const { width: constrainedWidth, xl } = useBreakpoints();

    const applyPanScroll = useCallback(
        (translationY: number) => {
            if (!scrollRef?.current) return;
            if (Math.abs(translationY) < 50) {
                uHeight = scrollHeight ?? 0;
            }
            const newScroll = uHeight - translationY;
            scrollRef.current.scrollTo({ y: newScroll, animated: false });
        },
        [scrollRef, scrollHeight]
    );

    const panScrollGesture = useMemo(
        () =>
            Gesture.Pan()
                .activeOffsetY([-5, 5])
                .onUpdate((e) => {
                    runOnJS(applyPanScroll)(e.translationY);
                }),
        [applyPanScroll]
    );

    const onImageTap = useCallback(() => {
        handleImagePress(item);
    }, [handleImagePress, item]);

    const imageTapAndPanGesture = useMemo(
        () =>
            Gesture.Exclusive(
                panScrollGesture,
                Gesture.Tap().onEnd((_e, success) => {
                    if (success) {
                        runOnJS(onImageTap)();
                    }
                })
            ),
        [panScrollGesture, onImageTap]
    );

    if (Math.abs((currentIndex || 0) - index) > 1) {
        return (
            <View
                style={{ width: width || "100%", height: height || 250, overflow: "hidden" }}
            />
        );
    }
    const frameHeight = height || 250;
    const frameWidth = width || "100%";
    const numericFrameWidth = typeof frameWidth === "number" ? frameWidth : constrainedWidth;
    const loadingCircle = (
        <LoadingCircle
            visible={isLoading}
            color={colors.text}
            frameHeight={frameHeight}
            frameWidth={numericFrameWidth}
        />
    );

    if (item?.type.includes("image")) {
        return (
            <ImageMediaItem
                item={item}
                frameHeight={frameHeight}
                frameWidth={frameWidth}
                shape={shape}
                size={size}
                mediaStyle={styles.media}
                onLoadEnd={() => setIsLoading(false)}
                gesture={imageTapAndPanGesture}
                loadingCircle={loadingCircle}
            />
        );
    }

    if (item?.type.includes("reel")) {
        const handleReelPlay = () => {
            if (item.playUrl) {
                Linking.openURL(item.playUrl);
                return;
            }
            if (handleImagePress) {
                handleImagePress(item);
            }
        };
        return (
            <ReelMediaItem
                item={item}
                frameHeight={frameHeight}
                frameWidth={frameWidth}
                shape={shape}
                size={size}
                mediaStyle={styles.media}
                gesture={panScrollGesture}
                loadingCircle={loadingCircle}
                onLoadEnd={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
                onPlay={handleReelPlay}
                playBackdropColor={colors.backdrop}
                playIconColor={colors.white}
            />
        );
    }

    return (
        <VideoMediaItem
            item={item}
            frameHeight={frameHeight}
            frameWidth={frameWidth}
            shape={shape}
            size={size}
            mediaStyle={styles.media}
            panGesture={panScrollGesture}
            colors={colors}
            xl={xl}
        />
    );
}

export default RenderMediaItem;
