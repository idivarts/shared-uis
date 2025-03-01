import { Dimensions, Image, Platform } from 'react-native';
export const MAX_WIDTH_WEB = 640;

const getMediaDimensions = async (url: string, type: string) => {
    return new Promise((resolve, reject) => {
        if (type === 'image') {
            Image.getSize(
                url,
                (width, height) => {
                    // resolve({ width, height })
                    const { width: mWidth } = Dimensions.get('window');
                    const iWidth = Platform.OS === 'web' ? MAX_WIDTH_WEB : mWidth;
                    const iHeight = (iWidth * height) / width;
                    const fHeight = Math.round(Math.min(Math.max(iHeight, 0.8 * mWidth), 1.3 * mWidth));
                    resolve({
                        width: Platform.OS === 'web' ? MAX_WIDTH_WEB : "100%",
                        height: fHeight,
                    });
                },
                (error) => reject(error)
            );
        } else if (type === 'video') {
            // const videoRef = new Video({});
            const { width } = Dimensions.get('window');
            resolve({
                width: Platform.OS === 'web' ? MAX_WIDTH_WEB : "100%",
                height: Platform.OS === 'web' ? MAX_WIDTH_WEB : width,
            });
        } else {
            reject(new Error('Invalid type. Use "image" or "video".'));
        }
    });
};

export default getMediaDimensions;
