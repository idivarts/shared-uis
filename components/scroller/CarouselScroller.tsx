import { IOScroll } from '@/shared-libs/contexts/scroll-context';
import { Console } from '@/shared-libs/utils/console';
import useBreakpoints from '@/shared-libs/utils/use-breakpoints';
import Colors from '@/shared-uis/constants/Colors';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Theme, useTheme } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Carousel, { CarouselRenderItem, ICarouselInstance } from 'react-native-reanimated-carousel';
import { useCarouselInViewContext } from './CarouselInViewContext';

interface IProps<T = any> {
    data: T[];
    renderItem: CarouselRenderItem<T>;
    objectKey: string;
    width: number;
    height: number;
    vertical: boolean;
    onWheel?: (event: any) => void;
    onLoadMore?: () => void;
    onPressView?: (item: T, index: number) => void;
}
const TIME_BETWEEN_SWIPE = 1000
const wheelLockRef = {
    current: 0
};
const CarouselScroller: React.FC<IProps> = (props) => {
    const { data } = props
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isInitiated, setIsInitiated] = useState(false)
    const [showOverlay, setShowOverlay] = useState(true);
    const { setCurrentItemId, containerHeight } = useCarouselInViewContext()

    const theme = useTheme();
    const { xl } = useBreakpoints()
    const isWeb = Platform.OS == "web" && xl
    const styles = stylesFn(theme, isWeb);
    const windowHeight = Dimensions.get("window").height;

    const carouselRef = useRef<ICarouselInstance>(null);
    const containerRef = useRef<any>(null);

    const handleWheel = (event: any) => {
        // Trigger your callback if provided
        if (typeof props.onWheel === 'function') {
            props.onWheel(event);
        }
        // Only handle wheel-driven navigation once per gesture
        if (!props.vertical) return; // Only using wheel to drive vertical carousel here
        if (wheelLockRef.current > (Date.now() - TIME_BETWEEN_SWIPE)) return; // Ignore if we're waiting for the snap to finish

        const delta = event?.deltaY ?? 0;
        const THRESHOLD = 10; // small noise guard for trackpads

        if (delta > THRESHOLD) {
            console.log("Next Data called", delta, wheelLockRef.current, Date.now());
            wheelLockRef.current = Date.now();
            console.log("Next Data called - Updating Ref", wheelLockRef.current);
            carouselRef.current?.next();
        } else if (delta < -THRESHOLD) {
            wheelLockRef.current = Date.now();
            carouselRef.current?.prev();
        }
    }

    useEffect(() => {
        if (!props.data || props.data.length == 0) {
            Console.error("CarouselScroller requires at least 1 items to function properly", "CarouselScroller");
            return;
        } else
            setIsInitiated(true)
        if (isInitiated)
            return;

        setCurrentItemId(props.data[currentIndex][props.objectKey]);
        Console.log("CarouselScroller initialized with data length:", props.data.length);

        setTimeout(() => {
            if (currentIndex + 1 < data.length) {
                carouselRef.current?.scrollTo({ index: currentIndex + 1, animated: true });
                setTimeout(() => {
                    carouselRef.current?.scrollTo({ index: currentIndex, animated: true });
                }, 300);
            }
        }, 500); // delay to ensure initial mount
        setTimeout(() => {
            setShowOverlay(false);
        }, 2000);
    }, [data]);

    useEffect(() => {
        if (Platform.OS !== 'web') return;
        const node = containerRef.current as any;
        if (!node) return;

        const listener = (e: any) => {
            handleWheel(e);
        };
        // Attach only inside this container so it fires when the cursor is over the carousel area
        node.addEventListener('wheel', listener, { passive: true });
        return () => {
            try { node.removeEventListener('wheel', listener as any); } catch { }
        };
    }, [containerRef.current, props.onWheel]);

    const handleSwipe = (direction: 'accept' | 'reject') => {
        if (direction === 'accept') {
            Console.log("Accepted item at index:", currentIndex);
            carouselRef.current?.next();
        } else if (direction === 'reject') {
            Console.log("Rejected item at index:", currentIndex);
            carouselRef.current?.prev();
        }
    }

    const refreshCarousel = (index: number) => {
        Console.log("Refreshing carousel at index:", index, props.data.length);
        const key = data[index][props.objectKey]
        setCurrentItemId(key);
        setCurrentIndex(index);
        // Unlock wheel after the carousel has snapped to the new index
        // wheelLockRef.current = 0;
        if (currentIndex == data.length - 2) {
            props.onLoadMore?.();
        }
    }

    return (
        <>
            <View ref={containerRef} style={{
                position: 'relative', height: "100%", alignSelf: "center",
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
           
            }}>
                <Carousel
                    ref={carouselRef}
                    loop={false}
                    vertical={props.vertical}
                    onSnapToItem={refreshCarousel}
                    width={props.width}
                    height={
                        props.vertical
                            ? (isWeb ? props.height : (containerHeight || windowHeight))
                            : props.height
                    }
                    data={data}
                    renderItem={({ item, index }) => {
                        if (Math.abs(currentIndex - index) > 2) {
                            return <View></View>
                        } else if (props.vertical) {
                            // @ts-ignore
                            return props.renderItem({ item, index })
                        } else {
                            return <IOScroll setRef={index == currentIndex}>
                                {
                                    // @ts-ignore
                                    props.renderItem({ item, index })
                                }
                            </IOScroll>
                        }
                    }}
                    mode="parallax"
                    modeConfig={isWeb ? {
                        parallaxScrollingScale: 1,
                        parallaxScrollingOffset: 0,
                        parallaxAdjacentItemScale: 0.85,
                    } : {
                        parallaxScrollingScale: 1,
                        parallaxScrollingOffset: 50,
                        parallaxAdjacentItemScale: 0.80,
                    }}
                // style={{
                //     paddingVertical: 16
                // }}
                />
                {showOverlay && (
                    <View style={styles.overlay}>
                        <Text style={styles.overlayText}>
                            Swipe {props.vertical ? 'down' : 'left'} to explore more {props.vertical ? '⬇️' : '⬅️'}
                        </Text>
                    </View>
                )}
            </View>
            {!props.vertical &&
                (isWeb ? <>
                    <View style={styles.floatingButtonsContainer}>
                        <TouchableOpacity style={[styles.floatingButton, styles.rejectButton]} onPress={() => handleSwipe('reject')}>
                            <FontAwesomeIcon icon={faArrowLeft} size={32} color={Colors(theme).white} />
                            <Text style={styles.buttonLabel}>Previous</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.floatingButton, styles.acceptButton]} onPress={() => handleSwipe('accept')}>
                            <FontAwesomeIcon icon={faArrowRight} size={32} color={Colors(theme).white} />
                            <Text style={styles.buttonLabel}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </> : <View style={styles.floatingButtonsContainer}>
                    {/* <TouchableOpacity style={[styles.floatingButton, styles.rejectButton]} onPress={() => handleSwipe('reject')}>
                        <FontAwesomeIcon icon={faArrowLeft} size={32} color={Colors(theme).white} />
                        <Text style={styles.buttonLabel}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.floatingButton, styles.acceptButton]} onPress={() => handleSwipe('accept')}>
                        <FontAwesomeIcon icon={faArrowRight} size={32} color={Colors(theme).white} />
                        <Text style={styles.buttonLabel}>Next</Text>
                    </TouchableOpacity> */}
                </View>)
            }
        </>
    )

}

