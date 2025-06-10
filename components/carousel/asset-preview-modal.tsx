import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Theme } from "@react-navigation/native";
import { Dimensions, Modal, Pressable } from "react-native";
import { PinchGestureHandler, PinchGestureHandlerGestureEvent } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import Colors from "@/shared-uis/constants/Colors";
import { stylesFn } from "@/shared-uis/styles/carousel/AssetPreviewModal.styles";
import { imageUrl } from "@/shared-uis/utils/url";
import { View } from "../theme/Themed";

const { width } = Dimensions.get("window");

interface AssetPreviewModalProps {
  previewImage: boolean;
  previewImageUrl: string | null;
  setPreviewImage: React.Dispatch<React.SetStateAction<boolean>>;
  theme: Theme;
}

const AssetPreviewModal: React.FC<AssetPreviewModalProps> = ({
  previewImage,
  previewImageUrl,
  setPreviewImage,
  theme,
}) => {
  const styles = stylesFn(theme);

  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const pinchHandler =
    useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
      onStart: (event) => {
        focalX.value = event.focalX;
        focalY.value = event.focalY;
      },
      onActive: (event) => {
        scale.value = event.scale;
      },
      onEnd: () => {
        if (scale.value < 1) {
          scale.value = withSpring(1);
        }
      },
    });

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: focalX.value },
        { translateY: focalY.value },
        { scale: scale.value },
        { translateX: -focalX.value },
        { translateY: -focalY.value },
      ],
    };
  });

  return (
    <Modal
      visible={previewImage}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalContainer}>
        <Pressable
          style={styles.closeButton}
          onPress={() => {
            setPreviewImage(false);
            scale.value = 1;
          }}
        >
          <FontAwesomeIcon
            icon={faClose}
            size={28}
            color={Colors(theme).white}
          />
        </Pressable>
        <PinchGestureHandler
          onGestureEvent={pinchHandler}
        >
          <Animated.Image
            source={imageUrl(previewImageUrl || "")}
            style={[
              animatedImageStyle,
              {
                width,
                height: width,
              }
            ]}
            resizeMode="contain"
          />
        </PinchGestureHandler>
      </View>
    </Modal>
  );
}

export default AssetPreviewModal;
