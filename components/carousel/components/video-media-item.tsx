import { Console } from "@/shared-libs/utils/console";
import ImageComponent from "@/shared-uis/components/image-component";
import Colors from "@/shared-uis/constants/Colors";
import { faPlay, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { ResizeMode, Video, VideoFullscreenUpdate } from "expo-av";
import * as VideoThumbnails from "expo-video-thumbnails";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Linking,
    Modal,
    Platform,
    Pressable,
    View as RNView,
    StyleSheet,
    type ViewStyle,
} from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { View } from "../../theme/Themed";
import LoadingCircle from "./loading-circle";
import PlayOverlay from "./play-overlay";
import type { MediaItem, MediaShape, MediaSize } from "./types";

interface VideoMediaItemProps {
    item: MediaItem;
    frameHeight: number;
    frameWidth: number | string;
    shape: MediaShape;
    size: MediaSize;
    mediaStyle: any;
    panGesture: any;
    colors: ReturnType<typeof Colors>;
    xl: boolean;
}

function VideoMediaItem({
    item,
    frameHeight,
    frameWidth,
    shape,
    size,
    mediaStyle,
    panGesture,
    colors,
    xl,
}: VideoMediaItemProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [extractedPosterUri, setExtractedPosterUri] = useState<string | null>(null);
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [webPosterReady, setWebPosterReady] = useState(false);
    const modalWebVideoRef = useRef<HTMLVideoElement | null>(null);
    const webPosterVideoRef = useRef<HTMLVideoElement | null>(null);
    const modalNativeVideoRef = useRef<Video | null>(null);
    const styles = useMemo(() => createVideoModalStyles(colors), [colors]);

    useEffect(() => {
        let cancelled = false;
        setWebPosterReady(false);

        if (item.imageUrl) {
            setExtractedPosterUri(null);
            setIsLoading(false);
            return () => {
                cancelled = true;
            };
        }

        setExtractedPosterUri(null);
        setIsLoading(true);

        (async () => {
            try {
                if (Platform.OS !== "web") {
                    const { uri } = await VideoThumbnails.getThumbnailAsync(item.url, {
                        time: 500,
                        quality: 0.78,
                    });
                    if (!cancelled) {
                        setExtractedPosterUri(uri);
                    }
                    return;
                }
                if (!cancelled) {
                    // Web uses an inline <video> first-frame preview for poster rendering.
                    setExtractedPosterUri(null);
                }
            } catch (error) {
                if (__DEV__) {
                    console.warn("video poster thumbnail", error);
                }
            } finally {
                if (!cancelled && Platform.OS !== "web") {
                    setIsLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [item.url, item.imageUrl]);

    const closeVideoModal = useCallback(() => {
        modalWebVideoRef.current?.pause();
        modalNativeVideoRef.current?.pauseAsync?.();
        setVideoModalOpen(false);
    }, []);

    const handleNativeFullscreenUpdate = useCallback(
        (event: { fullscreenUpdate: number }) => {
            if (event.fullscreenUpdate === VideoFullscreenUpdate.PLAYER_DID_DISMISS) {
                closeVideoModal();
            }
        },
        [closeVideoModal]
    );

    const openVideoPlayback = useCallback(async () => {
        if (item.playUrl) {
            try {
                const ok = await Linking.canOpenURL(item.playUrl);
                if (ok) {
                    await Linking.openURL(item.playUrl);
                }
            } catch (error) {
                Console.error(error, "openVideoPlayback playUrl");
            }
            return;
        }
        setVideoModalOpen(true);
    }, [item.playUrl]);

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
        }
        // Moved this line on Load
        // modalNativeVideoRef.current?.presentFullscreenPlayer?.();
    }, [videoModalOpen, modalNativeVideoRef.current, modalWebVideoRef.current, xl]);

    useEffect(() => {
        if (!videoModalOpen || Platform.OS !== "web" || xl) {
            return;
        }

        const handleFullscreenChange = () => {
            const doc = document as Document & { webkitFullscreenElement?: Element | null };
            const fullscreenElement = doc.fullscreenElement || doc.webkitFullscreenElement || null;
            if (!fullscreenElement) {
                closeVideoModal();
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange as EventListener);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("webkitfullscreenchange", handleFullscreenChange as EventListener);
        };
    }, [videoModalOpen, xl, closeVideoModal]);

    const displayPosterUri = item.imageUrl ?? extractedPosterUri;
    const posterBody = displayPosterUri ? (
        <ImageComponent
            url={displayPosterUri}
            altText="Video poster"
            style={[
                mediaStyle,
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
    ) : Platform.OS === "web" ? (
        <video
            ref={(el: HTMLVideoElement | null) => {
                webPosterVideoRef.current = el;
            }}
            src={item.url}
            preload="metadata"
            muted
            playsInline
            style={{
                width: frameWidth,
                height: frameHeight,
                backgroundColor: colors.card,
            }}
            onLoadedMetadata={() => {
                const videoEl = webPosterVideoRef.current;
                if (!videoEl) {
                    setIsLoading(false);
                    return;
                }
                try {
                    const d = videoEl.duration;
                    const t = Number.isFinite(d) && d > 0 ? Math.min(0.5, Math.max(0.05, d * 0.05)) : 0.1;
                    videoEl.currentTime = t;
                } catch {
                    setIsLoading(false);
                }
            }}
            onSeeked={() => {
                webPosterVideoRef.current?.pause();
                setWebPosterReady(true);
                setIsLoading(false);
            }}
            onError={() => {
                setIsLoading(false);
            }}
        />
    ) : (
        <View
            style={[
                mediaStyle,
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
                    onRequestClose={closeVideoModal}
                >
                    <Pressable
                        style={xl ? styles.backdrop : styles.mobileBackdrop}
                        onPress={closeVideoModal}
                    >
                        <Pressable
                            style={xl ? styles.sheet : styles.mobileSheet}
                            onPress={() => { }}
                        >
                            <Pressable
                                accessibilityRole="button"
                                onPress={closeVideoModal}
                                style={styles.closeBtn}
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
                                    style={xl ? styles.player : styles.mobilePlayer}
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
                                    onLoad={() => {
                                        modalNativeVideoRef.current?.presentFullscreenPlayer()
                                    }}
                                    useNativeControls
                                    resizeMode={ResizeMode.CONTAIN}
                                    onFullscreenUpdate={handleNativeFullscreenUpdate}
                                    style={styles.mobilePlayer}
                                    onError={(error) => {
                                        Console.error(error, "Native video modal error");
                                    }}
                                />
                            )}
                        </Pressable>
                    </Pressable>
                </Modal>
            ) : null}

            <GestureDetector gesture={panGesture}>
                <Animated.View
                    style={{
                        width: frameWidth as ViewStyle["width"],
                        height: frameHeight,
                        overflow: "hidden",
                    }}
                >
                    <RNView style={{ position: "relative", width: "100%", height: "100%" }}>
                        {posterBody}
                        <PlayOverlay
                            onPress={openVideoPlayback}
                            backdropColor={colors.backdrop}
                            iconColor={colors.white}
                        />
                        <LoadingCircle
                            visible={isLoading || (Platform.OS === "web" && !displayPosterUri && !webPosterReady)}
                            color={colors.text}
                            frameHeight={frameHeight}
                            frameWidth={typeof frameWidth === "number" ? frameWidth : 250}
                        />
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
            padding: 0,
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

export default VideoMediaItem;
