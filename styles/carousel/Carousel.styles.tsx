import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import { Platform } from "react-native";

export const stylesFn = (theme: Theme) => StyleSheet.create({
  carouselContainer: {
    backgroundColor: Colors(theme).card,
  },
  pagination: {
    bottom: Platform.OS === 'web' ? -30 : 0,
  },
  buttonWrapper: {
    backgroundColor: Colors(theme).white,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 100,
    backgroundColor: Colors(theme).platinum,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: Colors(theme).primary,
  },
});