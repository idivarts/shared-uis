import React, { createContext, ReactNode, useContext, useState } from 'react';

interface CarouselInViewContextType {
    currentItemId: string;
    setCurrentItemId: (id: string) => void;
}

// Create the context
const CarouselInViewContext = createContext<CarouselInViewContextType>({
    currentItemId: "",
    setCurrentItemId: () => { }
});

// Create a provider component
interface CarouselInViewProviderProps {
    children: ReactNode;
}

export const CarouselInViewProvider: React.FC<CarouselInViewProviderProps> = ({ children }) => {
    const [currentItemId, setCurrentItemId] = useState("");
    return (
        <CarouselInViewContext.Provider value={{ currentItemId, setCurrentItemId }}>
            {children}
        </CarouselInViewContext.Provider>
    );
};

// Custom hook to use the context
export const useCarouselInViewContext = () => useContext(CarouselInViewContext);