const stylesFn = (theme: Theme, isWeb = false) => StyleSheet.create({
    floatingButtonsContainer: isWeb ? {
        position: 'absolute',
        bottom: "40%",
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 100,
        pointerEvents: 'box-none',
    } : {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        zIndex: 999,
    },
    floatingButton: isWeb ? {
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
        height: 120,
        borderRadius: 32,
        backgroundColor: Colors(theme).gray200,
        shadowColor: Colors(theme).black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 6,
        padding: 16,
    } : {
        alignItems: 'center',
        justifyContent: 'center',
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors(theme).gray200,
        shadowColor: Colors(theme).black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 6,
        padding: 16,
    },
    acceptButton: {
        backgroundColor: Colors(theme).primary, // pastel green with transparency
    },
    rejectButton: {
        backgroundColor: Colors(theme).yellow100, // pastel red/pink with transparency
    },
    // profileButton: isWeb ? {
    //     backgroundColor: 'rgba(173, 216, 230, 1)', // pastel blue with transparency
    //     position: 'absolute',
    //     right: "50%",
    //     bottom: 0,
    //     transform: [{ translateX: 60 }],
    //     width: 120,
    //     height: 60,
    //     borderRadius: 32,
    //     elevation: 5,
    //     padding: 16,
    // } : {
    //     backgroundColor: 'rgba(173, 216, 230, 1)', // pastel blue with transparency
    // },
    buttonLabel: {
        fontSize: 12,
        color: Colors(theme).white,
        marginTop: 4,
    },
    overlay: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -100 }, { translateY: -25 }],
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        zIndex: 10,
    },
    overlayText: {
        color: Colors(theme).white,
        fontSize: 16,
        fontWeight: '500',
    },
});

export default CarouselScroller
