import {
  IMAGE_LARGE,
  IMAGE_MEDIUM,
  IMAGE_SMALL,
} from "@/shared-uis/constants/ImageSize";
import { imageUrl } from "@/shared-uis/utils/url";
import React, { FC } from "react";
import { Image, ImageProps } from "react-native";

interface ImageComponentProps extends Omit<ImageProps, "source"> {
  shape?: "circle" | "square";
  size?: "small" | "medium" | "large";
  url: string;
  altText: string;
  placeholder?: string;
}

const ImageComponent: FC<ImageComponentProps> = ({
  shape = "circle",
  size = "medium",
  url,
  altText,
  style,
  placeholder,
  ...imageProps
}) => {
  const dimensions = {
    small: IMAGE_SMALL,
    medium: IMAGE_MEDIUM,
    large: IMAGE_LARGE,
  };

  const containerStyle = {
    width: size !== "large" ? dimensions[size] : "100%",
    height: dimensions[size],
    borderRadius: shape === "circle" ? dimensions[size] / 2 : 0,
    overflow: "hidden",
  };

  const [loadFailed, setLoadFailed] = React.useState(false);

  const renderContent = () => {
    return (
      <Image
        {...imageProps}
        source={imageUrl(url)}
        //@ts-ignore
        style={[containerStyle, style]}
      />
    );
  };

  if (!url) {
    return (
      <Image
        source={imageUrl(placeholder)}
        //@ts-ignore
        style={[containerStyle, style]}
        onError={() => {
          console.log("Image load failed");

          setLoadFailed(true);
        }}
        resizeMode="cover"
      />
    );
  }
  return renderContent();
};

export default ImageComponent;
