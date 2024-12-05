import Colors from "@/shared-uis/constants/Colors";
import { Dimensions, StyleSheet } from "react-native";

export const stylesFn = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors(theme).background,
    },
    contentContainer: {
      flexGrow: 1,
    },
    carouselContainer: {
      height: Dimensions.get("window").height * 0.4,
      backgroundColor: Colors(theme).background,
    },
    carousel: {},
    slide: {
      flex: 1,
    },
    profileImage: {
      width: "100%",
      height: "100%",
    },
    pagination: {
      bottom: 20,
    },
    header: {
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
    },
    profileInfo: {
      flex: 1,
    },
    name: {
      fontSize: 24,
      fontWeight: "bold",
      color: Colors(theme).text,
    },
    subText: {
      color: Colors(theme).text,
      marginVertical: 2,
    },
    divider: {
      borderBottomColor: "black",
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginVertical: 10,
    },
    cardColor: {
      color: Colors(theme).text,
    },
    chipContainer: {
      flexDirection: "row",
      padding: 20,
      flexWrap: "wrap",
    },
    chip: {
      marginRight: 10,
      marginBottom: 10,
    },
    aboutContainer: {
      marginVertical: 10,
    },
    aboutCard: {
      marginHorizontal: 20,
      marginVertical: 10,
      backgroundColor: Colors(theme).card,
    },
    dot: {
      backgroundColor: Colors(theme).primary,
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: 3,
      marginRight: 3,
    },
    activeDot: {
      backgroundColor: Colors(theme).gray100,
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: 3,
      marginRight: 3,
    },
  });
