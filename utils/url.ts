import * as ImageManipulator from 'expo-image-manipulator';
import { Platform } from 'react-native';

export const imageUrlWithHeic = async (image: string | NodeRequire | number | undefined) => {

    if (
        image &&
        typeof image === "string" &&
        (image.startsWith("http") ||
            image.startsWith("ph://") ||
            image.startsWith("file://"))
    ) {
        if (Platform.OS == "web") {
            if (image.endsWith(".heic") || image.endsWith(".HEIC")) {
                const result = await ImageManipulator.manipulateAsync(image, [], {
                    format: ImageManipulator.SaveFormat.JPEG, compress: 0.8
                });// Adjust compression as needed
                return { uri: result.uri };
            }
        }
        return { uri: image };
    } else if (image) {
        return image;
    } else {
        return require("@/assets/images/placeholder-image.jpg");
    }
};
export const imageUrl = (image: string | NodeRequire | number | undefined) => {
    if (
        image &&
        typeof image === "string" &&
        (image.startsWith("http") ||
            image.startsWith("ph://") ||
            image.startsWith("file://"))
    ) {
        return {
            uri: image,
        };
    } else if (image) {
        return image;
    } else {
        return require("@/assets/images/placeholder-image.jpg");
    }
};

/** Returns gender-specific placeholder image for influencer avatars (male/female); otherwise default placeholder. */
export const getPlaceholderImageForGender = (gender: string | undefined): NodeRequire => {
    if (!gender || typeof gender !== "string") {
        return require("@/assets/images/placeholder-image.jpg");
    }
    const g = gender.toLowerCase().trim();
    if (g === "male") return require("@/assets/images/placeholder-image-male.jpeg");
    if (g === "female") return require("@/assets/images/placeholder-image-female.jpeg");
    return require("@/assets/images/placeholder-image.jpg");
};

export const queryParams = (
    params: Partial<Record<string, string | string[]>>
) => {
    let values: string[] = [];

    Object.entries(params).map(([key, value]) => {
        values.push(`${key}=${value}`);
    });

    return values.length === 0 ? "" : `?${values.join("&")}`;
};
