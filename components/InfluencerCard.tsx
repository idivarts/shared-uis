import { Attachment } from "@/shared-libs/firestore/trendly-pro/constants/attachment";
import { ISocials } from "@/shared-libs/firestore/trendly-pro/models/socials";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { AuthApp } from "@/shared-libs/utils/firebase/auth";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import AssetPreviewModal from "@/shared-uis/components/carousel/asset-preview-modal";
import Carousel from "@/shared-uis/components/carousel/carousel";
import { MediaItem } from "@/shared-uis/components/carousel/render-media-item";
import { stylesFn } from "@/shared-uis/styles/InfluencerCard.styles";
import { processRawAttachment } from "@/shared-uis/utils/attachments";
import { truncateText } from "@/shared-uis/utils/text";
import { imageUrl } from "@/shared-uis/utils/url";
import {
  faEllipsis
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { collection, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle
} from "react-native";
import { Avatar, Card } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import Colors from "../constants/Colors";
import { MAX_WIDTH_WEB } from "./carousel/carousel-util";
import { InfluencerMetrics } from "./influencers/influencer-metrics";

type User = IUsers & { id?: string }
interface InfluencerCardPropsType {
  influencer: User;
  customAttachments?: Attachment[]
  openProfile?: (influencer: User) => void;
  setSelectedInfluencer?: React.Dispatch<React.SetStateAction<User | null>>;
  ToggleModal?: () => void;
  type: string;
  cardActionNode?: any
  footerNode?: any
  style?: StyleProp<ViewStyle>,
  xl?: boolean;
}

const InfluencerCard = (props: InfluencerCardPropsType) => {
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState(false);
  const [socialHandle, setSocialHandle] = useState("")

  const influencer = props.influencer;
  const theme = useTheme();
  const styles = stylesFn(theme);
  const [socials, setSocials] = useState<ISocials | undefined>(undefined)

  const [images, setImages] = useState((props.customAttachments || influencer.profile?.attachments)?.map((attachment) =>
    processRawAttachment(attachment)
  ) || [])
  useEffect(() => {
    let mImg = []
    if (!props.customAttachments) {
      mImg = props.influencer.profile?.attachments?.map((attachment) =>
        processRawAttachment(attachment)
      ) || []
      if (socials && socials.socialScreenShots && socials.socialScreenShots.length > 0) {
        const sdata = socials.socialScreenShots?.map(s => ({
          type: "image",
          url: s
        }))
        mImg.push(...sdata)
      }
    } else {
      mImg = props.customAttachments.map((attachment) =>
        processRawAttachment(attachment)
      ) || []
    }
    setImages([...mImg])
  }, [props.customAttachments, props.influencer, socials])

  const getSocial = async () => {
    if (influencer.primarySocial) {
      const socialCol = collection(FirestoreDB, "users", influencer.id || AuthApp.currentUser?.uid || "", "socials")
      const socialData = await getDoc(doc(socialCol, influencer.primarySocial))
      const social = socialData.data() as ISocials
      setSocialHandle(social.instaProfile?.username || social.fbProfile?.name || "")
      setSocials(social)
    }
  }
  useEffect(() => {
    getSocial()
  }, [])

  const screenWidth = Dimensions.get("window").width;

  const onImagePress = (data: MediaItem) => {
    setPreviewImageUrl(data.url);
    setPreviewImage(true);
  };

  return (
    <>
      <Card
        style={[
          styles.card,
          props.style,
          props.xl && {
            maxWidth: MAX_WIDTH_WEB,
            alignSelf: "center",
            borderRadius: 20,
            borderColor: Colors(theme).border,
            borderWidth: 1,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }
        ]}
        mode="contained"
      >
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
            {socialHandle &&
              <Text style={styles.handle}>
                {socialHandle}
              </Text>}
          </Pressable>

          <Pressable
            onPress={() => {
              props.ToggleModal?.();
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
          data={images}
          onImagePress={onImagePress}
          theme={theme}
        />

        <View style={styles.content}>
          <InfluencerMetrics user={influencer} action={props.cardActionNode} />

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
        {props.footerNode}
      </Card>

      {previewImage &&
        <AssetPreviewModal
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
          previewImageUrl={previewImageUrl}
          theme={theme}
        />}
    </>
  );
};

export default InfluencerCard;
