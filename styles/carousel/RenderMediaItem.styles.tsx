import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

export const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    media: {
      alignSelf: "center",
    },
    loadingIndicatorContainer: {
      position: "absolute",
      marginTop: 100,
      // justifyContent: "center",
      alignSelf: "center",
    },
  });
