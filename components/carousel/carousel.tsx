import Colors from "@/shared-uis/constants/Colors";
import {
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Theme } from "@react-navigation/native";
import useBreakpoints from "@/shared-libs/utils/use-breakpoints";
import React, { useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleProp, ViewProps } from "react-native";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import {
    ICarouselInstance,
    Pagination,
    default as ReanimatedCarousel,
} from "react-native-reanimated-carousel";
import { stylesFn } from "../../styles/carousel/Carousel.styles";
import { View } from "../theme/Themed";
import { MAX_HEIGHT_WEB, MAX_WIDTH_WEB } from "./carousel-util";
import RenderMediaItem, { MediaItem } from "./render-media-item";

interface CarouselProps {
    data: MediaItem[];
    theme: Theme;
    width?: number;
    parentId?: string;
    onImagePress?: (data: MediaItem) => void;

    // To be removed later
    carouselWidth?: number;
    carouselContainerStyle?: StyleProp<ViewProps>;
    containerHeight?: number;
}

const Carousel: React.FC<CarouselProps> = ({
    // carouselContainerStyle,
    containerHeight,
    // carouselWidth,
    onImagePress,
    data,
    theme,
    width,
    ...props
}) => {
    const styles = stylesFn(theme);
    const swiperRef = useRef<ICarouselInstance>(null);
    const [currentItem, setCurrentItem] = useState<number>(0);
    // const nativeRef = useRef<Swiper>(null);
    const progress = useSharedValue(0);

    const [key, _] = useState(Math.floor(Math.random() * 10000))
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
            // getMediaDimensions(data[0].url, data[0].type).then((dimensions: any) => {
            //   if (dimensions) {
            //     setCarouselHeight(dimensions.height);
            //     setCarouselWidth(dimensions.width);
            //   }
            // });
        }
    }, [data]);

    const { width: screenWidth } = useBreakpoints();

    const [carouselHeight, setCarouselHeight] = useState<any>(Platform.OS === "web"
        ? (MAX_WIDTH_WEB < screenWidth ? MAX_HEIGHT_WEB : screenWidth)
        : screenWidth);
    const [carouselWidth] = useState((Platform.OS === "web" && MAX_WIDTH_WEB < screenWidth) ? MAX_WIDTH_WEB : (width ? width : screenWidth))

    useEffect(() => {
        if (containerHeight != null && containerHeight > 0) {
            setCarouselHeight(Math.max(0, containerHeight - 20));
        }
    }, [containerHeight]);
    if (data.length == 0) {
        return null;
    }

    return (
        <View
            id={"carousel" + key}
            style={{
                height: carouselHeight + 20,
                width: Platform.OS == "web" ? carouselWidth : "auto",
                backgroundColor: "transparent",
            }}
        >
            {/* {Platform.OS === "web" ? ( */}
            <>
                <ReanimatedCarousel
                    ref={swiperRef}
                    data={data}
                    width={carouselWidth}
                    height={carouselHeight}
                    loop={false}
                    onProgressChange={(_, absoluteProgress) => {
                        runOnJS((value: number) => {
                            progress.value = value;
                        })(absoluteProgress);
                        setCurrentItem(absoluteProgress)
                    }}
                    withAnimation={{
                        type: "timing",
                        config: {},
                    }}
                    renderItem={({ item, index }) => (
                        <RenderMediaItem
                            handleImagePress={handleImagePress}
                            height={carouselHeight}
                            width={carouselWidth}
                            currentIndex={currentItem}
                            index={index}
                            cKey={"carousel" + key}
                            item={item}
                            key={index}
                            parentId={props.parentId}
                        />
                    )}
                    style={[styles.carouselContainer]}
                    pagingEnabled
                    {...props}
                />
                {data.length > 1 && <>
                    {Platform.OS == "web" && <>
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
                                    color={Colors(theme).primary}
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
                                    color={Colors(theme).primary}
                                />
                            </Pressable>
                        </View>
                    </>}
                    <Pagination.Basic
                        progress={progress}
                        data={data}
                        size={8}
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
                    // onPress={(index) => {
                    //   swiperRef.current?.scrollTo({
                    //     count: index - progress.value,
                    //     animated: true,
                    //   });
                    // }}
                    />
                </>}
            </>
            {/* ) : (
        <Swiper
          ref={nativeRef}
          height={carouselHeight}
          style={[styles.carouselContainer]}
          dotStyle={styles.dot}
          activeDotStyle={[styles.dot, styles.activeDot]}
          paginationStyle={styles.pagination}
          onIndexChanged={(index) => { setCurrentItem(index) }}
          pagingEnabled
          {...props}
        >
          {data.map((item: MediaItem, index: number) => (
            <RenderMediaItem
              handleImagePress={handleImagePress}
              height={carouselHeight}
              width={carouselWidth}
              currentIndex={currentItem}
              index={index}
              item={item}
              key={item.url || index}
            />
          ))}
        </Swiper>
      )} */}
        </View>
    );
};

export default Carousel;
