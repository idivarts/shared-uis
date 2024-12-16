import React from "react";
import { View, Dimensions, ScrollView, Text } from "react-native";
import { Chip, Card, Title } from "react-native-paper";
import Swiper from "react-native-swiper";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import { stylesFn } from "@/shared-uis/styles/profile-modal/ProfileModal.styles";
import Colors from "@/shared-uis/constants/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import {
  faChartBar,
  faClock,
  faEnvelope,
  faFaceSmile,
  faMessage,
  faPhone,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
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
          autoplay={false}
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
          <Text style={styles.name}>{influencer?.name}</Text>

          <View style={styles.row}>
            <FontAwesomeIcon
              icon={faInstagram}
              size={16}
              color={Colors(theme).primary}
              style={styles.icon}
            />
            <Text style={styles.subTextHeading}>Instagram: @John.Doe</Text>
          </View>

          {/* Email */}
          {influencer?.email && (
            <View style={styles.row}>
              <FontAwesomeIcon
                icon={faEnvelope}
                size={16}
                color={Colors(theme).primary}
                style={styles.icon}
              />
              <Text style={styles.subTextHeading}>
                Email: {influencer?.email}
              </Text>
            </View>
          )}

          {/* Phone */}
          {influencer?.phoneNumber && (
            <View style={styles.row}>
              <FontAwesomeIcon
                icon={faPhone}
                size={16}
                color={Colors(theme).primary}
                style={styles.icon}
              />
              <Text style={styles.subTextHeading}>
                Phone: {influencer?.phoneNumber}
              </Text>
            </View>
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
                Time Commitment: {influencer?.profile?.timeCommitment}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          {/* Reach */}
          <View style={styles.row}>
            <FontAwesomeIcon
              icon={faUsers}
              size={16}
              color={Colors(theme).primary}
              style={styles.icon}
            />
            <Text style={styles.subTextHeading}>
              Reach: {influencer?.backend?.reach}
            </Text>
          </View>

          {/* Engagement */}
          <View style={styles.row}>
            <FontAwesomeIcon
              icon={faChartBar}
              size={16}
              color={Colors(theme).primary}
              style={styles.icon}
            />
            <Text style={styles.subTextHeading}>
              Engagement: {influencer?.backend?.engagement}
            </Text>
          </View>

          {/* Rating */}
          <View style={styles.row}>
            <FontAwesomeIcon
              icon={faFaceSmile}
              size={16}
              color={Colors(theme).primary}
              style={styles.icon}
            />
            <Text style={styles.subTextHeading}>
              Rating: {influencer?.backend?.rating}
            </Text>
          </View>
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
        {influencer?.profile?.content?.about && (
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
                style: { fontSize: 16, color: Colors(theme).text },
              }}
            />
          </View>
        )}

        {influencer?.profile?.content?.socialMediaHighlight && (
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
                style: { fontSize: 16, color: Colors(theme).text },
              }}
            />
          </View>
        )}
        {influencer?.profile?.content?.collaborationGoals && (
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
                style: { fontSize: 16, color: Colors(theme).text },
              }}
            />
          </View>
        )}
        {influencer?.profile?.content?.audienceInsights && (
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
                style: { fontSize: 16, color: Colors(theme).text },
              }}
            />
          </View>
        )}
        {influencer?.profile?.content?.funFactAboutUser && (
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
                style: { fontSize: 16, color: Colors(theme).text },
              }}
            />
          </View>
        )}
        <View style={styles.aboutCard}>
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
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileBottomSheet;
