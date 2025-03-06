import { useTheme } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { State, TapGestureHandler } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import { Zoomable } from '@likashefqet/react-native-image-zoom';
import { Platform } from "react-native";
import { stylesFn } from "../../styles/carousel/RenderMediaItem.styles";
import ImageComponent from "../image-component";
import { View } from "../theme/Themed";

export interface MediaItem {
  type: string;
  url: string;
}

interface RenderMediaItemProps {
  handleImagePress: (item: MediaItem) => void;
  height?: number;
  index: number;
  item: MediaItem;
  videoRefs?: React.MutableRefObject<{ [key: number]: any }>;
  width?: number;
  shape?: "circle" | "square";
  size?: "small" | "medium" | "large";
}

const RenderMediaItem: React.FC<RenderMediaItemProps> = ({
  handleImagePress,
  height,
  index,
  item,
  videoRefs,
  width,
  shape = "square",
  size = "large",
}) => {
  const theme = useTheme();
  const styles = stylesFn(theme);
  const [isLoading, setIsLoading] = useState(false);
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
  if (item?.type.includes("image")) {
    return (
      <TapGestureHandler
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE && handleImagePress) {
            handleImagePress(item);
          }
        }}
      >
        <Animated.View
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

          {Platform.OS == "web" ? mImage : <Zoomable
            maxPanPointers={2}>
            {mImage}
          </Zoomable>}
        </Animated.View>
      </TapGestureHandler>
    );
  }

  return (
    <Video
      ref={(ref) => {
        if (ref && videoRefs) {
          videoRefs.current[index] = ref;
        }
      }}
      source={
        item.url
          ? {
            uri: item.url,
          }
          : require("@/assets/videos/ForBiggerJoyrides.mp4")
      }
      style={[
        styles.media,
        {
          height: height || 250,
          width: width || "100%",
        },
      ]}
      resizeMode={ResizeMode.COVER}
      isLooping={true}
      shouldPlay
      useNativeControls
      usePoster
      volume={0.0}
      PosterComponent={() => (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator />
        </View>
      )}
      onError={(error) => console.error("Video Error:", error)}
      onLoadStart={() => setIsLoading(true)}
      onLoad={() => setIsLoading(false)}
    />
  );
};

export default RenderMediaItem;
