import React from "react";
import { View, Dimensions, ScrollView } from "react-native";
import { Text, Chip, Card, Title } from "react-native-paper";
import Swiper from "react-native-swiper";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { stylesFn } from "@/shared-uis/styles/profile-modal/ProfileModal.styles";
import Colors from "@/shared-uis/constants/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import RenderMediaItem from "../carousel/render-media-item";
import { Theme } from "@react-navigation/native";
import { processRawAttachment } from "@/shared-uis/utils/attachments";
import RenderHTML from "react-native-render-html";
import { Image, Pressable } from "react-native";

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

  const mediaProcessing = influencer?.profile?.attachments?.map((media) =>
    processRawAttachment(media)
  );

  const screenWidth = Dimensions.get("window").width;

  return (
    <ScrollView style={styles.container}>
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
                handleImagePress={() => { }}
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
              borderRadius: 20,
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
          <Title style={styles.name}>{influencer?.name}</Title>
          <Text style={styles.subText}>Email: {influencer?.email}</Text>
          <Text style={styles.subText}>Phone: {influencer?.phoneNumber}</Text>
          <View style={styles.divider} />
          <Text style={styles.subText}>Reach: {influencer?.backend?.reach}</Text>
          <Text style={styles.subText}>
            Engagement: {influencer?.backend?.engagement}
          </Text>
          <Text style={styles.subText}>
            Rating: {influencer?.backend?.rating}
          </Text>
        </View>
      </View>

      <View style={styles.chipContainer}>
        {influencer?.profile?.category &&
          influencer?.profile?.category.map((interest, index) => (
            <Chip key={index} style={styles.chip} mode="outlined">
              {interest}
            </Chip>
          ))}
      </View>

      <View style={styles.aboutContainer}>
        <Card style={styles.aboutCard}>
          <Card.Content>
            <Title style={styles.cardColor}>About Me</Title>
            <RenderHTML
              contentWidth={screenWidth}
              source={{
                html:
                  influencer?.profile?.content?.about ||
                  "<p>No content available.</p>",
              }}
              tagsStyles={{
                p: { color: Colors(theme).text, fontSize: 16 },
              }}
            />
          </Card.Content>
        </Card>
        <Card style={styles.aboutCard}>
          <Card.Content>
            <Title style={styles.cardColor}>Social Media Highlight</Title>
            <RenderHTML
              contentWidth={screenWidth}
              source={{
                html:
                  influencer?.profile?.content?.socialMediaHighlight ||
                  "<p>No content available.</p>",
              }}
              tagsStyles={{
                p: { color: Colors(theme).text, fontSize: 16 },
              }}
            />
          </Card.Content>
        </Card>
        <Card style={styles.aboutCard}>
          <Card.Content>
            <Title style={styles.cardColor}>Campaign Goals</Title>
            <RenderHTML
              contentWidth={screenWidth}
              source={{
                html:
                  influencer?.profile?.content?.collaborationGoals ||
                  "<p>No content available.</p>",
              }}
              tagsStyles={{
                p: { color: Colors(theme).text, fontSize: 16 },
              }}
            />
          </Card.Content>
        </Card>
        <Card style={styles.aboutCard}>
          <Card.Content>
            <Title style={styles.cardColor}>Audience Insights</Title>
            <RenderHTML
              contentWidth={screenWidth}
              source={{
                html:
                  influencer?.profile?.content?.audienceInsights ||
                  "<p>No content available.</p>",
              }}
              tagsStyles={{
                p: { color: Colors(theme).text, fontSize: 16 },
              }}
            />
          </Card.Content>
        </Card>
        <Card style={styles.aboutCard}>
          <Card.Content>
            <Title style={styles.cardColor}>Fun Fact About You</Title>
            <RenderHTML
              contentWidth={screenWidth}
              source={{
                html:
                  influencer?.profile?.content?.funFactAboutUser ||
                  "<p>No content available.</p>",
              }}
              tagsStyles={{
                p: { color: Colors(theme).text, fontSize: 16 },
              }}
            />
          </Card.Content>
        </Card>
        <Card style={styles.aboutCard}>
          <Card.Content>
            <Title style={styles.cardColor}>Other Instagram Posts</Title>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: "column" }}>
                <View style={{ flexDirection: "row", marginBottom: 10 }}>
                  {mediaProcessing &&
                    mediaProcessing
                      .filter((_, index) => index % 2 === 0)
                      .map((item, index) => (
                        <Image
                          key={`top-${index}`}
                          source={{ uri: item.url }}
                          style={{
                            width: 100,
                            height: 100,
                            borderRadius: 10,
                            marginRight: 10,
                          }}
                        />
                      ))}
                </View>
                <View style={{ flexDirection: "row" }}>
                  {mediaProcessing &&
                    mediaProcessing
                      .filter((_, index) => index % 2 !== 0)
                      .map((item, index) => (
                        <Image
                          key={`bottom-${index}`}
                          source={{ uri: item.url }}
                          style={{
                            width: 100,
                            height: 100,
                            borderRadius: 10,
                            marginRight: 10,
                          }}
                        />
                      ))}
                </View>
              </View>
            </ScrollView>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

export default ProfileBottomSheet;
