import { Attachment } from "@/shared-libs/firestore/trendly-pro/constants/attachment";
import { ISocials } from "@/shared-libs/firestore/trendly-pro/models/socials";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { AuthApp } from "@/shared-libs/utils/firebase/auth";
import { FirestoreDB } from "@/shared-libs/utils/firebase/firestore";
import useBreakpoints from "@/shared-libs/utils/use-breakpoints";
import AssetPreviewModal from "@/shared-uis/components/carousel/asset-preview-modal";
import Carousel from "@/shared-uis/components/carousel/carousel";
import { MediaItem } from "@/shared-uis/components/carousel/render-media-item";
import { stylesFn } from "@/shared-uis/styles/InfluencerCard.styles";
import { processRawAttachment } from "@/shared-uis/utils/attachments";
import { truncateText } from "@/shared-uis/utils/text";
import { imageUrl } from "@/shared-uis/utils/url";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { collection, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    ViewStyle,
} from "react-native";
import { Avatar, Chip } from "react-native-paper";
import Colors from "../constants/Colors";
import { maskHandle, maskName } from "../utils/masks";
import { MAX_WIDTH_WEB } from "./carousel/carousel-util";
import { InfluencerMetrics } from "./influencers/influencer-metrics";
import { View } from "./theme/Themed";

type User = IUsers & { id?: string };
interface InfluencerCardPropsType {
    influencer: User;
    customAttachments?: Attachment[];
    customText?: string;
    customTaxonomies?: string[];
    openProfile?: (influencer: User) => void;
    setSelectedInfluencer?: React.Dispatch<React.SetStateAction<User | null>>;
    ToggleModal?: () => void;
    type: string;
    cardActionNode?: any;
    footerNode?: any;
    topHeaderNode?: any;
    style?: StyleProp<ViewStyle>;
    xl?: boolean;
    isOnFreePlan?: boolean;
    lockProfile?: boolean;
    fullHeight?: boolean;
}

