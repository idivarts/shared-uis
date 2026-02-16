import { IS_MONETIZATION_DONE } from "@/shared-constants/app";
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
    maskPhone
} from "@/shared-uis/utils/masks";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import {
    faCheck,
    faClock,
    faClose,
    faEnvelope,
    faLocation,
    faPhone,
    faStar,
    faUser,
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
import { Button, Chip, Title } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import { Subject } from "rxjs";
import { useConfirmationModel } from "../ConfirmationModal";
import InfluencerCard from "../InfluencerCard";
import Carousel from "../carousel/carousel";
import { MAX_WIDTH_WEB } from "../carousel/carousel-util";
import { MediaItem } from "../carousel/render-media-item";
import { InfluencerMetrics } from "../influencers/influencer-metrics";
import SelectGroup from "../select/select-group";


interface ProfileBottomSheetProps {
    actionButton?: React.ReactNode;
    actionCard?: React.ReactNode;
    carouselMedia?: MediaItem[];
    FireStoreDB: Firestore;
    influencer: IUsers & {
        id: string; // Note: additional fields from discovery page
    };
    social?: ISocials & Partial<{
        gender: string,
        quality: number,
        isVerified: boolean
    }>;
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
    // editMetricsButton?: React.ReactNode;
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
    // editMetricsButton,
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

}) => {
    const styles = stylesFn(theme);
    const [primarySocial, setPrimarySocial] = useState<ISocials>();
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

    useEffect(() => {
        console.log("SOCIAL DATA FETCHED", social);

        setPrimarySocial(social)
    }, [social])

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
    const isTwoColumn = Platform.OS == "web" ? width > 768 : false;
    const trendlyGender = social?.gender;
    const trendlyQuality =
        typeof social?.quality === "number"
            ? social.quality
            : typeof (social as any)?.quality_score === "number"
                ? (social as any).quality_score
                : undefined;

    const formatQualityStars = (quality?: number | null) => {
        if (quality === null || quality === undefined) return 0;
        return Math.round(quality / 20);
    };

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Text key={i} style={{ fontSize: 16, marginRight: 4 }}>
                    {i <= rating ? "⭐" : "☆"}
                </Text>
            );
        }
        return stars;
    };
    const trendlyVerified =
        typeof social?.isVerified === "boolean"
            ? social.isVerified
            : Boolean((social as any)?.profile_verified);
    const showGenderChip = !!trendlyGender && trendlyGender !== "unknown";
    const showQualityChip = typeof trendlyQuality === "number";
    const showVerifiedChip = !!trendlyVerified;
    const showTrendlyChips = showGenderChip || showQualityChip || showVerifiedChip;
    const actionButtonNode =
        actionButton != undefined
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
            );

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: Colors(theme).background,
                position: "relative",
            }}
        >
            <ScrollView
                style={{
                    flex: 1,
                }}
                contentContainerStyle={{
                    paddingBottom: 100,
                }}
                showsVerticalScrollIndicator={true}
                bounces={true}
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
                {previewType.value === "Preview" ? (
                    <View
                        style={{
                            flexDirection: isTwoColumn ? "row" : "column",
                            padding: isTwoColumn ? 20 : 0,
                            alignItems: isTwoColumn ? "flex-start" : undefined,
                        }}
                    >
                        {isTwoColumn ? (
                            <View style={[styles.carouselContainer, { flex: 1 }, Platform.OS === "web" ? { maxWidth: MAX_WIDTH_WEB + 34 } : { alignSelf: "center" }]}>
                                <InfluencerCard
                                    // @ts-ignore
                                    influencer={{ ...influencer, socials: [primarySocial?.isInstagram ? primarySocial?.instaProfile?.username : primarySocial?.fbProfile?.name] }}
                                    type="explore"
                                    isOnFreePlan={isOnFreePlan}
                                    lockProfile={lockProfile}
                                />
                            </View>) : (
                            <View style={[styles.carouselContainer,
                            Platform.OS === "web" ? { maxWidth: MAX_WIDTH_WEB + 34 } :
                                { alignSelf: "center" }]}>
                                {mediaProcessing && mediaProcessing.length > 0 && (
                                    <Carousel data={mediaProcessing || []} theme={theme} />
                                )}
                                <View style={{ paddingHorizontal: 16 }}>
                                    <InfluencerMetrics user={influencer} social={primarySocial} />
                                </View>
                            </View>)}

                        <View style={[{ flex: 1, marginTop: 16 }]}>
                            <View style={[styles.header]}>
                                <View style={styles.profileInfo}>
                                    <View
                                        style={{
                                            flexDirection: isTwoColumn ? "row" : "column",
                                            alignItems: "flex-start",
                                            gap: isTwoColumn ? 24 : 12,
                                            marginBottom: 16,
                                        }}
                                    >
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                            <Text
                                                style={[
                                                    styles.name,

                                                ]}
                                                numberOfLines={isTwoColumn ? 1 : 2}
                                            >
                                                {influencer.name}
                                            </Text>
                                            {influencer.isKYCDone && (
                                                <MaterialIcons
                                                    name="verified"
                                                    size={24}
                                                    color="#3B82F6"
                                                />
                                            )}
                                        </View>
                                        {actionButtonNode ? (
                                            <View
                                                style={{
                                                    width: isTwoColumn ? "auto" : "100%",
                                                    alignItems: "flex-start"

                                                }}
                                            >
                                                {actionButtonNode}
                                            </View>
                                        ) : null}
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

                                    {showTrendlyChips ? (
                                        <View style={{ marginTop: 8 }}>
                                            {showGenderChip ? (
                                                <View style={styles.row}>
                                                    <FontAwesomeIcon
                                                        icon={faUser}
                                                        size={16}
                                                        color={Colors(theme).primary}
                                                        style={styles.icon}
                                                    />
                                                    <Text style={styles.subTextHeading}>
                                                        Gender: {trendlyGender}
                                                    </Text>
                                                </View>
                                            ) : null}
                                            {showQualityChip ? (
                                                <View style={styles.row}>
                                                    <FontAwesomeIcon
                                                        icon={faStar}
                                                        size={16}
                                                        color={Colors(theme).primary}
                                                        style={styles.icon}
                                                    />
                                                    <Text style={styles.subTextHeading}>Quality: </Text>
                                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                        {renderStars(formatQualityStars(trendlyQuality))}
                                                    </View>
                                                </View>
                                            ) : null}
                                            {showVerifiedChip ? (
                                                <View style={styles.row}>
                                                    <FontAwesomeIcon
                                                        icon={faCheck}
                                                        size={16}
                                                        color={Colors(theme).primary}
                                                        style={styles.icon}
                                                    />
                                                    <Text style={styles.subTextHeading}>
                                                        Verified
                                                    </Text>
                                                </View>
                                            ) : null}
                                        </View>
                                    ) : null}

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
                                                                confirmAction: () => { },
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
                                    {(influencer?.location) && (
                                        <View style={styles.row}>
                                            <FontAwesomeIcon
                                                icon={faLocation}
                                                size={16}
                                                color={Colors(theme).primary}
                                                style={styles.icon}
                                            />
                                            <Text style={styles.subTextHeading}>
                                                {influencer?.location}
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
                            ToggleModal={() => { }}
                            type="explore"
                            fullHeight={true}
                            isOnFreePlan={isOnFreePlan}
                            lockProfile={lockProfile}
                        />
                    </View>
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
