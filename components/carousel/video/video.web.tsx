import React from 'react';
import { Video as WebVideo } from "react-native-video";

const MyVideo = (params: any) => {
    return (
        <WebVideo {...params} />
    )
}

export default MyVideo