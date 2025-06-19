import { Console } from '@/shared-libs/utils/console';
import React, { useEffect, useState } from 'react';
import Carousel, { CarouselRenderItem } from 'react-native-reanimated-carousel';

interface IProps<T = any> {
    data: T[];
    renderItem: CarouselRenderItem<T>;
    objectKey: string;
    width: number;
    height: number;
    vertical: boolean;
    onLoadMore?: () => void;
}
const CarouselScroller: React.FC<IProps> = (props) => {
    const [data, setData] = useState<any[]>([])
    const [loop, setLoop] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentGlobalIndex, setCurrentGlobalIndex] = useState(0)

    useEffect(() => {
        if (!props.data || props.data.length < 3) {
            Console.error("CarouselScroller requires at least 3 items to function properly", "CarouselScroller");
            return;
        }
        setData(props.data.slice(0, 3));
        Console.log("CarouselScroller initialized with data length:", props.data.length);
    }, [props.data])

    if (props.data.length < 3) {
        Console.error("CarouselScroller requires at least 3 items to function properly", "CarouselScroller");
        return null
    }

    const refreshCarousel = (index: number) => {
        Console.log("Refreshing carousel at index:", index);
        // if (!data[index])
        //     return;
        const key = data[index][props.objectKey]
        const globalIndex = props.data.findIndex((item) => item[props.objectKey] === key)
        if (globalIndex == -1)
            return;
        if (globalIndex >= data.length - 3) {
            props.onLoadMore?.();
        }
        setCurrentIndex(index);
        setCurrentGlobalIndex(globalIndex);
        setLoop(globalIndex != 0);

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

    return (<Carousel
        loop={loop}
        vertical={props.vertical}
        onSnapToItem={refreshCarousel}
        width={props.width}
        height={props.height}
        data={data}
        renderItem={props.renderItem}
        mode="parallax"
    />)

}

export default CarouselScroller