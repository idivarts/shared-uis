import React, { useRef } from "react";
import { Platform, Dimensions } from "react-native";
import SwiperProps from "react-native-swiper";
import { Theme } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { View } from "../theme/Themed";
import { stylesFn } from "../../styles/carousel/Carousel.styles";
import RenderMediaItem, { MediaItem } from "./render-media-item";
import Colors from "../../constants/Colors";
import { StyleProp } from "react-native";
import { ViewProps } from "react-native";
import {
  default as ReanimatedCarousel,
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useSharedValue, runOnJS } from "react-native-reanimated";
import { Pressable } from "react-native";
import Swiper from "react-native-swiper";

interface CarouselProps {
  carouselContainerStyle?: StyleProp<ViewProps>;
  carouselWidth?: number;
  containerHeight?: number;
  data: MediaItem[];
  onImagePress?: (data: MediaItem) => void;
  theme: Theme;
}

const Carousel: React.FC<CarouselProps> = ({
  carouselContainerStyle,
  carouselWidth,
  containerHeight,
  data,
  onImagePress,
  theme,
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

  return (
    <View
      style={{
        height: containerHeight
          ? containerHeight
          : Platform.OS === "web"
          ? 580
          : 400,
      }}
    >
      {Platform.OS === "web" ? (
        <>
          <ReanimatedCarousel
            ref={swiperRef}
            data={data}
            width={
              carouselWidth ? carouselWidth : Dimensions.get("window").width
            }
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
                height={Platform.OS === "web" ? 580 : 280}
                index={index}
                item={item}
                key={item.url || index}
                videoRefs={videoRefs}
              />
            )}
            style={[styles.carouselContainer, carouselContainerStyle]}
            pagingEnabled
            {...props}
          />
          {Platform.OS === "web" && (
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
          )}
          {Platform.OS === "web" && (
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
          )}
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
          height={320}
          style={[styles.carouselContainer, carouselContainerStyle]}
          dotStyle={styles.dot}
          activeDotStyle={[styles.dot, styles.activeDot]}
          paginationStyle={styles.pagination}
          pagingEnabled
          {...props}
        >
          {data.map((item: MediaItem, index: number) => (
            <RenderMediaItem
              handleImagePress={handleImagePress}
              height={
                Platform.OS === "web" ? 560 : Dimensions.get("window").width
              }
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
