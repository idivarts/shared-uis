import { IUsers as User } from "@/shared-libs/firestore/trendly-pro/models/users";
import AssetPreviewModal from "@/shared-uis/components/carousel/asset-preview-modal";
import Carousel from "@/shared-uis/components/carousel/carousel";
import { MediaItem } from "@/shared-uis/components/carousel/render-media-item";
import { stylesFn } from "@/shared-uis/styles/InfluencerCard.styles";
import { processRawAttachment } from "@/shared-uis/utils/attachments";
import { truncateText } from "@/shared-uis/utils/text";
import { imageUrl } from "@/shared-uis/utils/url";
import {
  faCheck,
  faEllipsis,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  Text,
  View
} from "react-native";
import { Avatar, Card } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import Colors from "../constants/Colors";
import { InfluencerMetrics } from "./influencers/influencer-metrics";
import Tag from "./tag";

interface InfluencerCardPropsType {
  alreadyInvited?: (influencerId: string) => Promise<boolean>;
  influencer: User;
  openProfile?: (influencer: User) => void;
  setSelectedInfluencer?: React.Dispatch<React.SetStateAction<User | null>>;
  ToggleMessageModal?: () => void;
  ToggleModal: () => void;
  type: string;
}

const InfluencerCard = (props: InfluencerCardPropsType) => {
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState(false);
  const [isInvited, setIsInvited] = useState(false);

  const influencer = props.influencer;
  const theme = useTheme();
  const styles = stylesFn(theme);

  const screenWidth = Dimensions.get("window").width;

  const onImagePress = (data: MediaItem) => {
    setPreviewImageUrl(data.url);
    setPreviewImage(true);
  };

  useEffect(() => {
    if (props?.alreadyInvited) {
      //@ts-ignore
      props.alreadyInvited(props.influencer.id).then((invited) => {
        setIsInvited(invited);
      });
    }
  }, []);

  return (
    <>
      <Card style={styles.card} mode="contained">
        <View style={[styles.header]}>
          <Pressable
            onPress={() => {
              if (props.openProfile) {
                props.openProfile(influencer);
              }
            }}
          >
            <Avatar.Image
              size={50}
              source={imageUrl(influencer.profileImage)}
            />
          </Pressable>
          <Pressable
            style={styles.nameContainer}
            onPress={() => {
              if (props.openProfile) {
                props.openProfile(influencer);
              }
            }}
          >
            <Text style={styles.name}>{influencer.name}</Text>
            <Text style={styles.handle}>
              {influencer.socials?.[0] || "influencer-handle"}
            </Text>
          </Pressable>
          {props.type === "invitation" &&
            (isInvited ? (
              <Tag
                icon={() => (
                  <FontAwesomeIcon
                    icon={faCheck}
                    size={12}
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
                    size={12}
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
              if (props?.setSelectedInfluencer) {
                props.setSelectedInfluencer(props.influencer);
              }
            }}
          >
            <FontAwesomeIcon
              icon={faEllipsis}
              size={24}
              color={Colors(theme).text}
            />
          </Pressable>
        </View>

        <Carousel
          data={
            influencer.profile?.attachments?.map((attachment) =>
              processRawAttachment(attachment)
            ) || []
          }
          onImagePress={onImagePress}
          theme={theme}
        />

        <View style={styles.content}>
          <InfluencerMetrics user={influencer} />

          <Pressable
            onPress={() => {
              if (props.openProfile) {
                props.openProfile(influencer);
              }
            }}
          >
            <Text>
              <RenderHTML
                contentWidth={screenWidth}
                source={{
                  html:
                    truncateText(
                      influencer?.profile?.content?.about as string,
                      160
                    ) || "<p>No content available.</p>",
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
        </View>
      </Card>

      <AssetPreviewModal
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
        previewImageUrl={previewImageUrl}
        theme={theme}
      />
    </>
  );
};

export default InfluencerCard;
