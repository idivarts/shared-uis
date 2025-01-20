import React, { useRef } from "react";
import { Platform } from "react-native";
import Swiper, { SwiperProps } from "react-native-swiper";
import { Theme } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import { View } from "../theme/Themed";
import { stylesFn } from "../../styles/carousel/Carousel.styles";
import RenderMediaItem, { MediaItem } from "./render-media-item";
import Colors from "../../constants/Colors";
import { StyleProp } from "react-native";
import { ViewProps } from "react-native";

interface CarouselProps extends SwiperProps {
  carouselContainerStyle?: StyleProp<ViewProps>;
  containerHeight?: number;
  data: MediaItem[];
  onImagePress?: (data: MediaItem) => void;
  theme: Theme;
};

const Carousel: React.FC<CarouselProps> = ({
  carouselContainerStyle,
  containerHeight,
  data,
  onImagePress,
  theme,
  ...props
}) => {
  const styles = stylesFn(theme);
  const swiperRef = useRef<Swiper>(null);
  const videoRefs = useRef<{ [key: number]: any }>({});

  const handleImagePress = (item: MediaItem) => {
    if (onImagePress) {
      onImagePress(item);
    }
  };

  return (
    <View
      style={{
        height: containerHeight ? containerHeight : (Platform.OS === 'web' ? 560 : 320),
        paddingBottom: Platform.OS === 'web' ? 40 : 0,
      }}
    >
      <Swiper
        ref={swiperRef}
        height={Platform.OS === 'web' ? 560 : 320}
        style={[
          styles.carouselContainer,
          carouselContainerStyle,
        ]}
        dotStyle={styles.dot}
        activeDotStyle={[
          styles.dot,
          styles.activeDot,
        ]}
        paginationStyle={styles.pagination}
        pagingEnabled
        showsButtons={Platform.OS === 'web' && data.length > 1}
        nextButton={
          Platform.OS === 'web' && <View
            style={styles.buttonWrapper}
          >
            <FontAwesomeIcon
              icon={faChevronRight}
              size={20}
              color={Colors(theme).black}
            />
          </View>
        }
        prevButton={
          Platform.OS === 'web' && <View
            style={styles.buttonWrapper}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              size={20}
              color={Colors(theme).black}
            />
          </View>
        }
        {...props}
      >
        {
          data.map((
            item: MediaItem,
            index: number,
          ) => (
            <RenderMediaItem
              handleImagePress={handleImagePress}
              height={Platform.OS === 'web' ? 560 : 280}
              index={index}
              item={item}
              key={item.url || index}
              videoRefs={videoRefs}
            />
          ))
        }
      </Swiper>
    </View>
  );
};

export default Carousel;
