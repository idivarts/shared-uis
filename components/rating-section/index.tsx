import { faStar as faStarSolid, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import Colors from "@/shared-uis/constants/Colors";
import { Text, View } from "../theme/Themed";
import { useMemo } from "react";

interface RatingSectionProps {
  feedbacks: {
    ratings?: number;
    review?: string;
  }[];
}

const Stars: React.FC<{
  rating: number;
}> = ({
  rating,
}) => {
    const theme = useTheme();
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 > 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        {
          Array.from({ length: fullStars }, (_, i) => (
            <FontAwesomeIcon
              key={i}
              icon={faStarSolid}
              size={20}
              color={Colors(theme).yellow}
            />
          ))
        }
        {
          halfStar && (
            <FontAwesomeIcon
              icon={faStarHalfStroke}
              size={20}
              color={Colors(theme).yellow}
            />
          )
        }
        {
          Array.from({ length: emptyStars }, (_, i) => (
            <FontAwesomeIcon
              key={i}
              icon={faStar}
              size={20}
              color={Colors(theme).yellow}
            />
          ))
        }
      </View>
    );

  };

const RatingSection: React.FC<RatingSectionProps> = ({
  feedbacks,
}) => {
  const avgRatings = useMemo(() => {
    const ratings = feedbacks.map((feedback) => feedback.ratings || 0).filter((rating) => rating > 0);
    const sum = ratings.reduce((acc, curr) => acc + curr, 0);

    if (ratings.length === 0) {
      return 0;
    }

    return sum / ratings.length;
  }, [feedbacks]);

  const calculateReviews = () => {
    return feedbacks.filter((feedback) => feedback.review);
  }

  const formattedAvgRatingsText = (
    ratings: number,
  ) => {
    const decimalPart = ratings % 1;
    const wholePart = Math.floor(ratings);

    if (decimalPart >= 0.01 && decimalPart <= 0.99) {
      return wholePart + 0.5;
    } else {
      return wholePart;
    }
  }

  if (avgRatings > 0) {
    return (
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: 8,
          marginBottom: 16,
        }}
      >
        <Stars rating={avgRatings} />
        <Text
          style={{
            fontSize: 14,
            fontWeight: 'medium',
          }}
        >
          {formattedAvgRatingsText(avgRatings)}
        </Text>
        {calculateReviews().length > 0 && (
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'medium',
            }}
          >
            ({calculateReviews().length} Reviews)
          </Text>
        )}
      </View>
    );
  };

  return null;
};

export default RatingSection;
