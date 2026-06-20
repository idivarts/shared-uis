import type { ViewStyle } from "react-native";

export type MediaShape = "circle" | "square";
export type MediaSize = "small" | "medium" | "large" | "extraLarge";

export interface MediaItem {
    type: string;
    /** Video or image URL. For video-only items, a poster is generated from this URL when `imageUrl` is omitted. */
    url: string;
    /** Optional poster; when set for video items, thumbnail extraction is skipped. */
    imageUrl?: string;
    playUrl?: string;
}

export interface RendererDimensions {
    frameHeight: number;
    frameWidth: ViewStyle["width"];
}
