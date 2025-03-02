import { ISocials } from "@/shared-libs/firestore/trendly-pro/models/socials";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import Colors from "@/shared-uis/constants/Colors";
import { stylesFn } from "@/shared-uis/styles/profile-modal/ProfileModal.styles";
import { processRawAttachment } from "@/shared-uis/utils/attachments";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowTrendUp,
  faArrowUpWideShort,
  faClock,
  faEnvelope,
  faPeopleRoof,
  faPhone,
  faStar
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Theme } from "@react-navigation/native";
import axios from "axios";
import { doc, Firestore, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, Linking, Platform, Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { Chip, Title } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import Swiper from "react-native-swiper";
import InfluencerCard from "../InfluencerCard";
import Carousel from "../carousel/carousel";
import { MAX_WIDTH_WEB } from "../carousel/carousel-util";
import { MediaItem } from "../carousel/render-media-item";
import SelectGroup from "../select/select-group";

interface ProfileBottomSheetProps {
  actionCard?: React.ReactNode;
  carouselMedia?: MediaItem[];
  FireStoreDB: Firestore;
  influencer: IUsers;
  isBrandsApp: boolean;
  theme: Theme;
}

const ProfileBottomSheet: React.FC<ProfileBottomSheetProps> = ({
  actionCard,
  carouselMedia,
  FireStoreDB: FirestoreDB,
  influencer,
  isBrandsApp,
  theme,
}) => {
  const styles = stylesFn(theme);
  const swiperRef = React.useRef<Swiper>(null);
  const [primarySocial, setPrimarySocial] = useState<ISocials>();
  const [loadingPosts, setLoadingPosts] = useState(false);

  const mediaProcessing = carouselMedia
    ? carouselMedia
    : influencer?.profile?.attachments?.map((media) =>
      processRawAttachment(media)
    );

  const [previewType, setPreviewType] = useState({
    label: "Preview",
    value: "Preview",
  });

  const [posts, setPosts] = useState([]);
  const [isInstagram, setIsInstagram] = useState(false);

  const screenWidth = Dimensions.get("window").width;

  const fetchPrimarySocialMedia = async () => {
    try {
      const userPrimaryID = influencer.primarySocial;
      if (!userPrimaryID) {
        return;
      }
      const fetchSocialRef = doc(
        FirestoreDB,
        "users",
        //@ts-ignore
        influencer.id,
        "socials",
        userPrimaryID
      );

      const socialData = await getDoc(fetchSocialRef);

      const data = socialData.data() as ISocials;

      setPrimarySocial(data);
    } catch (error) {
      console.log("Error fetching primary social media", error);
    }
  };

  const fetchPosts = async () => {
    setLoadingPosts(true);
    const response = await axios.get(
      //@ts-ignore
      `https://be.trendly.pro/api/v1/socials/medias?userId=${influencer.id}`,
      {
        headers: {
          //@ts-ignore
          Authorization: `Bearer ${influencer.id}`,
        },
      }
    ).finally(() => {
      setLoadingPosts(false)
    });

    if (response.data.data.isInstagram) {
      setIsInstagram(true);
      setPosts(response.data.data.medias);
      setLoadingPosts(false);
    } else {
      setIsInstagram(false);
      setPosts(response.data.data.posts);
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPrimarySocialMedia();
    fetchPosts();
  }, []);

  const { width } = useWindowDimensions();
  const isTwoColumn = Platform.OS == "web" ? (width > 768) : false; // Adjus

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors(theme).background,
        position: "relative",
        height: "100%",
      }}
    >
      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        {previewType.value === "Preview" ? (
          <View style={{ flexDirection: isTwoColumn ? "row" : "column", padding: 16 }}>
            {isTwoColumn ?
              <View style={[styles.carouselContainer, { flex: 1, borderColor: Colors(theme).border, borderWidth: 1 }, Platform.OS === "web" ? { maxWidth: MAX_WIDTH_WEB + 34 } : { alignSelf: "center" }]}>
                <InfluencerCard
                  // @ts-ignore
                  influencer={{ ...influencer, socials: [primarySocial?.isInstagram ? primarySocial?.instaProfile?.username : primarySocial?.fbProfile?.name] }}
                  ToggleModal={() => { }}
                  type="explore"
                />
              </View> :
              <View style={[styles.carouselContainer, { flex: 1, borderColor: Colors(theme).border, borderWidth: 1 }, Platform.OS === "web" ? { maxWidth: MAX_WIDTH_WEB + 34 } : { alignSelf: "center" }]}>
                {mediaProcessing && mediaProcessing.length > 0 && (
                  <Carousel data={mediaProcessing || []} theme={theme} />
                )}
              </View>}

            <View style={{ flex: 1 }}>
              <View style={[styles.header]}>
                <View style={styles.profileInfo}>
                  <Text style={styles.name}>{influencer?.name}</Text>

                  <Pressable
                    style={styles.row}
                    onPress={() => {
                      Linking.openURL(
                        primarySocial?.isInstagram
                          ? `https://www.instagram.com/${primarySocial?.instaProfile?.username}`
                          : `https://www.facebook.com/${primarySocial?.fbProfile?.id}`
                      );
                      console.log(
                        primarySocial?.isInstagram
                          ? `https://www.instagram.com/${primarySocial?.instaProfile?.username}`
                          : `https://www.facebook.com/${primarySocial?.fbProfile?.id}`
                      );
                    }}
                  >
                    <FontAwesomeIcon
                      icon={primarySocial?.isInstagram ? faInstagram : faFacebook}
                      size={18}
                      color={Colors(theme).primary}
                      style={styles.icon}
                    />
                    <Text style={styles.subTextHeading}>
                      {primarySocial?.isInstagram
                        ? "@" + primarySocial?.instaProfile?.username
                        : primarySocial?.fbProfile?.name}
                    </Text>
                  </Pressable>

                  {/* Email */}
                  {influencer?.email && (
                    <Pressable
                      style={styles.row}
                      onPress={() => {
                        Linking.openURL(`mailto:${influencer?.email}`);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        size={16}
                        color={Colors(theme).primary}
                        style={styles.icon}
                      />
                      <Text style={styles.subTextHeading}>
                        {influencer?.email}
                      </Text>
                    </Pressable>
                  )}

                  {/* Phone */}
                  {influencer?.phoneNumber && (
                    <Pressable
                      style={styles.row}
                      onPress={() => {
                        Linking.openURL(`tel:${influencer?.phoneNumber}`);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faPhone}
                        size={16}
                        color={Colors(theme).primary}
                        style={styles.icon}
                      />
                      <Text style={styles.subTextHeading}>
                        {influencer?.phoneNumber}
                      </Text>
                    </Pressable>
                  )}

                  {influencer?.profile?.timeCommitment && (
                    <View style={styles.row}>
                      <FontAwesomeIcon
                        icon={faClock}
                        size={16}
                        color={Colors(theme).primary}
                        style={styles.icon}
                      />
                      <Text style={styles.subTextHeading}>
                        {influencer?.profile?.timeCommitment}
                      </Text>
                    </View>
                  )}

                  <View style={styles.divider} />

                  {/* Reach */}
                  <View style={styles.row}>
                    <FontAwesomeIcon
                      icon={faPeopleRoof}
                      size={16}
                      color={Colors(theme).primary}
                      style={styles.icon}
                    />
                    <Text style={styles.subTextHeading}>
                      {influencer?.backend?.followers || 0} Followers
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <FontAwesomeIcon
                      icon={faArrowTrendUp}
                      size={16}
                      color={Colors(theme).primary}
                      style={styles.icon}
                    />
                    <Text style={styles.subTextHeading}>
                      {influencer?.backend?.reach || 0} Reach
                    </Text>
                  </View>

                  {/* Engagement */}
                  <View style={styles.row}>
                    <FontAwesomeIcon
                      icon={faArrowUpWideShort}
                      size={16}
                      color={Colors(theme).primary}
                      style={styles.icon}
                    />
                    <Text style={styles.subTextHeading}>
                      {influencer?.backend?.engagement || 0} Engagement
                    </Text>
                  </View>

                  {/* Rating */}
                  <View style={styles.row}>
                    <FontAwesomeIcon
                      icon={faStar}
                      size={16}
                      color={Colors(theme).primary}
                      style={styles.icon}
                    />
                    <Text style={styles.subTextHeading}>
                      {influencer?.backend?.rating || 0} Rating
                    </Text>
                  </View>
                </View>
              </View>

              {actionCard}

              {influencer?.profile?.category?.length !== 0 && (
                <View
                  style={[
                    styles.chipContainer,
                    {
                      paddingTop: actionCard ? 20 : 0,
                    },
                  ]}
                >
                  {influencer?.profile?.category &&
                    influencer?.profile?.category.map((interest, index) => (
                      <Chip key={index} style={styles.chip} mode="outlined">
                        {interest}
                      </Chip>
                    ))}
                </View>
              )}
              <View style={styles.aboutContainer}>
                {influencer?.profile?.content?.about ? (
                  <View style={styles.aboutCard}>
                    <Title style={styles.cardColor}>About Me</Title>
                    <RenderHTML
                      contentWidth={screenWidth}
                      source={{
                        html:
                          influencer?.profile?.content?.about ||
                          "<p>No content available.</p>",
                      }}
                      defaultTextProps={{
                        style: {
                          color: theme.dark
                            ? Colors(theme).text
                            : Colors(theme).gray300,
                          fontSize: 16,
                          lineHeight: 22,
                        },
                      }}
                    />
                  </View>
                ) : null}

                {influencer?.profile?.content?.socialMediaHighlight ? (
                  <View style={styles.aboutCard}>
                    <Title style={styles.cardColor}>Social Media Highlight</Title>
                    <RenderHTML
                      contentWidth={screenWidth}
                      source={{
                        html:
                          influencer?.profile?.content?.socialMediaHighlight ||
                          "<p>No content available.</p>",
                      }}
                      defaultTextProps={{
                        style: {
                          color: theme.dark
                            ? Colors(theme).text
                            : Colors(theme).gray300,
                          fontSize: 16,
                          lineHeight: 22,
                        },
                      }}
                    />
                  </View>
                ) : null}
                {influencer?.profile?.content?.collaborationGoals ? (
                  <View style={styles.aboutCard}>
                    <Title style={styles.cardColor}>Campaign Goals</Title>
                    <RenderHTML
                      contentWidth={screenWidth}
                      source={{
                        html:
                          influencer?.profile?.content?.collaborationGoals ||
                          "<p>No content available.</p>",
                      }}
                      defaultTextProps={{
                        style: {
                          color: theme.dark
                            ? Colors(theme).text
                            : Colors(theme).gray300,
                          fontSize: 16,
                          lineHeight: 22,
                        },
                      }}
                    />
                  </View>
                ) : null}
                {influencer?.profile?.content?.audienceInsights ? (
                  <View style={styles.aboutCard}>
                    <Title style={styles.cardColor}>Audience Insights</Title>
                    <RenderHTML
                      contentWidth={screenWidth}
                      source={{
                        html:
                          influencer?.profile?.content?.audienceInsights ||
                          "<p>No content available.</p>",
                      }}
                      defaultTextProps={{
                        style: {
                          color: theme.dark
                            ? Colors(theme).text
                            : Colors(theme).gray300,
                          fontSize: 16,
                          lineHeight: 22,
                        },
                      }}
                    />
                  </View>
                ) : null}
                {influencer?.profile?.content?.funFactAboutUser ? (
                  <View style={styles.aboutCard}>
                    <Title style={styles.cardColor}>Fun Fact About You</Title>
                    <RenderHTML
                      contentWidth={screenWidth}
                      source={{
                        html:
                          influencer?.profile?.content?.funFactAboutUser ||
                          "<p>No content available.</p>",
                      }}
                      defaultTextProps={{
                        style: {
                          color: theme.dark
                            ? Colors(theme).text
                            : Colors(theme).gray300,
                          fontSize: 16,
                          lineHeight: 22,
                        },
                      }}
                    />
                  </View>
                ) : null}
                {loadingPosts ? (
                  <ActivityIndicator size="large" color={Colors(theme).primary} />
                ) : posts.length > 0 ? (
                  <View style={styles.aboutCard}>
                    <Title
                      style={[
                        styles.cardColor,
                        {
                          marginBottom: 20,
                        },
                      ]}
                    >
                      {influencer.name}'s {isInstagram ? "Instagram" : "Facebook"}{" "}
                      Posts
                    </Title>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View style={{ flexDirection: "column" }}>
                        <View style={{ flexDirection: "row", marginBottom: 10 }}>
                          {posts &&
                            posts
                              .filter((_, index) => index % 2 === 0)
                              .map((item: any, index) => (
                                <Pressable
                                  onPress={() => {
                                    Linking.openURL(
                                      isInstagram
                                        ? item.permalink
                                        : item.permalink_url
                                    );
                                  }}
                                >
                                  <Image
                                    key={`bottom-${index}`}
                                    source={{
                                      uri: isInstagram
                                        ? item.media_type === "IMAGE"
                                          ? item.media_url
                                          : item.thumbnail_url
                                        : item.full_picture,
                                    }}
                                    style={{
                                      width: 100,
                                      height: 100,
                                      borderRadius: 10,
                                      marginRight: 10,
                                    }}
                                  />
                                </Pressable>
                              ))}
                        </View>
                        <View style={{ flexDirection: "row" }}>
                          {posts &&
                            posts
                              .filter((_, index) => index % 2 !== 0)
                              .map((item: any, index) => (
                                <Pressable
                                  onPress={() => {
                                    Linking.openURL(
                                      isInstagram
                                        ? item.permalink
                                        : item.permalink_url
                                    );
                                  }}
                                >
                                  <Image
                                    key={`bottom-${index}`}
                                    source={{
                                      uri: isInstagram
                                        ? item.media_type === "IMAGE"
                                          ? item.media_url
                                          : item.thumbnail_url
                                        : item.full_picture,
                                    }}
                                    style={{
                                      width: 100,
                                      height: 100,
                                      borderRadius: 10,
                                      marginRight: 10,
                                    }}
                                  />
                                </Pressable>
                              ))}
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        ) : (
          <View
            style={{
              padding: 20,
              alignSelf: "center",
            }}
          >
            <InfluencerCard
              influencer={influencer}
              ToggleModal={() => { }}
              type="explore"
            />
          </View>
        )}
      </ScrollView>
      {(!isBrandsApp && !isTwoColumn) && (
        <View
          style={{
            padding: 10,
            backgroundColor: Colors(theme).background,
            borderTopWidth: 1,
            borderTopColor: Colors(theme).border,
            position: "absolute",
            bottom: 30,
            left: 0,
            right: 0,
            zIndex: 1000,
            elevation: 5, // For Android shadow
            shadowColor: "#000", // For iOS shadow
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
        >
          <SelectGroup
            items={[
              { label: "Preview", value: "Preview" },
              { label: "Card View", value: "Card View" },
            ]}
            theme={theme}
            selectedItem={previewType}
            onValueChange={(value) => {
              setPreviewType({
                label: value.label,
                value: value.value,
              });
            }}
          />
        </View>
      )}
    </View>
  );
};

export default ProfileBottomSheet;