const InfluencerCard = (props: InfluencerCardPropsType) => {
    const startX = useRef(0);
    const startY = useRef(0);

    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState(false);
    const [socialHandle, setSocialHandle] = useState("");

    const influencer = props.influencer;
    const type = props.type;
    const theme = useTheme();
    const colors = Colors(theme);
    const styles = stylesFn(theme);
    const layoutStyles = React.useMemo(
        () =>
            StyleSheet.create({
                cardNotFullHeight: {
                    borderRadius: 20,
                    borderColor: colors.border,
                    borderWidth: 1,
                    shadowColor: colors.text,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                },
                cardInner: {
                    maxWidth: MAX_WIDTH_WEB,
                    alignSelf: "center",
                    overflow: "hidden",
                    backgroundColor: colors.background,
                },
                fullHeight: { height: "100%" },
                headerRow: {
                    gap: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                },
                nameRow: {
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                },
                ellipsisButton: { padding: 6 },
                cardActionWrap: { paddingVertical: 16 },
                aboutText: {
                    color: colors.text,
                    fontSize: 16,
                    lineHeight: 22,
                },
                taxonomiesRow: {
                    flexDirection: "row",
                    marginTop: 10,
                    flexWrap: "wrap",
                    rowGap: 10,
                    gap: 8,
                },
                chip: { backgroundColor: colors.primary },
                chipText: { color: colors.white },
            }),
        [colors]
    );
    const [socials, setSocials] = useState<ISocials | undefined>(undefined);

    const [images, setImages] = useState(
        (props.customAttachments || influencer.profile?.attachments)?.map(
            (attachment) => processRawAttachment(attachment)
        ) || []
    );

    const [bodyHeight, setBodyHeight] = useState<number>(0);

    useEffect(() => {
        let mImg = [];
        if (!props.customAttachments) {
            mImg = props.influencer.profile?.attachments?.map((attachment) =>
                processRawAttachment(attachment)
            ) || [];
            // if (
            //     socials &&
            //     socials.socialScreenShots &&
            //     socials.socialScreenShots.length > 0
            // ) {
            //     const sdata = socials.socialScreenShots?.map((s) => ({
            //         type: "image",
            //         url:
            //             props.isOnFreePlan || props.lockProfile
            //                 ? SOCIAL_ACCESS_RESTRICTED
            //                 : s,
            //     }));
            //     mImg.push(...sdata);
            // }
        } else {
            mImg =
                props.customAttachments.map((attachment) =>
                    processRawAttachment(attachment)
                ) || [];
        }
        setImages([...mImg]);
    }, [props.customAttachments, props.influencer, socials]);

    const getSocial = async () => {
        if (influencer.primarySocial) {
            const socialCol = collection(
                FirestoreDB,
                "users",
                influencer.id || AuthApp.currentUser?.uid || "",
                "socials"
            );
            const socialData = await getDoc(doc(socialCol, influencer.primarySocial));
            const social = socialData.data() as ISocials;
            setSocialHandle(
                social.instaProfile?.username || social.fbProfile?.name || ""
            );
            setSocials(social);
        }
    };
    useEffect(() => {
        getSocial();
    }, []);

    const { width: screenWidth } = useBreakpoints();

    const onImagePress = (data: MediaItem) => {
        setPreviewImageUrl(data.url);
        setPreviewImage(true);
    };

    return (
        <>
            <View
                style={[
                    styles.card,
                    props.style,
                    props.fullHeight
                        ? layoutStyles.fullHeight
                        : layoutStyles.cardNotFullHeight,
                    layoutStyles.cardInner,
                ]}
            >
                <View style={[styles.header]}>
                    <View>
                        {props.topHeaderNode}
                        <View style={layoutStyles.headerRow}>
                            <Pressable
                                onPressIn={(e) => {
                                    startX.current = e.nativeEvent.pageX;
                                    startY.current = e.nativeEvent.pageY;
                                }}
                                onPressOut={(e) => {
                                    const dx = Math.abs(e.nativeEvent.pageX - startX.current);
                                    const dy = Math.abs(e.nativeEvent.pageY - startY.current);
                                    if (dx < 5 && dy < 5 && props.openProfile) {
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
                                onPressIn={(e) => {
                                    startX.current = e.nativeEvent.pageX;
                                    startY.current = e.nativeEvent.pageY;
                                }}
                                onPressOut={(e) => {
                                    const dx = Math.abs(e.nativeEvent.pageX - startX.current);
                                    const dy = Math.abs(e.nativeEvent.pageY - startY.current);
                                    if (dx < 5 && dy < 5 && props.openProfile) {
                                        props.openProfile(influencer);
                                    }
                                }}
                            >
                                <View style={layoutStyles.nameRow}>
                                    <Text style={styles.name}>
                                        {props.isOnFreePlan || props.lockProfile
                                            ? maskName(influencer.name)
                                            : influencer.name}
                                    </Text>
                                    {influencer.isKYCDone && (
                                        <MaterialIcons name="verified" size={16} color={colors.primary} />
                                    )}
                                </View>
                                {socialHandle && (
                                    <Text style={styles.handle}>
                                        {props.isOnFreePlan || props.lockProfile
                                            ? maskHandle(socialHandle)
                                            : socialHandle}
                                    </Text>
                                )}
                            </Pressable>

                            {props.ToggleModal && (
                                <Pressable
                                    onPress={() => {
                                        props.ToggleModal?.();
                                        if (props?.setSelectedInfluencer) {
                                            props.setSelectedInfluencer(props.influencer);
                                        }
                                    }}
                                    hitSlop={8}
                                    style={layoutStyles.ellipsisButton}
                                    accessibilityRole="button"
                                    testID="influencer-ellipsis"
                                >
                                    <FontAwesomeIcon
                                        icon={faEllipsis}
                                        size={24}
                                        color={Colors(theme).text}
                                    />
                                </Pressable>
                            )}
                        </View>
                    </View>
                </View>

                <View
                    style={[props.fullHeight && styles.body]}
                    onLayout={(event) => {
                        const next = Math.round(event.nativeEvent.layout.height);
                        setBodyHeight((prev) => (prev === next ? prev : next));
                    }}
                >
                    <Carousel
                        data={images}
                        onImagePress={onImagePress}
                        theme={theme}
                        parentId={influencer.id}
                        containerHeight={bodyHeight > 0 ? bodyHeight : undefined}
                    />
                </View>

                <View style={styles.content}>
                    <Pressable
                        onPressIn={(e) => {
                            startX.current = e.nativeEvent.pageX;
                            startY.current = e.nativeEvent.pageY;
                        }}
                        onPressOut={(e) => {
                            const dx = Math.abs(e.nativeEvent.pageX - startX.current);
                            const dy = Math.abs(e.nativeEvent.pageY - startY.current);
                            if (dx < 5 && dy < 5 && props.openProfile) {
                                props.openProfile(influencer);
                            }
                        }}
                    >
                        <InfluencerMetrics user={influencer} social={socials} />
                        {props.cardActionNode && (
                            <View style={layoutStyles.cardActionWrap}>
                                {props.cardActionNode}
                            </View>
                        )}
                        {(props.customText || influencer?.profile?.content?.about) &&
                            type != "influencers" && (
                                <Text
                                    style={layoutStyles.aboutText}
                                >
                                    {props.customText
                                        ? props.customText
                                        : truncateText(
                                            influencer?.profile?.content?.about as string,
                                            80
                                        )}
                                </Text>
                            )}
                        {props.customTaxonomies && props.customTaxonomies.length > 0 && (
                            <View style={layoutStyles.taxonomiesRow}>
                                {props.customTaxonomies.map((tag, index) => (
                                    <Chip style={layoutStyles.chip}>
                                        <Text style={layoutStyles.chipText}>{tag}</Text>
                                    </Chip>
                                ))}
                            </View>
                        )}
                        {type == "influencers" && (
                            <Text
                                style={layoutStyles.aboutText}
                            >
                                {truncateText(
                                    (influencer?.profile?.content?.influencerConectionGoals
                                        ? influencer?.profile?.content?.influencerConectionGoals
                                        : influencer?.profile?.content?.about) as string,
                                    80
                                )}
                            </Text>
                        )}
                    </Pressable>
                    {props.footerNode}
                </View>
            </View>

            {previewImage && (
                <AssetPreviewModal
                    previewImage={previewImage}
                    setPreviewImage={setPreviewImage}
                    previewImageUrl={previewImageUrl}
                    theme={theme}
                />
            )}
        </>
    );
};

export default InfluencerCard;
