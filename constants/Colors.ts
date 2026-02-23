import { Theme } from "@react-navigation/native";



export const ColorsStatic = {
    primary: "rgb(5, 68, 99)",
    secondary: "rgb(83, 139, 166)",

    // Some Default colours
    aliceBlue: "rgb(233, 241, 247)",
    eerieBlack: "rgb(27, 27, 27)",
    gold: "rgb(236, 214, 148)",
    green: "rgb(157, 213, 134)",
    yellow: "rgb(232, 185, 49)",
    yellow100: "rgba(166, 159, 91, 0.839)",
    black: "rgb(0, 0, 0)",
    lightgray: "lightgray",
    red: "red",
    platinum: "rgb(219, 219, 219)",
    notificationDot: "red",
    orange: "rgb(246, 71, 64)",
    gray100: "rgb(85, 85, 85)",
    gray200: "rgb(249, 249, 249)",
    gray300: "rgb(117, 117, 117)",
    white: "rgb(255, 255, 255)",
    transparent: "transparent",

    backdrop: "rgba(0, 0, 0, 0.5)",
    backdropDark: "rgba(255, 255, 255, 0.5)",
    success: "rgb(2, 202, 48)",
    successForeground: "rgb(40, 167, 69)",
    cardDark: "rgb(30, 30, 30)",
    textLight: "rgb(0, 0, 0)",
    textSecondaryLight: "rgb(102, 102, 102)",
    tabIconDefault: "rgb(204, 204, 204)",
    onSurfaceDark: "rgb(83, 139, 166)",
    tagDark: "rgb(95, 99, 104)",
    tagForegroundDark: "rgb(241, 243, 244)",
    outlineDark: "rgb(83, 139, 166)",
    backgroundDark: "rgb(0, 0, 0)",
    modalBackgroundDark: "rgb(33, 33, 33)",
    tagLight: "rgb(241, 243, 244)",
    tagForegroundLight: "rgb(95, 99, 104)",
    outlineLight: "rgb(5, 68, 99)",
    modalBackgroundLight: "rgb(255, 255, 255)",

    shimmerOverlayDark: 'rgba(255, 255, 255, 0.3)',
    shimmerOverlayLight: 'rgba(0, 0, 0, 0.1)',

    primaryLight: "#D9E4F2",
    primaryDark: "#1A3B5C",
    primaryDarkVariant: "rgb(29, 66, 93)",
    surface: "#EEF4FB",
    planBadgeProBg: "rgba(236, 214, 148, 0.16)",
    planBadgeEnterpriseBg: "rgba(83, 139, 166, 0.16)",

    // Toast colors
    toastSuccess: "#4caf50",
    toastSuccessBg: "#1a472a",
    toastError: "#f44336",
    toastErrorBg: "#5f1a1a",
    toastInfo: "#2196f3",
    toastInfoBg: "#1a2f4a",
    toastWarning: "#ff9800",
    toastWarningBg: "#4a3a1a",
    toastText: "#ffffff",

    // Generic tokens (no specific color names)
    gray400: "rgb(158, 163, 175)",
    gray500: "rgb(107, 114, 128)",
    gray600: "rgb(75, 85, 99)",
    gray700: "rgb(55, 65, 81)",
    borderLight: "rgb(229, 231, 235)",
    borderMuted: "rgb(229, 229, 229)",
    borderDefault: "rgb(204, 204, 204)",
    surfaceMuted: "rgb(243, 244, 246)",
    surfaceLight: "rgb(249, 250, 251)",
    overlayWhite90: "rgba(255, 255, 255, 0.9)",
    overlayWhite80: "rgba(255, 255, 255, 0.8)",
    overlayWhite70: "rgba(255, 255, 255, 0.7)",
    overlayWhite20: "rgba(255, 255, 255, 0.2)",
    overlayWhite18: "rgba(255, 255, 255, 0.18)",
    overlayWhite15: "rgba(255, 255, 255, 0.15)",
    overlayWhite12: "rgba(255, 255, 255, 0.12)",
    overlayWhite08: "rgba(255, 255, 255, 0.08)",
    overlayWhite07: "rgba(255, 255, 255, 0.07)",
    overlayWhite06: "rgba(255, 255, 255, 0.06)",
    overlayBlack50: "rgba(0, 0, 0, 0.5)",
    overlayBlack40: "rgba(0, 0, 0, 0.4)",
    overlayBlack25: "rgba(0, 0, 0, 0.25)",
    overlayBlack20: "rgba(0, 0, 0, 0.2)",
    overlayBlack15: "rgba(0, 0, 0, 0.15)",
    overlayBlack12: "rgba(0, 0, 0, 0.12)",
    overlayBlack10: "rgba(0, 0, 0, 0.1)",
    overlayBlack08: "rgba(0, 0, 0, 0.08)",
    overlayBlack06: "rgba(0, 0, 0, 0.06)",
    overlayBlack03: "rgba(0, 0, 0, 0.03)",
    overlayBlack09: "rgba(0, 0, 0, 0.9)",
    overlayBlack06Alt: "rgba(0, 0, 0, 0.6)",
    borderSlate08: "rgba(15, 23, 42, 0.08)",
    shadowSlate12: "rgba(15, 23, 42, 0.12)",
    shadowSlate70: "rgba(15, 23, 42, 0.7)",
    shadowWhite30: "rgba(255, 255, 255, 0.3)",
    shadowBlack15: "rgba(0, 0, 0, 0.15)",
    shadowBlack18: "rgba(0, 0, 0, 0.18)",
    dividerLight: "rgba(255, 255, 255, 0.12)",
    dividerDark: "rgba(0, 0, 0, 0.08)",
    accentBlue: "rgb(37, 99, 235)",
    linkBlue: "rgb(59, 130, 246)",
    statusSuccessBg: "rgb(209, 247, 220)",
    statusErrorBg: "rgb(247, 215, 215)",
    statusWarningBg: "rgb(242, 230, 181)",
    statusSuccessFg: "rgb(11, 122, 42)",
    statusErrorFg: "rgb(169, 44, 44)",
    titleDark: "rgb(15, 23, 42)",
    backgroundLight: "rgb(247, 249, 252)",
    backgroundLightAlt: "rgb(239, 243, 249)",
    backgroundLightTert: "rgb(233, 238, 246)",
    surfaceFrost: "rgba(255, 255, 255, 0.14)",
    borderFrost: "rgba(255, 255, 255, 0.22)",
    borderFrost34: "rgba(255, 255, 255, 0.34)",
    glowMuted: "rgba(98, 144, 186, 0.35)",
    surfaceHighlight: "rgba(255, 255, 255, 0.06)",
    surfaceSecondary: "rgba(15, 23, 42, 0.16)",
    borderSecondary: "rgba(15, 23, 42, 0.28)",
    overlayGray25: "rgba(128, 128, 128, 0.25)",
    overlayGray35: "rgba(128, 128, 128, 0.35)",
    overlayGray55: "rgba(128, 128, 128, 0.55)",
    overlayGray70: "rgba(128, 128, 128, 0.7)",
    textOnOverlay90: "rgba(255, 255, 255, 0.9)",
    textOnOverlay85: "rgba(255, 255, 255, 0.85)",
    gridDragBg: "rgb(245, 245, 245)",
    gridDragBorder: "rgb(30, 58, 95)",
    gridDragText: "rgb(21, 41, 63)",
    inputErrorBorder: "rgb(232, 112, 112)",
    inputErrorText: "rgb(214, 69, 69)",
    errorPaleBg: "rgb(255, 235, 238)",
    errorPaleBorder: "rgb(255, 205, 210)",
    errorPaleText: "rgb(198, 40, 40)",
    discountPillBg: "rgb(31, 63, 115)",
    priceSlash: "rgb(138, 160, 186)",
    savingsGreen: "rgb(26, 127, 55)",
    dividerBg: "rgb(238, 243, 249)",
    pastelGreen: "rgba(144, 238, 144, 0.8)",
    pastelPink: "rgba(255, 182, 193, 0.8)",
    pastelBlue: "rgba(173, 216, 230, 0.8)",
    errorLightBg: "rgba(244, 67, 54, 0.25)",
    errorLightBorder: "rgba(244, 67, 54, 0.8)",
    warningLightBg: "rgba(255, 193, 7, 0.22)",
    warningLightBorder: "rgba(255, 193, 7, 0.75)",
    cardShadow: "rgba(140, 200, 240, 0.55)",
    gradientDark1: "rgb(15, 32, 39)",
    gradientDark2: "rgb(32, 58, 67)",
    gradientDark3: "rgb(44, 83, 100)",
    gradientAccent1: "rgb(255, 81, 47)",
    gradientAccent2: "rgb(221, 36, 118)",
    textMutedSecondary: "rgb(108, 122, 137)",
    surfaceBlueTint: "rgb(248, 251, 255)",
    surfaceBlueTintAlt: "rgb(245, 250, 255)",
    surfaceBlueTintStrong: "rgb(240, 246, 255)",
    borderBlueTint: "rgb(225, 230, 238)",
    linkUnderline: "rgb(207, 226, 247)",
    shadowBlue: "rgba(43, 92, 143, 1)",
    overlayWhite34: "rgba(255, 255, 255, 0.34)",
    overlayWhite85: "rgba(255, 255, 255, 0.85)",
    overlayWhite40: "rgba(255, 255, 255, 0.4)",
}

