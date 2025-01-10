import {
  IMAGE_LARGE,
  IMAGE_MEDIUM,
  IMAGE_SMALL,
} from "@/shared-uis/constants/ImageSize";
import { imageUrl } from "@/shared-uis/utils/url";
import React, { FC } from "react";
import { Image, ImageProps } from "react-native";
import { Text, View } from "../theme/Themed";
import Colors from "@/shared-uis/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { ImageStyle } from "react-native";

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
    width: size !== "large" ? dimensions[size] : "100%",
    height: dimensions[size],
    borderRadius: shape === "circle" ? dimensions[size] / 2 : 0,
    overflow: "hidden",
  };

  const [loadFailed, setLoadFailed] = React.useState(false);
  const theme = useTheme();

  const renderContent = () => {
    return (
      <Image
        source={imageUrl(url)}
        style={[containerStyle, style]}
        {...imageProps}
      />
    );
  };

  if (!url && !initials) {
    return (
      <Image
        source={imageUrl(placeholder)}
        style={[containerStyle, style]}
        onError={() => {
          console.log("Image load failed");

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
