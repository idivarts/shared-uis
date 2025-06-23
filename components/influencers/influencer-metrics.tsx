import { ISocials } from "@/shared-libs/firestore/trendly-pro/models/socials";
import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import Colors from "@/shared-uis/constants/Colors";
import { convertToKUnits } from "@/shared-uis/utils/conversion";
import {
  faArrowUpWideShort,
  faChartLine,
  faPeopleRoof
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "../theme/Themed";

type CardActionsProps = {
  user: Partial<IUsers> & { id?: string }
  social?: ISocials
  action?: React.ReactNode;
};

export const InfluencerMetrics = ({ user, social, action = null }: CardActionsProps) => {
  const metrics = {
    followers: user.backend?.followers || 0,
    reach: user.backend?.reach || 0,
    engagement: user.backend?.engagement || 0,
    rating: user.backend?.rating || 0,
  };
  const theme = useTheme();
  const followers = convertToKUnits(metrics.followers) || social?.instaProfile?.approxMetrics?.followers || "";
  const reach = convertToKUnits(metrics.reach) || social?.instaProfile?.approxMetrics?.views || "";
  const interations = convertToKUnits(metrics.engagement) || social?.instaProfile?.approxMetrics?.interactions || "";
  if (!followers && !reach && !metrics.rating) {
    return null
  }

  return (
    <View style={styles.container}>
      <View style={styles.metrics}>
        {!!followers &&
          <View style={styles.metric}>
            <FontAwesomeIcon
              icon={faPeopleRoof}
              color={Colors(theme).primary}
              size={24}
            />
            <View style={styles.metricContent}>
              <Text style={styles.metricText}>{followers}</Text>
              <Text style={styles.metricLabel}>Followers</Text>
            </View>
          </View>}
        {!!reach &&
          <View style={styles.metric}>
            <FontAwesomeIcon
              icon={faChartLine}
              color={Colors(theme).primary}
              size={24}
            />
            <View style={styles.metricContent}>
              <Text style={styles.metricText}>{reach}</Text>
              <Text style={styles.metricLabel}>Reach</Text>
            </View>
          </View>}
        {!!interations &&
          <View style={styles.metric}>
            <FontAwesomeIcon
              icon={faArrowUpWideShort}
              color={Colors(theme).primary}
              size={24}
            />
            <View style={styles.metricContent}>
              <Text style={styles.metricText}>{interations}</Text>
              <Text style={styles.metricLabel}>Interactions</Text>
            </View>
          </View>}
        {/* {!!metrics.rating &&
          <View style={styles.metric}>
            <FontAwesomeIcon
              icon={faFaceSmile}
              color={Colors(theme).primary}
              size={24}
            />
            <View style={styles.metricContent}>
              <Text style={styles.metricText}>{metrics.rating}</Text>
              <Text style={styles.metricLabel}>Rating</Text>
            </View>
          </View>} */}
      </View>
      {action}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 0,
    paddingBottom: 16,
    paddingTop: 16,
  },
  metrics: {
    flexDirection: "row",
    alignItems: "center",
  },
  metric: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  metricContent: {
    marginLeft: 8,
    alignItems: 'flex-start',
  },
  metricLabel: {
    fontSize: 12,
    color: '#888',
    lineHeight: 16,
  },
  metricText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
