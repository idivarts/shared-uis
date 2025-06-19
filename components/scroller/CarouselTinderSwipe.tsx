import { Console } from '@/shared-libs/utils/console';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Carousel, { CarouselRenderItem } from 'react-native-reanimated-carousel';

interface IProps<T = any> {
    data: T[];
    renderItem: CarouselRenderItem<T>;
    objectKey: string;
    width: number;
    height: number;
    onLoadMore?: () => void;
}
const CarouselTinderSwipe: React.FC<IProps> = (props) => {
    const [data, setData] = useState<any[]>([])
    const [showOverlay, setShowOverlay] = useState(true);
    const [swipeOverlay, setSwipeOverlay] = useState<'accept' | 'reject' | null>(null);
    const carouselRef = useRef<any>(null);
    const prevIndex = useRef(0);

    useEffect(() => {
        if (!props.data || props.data.length < 3) {
            Console.error("CarouselScroller requires at least 3 items to function properly", "CarouselScroller");
            return;
        }
        setData([props.data[0], props.data[1], props.data[1]]);
        Console.log("CarouselScroller initialized with data length:", props.data.length);

        setTimeout(() => {
            carouselRef.current?.scrollTo({ index: 1, animated: true });
            setTimeout(() => {
                carouselRef.current?.scrollTo({ index: 0, animated: true });
            }, 300);
        }, 500);

        setTimeout(() => {
            setShowOverlay(false);
        }, 2000);
    }, [props.data])

    if (props.data.length < 3) {
        Console.error("CarouselScroller requires at least 3 items to function properly", "CarouselScroller");
        return null
    }

    const refreshCarousel = (index: number) => {
        const direction = index > prevIndex.current ? 'accept' : 'reject';
        setSwipeOverlay(direction);
        setTimeout(() => setSwipeOverlay(null), 500);
        prevIndex.current = index;

        Console.log("Refreshing carousel at index:", index);
        const key = data[index][props.objectKey]
        const globalIndex = props.data.findIndex((item) => item[props.objectKey] === key)
        if (globalIndex == -1)
            return;
        if (globalIndex >= data.length - 3) {
            props.onLoadMore?.();
        }
        setData((prevData) => {
            const newData = [...prevData];
            let previousIndex = index - 1;
            if (previousIndex < 0)
                previousIndex = data.length - 1;
            let nextIndex = index + 1;
            if (nextIndex >= data.length)
                nextIndex = 0;

            if (globalIndex + 1 < props.data.length) {
                newData[previousIndex] = props.data[globalIndex + 1];
                newData[nextIndex] = props.data[globalIndex + 1];
            }
            return [...newData];
        });
    }

    return (
        <View style={{ position: 'relative' }}>
            <Carousel
                ref={carouselRef}
                loop={true}
                vertical={false}
                onSnapToItem={refreshCarousel}
                width={props.width}
                height={props.height}
                data={data}
                renderItem={props.renderItem}
                mode="parallax"
                modeConfig={{
                    parallaxScrollingScale: 0.9,
                    parallaxScrollingOffset: 50,
                    parallaxAdjacentItemScale: 0.4,
                }}
            />
            {showOverlay && (
                <View style={styles.overlay}>
                    <Text style={styles.overlayText}>
                        Swipe left to explore more ⬅️
                    </Text>
                </View>
            )}
            {swipeOverlay && !showOverlay && (
                <View style={styles.swipeFeedback}>
                    <Text style={styles.swipeText}>
                        {swipeOverlay === 'accept' ? '✅ Accepted' : '❌ Rejected'}
                    </Text>
                </View>
            )}
        </View>
    );

}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -75 }, { translateY: -25 }],
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        zIndex: 10,
    },
    overlayText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    swipeFeedback: {
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: [{ translateX: -90 }],
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 8,
        zIndex: 12,
    },
    swipeText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default CarouselTinderSwipe