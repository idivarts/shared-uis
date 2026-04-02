import Colors from "@/shared-uis/constants/Colors";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faStarHalfStroke, faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@react-navigation/native";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

import { Text, View } from "../theme/Themed";

interface RatingSectionProps {
    feedbacks: {
        ratings?: number;
        review?: string;
    }[];
}

export const qualityScoreToStars = (qualityScore: number): number =>
    Math.round((qualityScore / 2) * 2) / 2;

const starsRowStyle = StyleSheet.create({
    row: { flexDirection: 'row', backgroundColor: 'transparent' },
}).row;

const sectionStyles = StyleSheet.create({
    section: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
        backgroundColor: 'transparent',
    },
    ratingText: { fontSize: 14, fontWeight: '500' },
});

export const Stars: React.FC<{
    rating: number;
    size?: number;
}> = ({
    rating,
    size = 20,
}) => {
        const theme = useTheme();
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 > 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <View style={starsRowStyle}>
                {
                    Array.from({ length: fullStars }, (_, i) => (
                        <FontAwesomeIcon
                            key={i}
                            icon={faStarSolid}
                            size={size}
                            color={Colors(theme).yellow}
                        />
                    ))
                }
                {
                    halfStar && (
                        <FontAwesomeIcon
                            icon={faStarHalfStroke}
                            size={size}
                            color={Colors(theme).yellow}
                        />
                    )
                }
                {
                    Array.from({ length: emptyStars }, (_, i) => (
                        <FontAwesomeIcon
                            key={i}
                            icon={faStar}
                            size={size}
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
        return feedbacks.map((feedback) => feedback.review);
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
            <View style={sectionStyles.section}>
                <Stars rating={avgRatings} />
                <Text style={sectionStyles.ratingText}>
                    {formattedAvgRatingsText(avgRatings)}
                </Text>
                {calculateReviews().length > 0 && (
                    <Text style={sectionStyles.ratingText}>
                        ({calculateReviews().length} Review{calculateReviews().length > 1 ? 's' : ''})
                    </Text>
                )}
            </View>
        );
    };

    return null;
};

export default RatingSection;
