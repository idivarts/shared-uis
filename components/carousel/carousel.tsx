import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Theme } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Platform, Pressable, StyleProp, ViewProps } from "react-native";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import {
  ICarouselInstance,
  Pagination,
  default as ReanimatedCarousel,
} from "react-native-reanimated-carousel";
import Swiper from "react-native-swiper";
import Colors from "../../constants/Colors";
import { stylesFn } from "../../styles/carousel/Carousel.styles";
import { View } from "../theme/Themed";
import getMediaDimensions, { MAX_HEIGHT_WEB, MAX_WIDTH_WEB } from "./carousel-util";
import RenderMediaItem, { MediaItem } from "./render-media-item";

interface CarouselProps {
  data: MediaItem[];
  theme: Theme;
  width?: number;
  onImagePress?: (data: MediaItem) => void;

  // To be removed later
  carouselWidth?: number;
  carouselContainerStyle?: StyleProp<ViewProps>;
  containerHeight?: number;
}

const Carousel: React.FC<CarouselProps> = ({
  // carouselContainerStyle,
  // containerHeight,
  // carouselWidth,

  onImagePress,
  data,
  theme,
  width,
  ...props
}) => {
  const styles = stylesFn(theme);
  const swiperRef = useRef<ICarouselInstance>(null);
  const videoRefs = useRef<{ [key: number]: any }>({});
  const nativeRef = useRef<Swiper>(null);
  const progress = useSharedValue(0);

  const handleImagePress = (item: MediaItem) => {
    if (onImagePress) {
      onImagePress(item);
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.scrollTo({
        count: 1, // Scroll forward by 1
        animated: true,
      });
    }
  };

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.scrollTo({
        count: -1, // Scroll backward by 1
        animated: true,
      });
    }
  };

  useEffect(() => {
    if (data && data.length > 0 && Platform.OS !== "web") {
      getMediaDimensions(data[0].url, data[0].type).then((dimensions: any) => {
        // console.log("Calculated Dimensions", dimensions);
        if (dimensions) {
          setCarouselHeight(dimensions.height);
          setCarouselWidth(dimensions.width);
        }
      });
    }
  }, [data]);

  const { width: mWidth } = Dimensions.get('window');
  const [carouselHeight, setCarouselHeight] = useState<any>(Platform.OS === "web"
    ? MAX_HEIGHT_WEB
    : mWidth);

  const [carouselWidth, setCarouselWidth] = useState(Platform.OS === "web" ? MAX_WIDTH_WEB : (width ? width : Dimensions.get("window").width))

  return (
    <View
      style={{
        height: carouselHeight,
        width: Platform.OS == "web" ? carouselWidth : undefined,
      }}
    >
      {Platform.OS === "web" ? (
        <>
          <ReanimatedCarousel
            ref={swiperRef}
            data={data}
            width={carouselWidth}
            loop={false}
            onProgressChange={(_, absoluteProgress) => {
              runOnJS((value: number) => {
                progress.value = value;
              })(absoluteProgress);
            }}
            withAnimation={{
              type: "timing",
              config: {},
            }}
            renderItem={({ item, index }) => (
              <RenderMediaItem
                handleImagePress={handleImagePress}
                height={MAX_HEIGHT_WEB}
                index={index}
                item={item}
                key={item.url || index}
                videoRefs={videoRefs}
              />
            )}
            style={[styles.carouselContainer]}
            pagingEnabled
            {...props}
          />
          <View
            style={{
              position: "absolute",
              top: "50%",
              left: 10,
              transform: [{ translateY: -50 }],
              zIndex: 10,
              padding: 10,
              borderRadius: 50,
            }}
          >
            <Pressable onPress={handlePrev}>
              <FontAwesomeIcon
                icon={faChevronLeft}
                size={20}
                color={Colors(theme).black}
              />
            </Pressable>
          </View>
          <View
            style={{
              position: "absolute",
              top: "50%",
              right: 10,
              transform: [{ translateY: -50 }],
              zIndex: 10,
              borderRadius: 50,
              padding: 10,
            }}
          >
            <Pressable onPress={handleNext}>
              <FontAwesomeIcon
                icon={faChevronRight}
                size={20}
                color={Colors(theme).black}
              />
            </Pressable>
          </View>
          <Pagination.Basic
            progress={progress}
            data={data}
            size={15}
            dotStyle={{
              borderRadius: 100,
              backgroundColor: Colors(theme).backdrop,
            }}
            activeDotStyle={{
              borderRadius: 100,
              overflow: "hidden",
              backgroundColor: Colors(theme).primary,
            }}
            containerStyle={[
              {
                gap: 5,
                marginTop: 10,
              },
            ]}
            horizontal
            onPress={(index) => {
              swiperRef.current?.scrollTo({
                count: index - progress.value,
                animated: true,
              });
            }}
          />
        </>
      ) : (
        <Swiper
          ref={nativeRef}
          height={carouselHeight}
          style={[styles.carouselContainer]}
          dotStyle={styles.dot}
          activeDotStyle={[styles.dot, styles.activeDot]}
          paginationStyle={styles.pagination}
          pagingEnabled
          {...props}
        >
          {data.map((item: MediaItem, index: number) => (
            <RenderMediaItem
              handleImagePress={handleImagePress}
              height={carouselHeight}
              index={index}
              item={item}
              key={item.url || index}
              videoRefs={videoRefs}
            />
          ))}
        </Swiper>
      )}
    </View>
  );
};

export default Carousel;
