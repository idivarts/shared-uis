import { Platform } from "react-native";

export type VideoPosterThumbnailOptions = {
    time?: number;
    quality?: number;
};

/**
 * Generates a poster URI from a video URL on native only.
 * Uses lazy `require("expo-video-thumbnails")` so missing native bindings
 * (web, mismatched Expo Go / dev client) do not crash at app startup.
 */
export async function getVideoPosterThumbnail(
    url: string,
    options: VideoPosterThumbnailOptions = {}
): Promise<string | null> {
    if (Platform.OS === "web") {
        return null;
    }
    try {
        const VideoThumbnails = require("expo-video-thumbnails") as typeof import("expo-video-thumbnails");
        const { uri } = await VideoThumbnails.getThumbnailAsync(url, {
            time: options.time ?? 500,
            quality: options.quality ?? 0.78,
        });
        return uri;
    } catch {
        return null;
    }
}
