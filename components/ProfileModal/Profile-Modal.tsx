import { IS_MONETIZATION_DONE } from "@/shared-constants/app";
import {
  ISocialAnalytics as ITrendlyAnalytics,
  ISocials as ITrendlySocial,
} from "@/shared-libs/firestore/trendly-pro/models/bq-socials";
import { ISocials } from "@/shared-libs/firestore/trendly-pro/models/socials";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { Console } from "@/shared-libs/utils/console";
import { useMyNavigation } from "@/shared-libs/utils/router";
import Colors from "@/shared-uis/constants/Colors";
import { stylesFn } from "@/shared-uis/styles/profile-modal/ProfileModal.styles";
import { processRawAttachment } from "@/shared-uis/utils/attachments";
import {
  maskEmail,
  maskHandle,
  maskName,
  maskPhone,
} from "@/shared-uis/utils/masks";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import {
  faClock,
  faClose,
  faEnvelope,
  faLocation,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Theme } from "@react-navigation/native";
import { doc, Firestore, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Button, Chip, Icon, Title } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import { Subject } from "rxjs";
import { useConfirmationModel } from "../ConfirmationModal";
import InfluencerCard from "../InfluencerCard";
import Carousel from "../carousel/carousel";
import { MAX_WIDTH_WEB } from "../carousel/carousel-util";
import { MediaItem } from "../carousel/render-media-item";
import { InfluencerMetrics } from "../influencers/influencer-metrics";
import SelectGroup from "../select/select-group";
import Entypo from "@expo/vector-icons/Entypo";

interface ProfileBottomSheetProps {
  actionButton?: React.ReactNode;
  actionCard?: React.ReactNode;
  carouselMedia?: MediaItem[];
  FireStoreDB: Firestore;
  influencer: IUsers & {
    id: string; // Note: additional fields from discovery page
  };
  social?: ISocials;
  isBrandsApp: boolean;
  showCardPreviewTab?: boolean;
  closeModal?: () => void;
  loadingPosts?: boolean;
  posts?: any[];
  isOnFreePlan?: boolean;
  lockProfile?: boolean;
  isInstagram?: boolean;
  isEmailMasked?: boolean;
  isPhoneMasked?: boolean;
  theme: Theme;
  showCampaignGoals?: boolean;
  showInfluencerGoals?: boolean;
  trendlySocial?: ITrendlySocial | null;
  trendlyAnalytics?: ITrendlyAnalytics | null;
  isDiscoverView?: boolean;
}

export const ProfileModalUnlockRequest = new Subject<{
  influencerId: string;
  callback: Function;
}>();
export const ProfileModalSendMessage = new Subject<{
  influencerId: string;
  callback: Function;
}>();

