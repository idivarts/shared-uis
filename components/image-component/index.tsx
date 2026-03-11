import { Console } from "@/shared-libs/utils/console";
import useBreakpoints from "@/shared-libs/utils/use-breakpoints";
import Colors from "@/shared-uis/constants/Colors";
import {
    IMAGE_LARGE,
    IMAGE_MEDIUM,
    IMAGE_SMALL,
} from "@/shared-uis/constants/ImageSize";
import { imageUrl, imageUrlWithHeic } from "@/shared-uis/utils/url";
import { useTheme } from "@react-navigation/native";
import React, { FC, useEffect, useState } from "react";
import {
    Image,
    ImageProps,
    ImageSourcePropType,
    ImageStyle,
    Platform,
} from "react-native";
import { Text, View } from "../theme/Themed";

interface ImageComponentProps extends Omit<ImageProps, "source"> {
    shape?: "circle" | "square";
    size?: "small" | "medium" | "large" | "extraLarge";
    url: string | ImageSourcePropType;
    altText: string;
    placeholder?: string | ImageSourcePropType;
    initials?: string;
    initialsSize?: number;
}

const ImageComponent: FC<ImageComponentProps> = ({
    shape = "circle",
    size = "medium",
    url,
    altText,
    style,
    placeholder,
    initials,
    initialsSize = 16,
    ...imageProps
}) => {
    const { width: constrainedWidth } = useBreakpoints();

    const dimensions = {
        small: IMAGE_SMALL,
        medium: IMAGE_MEDIUM,
        large: IMAGE_LARGE,
        extraLarge: constrainedWidth
    };

    const containerStyle: ImageStyle = {
        width: size !== "extraLarge" ? dimensions[size] : constrainedWidth,
        height:
            size !== "extraLarge"
                ? dimensions[size]
                : Platform.OS === "web"
                    ? 580
                    : constrainedWidth,
        borderRadius: shape === "circle" ? dimensions[size] / 2 : 0,
        overflow: "hidden",
    };

    const [loadFailed, setLoadFailed] = React.useState(false);
    const theme = useTheme();

    const [source, setSource] = useState<ImageSourcePropType | null>(null);
    useEffect(() => {
        (async () => {
            setLoadFailed(false);
            if (!url) {
                setSource(imageUrl(placeholder));
                return;
            }

            if (typeof url === "string") {
                const src = await imageUrlWithHeic(url);
                setSource(src);
                return;
            }

            if (typeof url === "number") {
                setSource(url);
                return;
            }

            setSource(url);
        })();
    }, [url, placeholder]);

    if (!url && !initials) {
        return (
            <Image
                source={imageUrl(placeholder)}
                style={[containerStyle, style]}
                onError={() => {
                    Console.log("Image load failed");

                    setLoadFailed(true);
                }}
                resizeMode="cover"
            />
        );
    }

    if (!url && initials) {
        return (
            <View
                style={[
                    containerStyle,
                    style,
                    {
                        backgroundColor: Colors(theme).primary, 
                        justifyContent: "center",
                        alignItems: "center",
                    },
                ]}
            >
                <Text style={{ color: Colors(theme).white, fontSize: initialsSize }}>
                    {initials
                        ?.split(" ")
                        .map((word) => word[0])
                        .join("")}
                </Text>
            </View>
        );
    }

    const fallbackSource = imageUrl(placeholder);
    const resolvedSource = loadFailed ? fallbackSource : source ?? fallbackSource;
    const { resizeMode = "cover", onError, ...restImageProps } = imageProps;

    return (
        <Image
            source={resolvedSource}
            style={[containerStyle, style]}
            resizeMode={resizeMode}
            onError={(event) => {
                Console.log("Image load failed");
                setLoadFailed(true);
                onError?.(event);
            }}
            {...restImageProps}
        />
    );
};

export const FacebookImageComponent: FC<ImageComponentProps> = (props) => {
    // return <Avatar.Image {...props} size={44} source={{ uri: props.url }} />
    return <ImageComponent  {...props}
        url={props.url} />
}

export default ImageComponent;
