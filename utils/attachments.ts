import { Platform } from "react-native";
import { MediaItem } from "../components/carousel/render-media-item";

export const processRawAttachment = (attachment: any): MediaItem => {
    if (!attachment) {
        return {
            type: "",
            url: "",
        };
    }
    if (attachment.type?.includes("reel")) {
        return {
            type: attachment.type,
            url: attachment.imageUrl || attachment.url || "",
            imageUrl: attachment.imageUrl,
            playUrl: attachment.playUrl,
        };
    }
    if (attachment.type.includes("video")) {
        if (Platform.OS === "ios") {
            return {
                type: attachment.type,
                url: attachment.appleUrl,
            };
        } else {
            return {
                type: attachment.type,
                url: attachment.playUrl,
            };
        }
    } else if (attachment.type.includes("image")) {
        return {
            type: attachment.type,
            url: attachment.imageUrl,
        };
    } else {
        return {
            type: "file",
            url: attachment.url,
        };
    }
};
