import { getConstrainedWidth } from '@/shared-libs/contexts/mobile-layout-context.provider';
import { Platform } from 'react-native';
export const MAX_WIDTH_WEB = 500;
export const MAX_HEIGHT_WEB = 500;
export const APPROX_CARD_HEIGHT = 710;

const getMediaDimensions = async (url: string, type: string) => {
    return new Promise((resolve, reject) => {
        const width = getConstrainedWidth();
        if (type === 'image') {
            resolve({
                width: Platform.OS === 'web' ? MAX_WIDTH_WEB : width,
                height: Platform.OS === 'web' ? MAX_HEIGHT_WEB : width,
            });
        } else if (type === 'video') {
            resolve({
                width: Platform.OS === 'web' ? MAX_WIDTH_WEB : width,
                height: Platform.OS === 'web' ? MAX_HEIGHT_WEB : width,
            });
        } else {
            reject(new Error('Invalid type. Use "image" or "video".'));
        }
    });
};

export default getMediaDimensions;
