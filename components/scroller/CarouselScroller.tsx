import { Console } from '@/shared-libs/utils/console';
import { faArrowLeft, faArrowRight, faPeopleRoof } from '@fortawesome/free-solid-svg-icons';
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
    vertical: boolean;
    onLoadMore?: () => void;
    onPressView?: (item: T, index: number) => void;
}
const CarouselScroller: React.FC<IProps> = (props) => {
    const [data, setData] = useState<any[]>([])
    const [loop, setLoop] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentGlobalIndex, setCurrentGlobalIndex] = useState(0)
    const [showOverlay, setShowOverlay] = useState(true);

    useEffect(() => {
        if (!props.data || props.data.length < 3) {
            Console.error("CarouselScroller requires at least 3 items to function properly", "CarouselScroller");
            return;
        }
        if (data.length != 0) return

        setData(props.data.slice(0, 3));
        Console.log("CarouselScroller initialized with data length:", props.data.length);
    }, [props.data])

    const carouselRef = useRef<ICarouselInstance>(null);

    useEffect(() => {
        setTimeout(() => {
            carouselRef.current?.scrollTo({ index: 1, animated: true });
            setTimeout(() => {
                carouselRef.current?.scrollTo({ index: 0, animated: true });
            }, 300);
        }, 500); // delay to ensure initial mount
        setTimeout(() => {
            setShowOverlay(false);
        }, 2000);
    }, []);

    if (props.data.length < 3) {
        Console.error("CarouselScroller requires at least 3 items to function properly", "CarouselScroller");
        return null
    }

    const handleSwipe = (direction: 'accept' | 'reject') => {
        if (direction === 'accept') {
            Console.log("Accepted item at index:", currentIndex);
            // Handle accept action
            carouselRef.current?.next();
        } else if (direction === 'reject') {
            Console.log("Rejected item at index:", currentIndex);
            // Handle reject action
            carouselRef.current?.prev();
        }
    }

    const refreshCarousel = (index: number) => {
        Console.log("Refreshing carousel at index:", index);
        // if (!data[index])
        //     return;
        const key = data[index][props.objectKey]
        const globalIndex = props.data.findIndex((item) => item[props.objectKey] === key)
        if (globalIndex == -1)
            return;
        if (globalIndex >= props.data.length - 3) {
            props.onLoadMore?.();
        }
        setCurrentIndex(index);
        setCurrentGlobalIndex(globalIndex);
        setLoop(globalIndex > 0 && globalIndex < props.data.length - 1);

        setData((prevData) => {
            const newData = [...prevData];
            // const itemToMove = newData.splice(globalIndex, 1)[0];
            // newData.push(itemToMove);
            let previousIndex = index - 1;
            if (previousIndex < 0)
                previousIndex = data.length - 1;
            let nextIndex = index + 1;
            if (nextIndex >= data.length)
                nextIndex = 0;

            if (globalIndex - 1 >= 0)
                newData[previousIndex] = props.data[globalIndex - 1];
            if (globalIndex + 1 < props.data.length)
                newData[nextIndex] = props.data[globalIndex + 1];
            return [...newData];
        });
    }

    return (
        <View style={{ position: 'relative', height: "100%" }}>
            <Carousel
                ref={carouselRef}
                loop={loop}
                vertical={props.vertical}
                onSnapToItem={refreshCarousel}
                width={props.width}
                height={props.height}
                data={data}
                renderItem={props.renderItem}
                mode="parallax"
                // modeConfig={{
                //     parallaxScrollingScale: 0.95,
                //     parallaxAdjacentItemScale: 0.8,
                // }}
                style={{
                    transform: [props.vertical ? { translateY: 3 } : { translateX: 5 }],
                    paddingVertical: 16
                }}
            />
            {showOverlay && (
                <View style={styles.overlay}>
                    <Text style={styles.overlayText}>
                        Swipe {props.vertical ? 'down' : 'left'} to explore more {props.vertical ? '⬇️' : '⬅️'}
                    </Text>
                </View>
            )}
            {!props.vertical &&
                <View style={styles.floatingButtonsContainer}>
                    <TouchableOpacity style={[styles.floatingButton, styles.rejectButton]} onPress={() => handleSwipe('reject')}>
                        <FontAwesomeIcon icon={faArrowLeft} size={32} color="#fff" />
                        <Text style={styles.buttonLabel}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.floatingButton, styles.profileButton]} onPress={() => props.onPressView?.(data[currentIndex], currentGlobalIndex)}>
                        <FontAwesomeIcon icon={faPeopleRoof} size={32} color="#fff" />
                        <Text style={styles.buttonLabel}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.floatingButton, styles.acceptButton]} onPress={() => handleSwipe('accept')}>
                        <FontAwesomeIcon icon={faArrowRight} size={32} color="#fff" />
                        <Text style={styles.buttonLabel}>Next</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )

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
        backgroundColor: 'rgba(214, 138, 222, 0.8)', // pastel red/pink with transparency
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
});

export default CarouselScroller