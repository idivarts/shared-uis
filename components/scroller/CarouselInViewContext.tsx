import { Console } from '@/shared-libs/utils/console';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { View } from '../theme/Themed';

interface CarouselInViewContextType {
    currentItemId: string;
    containerHeight?: number,
    setCurrentItemId: (id: string) => void;
}

// Create the context
const CarouselInViewContext = createContext<CarouselInViewContextType>({
    currentItemId: "",
    containerHeight: 0,
    setCurrentItemId: () => { }
});

// Create a provider component
interface CarouselInViewProviderProps {
    children: ReactNode;
}

export const CarouselInViewProvider: React.FC<CarouselInViewProviderProps> = ({ children }) => {
    const [currentItemId, setCurrentItemId] = useState("");
    const [containerHeight, setContainerHeight] = useState(0);
    return (
        <CarouselInViewContext.Provider value={{ currentItemId, setCurrentItemId, containerHeight }}>
            <View
                style={{ width: "100%", height: "100%" }}
                onLayout={(event) => {
                    const height = event.nativeEvent.layout.height;
                    Console.log("Carousel Height", height)
                    setContainerHeight(height);
                }}
            >
                {children}
            </View>
        </CarouselInViewContext.Provider>
    );
};

// Custom hook to use the context
export const useCarouselInViewContext = () => useContext(CarouselInViewContext);