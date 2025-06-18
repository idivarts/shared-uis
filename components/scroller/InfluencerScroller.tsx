import { FlashList } from "@shopify/flash-list";
import React from 'react';
import { FlatListProps } from 'react-native';
import { APPROX_CARD_HEIGHT } from "../carousel/carousel-util";

const InfluencerScroller: React.FC<FlatListProps<any>> = (props) => {
    return (
        // @ts-ignore
        <FlashList {...props} estimatedItemSize={APPROX_CARD_HEIGHT} />
    )
}

export default InfluencerScroller