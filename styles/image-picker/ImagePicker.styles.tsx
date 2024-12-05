import { StyleSheet } from "react-native";
import Colors from "@/shared-uis/constants/Colors";
import { Theme } from "@react-navigation/native";

const fnStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      position: "relative",
    },
    image: {
      borderRadius: 75,
      width: 100,
      height: 100,
      borderColor: Colors(theme).border,
      borderWidth: 5,
    },
    cameraButton: {
      backgroundColor: Colors(theme).primary,
      borderRadius: 24,
      padding: 8,
      position: "absolute",
      right: 0,
      bottom: 0,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: Colors(theme).backdrop,
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
      gap: 24,
    },
    modalContent: {
      backgroundColor: Colors(theme).background,
      borderRadius: 4,
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
      gap: 24,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "500",
    },
    modalButtons: {
      flexDirection: "row",
      gap: 24,
    },
    modalButton: {
      backgroundColor: Colors(theme).primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 4,
    },
    modalButtonText: {
      color: Colors(theme).white,
    },
  });

export default fnStyles;
