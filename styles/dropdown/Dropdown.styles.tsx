import Colors from "@/shared-uis/constants/Colors";
import { Theme } from "@react-navigation/native";
import { Platform, StyleSheet } from "react-native";

export const getDropdownStyles = (theme: Theme) => {
    const colors = Colors(theme);
    return StyleSheet.create({
        dropdownContainer: {
            position: "relative",
        },
        dropdownTrigger: {},
        dropdownOptions: {
            position: "absolute",
            zIndex: 3,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: "hidden",
            borderRadius: 5,
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 5,
            marginTop: 4,
            minWidth: 140,
        },
        dropdownOption: {
            alignItems: "center",
            textAlign: "center",
        },
        dropdownButton: {
            padding: 10,
            width: "100%",
            backgroundColor: colors.background,
        },
        dropdownButtonText: {
            color: colors.text,
            fontSize: 16,
            fontWeight: "500",
            textAlign: "center",
        },
        dropdownOverlay: {
            position: "absolute",
            zIndex: 2,
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            width: 4000,
            height: 4000,
            transform: Platform.select({
                web: [{ translateY: "-50%" }, { translateX: "-50%" }],
                default: [],
            }),
        },
        dropdownOverlayVisible: { display: "flex" as const },
        dropdownOverlayHidden: { display: "none" as const },
    dropdownButtonHover: { backgroundColor: colors.tag },
    });
};

export default getDropdownStyles;
