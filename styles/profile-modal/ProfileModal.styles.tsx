import Colors from "@/shared-uis/constants/Colors";
import { Dimensions, StyleSheet } from "react-native";

export const stylesFn = (theme: any) =>
  StyleSheet.create({
    container: {
      height: "80%",
      backgroundColor: Colors(theme).background,
    },
    contentContainer: {
      flexGrow: 1,
    },
    carouselContainer: {
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
      paddingTop: 0,
      flexDirection: "row",
      alignItems: "center",
    },
    profileInfo: {
      flex: 1,
    },
    name: {
      fontSize: 26,
      fontWeight: "bold",
      color: Colors(theme).text,
      marginBottom: 5,
    },
    subText: {
      color: Colors(theme).text,
      marginVertical: 2,
      fontSize: 16,
    },
    subTextHeading: {
      color: Colors(theme).text,
      fontSize: 20,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    icon: {
      marginRight: 8,
      color: Colors(theme).primary,
    },
    statItem: {
      flex: 1,
      alignItems: "center",
      flexDirection: "row",
    },
    statsText: {
      color: Colors(theme).text,
      fontSize: 16,
    },
    divider: {
      borderBottomColor: "black",
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginVertical: 10,
    },
    dividerCard: {
      borderBottomColor: "black",
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginVertical: 10,
      marginHorizontal: 20,
    },
    cardColor: {
      color: Colors(theme).text,
      fontSize: 20,
      fontWeight: "bold",
    },
    chipContainer: {
      flexDirection: "row",
      paddingHorizontal: 20,
      flexWrap: "wrap",
    },
    chip: {
      marginRight: 10,
      marginBottom: 10,
    },
    aboutContainer: {
      marginBottom: 10,
    },
    aboutCard: {
      marginHorizontal: 20,
      marginVertical: 10,
      backgroundColor: Colors(theme).background,
    },
    stickyBottom: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      backgroundColor: "#fff",
      borderTopWidth: 1,
      borderTopColor: "#ccc",
      padding: 10,
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