export default (theme: Theme) => ({
    ...theme.colors,
    ...ColorsStatic,
    ...(theme.dark
        ? {
            primary: ColorsStatic.secondary, // Main accent color
            onPrimary: ColorsStatic.white, // Icons/text on primary
            card: ColorsStatic.eerieBlack, // Card background color
            text: ColorsStatic.white, // Primary text color
            textSecondary: ColorsStatic.gray300, // Secondary text, captions
            tint: ColorsStatic.secondary, // Tint for icons/buttons
            tabIconDefault: ColorsStatic.gray300, // Inactive tab icons
            tabIconSelected: ColorsStatic.secondary, // Active tab icons
            onSurface: ColorsStatic.gray300, // Surface overlay color
            tag: ColorsStatic.gray100, // Tag background
            tagForeground: ColorsStatic.white, // Tag text/icon color
            outline: ColorsStatic.gray300, // Borders and outlines
            border: ColorsStatic.gray300, // Alias for borders
            background: ColorsStatic.black, // App background
            reverseBackground: ColorsStatic.white, // Opposite of background for contrast
            modalBackground: ColorsStatic.eerieBlack, // Modal or overlay background

            backdrop: ColorsStatic.backdropDark, // Backdrop color for modals
            shimmerBackground: ColorsStatic.gray100,
            shimmerOverlay: ColorsStatic.shimmerOverlayDark,
            InfluencerStatCard: ColorsStatic.secondary
        }
        : {
            primary: ColorsStatic.primary, // Main accent color
            onPrimary: ColorsStatic.white, // Icons/text on primary
            card: ColorsStatic.white, // Card background color
            text: ColorsStatic.black, // Primary text color
            textSecondary: ColorsStatic.gray100, // Secondary text, captions
            tint: ColorsStatic.primary, // Tint for icons/buttons
            tabIconDefault: ColorsStatic.gray300, // Inactive tab icons
            tabIconSelected: ColorsStatic.primary, // Active tab icons
            onSurface: ColorsStatic.gray300, // Surface overlay color
            tag: ColorsStatic.gray200, // Tag background
            tagForeground: ColorsStatic.black, // Tag text/icon color
            outline: ColorsStatic.gray300, // Borders and outlines
            border: ColorsStatic.gray300, // Alias for borders
            background: ColorsStatic.white, // App background
            reverseBackground: ColorsStatic.black, // Opposite of background for contrast
            modalBackground: ColorsStatic.white, // Modal or overlay background

            backdrop: ColorsStatic.backdrop, // Backdrop color for modals
            shimmerBackground: ColorsStatic.gray200,
            shimmerOverlay: ColorsStatic.shimmerOverlayLight,
            InfluencerStatCard: ColorsStatic.white
        }),
});