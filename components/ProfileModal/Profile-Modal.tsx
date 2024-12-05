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

interface ProfileBottomSheetProps {
  influencer: IUsers;
  theme: any;
  isBrandsApp: boolean;
}

const ProfileBottomSheet: React.FC<ProfileBottomSheetProps> = ({
  influencer,
  theme,
  isBrandsApp,
}) => {
  const interests = influencer.profile?.category || [];
  const aboutMe = influencer.profile?.content?.about || "";
  const socialMediaHighlight =
    influencer.profile?.content?.socialMediaHighlight || "";
  const collaborationGoals =
    influencer.profile?.content?.collaborationGoals || "";
  const audienceInsights = influencer.profile?.content?.audienceInsights || "";
  const funFactAboutYou = influencer.profile?.content?.funFactAboutUser || "";
  const profileImages = influencer.profile?.attachments || [];
  const styles = stylesFn(theme);
  const swiperRef = React.useRef<Swiper>(null);

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
          {profileImages &&
            profileImages.map((media, index) => (
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
          {/* <Text style={styles.subText}>Insta: {influencer.socials}</Text> */}
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
        {interests &&
          interests.map((interest, index) => (
            <Chip key={index} style={styles.chip} mode="outlined">
              {interest}
            </Chip>
          ))}
      </View>

      <View style={styles.aboutContainer}>
        <Card style={styles.aboutCard}>
          <Card.Content>
            <Title>About Me</Title>
            <Paragraph>{aboutMe}</Paragraph>
          </Card.Content>
        </Card>
        <Card style={styles.aboutCard}>
          <Card.Content>
            <Title>Social Media Highlight</Title>
            <Paragraph>{socialMediaHighlight}</Paragraph>
          </Card.Content>
        </Card>
        <Card style={styles.aboutCard}>
          <Card.Content>
            <Title>Campaign Goals</Title>
            <Paragraph>{collaborationGoals}</Paragraph>
          </Card.Content>
        </Card>
        <Card style={styles.aboutCard}>
          <Card.Content>
            <Title>Audience Insights</Title>
            <Paragraph>{audienceInsights}</Paragraph>
          </Card.Content>
        </Card>
        <Card style={styles.aboutCard}>
          <Card.Content>
            <Title>Fun Fact About You</Title>
            <Paragraph>{funFactAboutYou}</Paragraph>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
};

export default ProfileBottomSheet;
