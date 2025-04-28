import { useTheme } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator } from "react-native";
import { PanGestureHandler, State, TapGestureHandler } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { Video as WebVideo } from "react-native-video";

import { Zoomable } from '@likashefqet/react-native-image-zoom';
import { Platform, Pressable } from "react-native";
import { InView } from 'react-native-intersection-observer';
import { stylesFn } from "../../styles/carousel/RenderMediaItem.styles";
import ImageComponent from "../image-component";
import { Text, View } from "../theme/Themed";

export interface MediaItem {
  type: string;
  url: string;
}

interface RenderMediaItemProps {
  handleImagePress: (item: MediaItem) => void;
  height?: number;
  index: number;
  currentIndex?: number;
  item: MediaItem;
  videoRefs?: React.MutableRefObject<{ [key: number]: any }>;
  width?: number;
  cKey?: string;
  shape?: "circle" | "square";
  size?: "small" | "medium" | "large";
}

const RenderMediaItem: React.FC<RenderMediaItemProps> = ({
  handleImagePress,
  height,
  index,
  item,
  currentIndex,
  width,
  cKey,
  shape = "square",
  size = "large",
}) => {
  const theme = useTheme();
  const styles = stylesFn(theme);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isMuted, setIsMuted] = useState(true)
  const [inView, setInView] = useState(false)
  const videoRef = useRef<HTMLVideoElement>()
  const nativeVideoRef = useRef<Video>()

  useEffect(() => {
    if (currentIndex == index && inView) {
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
  }, [currentIndex, inView])

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
    resizeMode={Platform.OS === "web" ? "contain" : "cover"}
    resizeMethod={"resize"}
    onLoadStart={() => setIsLoading(true)}
    onLoad={() => setIsLoading(false)}
  />
  const getScrollableParent = () => {
    if (!cKey)
      return null;
    const element = document.getElementById(cKey);
    if (!element)
      return null;

    const scrollableParents = [];
    let parent = element.parentElement;
    while (parent) {
      const overflowY = window.getComputedStyle(parent).overflowY;
      const isScrollable = (overflowY === 'scroll' || overflowY === 'auto') && parent.scrollHeight > parent.clientHeight;
      if (isScrollable) {
        scrollableParents.push(parent);
      }
      parent = parent.parentElement;
    }
    // console.log("All scrollable parents", cKey, scrollableParents);
    return scrollableParents[0];
  }

  const [element, setElement] = useState<any>(null)
  useEffect(() => {
    setElement(getScrollableParent());
    // const element = getScrollableParent()
  }, [])

  if (item?.type.includes("image")) {
    const AnimatedImageView = <Animated.View
      style={{
        position: "relative",
      }}
    >
      <View
        style={[
          styles.loadingIndicatorContainer,
          {
            display: isLoading ? "flex" : "none",
          },
        ]}
      >
        {isLoading && <ActivityIndicator />}
      </View>
      {Platform.OS == "web" ? (
        mImage
      ) : (
        <Zoomable maxPanPointers={2}>
          {mImage}
        </Zoomable>
      )}
    </Animated.View>

    return (
      <TapGestureHandler
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE && handleImagePress) {
            handleImagePress(item);
          }
        }}
      >
        {Platform.OS == "web" ? <PanGestureHandler
          onGestureEvent={({ nativeEvent }) => {
            // console.log("Vertical drag detected", element);
            element?.scrollBy(0, -nativeEvent.translationY * 0.05);
          }}
          onHandlerStateChange={({ nativeEvent }) => {
            // console.log("Vertical drag ended", nativeEvent);
            // document.getElementById("collab-list")?.scrollBy(0, -nativeEvent.translationY);
          }}
          activeOffsetY={[-5, 5]} // allow only minimal horizontal 
        // minDist={10}
        // activeOffsetX={[-5, 5]} // allow only minimal horizontal 
        >
          {AnimatedImageView}
        </PanGestureHandler> : AnimatedImageView}
      </TapGestureHandler >
    );
  }

  if (Platform.OS == "web") {
    return <InView onChange={(inView) => {
      console.log("Video in view", inView, index, typeof videoRef?.current);
      setInView(inView);
    }} >
      <Pressable
        style={{ width: width || "100%", height: height || 250, overflow: "hidden" }}
        onPress={() => {
          videoRef.current?.play();
          setIsMuted(false)
        }}
        onTouchEnd={() => {
          videoRef.current?.play();
          setIsMuted(false)
        }} >
        <WebVideo
          ref={(ref) => {
            if (ref) {
              videoRef.current = ref.nativeHtmlVideoRef?.current as any;
            }
          }}
          source={{ uri: item.url }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          controls // enables native controls
          repeat={false}
          muted={isMuted}
          onError={(error) => console.error("Video error:", error)}
          onLoadStart={() => console.log("Loading video")}
          onLoad={() => console.log("Video loaded")}
        />
      </Pressable>
    </InView>
  }
  return (
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
      resizeMode={ResizeMode.COVER}
      isLooping={false}
      useNativeControls
      usePoster
      isMuted={isMuted}
      PosterComponent={() => (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isLoading && <ActivityIndicator />}
          {isError && <Text style={{ color: "red" }}>Error loading video</Text>}
        </View>
      )}
      onError={(error) => {
        setIsLoading(false);
        setIsError(true);
        console.error("Video Error:", error)
      }}
      onLoadStart={() => setIsLoading(true)}
      onLoad={() => setIsLoading(false)}
    />
  );
};

export default RenderMediaItem;
