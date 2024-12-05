import React from "react";
import { View, Pressable } from "react-native";
import { Text, Chip, Card, Title, Paragraph } from "react-native-paper";
import Swiper from "react-native-swiper";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { stylesFn } from "@/shared-uis/styles/profile-modal/ProfileModal.styles";
import Colors from "@/shared-uis/constants/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import RenderMediaItem from "../carousel/render-media-item";
import { Theme, useTheme } from "@react-navigation/native";
import { processRawAttachment } from "@/shared-uis/utils/attachments";

interface ProfileBottomSheetProps {
  influencer: IUsers;
  theme: Theme;
  isBrandsApp: boolean;
}

const ProfileBottomSheet: React.FC<ProfileBottomSheetProps> = ({
  influencer,
  theme,
  isBrandsApp,
}) => {
  const styles = stylesFn(theme);
  const swiperRef = React.useRef<Swiper>(null);

  const mediaProcessing = influencer.profile?.attachments?.map((media) =>
    processRawAttachment(media)
  );

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <Swiper
          style={styles.carousel}
          ref={swiperRef}
          showsButtons={false}
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}
          loop={true}
          autoplay={true}
          removeClippedSubviews={false}
          paginationStyle={styles.pagination}
        >
          {mediaProcessing &&
            mediaProcessing.map((media, index) => (
              <RenderMediaItem
                key={index}
                item={media}
                index={index}
                handleImagePress={() => {}}
              />
            ))}
        </Swiper>
        {isBrandsApp && (
          <Pressable
            style={{
              position: "absolute",
              bottom: 20,
              right: 20,
              zIndex: 10,
              backgroundColor: Colors(theme).primary,
              padding: 10,
              borderRadius: 50,
            }}
          >
            <FontAwesomeIcon
              icon={faMessage}
              size={24}
              color={Colors(theme).white}
            />
          </Pressable>
        )}
      </View>

      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Title style={styles.name}>{influencer.name}</Title>
          <Text style={styles.subText}>Email: {influencer.email}</Text>
          <Text style={styles.subText}>Phone: {influencer.phoneNumber}</Text>
          <View style={styles.divider} />
          <Text style={styles.subText}>Reach: {influencer.backend?.reach}</Text>
          <Text style={styles.subText}>
            Engagement: {influencer.backend?.engagement}
          </Text>
          <Text style={styles.subText}>
            Rating: {influencer.backend?.rating}
          </Text>
        </View>
      </View>

      <View style={styles.chipContainer}>
        {influencer.profile?.category &&
          influencer.profile?.category.map((interest, index) => (
            <Chip key={index} style={styles.chip} mode="outlined">
              {interest}
            </Chip>
          ))}
      </View>

      <View style={styles.aboutContainer}>
        <Card style={styles.aboutCard}>
          <Card.Content>
            <Title style={styles.cardColor}>About Me</Title>
            <Paragraph style={styles.cardColor}>
              {influencer.profile?.content?.about || ""}
            </Paragraph>
          </Card.Content>
        </Card>
        <Card style={styles.aboutCard}>
          <Card.Content>
            <Title style={styles.cardColor}>Social Media Highlight</Title>
            <Paragraph style={styles.cardColor}>
              {influencer.profile?.content?.socialMediaHighlight || ""}
            </Paragraph>
          </Card.Content>
        </Card>
        <Card style={styles.aboutCard}>
          <Card.Content>
            <Title style={styles.cardColor}>Campaign Goals</Title>
            <Paragraph style={styles.cardColor}>
              {influencer.profile?.content?.collaborationGoals || ""}
            </Paragraph>
          </Card.Content>
        </Card>
        <Card style={styles.aboutCard}>
          <Card.Content>
            <Title style={styles.cardColor}>Audience Insights</Title>
            <Paragraph style={styles.cardColor}>
              {influencer.profile?.content?.audienceInsights || ""}
            </Paragraph>
          </Card.Content>
        </Card>
        <Card style={styles.aboutCard}>
          <Card.Content>
            <Title style={styles.cardColor}>Fun Fact About You</Title>
            <Paragraph style={styles.cardColor}>
              {influencer.profile?.content?.funFactAboutUser || ""}
            </Paragraph>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
};

export default ProfileBottomSheet;
