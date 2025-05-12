import { IUsers } from "@/shared-libs/firestore/trendly-pro/models/users";
import Colors from "@/shared-uis/constants/Colors";
import { convertToKUnits } from "@/shared-uis/utils/conversion";
import {
  faChartLine,
  faFaceSmile,
  faPeopleRoof,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "../theme/Themed";

type CardActionsProps = {
  user: Partial<IUsers> & { id?: string }
  action?: React.ReactNode;
};

export const InfluencerMetrics = ({ user, action = null }: CardActionsProps) => {
  const metrics = {
    followers: user.backend?.followers || 0,
    reach: user.backend?.reach || 0,
    rating: user.backend?.rating || 0,
  };
  const theme = useTheme();

  if (!metrics.followers && !metrics.rating && !metrics.rating) {
    return null
  }

  return (
    <View style={styles.container}>
      <View style={styles.metrics}>
        {!!metrics.followers &&
          <View style={styles.metric}>
            <FontAwesomeIcon
              icon={faPeopleRoof}
              color={Colors(theme).primary}
              size={16}
            />
            <Text style={styles.metricText}>
              {convertToKUnits(metrics.followers)}
            </Text>
          </View>}
        {!!metrics.reach &&
          <View style={styles.metric}>
            <FontAwesomeIcon
              icon={faChartLine}
              color={Colors(theme).primary}
              size={16}
            />
            <Text style={styles.metricText}>
              {convertToKUnits(metrics.reach)}
            </Text>
          </View>}
        {!!metrics.rating &&
          <View style={styles.metric}>
            <FontAwesomeIcon
              icon={faFaceSmile}
              color={Colors(theme).primary}
              size={16}
            />
            <Text style={styles.metricText}>
              {convertToKUnits(metrics.rating)}
            </Text>
          </View>}
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
    paddingHorizontal: 16,
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
    marginRight: 16,
  },
  metricText: {
    marginLeft: 4,
    fontSize: 14,
  },
});
