import { Console } from "@/shared-libs/utils/console";
import Colors from "@/shared-uis/constants/Colors";
import {
  IMAGE_LARGE,
  IMAGE_MEDIUM,
  IMAGE_SMALL,
} from "@/shared-uis/constants/ImageSize";
import { imageUrl, imageUrlSync } from "@/shared-uis/utils/url";
import { useTheme } from "@react-navigation/native";
import React, { FC, useEffect, useState } from "react";
import { Dimensions, Image, ImageProps, ImageStyle, Platform } from "react-native";
import { Text, View } from "../theme/Themed";

interface ImageComponentProps extends Omit<ImageProps, "source"> {
  shape?: "circle" | "square";
  size?: "small" | "medium" | "large";
  url: string;
  altText: string;
  placeholder?: string;
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
  const dimensions = {
    small: IMAGE_SMALL,
    medium: IMAGE_MEDIUM,
    large: IMAGE_LARGE,
  };

  const containerStyle: ImageStyle = {
    width: size !== "large" ? dimensions[size] : Dimensions.get("window").width,
    height:
      size !== "large"
        ? dimensions[size]
        : Platform.OS === "web"
          ? 580
          : Dimensions.get("window").width,
    borderRadius: shape === "circle" ? dimensions[size] / 2 : 0,
    overflow: "hidden",
  };

  const [loadFailed, setLoadFailed] = React.useState(false);
  const theme = useTheme();

  const [source, setSource] = useState<any>(null)
  useEffect(() => {
    (async () => {
      if (url) {
        const src = await imageUrl(url)
        setSource(src)
      }
    })()
  }, [url])

  const renderContent = () => {
    if (source)
      return (
        <Image
          source={source}
          style={[containerStyle, style]}
          height={Platform.OS === "web" ? 580 : 480}
          {...imageProps}
        />
      );
    else {
      <Image
        source={imageUrlSync(placeholder)}
        style={[containerStyle, style]}
        onError={() => {
          Console.log("Image load failed");

          setLoadFailed(true);
        }}
        resizeMode="cover"
      />
    }
  };

  if (!url && !initials) {
    return (
      <Image
        source={imageUrlSync(placeholder)}
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
        <Text style={{ color: "white", fontSize: initialsSize }}>
          {initials
            ?.split(" ")
            .map((word) => word[0])
            .join("")}
        </Text>
      </View>
    );
  }

  return renderContent();
};

export default ImageComponent;
