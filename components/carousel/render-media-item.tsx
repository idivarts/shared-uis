import { useIsFocused, useTheme } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, findNodeHandle, UIManager } from "react-native";
import { GestureEventPayload, PanGestureHandler, PanGestureHandlerEventPayload, State, TapGestureHandler } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useScrollContext } from "@/shared-libs/contexts/scroll-context";
import { Console } from "@/shared-libs/utils/console";
import Colors from "@/shared-uis/constants/Colors";
import { Zoomable } from '@likashefqet/react-native-image-zoom';
import useBreakpoints from "@/shared-libs/utils/use-breakpoints";
import React from "react";
import { Linking, Platform, Pressable, type ViewStyle } from "react-native";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
//  import { InView } from 'react-native-intersection-observer';
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

const RenderMediaItem: React.FC<RenderMediaItemProps> = ({
    handleImagePress,
    height,
    index,
    item,
    currentIndex,
    width,
    cKey,
    parentId,
    shape = "square",
    size = "extraLarge",
}) => {
    const theme = useTheme();
    const styles = stylesFn(theme);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isMuted, setIsMuted] = useState(true)
    const [inView, setInView] = useState(false)
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const nativeVideoRef = useRef<Video | null>(null)
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
                    // setIsMuted(false)
                }
                if (nativeVideoRef.current) {
                    nativeVideoRef.current.playAsync();
                    if (index != 0)
                        setIsMuted(false)
                    // setIsMuted(false)
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
            // console.log("Scroll Calculations :", cKey, rect.top, rect.bottom, rect.left, rect.right);
            setTopPosition(rect.top)
            setBottomPosition(rect.bottom)
        }
        if (Platform.OS !== 'web' && nativeVideoRef.current) {
            const handle = findNodeHandle(nativeVideoRef.current);
            if (handle) {
                UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
                    // console.log("Scroll Calculations :", cKey, { x, y, width, height, pageX, pageY });
                    setTopPosition(pageY);
                    setBottomPosition(pageY + height);
                });
            }
        }
    }, [videoRef.current, nativeVideoRef.current])

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

    // const [LoadingCircle, setLoadingCircle] = useState<any>(null);
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

    const element = scrollRef

    const scrollBy = (nativeEvent: Readonly<GestureEventPayload & PanGestureHandlerEventPayload>) => {
        if (element?.current) {
            if (Math.abs(nativeEvent.translationY) < 50) {
                uHeight = scrollHeight || 0
            }
            const currentScroll = uHeight;
            const newScroll = currentScroll - nativeEvent.translationY;

            element.current.scrollTo({
                y: newScroll,
                animated: false,
            });
        }
    }

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
            <TapGestureHandler
                onHandlerStateChange={({ nativeEvent }) => {
                    if (nativeEvent.state === State.ACTIVE && handleImagePress) {
                        handleImagePress(item);
                    }
                }}
            >
                <PanGestureHandler
                    onGestureEvent={({ nativeEvent }) => {
                        scrollBy(nativeEvent)
                        // element?.current?.scrollBy(0, -nativeEvent.translationY * 0.05);
                    }}
                    activeOffsetY={[-5, 5]}
                >
                    {AnimatedImageView}
                </PanGestureHandler>
            </TapGestureHandler >
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
            <PanGestureHandler
                onGestureEvent={({ nativeEvent }) => {
                    scrollBy(nativeEvent)
                    // element?.current?.scrollBy(0, -nativeEvent.translationY * 0.05);
                }}
                activeOffsetY={[-5, 5]}
            >
                {AnimatedImageView}
            </PanGestureHandler>
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
            <PanGestureHandler
                onGestureEvent={({ nativeEvent }) => {
                    scrollBy(nativeEvent)
                    // element?.current?.scrollBy(0, -nativeEvent.translationY * 0.05);
                }}
                onHandlerStateChange={({ nativeEvent }) => {
                }}
                activeOffsetY={[-5, 5]} // allow only minimal horizontal 
            >
                <Animated.View
                    style={{ width: width || "100%", height: height || 250, overflow: "hidden" ,}}
                >
                    {/* if (Platform.OS == "web") { */}
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
                        // onLoad={() => setIsLoading(false)}
                        onError={(error: any) => {
                            setIsLoading(false);
                            setIsError(true);
                            Console.error(error, "Video Error:")
                        }}
                        loop={false}
                    /> : <Video
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
                    />}
                </Animated.View>
            </PanGestureHandler>
        </Pressable>
        <LoadingCircle />
    </>
    // </InView>
};

export default RenderMediaItem;
