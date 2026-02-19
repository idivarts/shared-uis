import Colors from "@/shared-uis/constants/Colors";
import { StyleSheet } from "react-native";

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
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
        },
        profileInfo: {
            flex: 1,
        },
        name: {
            fontSize: 24,
            fontWeight: "700",
            color: Colors(theme).text,
            letterSpacing: 0.3,
        },
        subText: {
            color: Colors(theme).text,
            marginVertical: 2,
            fontSize: 16,
        },
        subTextHeading: {
            color: Colors(theme).text,
            fontSize: 15,
            fontWeight: "400",
        },
        row: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
        },
        icon: {
            marginRight: 10,
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
            borderBottomColor: Colors(theme).border,
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginVertical: 16,
        },
        dividerCard: {
            borderBottomColor: Colors(theme).border,
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginVertical: 10,
            marginHorizontal: 20,
        },
        cardColor: {
            color: Colors(theme).text,
            fontSize: 18,
            fontWeight: "600",
        },
        chipContainer: {
            flexDirection: "row",
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 4,
            flexWrap: "wrap",
            gap: 8,
        },
        chip: {
            marginRight: 0,
            marginBottom: 0,
        },
        aboutContainer: {
            marginBottom: 24,
            paddingTop: 8,
        },
        aboutCard: {
            marginHorizontal: 20,
            marginVertical: 12,
            padding: 16,
            borderRadius: 12,
            backgroundColor: theme.dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
            borderWidth: 1,
            borderColor: theme.dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
        },
        contactCard: {
            marginHorizontal: 20,
            marginTop: 16,
            marginBottom: 8,
            padding: 16,
            borderRadius: 12,
            backgroundColor: theme.dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
            borderWidth: 1,
            borderColor: theme.dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
        },
        sectionLabel: {
            fontSize: 12,
            fontWeight: "600",
            color: Colors(theme).primary,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 12,
        },
        stickyBottom: {
            position: "absolute",
            bottom: 0,
            width: "100%",
            backgroundColor: Colors(theme).background,
            borderTopWidth: 1,
            borderTopColor: Colors(theme).border,
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