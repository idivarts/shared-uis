import { IS_MONETIZATION_DONE } from "@/shared-constants/app";
import { ISocials } from "@/shared-libs/firestore/trendly-pro/models/socials";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { Console } from "@/shared-libs/utils/console";
import { useMyNavigation } from "@/shared-libs/utils/router";
import useBreakpoints from "@/shared-libs/utils/use-breakpoints";
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
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Theme } from "@react-navigation/native";
import { doc, Firestore, getDoc } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Linking,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
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
import { qualityScoreToStars, Stars } from "../rating-section";
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
    const { width: screenWidth, width } = useBreakpoints();
    const isTwoColumn = Platform.OS === "web" ? width > 768 : false;
    const localStyles = useMemo(
        () => createLocalStyles(theme, isTwoColumn, screenWidth),
        [theme, isTwoColumn, screenWidth]
    );
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

    const trendlyGender = social?.gender;
    const trendlyQuality =
        typeof social?.quality === "number"
            ? social.quality
            : typeof (social as any)?.quality_score === "number"
                ? (social as any).quality_score
                : undefined;
    const trendlyVerified =
        typeof social?.isVerified === "boolean"
            ? social.isVerified
            : Boolean((social as any)?.profile_verified);
    const showGenderChip = !!trendlyGender && trendlyGender !== "unknown";
    const showQualityChip = typeof trendlyQuality === "number";
    const showVerifiedChip = !!trendlyVerified;
    const showTrendlyChips = showGenderChip || showQualityChip || showVerifiedChip;
    const profileContent = influencer?.profile?.content;
    const profileSections = [
        {
            key: "about",
            title: "About Me",
            subtitle: "The real intro",
            icon: "auto-awesome",
            sectionTag: "Know More",
            html: profileContent?.about,
            visible: !!profileContent?.about,
        },
        {
            key: "social-highlight",
            title: "Social Media Highlight",
            subtitle: "Main character moment",
            icon: "bolt",
            sectionTag: "My Socials",
            html: profileContent?.socialMediaHighlight,
            visible: !!profileContent?.socialMediaHighlight,
        },
        {
            key: "campaign-goals",
            title: "Campaign Goals",
            subtitle: "What they want to build",
            icon: "campaign",
            sectionTag: "Why Chose Me",
            html: profileContent?.collaborationGoals,
            visible: showCampaignGoals && !!profileContent?.collaborationGoals,
        },
        {
            key: "influencer-goals",
            title: "Influencer Connection Goals",
            subtitle: "Collab energy",
            icon: "groups",
            sectionTag: "Why Connect",
            html: profileContent?.influencerConectionGoals,
            visible: showInfluencerGoals && !!profileContent?.influencerConectionGoals,
        },
        {
            key: "audience-insights",
            title: "Audience Insights",
            subtitle: "Who is tuning in",
            icon: "insights",
            sectionTag: "My Audience",
            html: profileContent?.audienceInsights,
            visible: !!profileContent?.audienceInsights,
        },
        {
            key: "fun-fact",
            title: "Fun Fact About You",
            subtitle: "Lore drop",
            icon: "emoji-objects",
            sectionTag: "Fun",
            html: profileContent?.funFactAboutUser,
            visible: !!profileContent?.funFactAboutUser,
        },
    ].filter((section) => section.visible && section.html);
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
        <View style={localStyles.root}>
            <ScrollView
                style={localStyles.scrollView}
                contentContainerStyle={localStyles.scrollContent}
                showsVerticalScrollIndicator={true}
                bounces={true}
            >
                {closeModal && isTwoColumn && (
                    <View style={localStyles.closeButtonWrap}>
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
                    <View style={localStyles.previewContainer}>
                        {isTwoColumn ? (
                            <View style={[styles.carouselContainer, localStyles.carouselColWeb]}>
                                <InfluencerCard
                                    // @ts-ignore
                                    influencer={{ ...influencer, socials: [primarySocial?.isInstagram ? primarySocial?.instaProfile?.username : primarySocial?.fbProfile?.name] }}
                                    type="explore"
                                    isOnFreePlan={isOnFreePlan}
                                    lockProfile={lockProfile}
                                />
                            </View>) : (
                            <View style={[styles.carouselContainer, localStyles.carouselColNative]}>
                                {mediaProcessing && mediaProcessing.length > 0 && (
                                    <Carousel data={mediaProcessing || []} theme={theme} />
                                )}
                                <View style={localStyles.metricsPadding}>
                                    <InfluencerMetrics user={influencer} social={primarySocial} />
                                </View>
                            </View>)}

                        <View style={localStyles.detailsCol}>
                            <View style={[styles.header]}>
                                <View style={styles.profileInfo}>
                                    <View style={localStyles.profileInfoInner}>
                                        <View style={localStyles.nameAndQualityBlock}>
                                            <View style={localStyles.nameRow}>
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
                                                        color={Colors(theme).primary}
                                                    />
                                                )}
                                            </View>
                                            {showQualityChip && (
                                                <View style={[styles.row, localStyles.qualityRow]}>
                                                    <Stars rating={qualityScoreToStars(trendlyQuality!)} size={16} />
                                                    <Text style={[styles.subTextHeading, localStyles.qualityValueMargin]}>
                                                        {qualityScoreToStars(trendlyQuality!).toFixed(1)}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                        {actionButtonNode ? (
                                            <View style={localStyles.actionButtonWrap}>
                                                {actionButtonNode}
                                            </View>
                                        ) : null}
                                    </View>

                                    <View style={localStyles.profileDetailsRow}>
                                        <Pressable
                                            style={[styles.row, localStyles.profileDetailItem]}
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
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={
                                                    primarySocial?.isInstagram
                                                        ? faInstagram
                                                        : faFacebook
                                                }
                                                size={16}
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
                                        {showGenderChip && (
                                            <View style={[styles.row, localStyles.profileDetailItem]}>
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
                                        )}
                                        {showVerifiedChip && (
                                            <View style={[styles.row, localStyles.profileDetailItem]}>
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
                                        )}
                                        {influencer?.location && (
                                            <View style={[styles.row, localStyles.profileDetailItem]}>
                                                <FontAwesomeIcon
                                                    icon={faLocation}
                                                    size={16}
                                                    color={Colors(theme).primary}
                                                    style={styles.icon}
                                                />
                                                <Text style={styles.subTextHeading}>
                                                    {influencer.location}
                                                </Text>
                                            </View>
                                        )}
                                        {/* Email */}
                                        {influencer?.email && (
                                            <Pressable
                                                style={[styles.row, localStyles.profileDetailItem]}
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
                                                    <Text style={styles.subTextHeading}>
                                                        {maskEmail(influencer?.email)}
                                                    </Text>
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
                                                style={[styles.row, localStyles.profileDetailItem]}
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
                                                    <Text style={styles.subTextHeading}>
                                                        {maskPhone(influencer?.phoneNumber)}
                                                    </Text>
                                                ) : (
                                                    <Text style={styles.subTextHeading}>
                                                        {influencer?.phoneNumber}
                                                    </Text>
                                                )}
                                            </Pressable>
                                        )}

                                        {influencer?.profile?.timeCommitment && (
                                            <View style={[styles.row, localStyles.profileDetailItem]}>
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
                                    </View>
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

                            <View style={[styles.aboutContainer, localStyles.aboutFeedContainer]}>
                                {profileSections.map((section) => (
                                    <View key={section.key} style={[styles.aboutCard, localStyles.aboutSection]}>
                                        <View style={localStyles.aboutCardHeader}>
                                            <View style={localStyles.aboutBadge}>
                                                <MaterialIcons
                                                    name={section.icon as any}
                                                    size={16}
                                                    color={Colors(theme).primary}
                                                />
                                                <Text style={localStyles.aboutBadgeText}>{section.sectionTag}</Text>
                                            </View>
                                        </View>
                                        <Title style={[styles.cardColor, localStyles.aboutTitle]}>
                                            {section.title}
                                        </Title>
                                        <Text style={localStyles.aboutSubtitle}>{section.subtitle}</Text>
                                        <View style={localStyles.aboutHtmlWrap}>
                                            <RenderHTML
                                                contentWidth={screenWidth}
                                                source={{ html: section.html || "<p>No content available.</p>" }}
                                                baseStyle={localStyles.htmlBaseStyle}
                                            />
                                        </View>
                                    </View>
                                ))}
                                {loadingPosts ? (
                                    <ActivityIndicator
                                        size="large"
                                        color={Colors(theme).primary}
                                    />
                                ) : posts.length > 0 ? (
                                    <View style={[styles.aboutCard, localStyles.aboutSection, localStyles.postsSection]}>
                                        <View style={localStyles.aboutCardHeader}>
                                            <View style={localStyles.aboutBadge}>
                                                <MaterialIcons
                                                    name={isInstagram ? "photo-camera" : "facebook"}
                                                    size={16}
                                                    color={Colors(theme).primary}
                                                />
                                                <Text style={localStyles.aboutBadgeText}>Feed</Text>
                                            </View>
                                        </View>
                                        <Title
                                            style={[styles.cardColor, localStyles.cardTitleWithMargin, localStyles.aboutTitle]}
                                        >
                                            {influencer.name}'s{" "}
                                            {isInstagram ? "Instagram" : "Facebook"} Posts
                                        </Title>
                                        <Text style={localStyles.aboutSubtitle}>
                                            Fresh drops from socials
                                        </Text>

                                        <ScrollView
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={localStyles.postsScrollContent}
                                        >
                                            <View style={localStyles.postsColumn}>
                                                <View style={localStyles.postsRow}>
                                                    {posts &&
                                                        posts
                                                            .filter((_, index) => index % 2 === 0)
                                                            .map((item: any, index) => (
                                                                <Pressable
                                                                    key={`top-${index}`}
                                                                    style={localStyles.postPressable}
                                                                    onPress={() => {
                                                                        Linking.openURL(
                                                                            isInstagram
                                                                                ? item.permalink
                                                                                : item.permalink_url
                                                                        );
                                                                    }}
                                                                >
                                                                    <Image
                                                                        source={{
                                                                            uri: isInstagram
                                                                                ? item.media_type === "IMAGE"
                                                                                    ? item.media_url
                                                                                    : item.thumbnail_url
                                                                                : item.full_picture,
                                                                        }}
                                                                        style={localStyles.postImage}
                                                                    />
                                                                </Pressable>
                                                            ))}
                                                </View>
                                                <View style={localStyles.postsRowOnly}>
                                                    {posts &&
                                                        posts
                                                            .filter((_, index) => index % 2 !== 0)
                                                            .map((item: any, index) => (
                                                                <Pressable
                                                                    key={`bottom-${index}`}
                                                                    style={localStyles.postPressable}
                                                                    onPress={() => {
                                                                        Linking.openURL(
                                                                            isInstagram
                                                                                ? item.permalink
                                                                                : item.permalink_url
                                                                        );
                                                                    }}
                                                                >
                                                                    <Image
                                                                        source={{
                                                                            uri: isInstagram
                                                                                ? item.media_type === "IMAGE"
                                                                                    ? item.media_url
                                                                                    : item.thumbnail_url
                                                                                : item.full_picture,
                                                                        }}
                                                                        style={localStyles.postImage}
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
                    <View style={localStyles.singleColumnPadding}>
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
                <View style={localStyles.stickyBottom}>
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

const createLocalStyles = (
    theme: Theme,
    isTwoColumn: boolean,
    _screenWidth: number
) => {
    const colors = Colors(theme);
    return StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: colors.background,
            position: "relative",
        },
        scrollView: { flex: 1 },
        scrollContent: { paddingBottom: 100 },
        closeButtonWrap: {
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1000,
        },
        previewContainer: {
            flexDirection: isTwoColumn ? "row" : "column",
            padding: isTwoColumn ? 20 : 0,
            alignItems: isTwoColumn ? "flex-start" : undefined,
        },
        carouselColWeb: {
            flex: 1,
            maxWidth: MAX_WIDTH_WEB + 34,
        },
        carouselColCenter: {
            alignSelf: "center",
        },
        carouselColNative: Platform.OS === "web"
            ? { maxWidth: MAX_WIDTH_WEB + 34 }
            : { alignSelf: "center" as const },
        metricsPadding: { paddingHorizontal: 16 },
        detailsCol: { flex: 1, marginTop: 16 },
        profileInfoInner: {
            flexDirection: isTwoColumn ? "row" : "column",
            flexWrap: isTwoColumn ? "wrap" : undefined,
            alignItems: "flex-start",
            gap: isTwoColumn ? 24 : 12,
            marginBottom: 16,
            minWidth: 0,
        },
        nameAndQualityBlock: {
            flexDirection: "column" as const,
            alignItems: "flex-start",
            flexShrink: isTwoColumn ? 1 : 0,
            minWidth: isTwoColumn ? 0 : undefined,
        },
        nameRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            flexShrink: isTwoColumn ? 1 : 0,
            minWidth: isTwoColumn ? 0 : undefined,
            maxWidth: isTwoColumn ? "100%" : undefined,
        },
        actionButtonWrap: {
            width: isTwoColumn ? "auto" : "100%",
            alignItems: "flex-start",
            flexShrink: 0,
        },
        chipsMarginTop: { marginTop: 8 },
        profileDetailsRow: {
            flexDirection: "column" as const,
            alignItems: "flex-start",
            gap: 10,
            marginBottom: 8,
        },
        profileDetailItem: {
            marginBottom: 0,
        },
        qualityRow: {
            alignItems: "center" as const,
            marginTop: 4,
        },
        qualityLabelMargin: { marginRight: 6 },
        qualityValueMargin: { marginLeft: 4 },
        htmlBaseStyle: {
            color: theme.dark ? colors.text : colors.gray300,
            fontSize: 16,
            lineHeight: 22,
        },
        aboutFeedContainer: {
            marginTop: 8,
        },
        aboutSection: {
            marginVertical: 0,
            paddingTop: 10,
            paddingBottom: 18,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: colors.border,
        },
        aboutCardHeader: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 6,
        },
        aboutBadge: {
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            borderRadius: 999,
            backgroundColor: colors.tag,
            paddingHorizontal: 10,
            paddingVertical: 4,
        },
        aboutBadgeText: {
            color: colors.tagForeground,
            fontSize: 11,
            fontWeight: "600",
            letterSpacing: 0.2,
            textTransform: "uppercase",
        },
        aboutSubtitle: {
            color: colors.textSecondary,
            fontSize: 13,
            marginBottom: 8,
        },
        aboutTitle: {
            marginBottom: 2,
            fontSize: 24,
            lineHeight: 30,
        },
        aboutHtmlWrap: {
            paddingTop: 2,
        },
        postsSection: {
            paddingBottom: 8,
            borderBottomWidth: 0,
        },
        cardTitleWithMargin: { marginBottom: 4 },
        postsScrollContent: { paddingBottom: 4 },
        postsColumn: { flexDirection: "column" as const },
        postsRow: { flexDirection: "row" as const, marginBottom: 12 },
        postsRowOnly: { flexDirection: "row" as const },
        postPressable: {
            borderRadius: 14,
            overflow: "hidden",
        },
        postImage: {
            width: 112,
            height: 112,
            borderRadius: 14,
            marginRight: 12,
        },
        singleColumnPadding: {
            padding: isTwoColumn ? 20 : 0,
            alignSelf: "center",
        },
        stickyBottom: {
            padding: 10,
            paddingBottom: 40,
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            elevation: 5,
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
        },
    });
};

export default ProfileBottomSheet;
