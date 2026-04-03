import { useIsFocused, useTheme } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";
import { useScrollContext } from "@/shared-libs/contexts/scroll-context";
import { Console } from "@/shared-libs/utils/console";
import Colors from "@/shared-uis/constants/Colors";
import { Zoomable } from '@likashefqet/react-native-image-zoom';
import useBreakpoints from "@/shared-libs/utils/use-breakpoints";
import React from "react";
import { Linking, Platform, Pressable, View as RNView, type ViewStyle } from "react-native";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { stylesFn } from "../../styles/carousel/RenderMediaItem.styles";
import ImageComponent from "../image-component";
import { useCarouselInViewContext } from "../scroller/CarouselInViewContext";
import { Text, View } from "../theme/Themed";

export interface MediaItem {
    type: string;
    url: string;
    imageUrl?: string;
    playUrl?: string;
}

interface RenderMediaItemProps {
    handleImagePress: (item: MediaItem) => void;
    height?: number;
    index: number;
    currentIndex?: number;
    item: MediaItem;
    width?: number;
    cKey?: string;
    parentId?: string
    shape?: "circle" | "square";
    size?: "small" | "medium" | "large" | "extraLarge";
}
let uHeight = 0

function RenderMediaItem({
    handleImagePress,
    height,
    index,
    item,
    currentIndex,
    width,
    parentId,
    shape = "square",
    size = "extraLarge",
}: RenderMediaItemProps) {
    const theme = useTheme();
    const styles = stylesFn(theme);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isMuted, setIsMuted] = useState(true)
    const [inView, setInView] = useState(false)
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const nativeVideoRef = useRef<Video | null>(null)
    const videoMeasureRef = useRef<React.ElementRef<typeof RNView> | null>(null)
    const isFocused = useIsFocused();
    const { scrollRef, scrollHeight } = useScrollContext()
    const [topPosition, setTopPosition] = useState<number | null>(null)
    const [bottomPosition, setBottomPosition] = useState<number | null>(null)
    const { currentItemId } = useCarouselInViewContext()
    const { width: constrainedWidth, height: windowHeight } = useBreakpoints();

    useEffect(() => {
        if (currentIndex == index && inView && isFocused) {
            if (!parentId || parentId == currentItemId) {
                if (videoRef.current) {
                    videoRef.current.play();
                    if (index != 0)
                        setIsMuted(false)
                }
                if (nativeVideoRef.current) {
                    nativeVideoRef.current.playAsync();
                    if (index != 0)
                        setIsMuted(false)
                }
            } else {
                if (videoRef.current) {
                    videoRef.current.pause();
                }
                if (nativeVideoRef.current) {
                    nativeVideoRef.current.pauseAsync();
                }
            }
        }
    }, [currentIndex, inView, isFocused, currentItemId])

    useEffect(() => {
        if (Platform.OS === 'web' && videoRef.current) {
            const rect = videoRef.current.getBoundingClientRect();
            setTopPosition(rect.top)
            setBottomPosition(rect.bottom)
        }
        if (Platform.OS !== "web" && videoMeasureRef.current) {
            videoMeasureRef.current.measureInWindow((x: number, y: number, _w: number, h: number) => {
                setTopPosition(y);
                setBottomPosition(y + h);
            });
        }
    }, [item.url, isLoading])

    useEffect(() => {
        if (!parentId)
            return;
        if (parentId == currentItemId) {
            setInView(true);
        } else {
            setInView(false);
        }
    }, [currentItemId])

    useEffect(() => {
        if (topPosition == null || bottomPosition == null || scrollHeight === undefined) {
            return;
        }
        const yStart = scrollHeight;
        const yEnd = scrollHeight + windowHeight; // height doesn't need constraining

        const cardHeight = bottomPosition - topPosition;
        const visibleHeight = Math.min(bottomPosition, yEnd) - Math.max(topPosition, yStart);
        const percentageInView = (visibleHeight / cardHeight) * 100;

        const isInView = percentageInView > 70;

        setInView(isInView);
    }, [scrollHeight, windowHeight]);

    const LoadingCircle = () => isLoading ? <View
        style={[
            {
                position: "absolute",
                top: (height || 250) / 2,
                left: (width || constrainedWidth) / 2 - 12,
                backgroundColor: "transparent"
            },
        ]}
    >
        <ActivityIndicator style={{ backgroundColor: "transparent" }} color={Colors(theme).text} />
    </View> : null

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
        return <View style={{ width: width || "100%", height: height || 250, overflow: "hidden" }}></View>
    }

    if (item?.type.includes("image")) {
        const mImage = <ImageComponent
            url={item.url}
            altText="Media"
            style={[
                styles.media,
                {
                    height: height || 250,
                    width: width || "100%",
                    
                },
            ]}
            shape={shape}
            size={size}
            resizeMode={"cover"}
            resizeMethod={"resize"}
            onLoadEnd={() => setIsLoading(false)}
            onError={() => {
                setIsError(true);
            }}
        />

        const AnimatedImageView = <Animated.View
            style={{
                position: "relative",
            }}
        >
            {Platform.OS == "web" ? (
                mImage
            ) : (
                <Zoomable maxPanPointers={2}>
                    {mImage}
                </Zoomable>
            )}
            <LoadingCircle />
        </Animated.View>

        return (
            <GestureDetector gesture={imageTapAndPanGesture}>
                {AnimatedImageView}
            </GestureDetector>
        );
    }

    if (item?.type.includes("reel")) {
        const reelImageUrl = item.imageUrl || item.url;
        const handleReelPlay = () => {
            if (item.playUrl) {
                Linking.openURL(item.playUrl);
                return;
            }
            if (handleImagePress) {
                handleImagePress(item);
            }
        };
        const mImage = <ImageComponent
            url={reelImageUrl}
            altText="Media"
            style={[
                styles.media,
                {
                    height: height || 250,
                    width: width || "100%",
                },
            ]}
            shape={shape}
            size={size}
            resizeMode={"cover"}
            resizeMethod={"resize"}
            onLoadEnd={() => setIsLoading(false)}
            onError={() => {
                setIsError(true);
            }}
        />

        const reelFrameStyle: ViewStyle = {
            width: width || "100%",
            height: height || 250,
            alignSelf: "center",
        };
        const AnimatedImageView = (
            <Animated.View
                style={{
                    position: "relative",
                    ...reelFrameStyle,
                }}
            >
                {Platform.OS == "web" ? (
                    mImage
                ) : (
                    <View style={reelFrameStyle}>
                        <Zoomable maxPanPointers={2}>
                            {mImage}
                        </Zoomable>
                    </View>
                )}
                <View
                    pointerEvents="box-none"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Pressable
                        onPress={handleReelPlay}
                        style={{
                            height: 52,
                            width: 52,
                            borderRadius: 26,
                            backgroundColor: Colors(theme).backdrop,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <FontAwesomeIcon icon={faPlay} size={20} color={Colors(theme).white} />
                    </Pressable>
                </View>
                <LoadingCircle />
            </Animated.View>
        );

        return (
            <GestureDetector gesture={panScrollGesture}>
                {AnimatedImageView}
            </GestureDetector>
        );
    }

    return <>
        <Pressable
            style={{ width: width || "100%", height: height || 250, overflow: "hidden", }}
            onPress={() => {
                videoRef.current?.play();
                setIsMuted(false)
            }}
            onTouchEnd={() => {
                videoRef.current?.play();
                setIsMuted(false)
            }} >
            <GestureDetector gesture={panScrollGesture}>
                <Animated.View
                    style={{ width: width || "100%", height: height || 250, overflow: "hidden" ,}}
                >
                    {Platform.OS == "web" ? <video
                        ref={(ref) => {
                            if (ref) {
                                videoRef.current = ref;
                            }
                        }}
                        src={item.url}
                        style={{ width: "100%", height: "100%" }}
                        muted
                        controls
                        onLoadedMetadata={() => setIsLoading(false)}
                        onError={(error: any) => {
                            setIsLoading(false);
                            setIsError(true);
                            Console.error(error, "Video Error:")
                        }}
                        loop={false}
                    /> : (
                        <RNView
                            ref={videoMeasureRef}
                            style={{ width: "100%", height: "100%" }}
                            collapsable={false}
                        >
                            <Video
                                onTouchEnd={() => {
                                    nativeVideoRef.current?.playAsync();
                                    setIsMuted(false)
                                }}
                                ref={(ref) => {
                                    if (ref) {
                                        nativeVideoRef.current = ref;
                                    }
                                }}
                                source={{ uri: item.url, }}
                                style={[
                                    styles.media,
                                    {
                                        height: height || 250,
                                        width: width || "100%",
                                    },
                                ]}
                                resizeMode={ResizeMode.CONTAIN}
                                isLooping={false}
                                useNativeControls
                                shouldPlay={true}
                                isMuted={isMuted}
                                onError={(error: any) => {
                                    setIsLoading(false);
                                    setIsError(true);
                                    Console.error(error, "Video Error:")
                                }}
                                onLoad={() => setIsLoading(false)}
                            />
                        </RNView>
                    )}
                </Animated.View>
            </GestureDetector>
        </Pressable>
        <LoadingCircle />
    </>
}

export default RenderMediaItem;
