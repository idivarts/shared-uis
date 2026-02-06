import { Dimensions, Platform } from 'react-native';
export const MAX_WIDTH_WEB = 430;
export const MAX_HEIGHT_WEB = 430;
export const APPROX_CARD_HEIGHT = 710;

const getMediaDimensions = async (url: string, type: string) => {
    return new Promise((resolve, reject) => {
        const { width: windowWidth } = Dimensions.get('window');
        const effectiveWidth = Platform.OS === 'web' ? Math.min(MAX_WIDTH_WEB, windowWidth) : windowWidth;
        
        if (type === 'image') {
            resolve({
                width: effectiveWidth,
                height: effectiveWidth,
            });
            // Image.getSize(
            //     url,
            //     (width, height) => {
            //         // resolve({ width, height })
            //         const { width: mWidth } = Dimensions.get('window');
            //         const iWidth = Platform.OS === 'web' ? MAX_WIDTH_WEB : mWidth;
            //         const iHeight = (iWidth * height) / width;
            //         const fHeight = Math.round(Math.min(Math.max(iHeight, 0.8 * mWidth), 1.3 * mWidth));
            //         resolve({
            //             width: Platform.OS === 'web' ? MAX_WIDTH_WEB : Dimensions.get('window').width,
            //             height: fHeight,
            //         });
            //     },
            //     (error) => reject(error)
            // );
        } else if (type === 'video') {
            // const videoRef = new Video({});
            resolve({
                width: Platform.OS === 'web' ? MAX_WIDTH_WEB : Dimensions.get('window').width,
                height: Platform.OS === 'web' ? MAX_HEIGHT_WEB : width,
            });
        } else {
            reject(new Error('Invalid type. Use "image" or "video".'));
        }
    });
};

export default getMediaDimensions;
