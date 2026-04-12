import { useScrollContext } from "@/shared-libs/contexts/scroll-context";
import { captureVideoFrameAsDataUrl } from "@/shared-libs/utils/capture-video-frame-web";
import { Console } from "@/shared-libs/utils/console";
import useBreakpoints from "@/shared-libs/utils/use-breakpoints";
import Colors from "@/shared-uis/constants/Colors";
import { faPlay, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Zoomable } from "@likashefqet/react-native-image-zoom";
import { useTheme } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import * as VideoThumbnails from "expo-video-thumbnails";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Linking,
    Modal,
    Platform,
    Pressable,
    View as RNView,
    StyleSheet,
    type ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";
import { stylesFn } from "../../styles/carousel/RenderMediaItem.styles";
import ImageComponent from "../image-component";
import { View } from "../theme/Themed";

export interface MediaItem {
    type: string;
    /** Video or image URL. For video-only items, a poster is generated from this URL when `imageUrl` is omitted. */
    url: string;
    /** Optional poster; when set for video items, thumbnail extraction is skipped. */
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
    shape = "square",
    size = "extraLarge",
}: RenderMediaItemProps) {
    const theme = useTheme();
    const styles = stylesFn(theme);
    const colors = Colors(theme);
    const [isLoading, setIsLoading] = useState(true);
    const [extractedPosterUri, setExtractedPosterUri] = useState<string | null>(null);
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const modalWebVideoRef = useRef<HTMLVideoElement | null>(null);
    const modalNativeVideoRef = useRef<Video | null>(null);
    const { scrollRef, scrollHeight } = useScrollContext();
    const { width: constrainedWidth, xl } = useBreakpoints();
    const videoModalStyles = useMemo(() => createVideoModalStyles(colors), [colors]);

    const isCarouselVideo =
        !!item &&
        !item.type.includes("image") &&
        !item.type.includes("reel");

    useEffect(() => {
        if (!isCarouselVideo) {
            return undefined;
        }
        if (Math.abs((currentIndex ?? 0) - index) > 1) {
            return undefined;
        }

        let cancelled = false;

        if (item.imageUrl) {
            setExtractedPosterUri(null);
            setIsLoading(true);
            return () => {
                cancelled = true;
            };
        }

        setExtractedPosterUri(null);
        setIsLoading(true);

        (async () => {
            try {
                if (Platform.OS === "web") {
                    const dataUrl = await captureVideoFrameAsDataUrl(item.url);
                    console.log("Data URL :", item.url, dataUrl);

                    if (!cancelled && dataUrl) {
                        setExtractedPosterUri(dataUrl);
                    }
                } else {
                    const { uri } = await VideoThumbnails.getThumbnailAsync(item.url, {
                        time: 500,
                        quality: 0.78,
                    });
                    if (!cancelled) {
                        setExtractedPosterUri(uri);
                    }
                }
            } catch (e) {
                if (__DEV__) {
                    console.warn("video poster thumbnail", e);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [isCarouselVideo, item.url, item.imageUrl, currentIndex, index]);

    const LoadingCircle = () =>
        isLoading ? (
            <View
                style={[
                    {
                        position: "absolute",
                        top: (height || 250) / 2,
                        left: (width || constrainedWidth) / 2 - 12,
                        backgroundColor: "transparent",
                    },
                ]}
            >
                <ActivityIndicator
                    style={{ backgroundColor: "transparent" }}
                    color={colors.text}
                />
            </View>
        ) : null;

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

    const closeDesktopVideoModal = useCallback(() => {
        modalWebVideoRef.current?.pause();
        modalNativeVideoRef.current?.pauseAsync?.();
        setVideoModalOpen(false);
    }, []);

    const openVideoPlayback = useCallback(async () => {
        if (item.playUrl) {
            try {
                const ok = await Linking.canOpenURL(item.playUrl);
                if (ok) {
                    await Linking.openURL(item.playUrl);
                }
            } catch (e) {
                Console.error(e, "openVideoPlayback playUrl");
            }
            return;
        }
        setVideoModalOpen(true);
    }, [item.playUrl, item.url, xl]);

    useEffect(() => {
        if (!videoModalOpen) {
            return;
        }
        if (Platform.OS === "web") {
            const videoEl = modalWebVideoRef.current;
            if (!videoEl) {
                return;
            }
            if (!xl) {
                const requestFullscreen =
                    videoEl.requestFullscreen ||
                    (videoEl as HTMLVideoElement & { webkitRequestFullscreen?: () => Promise<void> })
                        .webkitRequestFullscreen;
                requestFullscreen?.call(videoEl)?.catch?.((error: unknown) => {
                    Console.error(error, "Video mobile web fullscreen");
                });
            }
            videoEl.play().catch((error: unknown) => {
                Console.error(error, "Video mobile web autoplay");
            });
            return;
        } else {
            modalNativeVideoRef.current?.presentFullscreenPlayer?.();
        }
    }, [videoModalOpen, xl]);

    if (Math.abs((currentIndex || 0) - index) > 1) {
        return (
            <View
                style={{ width: width || "100%", height: height || 250, overflow: "hidden" }}
            />
        );
    }

    if (item?.type.includes("image")) {
        const mImage = (
            <ImageComponent
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
            />
        );

        const AnimatedImageView = (
            <Animated.View
                style={{
                    position: "relative",
                }}
            >
                {Platform.OS == "web" ? (
                    mImage
                ) : (
                    <Zoomable maxPanPointers={2}>{mImage}</Zoomable>
                )}
                <LoadingCircle />
            </Animated.View>
        );

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
        const mImage = (
            <ImageComponent
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
                onError={() => setIsLoading(false)}
            />
        );

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
                        <Zoomable maxPanPointers={2}>{mImage}</Zoomable>
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
                            backgroundColor: colors.backdrop,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <FontAwesomeIcon icon={faPlay} size={20} color={colors.white} />
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

    const frameHeight = height || 250;
    const frameWidth = width || "100%";
    const displayPosterUri = item.imageUrl ?? extractedPosterUri;

    const posterBody = displayPosterUri ? (
        <ImageComponent
            url={displayPosterUri}
            altText="Video poster"
            style={[
                styles.media,
                {
                    height: frameHeight,
                    width: frameWidth as ViewStyle["width"],
                },
            ]}
            shape={shape}
            size={size}
            resizeMode="cover"
            resizeMethod="resize"
            onLoadEnd={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
        />
    ) : (
        <View
            style={[
                styles.media,
                {
                    height: frameHeight,
                    width: frameWidth as ViewStyle["width"],
                    backgroundColor: colors.card,
                    alignItems: "center",
                    justifyContent: "center",
                },
            ]}
        >
            <FontAwesomeIcon icon={faPlay} size={36} color={colors.textSecondary} />
        </View>
    );

    return (
        <>
            {videoModalOpen ? (
                <Modal
                    visible={videoModalOpen}
                    animationType="fade"
                    transparent
                    onRequestClose={closeDesktopVideoModal}
                >
                    <Pressable
                        style={xl ? videoModalStyles.backdrop : videoModalStyles.mobileBackdrop}
                        onPress={closeDesktopVideoModal}
                    >
                        <Pressable
                            style={xl ? videoModalStyles.sheet : videoModalStyles.mobileSheet}
                            onPress={() => { }}
                        >
                            <Pressable
                                accessibilityRole="button"
                                onPress={closeDesktopVideoModal}
                                style={videoModalStyles.closeBtn}
                            >
                                <FontAwesomeIcon icon={faXmark} size={18} color={colors.text} />
                            </Pressable>
                            {Platform.OS === "web" ? (
                                <video
                                    ref={(el: HTMLVideoElement | null) => {
                                        modalWebVideoRef.current = el;
                                    }}
                                    src={item.url}
                                    controls
                                    autoPlay
                                    playsInline={xl}
                                    style={xl ? videoModalStyles.player : videoModalStyles.mobilePlayer}
                                    onError={(error: unknown) => {
                                        Console.error(error, "Video modal error");
                                    }}
                                />
                            ) : (
                                <Video
                                    ref={(ref) => {
                                        modalNativeVideoRef.current = ref;
                                    }}
                                    source={{ uri: item.url }}
                                    shouldPlay
                                    useNativeControls
                                    resizeMode={ResizeMode.CONTAIN}
                                    style={videoModalStyles.mobilePlayer}
                                    onError={(error) => {
                                        Console.error(error, "Native video modal error");
                                    }}
                                />
                            )}
                        </Pressable>
                    </Pressable>
                </Modal>
            ) : null}
            <GestureDetector gesture={panScrollGesture}>
                <Animated.View
                    style={{
                        width: frameWidth as ViewStyle["width"],
                        height: frameHeight,
                        overflow: "hidden",
                    }}
                >
                    <RNView style={{ position: "relative", width: "100%", height: "100%" }}>
                        {posterBody}
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
                                onPress={openVideoPlayback}
                                style={{
                                    height: 52,
                                    width: 52,
                                    borderRadius: 26,
                                    backgroundColor: colors.backdrop,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <FontAwesomeIcon icon={faPlay} size={20} color={colors.white} />
                            </Pressable>
                        </View>
                        <LoadingCircle />
                    </RNView>
                </Animated.View>
            </GestureDetector>
        </>
    );
}

function createVideoModalStyles(colors: ReturnType<typeof Colors>) {
    return StyleSheet.create({
        backdrop: {
            flex: 1,
            backgroundColor: colors.backdropStrong,
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
        },
        mobileBackdrop: {
            flex: 1,
            backgroundColor: colors.backdropStrong,
            justifyContent: "center",
            alignItems: "center",
        },
        sheet: {
            width: "100%",
            maxWidth: 960,
            maxHeight: "85%",
            backgroundColor: colors.modalBackground,
            borderRadius: 12,
            overflow: "hidden",
            padding: 12,
        },
        player: {
            width: "100%",
            aspectRatio: 16 / 9,
            backgroundColor: colors.reverseBackground,
        },
        mobileSheet: {
            width: "100%",
            height: "100%",
            backgroundColor: colors.modalBackground,
            justifyContent: "center",
            alignItems: "center",
            padding: 12,
        },
        mobilePlayer: {
            width: "100%",
            height: "100%",
            backgroundColor: colors.reverseBackground,
        },
        closeBtn: {
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 2,
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.backdrop,
            alignItems: "center",
            justifyContent: "center",
        },
    });
}

export default RenderMediaItem;