const ProfileBottomSheet: React.FC<ProfileBottomSheetProps> = ({
  actionCard,
  actionButton,
  carouselMedia,
  FireStoreDB: FirestoreDB,
  influencer,
  social,
  isBrandsApp,
  showCardPreviewTab = false,
  closeModal,
  theme,
  loadingPosts,
  posts = [],
  isOnFreePlan = false,
  lockProfile = false,
  isInstagram,
  isEmailMasked = false,
  isPhoneMasked = true,
  showCampaignGoals = true,
  showInfluencerGoals = false,
  trendlySocial = null,
  trendlyAnalytics = null,
  isDiscoverView = false,
}) => {
  const styles = stylesFn(theme);
  const [primarySocial, setPrimarySocial] = useState<ISocials>(
    social as ISocials
  );
  const { openModal } = useConfirmationModel();
  const router = useMyNavigation();

  const mediaProcessing = carouselMedia
    ? carouselMedia
    : influencer?.profile?.attachments?.map((media) =>
        processRawAttachment(media)
      );

  const [previewType, setPreviewType] = useState({
    label: "Preview",
    value: "Preview",
  });

  const [loading, setLoading] = useState(false);

  const unlockProfile = () => {
    setLoading(true);
    ProfileModalUnlockRequest.next({
      influencerId: influencer?.id || "",
      callback: (success: boolean) => {
        setLoading(false);
      },
    });
  };
  const sendMessage = () => {
    setLoading(true);
    ProfileModalSendMessage.next({
      influencerId: influencer?.id || "",
      callback: (success: boolean) => {
        setLoading(false);
        if (success) closeModal?.();
      },
    });
  };

  const upgradeNow = () => {
    closeModal?.();
    openModal({
      title: "Upgrade your Plan Now",
      description:
        "You can only get the access to influencers social media after you subscribe to a paid plan",
      confirmAction: () => {
        router.push("/billing");
      },
      confirmText: "Upgrade now",
    });
  };

  const screenWidth = Dimensions.get("window").width;

  const fetchPrimarySocialMedia = async () => {
    if (primarySocial) return;

    try {
      const userPrimaryID = influencer.primarySocial;
      if (!userPrimaryID) {
        return;
      }
      const fetchSocialRef = doc(
        FirestoreDB,
        "users",
        influencer.id,
        "socials",
        userPrimaryID
      );

      const socialData = await getDoc(fetchSocialRef);

      const data = socialData.data() as ISocials;

      setPrimarySocial(data);
    } catch (error) {
      Console.log("Error fetching primary social media", error);
    }
  };

  useEffect(() => {
    fetchPrimarySocialMedia();
  }, []);

  const { width } = useWindowDimensions();
  const isTwoColumn = Platform.OS == "web" ? width > 768 : false; // Adjus
  const formatDate = (epoch?: number | null) => {
    if (!epoch) return "—";
    try {
      return new Date(epoch * 1000).toLocaleString();
    } catch {
      return `${epoch}`;
    }
  };
  const qualityValue =
    trendlySocial?.quality_score ?? trendlyAnalytics?.quality;

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
        {closeModal && isTwoColumn && (
          <View
            style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}
          >
            <Pressable onPress={closeModal}>
              <FontAwesomeIcon
                icon={faClose}
                size={24}
                color={Colors(theme).primary}
                style={styles.icon}
              />
            </Pressable>
          </View>
        )}
        {isDiscoverView && (
          <View
            style={{
              flex: 1,
              paddingHorizontal: isTwoColumn ? 40 : 16,
              paddingVertical: 24,
            }}
          >
            {/* Top gray bar */}
            <View
              style={{
                width: 60,
                height: 4,
                backgroundColor: Colors(theme).gray200,
                borderRadius: 4,
                alignSelf: "center",
                marginBottom: 24,
              }}
            />
            <View
              style={{
                flexDirection: isTwoColumn ? "row" : "column",
                alignItems: isTwoColumn ? "flex-start" : "stretch",
              }}
            >
              {/* LEFT: Instagram-style profile card */}
              <View
                style={{
                  width: isTwoColumn ? 380 : "100%",
                  maxWidth: 420,
                  marginRight: isTwoColumn ? 32 : 0,
                  marginBottom: isTwoColumn ? 0 : 24,
                  // alignSelf: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: Colors(theme).background,
                    borderRadius: 16,
                    overflow: "hidden",
                    shadowColor: "#000",
                    shadowOpacity: 0.12,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 6 },
                    elevation: 6,
                    borderWidth: 1,
                    borderColor: Colors(theme).border,
                  }}
                >
                  {/* Mini header: avatar + name + role */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <Image
                      source={{
                        uri:
                          (influencer as any)?.profilePic ||
                          (influencer as any)?.profile?.profilePic ||
                          (trendlySocial as any)?.profile_pic ||
                          undefined,
                      }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        marginRight: 12,
                        marginLeft: 12,
                        marginTop: 12,

                        backgroundColor:
                          Colors(theme).gray100 || Colors(theme).background,
                      }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          marginTop: 4,
                        }}
                        numberOfLines={1}
                      >
                        {influencer.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          opacity: 0.7,
                        }}
                        numberOfLines={1}
                      >
                        {primarySocial?.isInstagram
                          ? primarySocial?.instaProfile?.username
                            ? `@${primarySocial?.instaProfile?.username}`
                            : ""
                          : primarySocial?.fbProfile?.name || ""}
                        {influencer?.profile?.category?.[0]
                          ? ` · ${influencer?.profile?.category?.[0]}`
                          : ""}
                      </Text>
                    </View>
                  </View>
                  {/* Media carousel / cover image */}
                  {mediaProcessing && mediaProcessing.length > 0 ? (
                    <Carousel data={mediaProcessing || []} theme={theme} />
                  ) : (
                    <Image
                      source={{
                        uri:
                          (influencer as any)?.profilePic ||
                          (influencer as any)?.profile?.profilePic ||
                          (trendlySocial as any)?.profile_pic ||
                          undefined,
                      }}
                      style={{
                        width: "100%",
                        height: 360,
                        backgroundColor:
                          Colors(theme).gray100 || Colors(theme).background,
                      }}
                      resizeMode="cover"
                    />
                  )}

                  {/* Card content */}
                  <View style={{ paddingHorizontal: 18, paddingVertical: 16 }}>
                    {/* Metrics row: followers / reach / interactions */}
                    {trendlySocial && (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: 12,
                        }}
                      >
                        <View style={{ alignItems: "center", flex: 1 }}>
                          <Text style={{ fontSize: 11, opacity: 0.7 }}>
                            Followers
                          </Text>
                          <Text style={{ fontSize: 13, fontWeight: "600" }}>
                            {trendlySocial.follower_count
                              ? new Intl.NumberFormat("en", {
                                  notation: "compact",
                                  maximumFractionDigits: 1,
                                }).format(trendlySocial.follower_count)
                              : "-"}
                          </Text>
                        </View>
                        <View style={{ alignItems: "center", flex: 1 }}>
                          <Text style={{ fontSize: 11, opacity: 0.7 }}>
                            Reach
                          </Text>
                          <Text style={{ fontSize: 13, fontWeight: "600" }}>
                            {trendlySocial.views_count
                              ? new Intl.NumberFormat("en", {
                                  notation: "compact",
                                  maximumFractionDigits: 1,
                                }).format(trendlySocial.views_count)
                              : "-"}
                          </Text>
                        </View>
                        <View style={{ alignItems: "center", flex: 1 }}>
                          <Text style={{ fontSize: 11, opacity: 0.7 }}>
                            Interactions
                          </Text>
                          <Text style={{ fontSize: 13, fontWeight: "600" }}>
                            {trendlySocial.engagement_count
                              ? new Intl.NumberFormat("en", {
                                  notation: "compact",
                                  maximumFractionDigits: 1,
                                }).format(trendlySocial.engagement_count)
                              : "-"}
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* Bio / description */}
                    {!!(trendlySocial as any)?.bio && (
                      <Text
                        style={{
                          fontSize: 12,
                          lineHeight: 16,
                          opacity: 0.85,
                          marginTop: 4,
                        }}
                        numberOfLines={4}
                      >
                        {(trendlySocial as any)?.bio}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {/* RIGHT: Details & analytics */}
              <View style={{ flex: 1 }}>
                {/* Top: Name + action button */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: 12,
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "700",
                      flexShrink: 1,
                      marginRight: 12,
                    }}
                    numberOfLines={1}
                  >
                    {influencer.name}
                  </Text>

                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <Button
                      style={{
                        borderWidth: 1,
                        borderColor: Colors(theme).border,
                        padding: 0,
                        borderRadius: 4,
                        paddingVertical: 0,
                      }}
                      textColor={Colors(theme).textLight}
                      icon={require("../../assets/images/quickinvite.png")}
                      mode="text"
                      onPress={() => {}}
                    >
                      Quick Invite
                    </Button>
                    <Button mode="contained" onPress={() => {}}>
                      Invite Now
                    </Button>
                  </View>
                </View>
                {/* <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Entypo name="instagram" size={20} color={Colors(theme).primary} />
                  <Text style={{fontSize:16}}>@{maskHandle(influencer.id)}</Text>
                </View> */}

                {/* Handle + meta chips block (blue strip in screenshot) */}
                <View
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    marginBottom: 12,
                    backgroundColor: Colors(theme).background,
                    flexDirection: "column",
                  }}
                >
                  {primarySocial && (
                    <View style={{ alignItems: "center" }}>
                      <FontAwesomeIcon
                        icon={
                          primarySocial?.isInstagram ? faInstagram : faFacebook
                        }
                        size={14}
                        color={Colors(theme).primary}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                        }}
                        numberOfLines={1}
                      >
                        {primarySocial?.isInstagram
                          ? "@" + primarySocial?.instaProfile?.username
                          : primarySocial?.fbProfile?.name}
                      </Text>
                    </View>
                  )}

                  {/* Meta list: gender, quality, verified */}
                  {trendlySocial && (
                    <View
                      style={{
                        // flexWrap: "wrap",
                        marginTop: 6,
                        flexDirection: "column",
                        maxWidth: 180,
                      }}
                    >
                      {!!trendlySocial.gender &&
                        trendlySocial.gender !== "unknown" && (
                          <Chip
                            icon="gender-male-female"
                            mode="flat"
                            style={{ marginRight: 6, marginBottom: 6 }}
                          >
                            {trendlySocial.gender}
                          </Chip>
                        )}
                      {typeof qualityValue === "number" && (
                        <Chip
                          icon="star"
                          mode="flat"
                          style={{ marginRight: 6, marginBottom: 6 }}
                        >
                          Quality: {qualityValue}/100
                        </Chip>
                      )}
                      {trendlySocial.profile_verified && (
                        <Chip
                          icon="check-decagram"
                          mode="flat"
                          style={{ marginRight: 6, marginBottom: 6 }}
                        >
                          Verified
                        </Chip>
                      )}
                    </View>
                  )}
                  {/* Location */}
                  {(influencer?.location || trendlySocial?.location) &&
                    (influencer?.location || trendlySocial?.location) !==
                      "unknown" && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faLocation}
                          size={14}
                          color={Colors(theme).primary}
                          style={{ marginRight: 6 }}
                        />
                        <Text style={{ fontSize: 14 }}>
                          {influencer?.location || trendlySocial?.location}
                        </Text>
                      </View>
                    )}
                </View>

                {/* Category chips */}
                {influencer?.profile?.category &&
                  influencer?.profile?.category.length > 0 && (
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        marginBottom: 16,
                      }}
                    >
                      {influencer.profile.category.map((cat, idx) => (
                        <View
                          key={idx}
                          style={{
                            paddingVertical: 6,
                            paddingHorizontal: 14,
                            backgroundColor: Colors(theme).gray100,
                            borderRadius: 20,
                            marginRight: 6,
                            marginBottom: 6,
                          }}
                        >
                          <Text style={{ fontSize: 13, fontWeight: "500" }}>
                            {cat}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                {/* Analytics area from parent (HeaderCards, Averages, Reels) */}
                {actionCard}
              </View>
            </View>
            {/* Profile meta (ID, platform, last updated) */}
            {trendlySocial && (
              <View style={{ marginTop: 16 }}>
                <Title
                  style={[
                    styles.cardColor,
                    { marginBottom: 4, alignSelf: "flex-start" },
                  ]}
                >
                  Profile Meta
                </Title>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    alignSelf: "flex-start",
                    columnGap: 20,
                  }}
                >
                  <Text style={styles.subTextHeading}>
                    ID: {trendlySocial.id}
                  </Text>
                  <Text style={styles.subTextHeading}>
                    Platform: {trendlySocial.social_type || "—"}
                  </Text>
                  <Text style={styles.subTextHeading}>
                    Last Updated:{" "}
                    {formatDate(
                      trendlySocial.last_update_time
                        ? trendlySocial.last_update_time / 1000000
                        : undefined
                    )}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
        {!isDiscoverView && (
          <>
            {previewType.value === "Preview" ? (
              <View
                style={{
                  flexDirection: isTwoColumn ? "row" : "column",
                  padding: isTwoColumn ? 20 : 0,
                  alignItems: isTwoColumn ? "flex-start" : undefined,
                }}
              >
                {isTwoColumn ? (
                  <View
                    style={[
                      styles.carouselContainer,
                      { flex: 1 },
                      Platform.OS === "web"
                        ? { maxWidth: MAX_WIDTH_WEB + 34 }
                        : { alignSelf: "center" },
                    ]}
                  >
                    {mediaProcessing && mediaProcessing.length > 0 ? (
                      <>
                        <Carousel data={mediaProcessing || []} theme={theme} />
                        <View style={{ paddingHorizontal: 16 }}>
                          <InfluencerMetrics
                            user={influencer}
                            social={primarySocial}
                          />
                        </View>
                      </>
                    ) : (
                      <InfluencerCard
                        // @ts-ignore
                        influencer={{
                          ...influencer,
                        }}
                        type="explore"
                        isOnFreePlan={isOnFreePlan}
                        lockProfile={lockProfile}
                      />
                    )}
                  </View>
                ) : (
                  <View
                    style={[
                      styles.carouselContainer,
                      Platform.OS === "web"
                        ? { maxWidth: MAX_WIDTH_WEB + 34 }
                        : { alignSelf: "center" },
                    ]}
                  >
                    {mediaProcessing && mediaProcessing.length > 0 && (
                      <Carousel data={mediaProcessing || []} theme={theme} />
                    )}
                    <View style={{ paddingHorizontal: 16 }}>
                      <InfluencerMetrics
                        user={influencer}
                        social={primarySocial}
                      />
                    </View>
                  </View>
                )}

                <View style={[{ flex: 1, marginTop: 16 }]}>
                  <View style={[styles.header]}>
                    <View style={styles.profileInfo}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 24,
                          marginBottom: 16,
                        }}
                      >
                        <Text style={styles.name}>
                          {isOnFreePlan || lockProfile
                            ? maskName(influencer.name)
                            : influencer.name}
                        </Text>
                        {actionButton != undefined
                          ? actionButton
                          : isBrandsApp && (
                              <>
                                {!isOnFreePlan ? (
                                  <>
                                    {lockProfile ? (
                                      <Button
                                        mode="outlined"
                                        onPress={unlockProfile}
                                        loading={loading}
                                      >
                                        Unlock Profile
                                      </Button>
                                    ) : (
                                      <>
                                        {IS_MONETIZATION_DONE && (
                                          <Button
                                            mode="contained"
                                            onPress={sendMessage}
                                            loading={loading}
                                          >
                                            Send Message
                                          </Button>
                                        )}
                                      </>
                                    )}
                                  </>
                                ) : (
                                  <Button mode="outlined" onPress={upgradeNow}>
                                    Unlock Profile
                                  </Button>
                                )}
                              </>
                            )}
                      </View>

                      <Pressable
                        style={styles.row}
                        onPress={() => {
                          if (isOnFreePlan) {
                            upgradeNow();
                            return;
                          }
                          if (lockProfile) {
                            closeModal?.();
                            openModal({
                              title: "Social Unavailable",
                              description:
                                "You can only get the influencers socials if they apply on your collaboration",
                              confirmAction: () => {
                                router.push("/collaborations");
                              },
                              confirmText: "Post Collaboration",
                            });
                            return;
                          }

                          Linking.openURL(
                            primarySocial?.isInstagram
                              ? `https://www.instagram.com/${primarySocial?.instaProfile?.username}`
                              : `https://www.facebook.com/${primarySocial?.fbProfile?.id}`
                          );
                          Console.log(
                            primarySocial?.isInstagram
                              ? `https://www.instagram.com/${primarySocial?.instaProfile?.username}`
                              : `https://www.facebook.com/${primarySocial?.fbProfile?.id}`
                          );
                        }}
                      >
                        <FontAwesomeIcon
                          icon={
                            primarySocial?.isInstagram
                              ? faInstagram
                              : faFacebook
                          }
                          size={18}
                          color={Colors(theme).primary}
                          style={styles.icon}
                        />
                        <Text style={styles.subTextHeading}>
                          {primarySocial?.isInstagram
                            ? "@" +
                              (isOnFreePlan || lockProfile
                                ? maskHandle(
                                    primarySocial?.instaProfile?.username || ""
                                  )
                                : primarySocial?.instaProfile?.username)
                            : isOnFreePlan || lockProfile
                            ? maskHandle(primarySocial?.fbProfile?.name || "")
                            : primarySocial?.fbProfile?.name}
                        </Text>
                      </Pressable>

                      {trendlySocial && (
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            marginTop: 8,
                          }}
                        >
                          {!!trendlySocial.gender &&
                            trendlySocial.gender !== "unknown" && (
                              <Chip
                                style={{ marginRight: 8, marginBottom: 8 }}
                                icon="account"
                                mode="outlined"
                              >
                                {trendlySocial.gender}
                              </Chip>
                            )}
                          {typeof qualityValue === "number" && (
                            <Chip
                              style={{ marginRight: 8, marginBottom: 8 }}
                              icon="star"
                              mode="outlined"
                            >
                              Quality: {qualityValue}/100
                            </Chip>
                          )}
                          {trendlySocial.profile_verified && (
                            <Chip
                              style={{ marginRight: 8, marginBottom: 8 }}
                              icon="check-decagram"
                              mode="outlined"
                            >
                              Verified
                            </Chip>
                          )}
                        </View>
                      )}

                      {/* Email */}
                      {influencer?.email && (
                        <Pressable
                          style={styles.row}
                          onPress={() => {
                            if (isEmailMasked || isOnFreePlan || lockProfile) {
                              if (closeModal) {
                                closeModal();
                                openModal({
                                  title: "Email Unavailable",
                                  description:
                                    "You can only get the influencers email if they apply on your collaboration",
                                  confirmAction: () => {
                                    router.push("/collaborations");
                                  },
                                  confirmText: "Post Collaboration",
                                });
                              }
                            } else
                              Linking.openURL(`mailto:${influencer?.email}`);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faEnvelope}
                            size={16}
                            color={Colors(theme).primary}
                            style={styles.icon}
                          />
                          {isEmailMasked || isOnFreePlan || lockProfile ? (
                            <>
                              <Text style={styles.subTextHeading}>
                                {maskEmail(influencer?.email)}
                              </Text>
                            </>
                          ) : (
                            <Text style={styles.subTextHeading}>
                              {influencer?.email}
                            </Text>
                          )}
                        </Pressable>
                      )}

                      {/* Phone */}
                      {influencer?.phoneNumber && (
                        <Pressable
                          style={styles.row}
                          onPress={() => {
                            if (isPhoneMasked || isOnFreePlan || lockProfile) {
                              if (closeModal) {
                                closeModal();
                                if (isBrandsApp)
                                  openModal({
                                    title: "Phone Access Unavailable",
                                    description:
                                      "You can only get the influencers phone number if they apply on your collaboration",
                                    confirmAction: () => {
                                      router.push("/collaborations");
                                    },
                                    confirmText: "Post Collaboration",
                                  });
                                else
                                  openModal({
                                    title: "Phone Access Unavailable",
                                    description:
                                      "You can only get the influencers phone number if they accept your invitation to connect",
                                    confirmAction: () => {},
                                    confirmText: "Understood",
                                  });
                              }
                            } else
                              Linking.openURL(`tel:${influencer?.phoneNumber}`);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faPhone}
                            size={16}
                            color={Colors(theme).primary}
                            style={styles.icon}
                          />
                          {isPhoneMasked || isOnFreePlan || lockProfile ? (
                            <>
                              <Text style={styles.subTextHeading}>
                                {maskPhone(influencer?.phoneNumber)}
                              </Text>
                            </>
                          ) : (
                            <Text style={styles.subTextHeading}>
                              {influencer?.phoneNumber}
                            </Text>
                          )}
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
                      {(influencer?.location || trendlySocial?.location) && (
                        <View style={styles.row}>
                          <FontAwesomeIcon
                            icon={faLocation}
                            size={16}
                            color={Colors(theme).primary}
                            style={styles.icon}
                          />
                          <Text style={styles.subTextHeading}>
                            {influencer?.location || trendlySocial?.location}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {influencer?.profile?.category?.length !== 0 && (
                    <View style={[styles.chipContainer]}>
                      {influencer?.profile?.category &&
                        influencer?.profile?.category.map((interest, index) => (
                          <Chip key={index} style={styles.chip} mode="outlined">
                            {interest}
                          </Chip>
                        ))}
                    </View>
                  )}
                  {actionCard}
                  {trendlySocial && (
                    <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
                      <Title style={[styles.cardColor, { marginBottom: 8 }]}>
                        Profile Meta
                      </Title>
                      <View style={{ gap: 6 }}>
                        <Text style={styles.subTextHeading}>
                          ID: {trendlySocial.id}
                        </Text>
                        <Text style={styles.subTextHeading}>
                          Platform: {trendlySocial.social_type || "—"}
                        </Text>
                        <Text style={styles.subTextHeading}>
                          Last Updated:{" "}
                          {formatDate(
                            trendlySocial.last_update_time
                              ? trendlySocial.last_update_time / 1000000
                              : undefined
                          )}
                        </Text>
                      </View>
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
                          baseStyle={{
                            color: theme.dark
                              ? Colors(theme).text
                              : Colors(theme).gray300,
                            fontSize: 16,
                            lineHeight: 22,
                          }}
                        />
                      </View>
                    ) : null}

                    {influencer?.profile?.content?.socialMediaHighlight ? (
                      <View style={styles.aboutCard}>
                        <Title style={styles.cardColor}>
                          Social Media Highlight
                        </Title>
                        <RenderHTML
                          contentWidth={screenWidth}
                          source={{
                            html:
                              influencer?.profile?.content
                                ?.socialMediaHighlight ||
                              "<p>No content available.</p>",
                          }}
                          baseStyle={{
                            color: theme.dark
                              ? Colors(theme).text
                              : Colors(theme).gray300,
                            fontSize: 16,
                            lineHeight: 22,
                          }}
                        />
                      </View>
                    ) : null}
                    {showCampaignGoals &&
                    influencer?.profile?.content?.collaborationGoals ? (
                      <View style={styles.aboutCard}>
                        <Title style={styles.cardColor}>Campaign Goals</Title>
                        <RenderHTML
                          contentWidth={screenWidth}
                          source={{
                            html:
                              influencer?.profile?.content
                                ?.collaborationGoals ||
                              "<p>No content available.</p>",
                          }}
                          baseStyle={{
                            color: theme.dark
                              ? Colors(theme).text
                              : Colors(theme).gray300,
                            fontSize: 16,
                            lineHeight: 22,
                          }}
                        />
                      </View>
                    ) : null}
                    {showInfluencerGoals &&
                    influencer?.profile?.content?.influencerConectionGoals ? (
                      <View style={styles.aboutCard}>
                        <Title style={styles.cardColor}>
                          Influencer Connection Goals
                        </Title>
                        <RenderHTML
                          contentWidth={screenWidth}
                          source={{
                            html:
                              influencer?.profile?.content
                                ?.influencerConectionGoals ||
                              "<p>No content available.</p>",
                          }}
                          baseStyle={{
                            color: theme.dark
                              ? Colors(theme).text
                              : Colors(theme).gray300,
                            fontSize: 16,
                            lineHeight: 22,
                          }}
                        />
                      </View>
                    ) : null}
                    {influencer?.profile?.content?.audienceInsights ? (
                      <View style={styles.aboutCard}>
                        <Title style={styles.cardColor}>
                          Audience Insights
                        </Title>
                        <RenderHTML
                          contentWidth={screenWidth}
                          source={{
                            html:
                              influencer?.profile?.content?.audienceInsights ||
                              "<p>No content available.</p>",
                          }}
                          baseStyle={{
                            color: theme.dark
                              ? Colors(theme).text
                              : Colors(theme).gray300,
                            fontSize: 16,
                            lineHeight: 22,
                          }}
                        />
                      </View>
                    ) : null}
                    {influencer?.profile?.content?.funFactAboutUser ? (
                      <View style={styles.aboutCard}>
                        <Title style={styles.cardColor}>
                          Fun Fact About You
                        </Title>
                        <RenderHTML
                          contentWidth={screenWidth}
                          source={{
                            html:
                              influencer?.profile?.content?.funFactAboutUser ||
                              "<p>No content available.</p>",
                          }}
                          baseStyle={{
                            color: theme.dark
                              ? Colors(theme).text
                              : Colors(theme).gray300,
                            fontSize: 16,
                            lineHeight: 22,
                          }}
                        />
                      </View>
                    ) : null}
                    {loadingPosts ? (
                      <ActivityIndicator
                        size="large"
                        color={Colors(theme).primary}
                      />
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
                          {influencer.name}'s{" "}
                          {isInstagram ? "Instagram" : "Facebook"} Posts
                        </Title>

                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                        >
                          <View style={{ flexDirection: "column" }}>
                            <View
                              style={{ flexDirection: "row", marginBottom: 10 }}
                            >
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
                  padding: isTwoColumn ? 20 : 0,
                  alignSelf: "center",
                }}
              >
                <InfluencerCard
                  influencer={influencer}
                  ToggleModal={() => {}}
                  type="explore"
                  fullHeight={true}
                  isOnFreePlan={isOnFreePlan}
                  lockProfile={lockProfile}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>
      {showCardPreviewTab && !isTwoColumn && (
        <View
          style={{
            padding: 10,
            paddingBottom: 40,
            backgroundColor: Colors(theme).background,
            borderTopWidth: 1,
            borderTopColor: Colors(theme).border,
            position: "absolute",
            bottom: 0,
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
