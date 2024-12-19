import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Card, Avatar } from "react-native-paper";
import { stylesFn } from "@/shared-uis/styles/InfluencerCard.styles";
import { useTheme } from "@react-navigation/native";
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Colors from "../constants/Colors";
import CarouselNative from "./carousel/carousel";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { convertToKUnits } from "../utils/conversion";
import {
  faArrowTrendUp,
  faCheck,
  faEllipsis,
  faMessage,
  faPeopleGroup,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Tag from "./tag";
import { MediaItem } from "./carousel/render-media-item";
import RenderHTML from "react-native-render-html";
import { truncateText } from "../utils/text";

const { width } = Dimensions.get("window");

interface InfluencerCardPropsType {
  influencer: {
    name: string;
    handle: string;
    profilePic: string;
    media: MediaItem[];
    followers: number | string;
    reach: number | string;
    rating: number | string;
    bio: string;
    jobsCompleted: number | string;
    successRate: number | string;
  };
  type: string;
  alreadyInvited?: boolean;
  ToggleModal: () => void;
  ToggleMessageModal?: () => void;
}

const InfluencerCard = (props: InfluencerCardPropsType) => {
  const [bioExpanded, setBioExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Animation values for zoom
  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const screenWidth = Dimensions.get("window").width;

  const influencer = props.influencer;
  const theme = useTheme();
  const styles = stylesFn(theme);

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

  const onImagePress = (data: MediaItem) => {
    //@ts-ignore
    setSelectedImage(data.url);
    setIsZoomed(true);
  };

  useEffect(() => {
    // we need to set a timer before loading the media
    // to prevent the carousel from crashing

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Avatar.Image size={50} source={{ uri: influencer.profilePic }} />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{influencer.name}</Text>
            <Text style={styles.handle}>{influencer.handle}</Text>
          </View>
          {props.type === "invitation" &&
            (props.alreadyInvited ? (
              <Tag
                icon={() => (
                  <FontAwesomeIcon
                    icon={faCheck}
                    size={10}
                    color={Colors(theme).text}
                  />
                )}
              >
                Invited
              </Tag>
            ) : (
              <Tag
                icon={() => (
                  <FontAwesomeIcon
                    icon={faPlus}
                    size={10}
                    color={Colors(theme).text}
                  />
                )}
                onPress={() => {
                  if (props.ToggleMessageModal) {
                    props.ToggleMessageModal();
                  }
                }}
              >
                Invite
              </Tag>
            ))}
          <Pressable
            onPress={() => {
              props.ToggleModal();
            }}
          >
            <FontAwesomeIcon
              icon={faEllipsis}
              size={24}
              color={Colors(theme).text}
            />
          </Pressable>
        </View>

        <CarouselNative data={influencer.media} onImagePress={onImagePress} />

        <Pressable>
          <Text>
            <RenderHTML
              contentWidth={screenWidth}
              source={{
                html:
                  truncateText(influencer.bio as string, 160) ||
                  "<p>No content available.</p>",
              }}
              defaultTextProps={{
                style: {
                  color: Colors(theme).text,
                  fontSize: 16,
                  lineHeight: 22,
                },
              }}
            />
          </Text>
        </Pressable>

        <View style={styles.content}>
          <View style={styles.stats}>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <FontAwesomeIcon
                  icon={faPeopleGroup}
                  color={Colors(theme).primary}
                  size={20}
                />
                <Text style={styles.statsText}>
                  {convertToKUnits(Number(influencer.followers))}
                </Text>
              </View>
              <View style={styles.statItem}>
                <FontAwesomeIcon
                  icon={faArrowTrendUp}
                  color={Colors(theme).primary}
                  size={20}
                />
                <Text style={styles.statsText}>
                  {convertToKUnits(Number(influencer.reach))}
                </Text>
              </View>
              <View style={styles.statItem}>
                <FontAwesomeIcon
                  icon={faStar}
                  color={Colors(theme).primary}
                  size={20}
                />
                <Text style={styles.statsText}>{influencer.rating}</Text>
              </View>
            </View>
            <View style={styles.statItem}>
              <FontAwesomeIcon
                icon={faMessage}
                color={Colors(theme).primary}
                size={18}
              />
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <TouchableOpacity
            onPress={() => {
              console.log("View job history");
            }}
          >
            <Text style={styles.jobHistory}>
              {influencer.jobsCompleted} Jobs completed (
              {influencer.successRate} success rate)
            </Text>
          </TouchableOpacity>
        </View>
      </Card>

      <Modal visible={isZoomed} transparent={true} animationType="fade">
        <View style={additionalStyles.modalContainer}>
          <TouchableOpacity
            style={additionalStyles.closeButton}
            onPress={() => {
              setIsZoomed(false);
              scale.value = 1;
            }}
          >
            <Text style={additionalStyles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <PinchGestureHandler onGestureEvent={pinchHandler}>
            <Animated.Image
              source={{ uri: selectedImage || "" }}
              style={[additionalStyles.zoomedImage, animatedImageStyle]}
              resizeMode="contain"
            />
          </PinchGestureHandler>
        </View>
      </Modal>
    </>
  );
};

const additionalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  zoomedImage: {
    width: width,
    height: width,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 36,
  },
});

export default InfluencerCard;
