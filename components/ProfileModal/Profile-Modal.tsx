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
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Linking,
    Platform,
    Pressable,
    ScrollView,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import { Button } from "react-native-paper";
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
        id: string;
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
}

export const ProfileModalUnlockRequest = new Subject<{
    influencerId: string;
    callback: Function;
}>();
export const ProfileModalSendMessage = new Subject<{
    influencerId: string;
    callback: Function;
}>();

const ACCENT = {
    blue: "#3B82F6",
    purple: "#8B5CF6",
    pink: "#EC4899",
    amber: "#F59E0B",
    emerald: "#10B981",
    teal: "#14B8A6",
    rose: "#F43F5E",
    sky: "#0EA5E9",
};

const tintBg = (hex: string, opacity = 0.1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

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

}) => {
    const styles = stylesFn(theme);
    const isDark = theme.dark;
    const colors = Colors(theme);
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

    const { width: screenWidth, xs, sm, md, lg } = useBreakpoints();

    // Responsive padding for all screen sizes (xs<480, sm>=480, md>=640, lg>=768)
    const responsivePaddingHorizontal = xs ? 16 : sm ? 18 : md ? 20 : 24;

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
    const isTwoColumn = Platform.OS === "web" ? lg : false;
    const trendlyGender = social?.gender;
    const trendlyVerified =
        typeof social?.isVerified === "boolean"
            ? social.isVerified
            : Boolean((social as any)?.profile_verified);
    const showGenderChip = !!trendlyGender && trendlyGender !== "unknown";
    const showVerifiedChip = !!trendlyVerified;
    const showTrendlyChips = showGenderChip || showVerifiedChip;

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
                                    style={{ borderRadius: 24 }}
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
                                            style={{ borderRadius: 24 }}
                                        >
                                            Send Message
                                        </Button>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <Button mode="outlined" onPress={upgradeNow} style={{ borderRadius: 24 }}>
                            Unlock Profile
                        </Button>
                    )}
                </>
            );

    const cardBg = tintBg(colors.primary, isDark ? 0.06 : 0.03);
    const cardBorder = tintBg(colors.primary, isDark ? 0.12 : 0.06);

    const iconSquareStyle = (accentColor: string) => ({
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: tintBg(accentColor, isDark ? 0.15 : 0.1),
        alignItems: "center" as const,
        justifyContent: "center" as const,
        marginRight: 12,
    });

    const contactRowStyle = {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        paddingVertical: 7,
    };

    const renderAboutSection = (title: string, html: string | undefined) => {
        if (!html) return null;
        return (
            <View style={{
                marginHorizontal: responsivePaddingHorizontal,
                marginBottom: 16,
                backgroundColor: cardBg,
                borderRadius: 16,
                padding: 18,
                borderWidth: 1,
                borderColor: cardBorder,
            }}>
                <Text style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: colors.primary,
                    marginBottom: 10,
                    letterSpacing: 0.8,
                    textTransform: "uppercase" as const,
                }}>
                    {title}
                </Text>
                <RenderHTML
                    contentWidth={screenWidth}
                    source={{ html: html || "<p>No content available.</p>" }}
                    baseStyle={{
                        color: isDark ? colors.text : Colors(theme).gray300,
                        fontSize: 15,
                        lineHeight: 22,
                    }}
                />
            </View>
        );
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.background,
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
                                color={colors.primary}
                                style={styles.icon}
                            />
                        </Pressable>
                    </View>
                )}
                {previewType.value === "Preview" ? (
                    <View
                        style={{
                            flexDirection: isTwoColumn ? "row" : "column",
                            padding: isTwoColumn ? responsivePaddingHorizontal : 0,
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
                                <View style={{ paddingHorizontal: responsivePaddingHorizontal }}>
                                    <InfluencerMetrics user={influencer} social={primarySocial} />
                                </View>
                            </View>)}

                        <View style={[{ flex: 1, marginTop: 16 }]}>
                            {/* ─── Name + Action Button ─── */}
                            <View style={{ paddingHorizontal: responsivePaddingHorizontal }}>
                                <View
                                    style={{
                                        flexDirection: isTwoColumn ? "row" : "column",
                                        flexWrap: isTwoColumn ? "wrap" : undefined,
                                        alignItems: "flex-start",
                                        gap: isTwoColumn ? 24 : 12,
                                        marginBottom: 4,
                                        minWidth: 0,
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 6,
                                            flexShrink: isTwoColumn ? 1 : 0,
                                            minWidth: isTwoColumn ? 0 : undefined,
                                            maxWidth: isTwoColumn ? "100%" : undefined,
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.name,
                                                { fontSize: xs ? 20 : sm ? 22 : 26 }
                                            ]}
                                            numberOfLines={isTwoColumn ? 1 : 2}
                                        >
                                            {influencer.name}
                                        </Text>
                                        {influencer.isKYCDone && (
                                            <MaterialIcons
                                                name="verified"
                                                size={24}
                                                color={ACCENT.blue}
                                            />
                                        )}
                                    </View>
                                    {actionButtonNode ? (
                                        <View
                                            style={{
                                                width: isTwoColumn ? "auto" : "100%",
                                                alignItems: "flex-start",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {actionButtonNode}
                                        </View>
                                    ) : null}
                                </View>
                            </View>

                            {/* ─── Contact Info Card ─── */}
                            <View style={{
                                marginHorizontal: responsivePaddingHorizontal,
                                marginTop: 16,
                                backgroundColor: cardBg,
                                borderRadius: 16,
                                padding: xs ? 12 : 16,
                                borderWidth: 1,
                                borderColor: cardBorder,
                            }}>
                                {/* Social Link */}
                                <Pressable
                                    style={contactRowStyle}
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
                                    <View style={iconSquareStyle(
                                        primarySocial?.isInstagram ? ACCENT.pink : ACCENT.blue
                                    )}>
                                        <FontAwesomeIcon
                                            icon={
                                                primarySocial?.isInstagram
                                                    ? faInstagram
                                                    : faFacebook
                                            }
                                            size={15}
                                            color={primarySocial?.isInstagram ? ACCENT.pink : ACCENT.blue}
                                        />
                                    </View>
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

                                {/* Email */}
                                {influencer?.email && (
                                    <Pressable
                                        style={contactRowStyle}
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
                                        <View style={iconSquareStyle(ACCENT.amber)}>
                                            <FontAwesomeIcon
                                                icon={faEnvelope}
                                                size={14}
                                                color={ACCENT.amber}
                                            />
                                        </View>
                                        <Text style={styles.subTextHeading}>
                                            {isEmailMasked || isOnFreePlan || lockProfile
                                                ? maskEmail(influencer?.email)
                                                : influencer?.email}
                                        </Text>
                                    </Pressable>
                                )}

                                {/* Phone */}
                                {influencer?.phoneNumber && (
                                    <Pressable
                                        style={contactRowStyle}
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
                                        <View style={iconSquareStyle(ACCENT.emerald)}>
                                            <FontAwesomeIcon
                                                icon={faPhone}
                                                size={14}
                                                color={ACCENT.emerald}
                                            />
                                        </View>
                                        <Text style={styles.subTextHeading}>
                                            {isPhoneMasked || isOnFreePlan || lockProfile
                                                ? maskPhone(influencer?.phoneNumber)
                                                : influencer?.phoneNumber}
                                        </Text>
                                    </Pressable>
                                )}

                                {/* Time Commitment */}
                                {influencer?.profile?.timeCommitment && (
                                    <View style={contactRowStyle}>
                                        <View style={iconSquareStyle(ACCENT.teal)}>
                                            <FontAwesomeIcon
                                                icon={faClock}
                                                size={14}
                                                color={ACCENT.teal}
                                            />
                                        </View>
                                        <Text style={styles.subTextHeading}>
                                            {influencer?.profile?.timeCommitment}
                                        </Text>
                                    </View>
                                )}

                                {/* Location */}
                                {influencer?.location && (
                                    <View style={contactRowStyle}>
                                        <View style={iconSquareStyle(ACCENT.sky)}>
                                            <FontAwesomeIcon
                                                icon={faLocation}
                                                size={14}
                                                color={ACCENT.sky}
                                            />
                                        </View>
                                        <Text style={styles.subTextHeading}>
                                            {influencer?.location}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* ─── Badges (Gender, Verified) - Niches shown in actionCard/TrendlyAnalyticsEmbed ─── */}
                            {showTrendlyChips && (
                                <View style={{
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    gap: 8,
                                    paddingHorizontal: responsivePaddingHorizontal,
                                    marginTop: 16,
                                }}>
                                    {showGenderChip && (
                                        <View style={{
                                            backgroundColor: tintBg(ACCENT.purple, isDark ? 0.2 : 0.1),
                                            borderRadius: 20,
                                            paddingVertical: 7,
                                            paddingHorizontal: 14,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 6,
                                        }}>
                                            <FontAwesomeIcon icon={faUser} size={12} color={ACCENT.purple} />
                                            <Text style={{ fontSize: 13, fontWeight: "600", color: ACCENT.purple }}>
                                                {trendlyGender}
                                            </Text>
                                        </View>
                                    )}
                                    {showVerifiedChip && (
                                        <View style={{
                                            backgroundColor: tintBg(ACCENT.emerald, isDark ? 0.2 : 0.1),
                                            borderRadius: 20,
                                            paddingVertical: 7,
                                            paddingHorizontal: 14,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 6,
                                        }}>
                                            <FontAwesomeIcon icon={faCheck} size={12} color={ACCENT.emerald} />
                                            <Text style={{ fontSize: 13, fontWeight: "600", color: ACCENT.emerald }}>
                                                Verified
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}

                            {/* ─── Action Card (Analytics Embed, etc.) ─── */}
                            <View style={{ marginTop: 16 }}>
                                {actionCard}
                            </View>

                            {/* ─── About Sections ─── */}
                            <View style={{ marginTop: 8 }}>
                                {renderAboutSection("About Me", influencer?.profile?.content?.about)}
                                {renderAboutSection(
                                    "Social Media Highlight",
                                    influencer?.profile?.content?.socialMediaHighlight
                                )}
                                {showCampaignGoals && renderAboutSection(
                                    "Campaign Goals",
                                    influencer?.profile?.content?.collaborationGoals
                                )}
                                {showInfluencerGoals && renderAboutSection(
                                    "Influencer Connection Goals",
                                    influencer?.profile?.content?.influencerConectionGoals
                                )}
                                {renderAboutSection(
                                    "Audience Insights",
                                    influencer?.profile?.content?.audienceInsights
                                )}
                                {renderAboutSection(
                                    "Fun Fact",
                                    influencer?.profile?.content?.funFactAboutUser
                                )}

                                {/* Posts */}
                                {loadingPosts ? (
                                    <ActivityIndicator
                                        size="large"
                                        color={colors.primary}
                                    />
                                ) : posts.length > 0 ? (
                                    <View style={{
                                        marginHorizontal: responsivePaddingHorizontal,
                                        marginBottom: 16,
                                        backgroundColor: cardBg,
                                        borderRadius: 16,
                                        padding: 18,
                                        borderWidth: 1,
                                        borderColor: cardBorder,
                                    }}>
                                        <Text style={{
                                            fontSize: 13,
                                            fontWeight: "700",
                                            color: colors.primary,
                                            marginBottom: 14,
                                            letterSpacing: 0.8,
                                            textTransform: "uppercase" as const,
                                        }}>
                                            {influencer.name}'s{" "}
                                            {isInstagram ? "Instagram" : "Facebook"} Posts
                                        </Text>

                                        <ScrollView
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                        >
                                            <View style={{ flexDirection: "column", gap: 10 }}>
                                                <View
                                                    style={{ flexDirection: "row" }}
                                                >
                                                    {posts &&
                                                        posts
                                                            .filter((_, index) => index % 2 === 0)
                                                            .map((item: any, index) => (
                                                                <Pressable
                                                                    key={`top-${index}`}
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
                                                                        style={{
                                                                            width: 120,
                                                                            height: 120,
                                                                            borderRadius: 14,
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
                                                                    key={`bottom-${index}`}
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
                                                                        style={{
                                                                            width: 120,
                                                                            height: 120,
                                                                            borderRadius: 14,
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
                            padding: responsivePaddingHorizontal,
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
                        backgroundColor: colors.background,
                        borderTopWidth: 1,
                        borderTopColor: colors.border,
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        elevation: 5,
                        shadowColor: "#000",
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
