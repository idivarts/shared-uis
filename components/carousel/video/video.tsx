import { Video } from "expo-av";
import React from 'react';

const MyVideo = (params: any) => {
    return (
        <Video {...params} />
    )
}

export default MyVideo