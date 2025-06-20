import { Console } from '@/shared-libs/utils/console';
import { faCheck, faPeopleRoof, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Carousel, { CarouselRenderItem, ICarouselInstance } from 'react-native-reanimated-carousel';

interface IProps<T = any> {
    data: T[];
    renderItem: CarouselRenderItem<T>;
    objectKey: string;
    width: number;
    height: number;
    onLoadMore?: () => void;
    onAccept?: (item: T, index: number) => void;
    onReject?: (item: T, index: number) => void;
    onPressView?: (item: T, index: number) => void;
}
const CarouselTinderSwipe: React.FC<IProps> = (props) => {
    const [data, setData] = useState<any[]>([])
    const [showOverlay, setShowOverlay] = useState(true);
    const [swipeOverlay, setSwipeOverlay] = useState<'accept' | 'reject' | null>(null);
    const [currentGlobalIndex, setCurrentGlobalIndex] = useState(0)

    const carouselRef = useRef<ICarouselInstance>(null);
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

    const handleSwipe = (direction: 'accept' | 'reject') => {
        if (direction === 'accept') {
            props.onAccept?.(data[prevIndex.current], prevIndex.current);
            // Handle accept action
            carouselRef.current?.next();
        } else if (direction === 'reject') {
            props.onReject?.(data[prevIndex.current], prevIndex.current);
            // Handle reject action
            carouselRef.current?.prev();
        }
    }

    const refreshCarousel = (index: number) => {
        const direction = index > prevIndex.current ? 'accept' : 'reject';
        if (!showOverlay && index != prevIndex.current) {
            setSwipeOverlay(direction);
            setTimeout(() => setSwipeOverlay(null), 500);
        }
        prevIndex.current = index;

        Console.log("Refreshing carousel at index:", index);
        const key = data[index][props.objectKey]
        const globalIndex = props.data.findIndex((item) => item[props.objectKey] === key)
        if (globalIndex == -1)
            return;
        setCurrentGlobalIndex(globalIndex);

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
            <View style={styles.floatingButtonsContainer}>
                <TouchableOpacity style={[styles.floatingButton, styles.rejectButton]} onPress={() => handleSwipe('reject')}>
                    <FontAwesomeIcon icon={faTimes} size={32} color="#fff" />
                    <Text style={styles.buttonLabel}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.floatingButton, styles.profileButton]} onPress={() => props.onPressView?.(data[prevIndex.current], currentGlobalIndex)}>
                    <FontAwesomeIcon icon={faPeopleRoof} size={28} color="#fff" />
                    <Text style={styles.buttonLabel}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.floatingButton, styles.acceptButton]} onPress={() => handleSwipe('accept')}>
                    <FontAwesomeIcon icon={faCheck} size={32} color="#fff" />
                    <Text style={styles.buttonLabel}>Accept</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    floatingButtonsContainer: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        zIndex: 999,
    },
    floatingButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#ccc',
        elevation: 5,
        padding: 16,
    },
    acceptButton: {
        backgroundColor: 'rgba(144, 238, 144, 0.8)', // pastel green with transparency
    },
    rejectButton: {
        backgroundColor: 'rgba(255, 182, 193, 0.8)', // pastel red/pink with transparency
    },
    profileButton: {
        backgroundColor: 'rgba(173, 216, 230, 0.8)', // pastel blue with transparency
    },
    buttonLabel: {
        fontSize: 12,
        color: 'white',
        marginTop: 4,
    },
    overlay: {
        position: 'absolute',
        top: '50%',
        left: '30%',
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