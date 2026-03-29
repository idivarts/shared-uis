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
    gray100: "rgb(85, 85, 85)",
    gray200: "rgb(249, 249, 249)",
    gray300: "rgb(117, 117, 117)",
    white: "rgb(255, 255, 255)",
    transparent: "transparent",

    backdrop: "rgba(0, 0, 0, 0.5)",
    backdropStrong: "rgba(0, 0, 0, 0.78)",
    backdropDark: "rgba(255, 255, 255, 0.5)",
    success: "rgb(2, 202, 48)",
    successForeground: "rgb(40, 167, 69)",
    cardDark: "rgb(30, 30, 30)",
    textLight: "rgb(0, 0, 0)",
    textSecondaryLight: "rgb(102, 102, 102)",
    secondaryTextLight: "rgb(15, 23, 42)",
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
    influencerCardGradientPurpleLight: "#E8DEFF",
    influencerCardGradientPurpleDark: "#36284D",
    surface: "#EEF4FB",
    planBadgeProBg: "rgba(236, 214, 148, 0.16)",
    planBadgeEnterpriseBg: "rgba(83, 139, 166, 0.16)",
    budgetCardBg: "rgba(5, 68, 99, 0.08)",
    budgetCardBorder: "rgba(5, 68, 99, 0.3)",
    reachCardBg: "rgba(157, 213, 134, 0.2)",
    reachCardBorder: "rgba(157, 213, 134, 0.4)",

    // Landing / form (light-oriented; use via Colors(theme))
    formLabel: "rgb(108, 122, 137)",
    formBorder: "rgb(225, 230, 238)",
    formBg: "rgb(248, 251, 255)",
    formBgInput: "rgb(250, 252, 255)",
    errorBorder: "rgb(232, 112, 112)",
    errorBannerBg: "rgb(255, 235, 238)",
    errorBannerBorder: "rgb(255, 205, 210)",
    errorBannerText: "rgb(198, 40, 40)",
    primaryShadow: "rgb(43, 92, 143)",
    visualBg: "rgb(231, 240, 249)",
    playBadgeBg: "rgba(255,255,255,0.9)",
    ageCardSelectedBg: "rgb(240, 246, 255)",
    skipBtnBg: "rgb(245, 250, 255)",
    textDecorationLight: "rgb(207, 226, 247)",
    subtitleGray: "rgb(83, 101, 122)",
    primaryMid: "rgb(108, 145, 186)",
    discountPillBg: "rgb(31, 63, 115)",
    reasonsBoxBorder: "rgb(230, 238, 248)",
    planCardDivider: "rgb(238, 243, 249)",
    priceSlashColor: "rgb(138, 160, 186)",
    savingsGreen: "rgb(26, 127, 55)",

    // Offer card (countdown / discount)
    offerTimerDefaultBg: "rgba(255,255,255,0.15)",
    offerTimerDefaultBorder: "rgba(255,255,255,0.35)",
    offerTimerNum: "rgb(255,255,255)",
    offerTimerLbl: "rgb(229, 236, 245)",
    offerTimerExpiredBg: "rgba(255,255,255,0.08)",
    offerTimerExpiredBorder: "rgba(255,255,255,0.18)",
    offerTimerExpiredNum: "rgb(229, 236, 245)",
    offerTimerDangerBg: "rgba(244,67,54,0.25)",
    offerTimerDangerBorder: "rgba(244,67,54,0.8)",
    offerTimerDangerLbl: "rgb(255, 236, 236)",
    offerTimerWarnBg: "rgba(255,193,7,0.22)",
    offerTimerWarnBorder: "rgba(255,193,7,0.75)",
    offerTimerWarnNum: "rgb(255, 248, 225)",
    offerTimerWarnLbl: "rgb(255, 224, 130)",
    offerGradientExpired1: "rgb(67, 67, 67)",
    offerGradientExpired2: "rgb(44, 62, 80)",
    offerGradientExpired3: "rgb(31, 41, 55)",
    offerGradientActive1: "rgb(142, 45, 226)",
    offerGradientActive2: "rgb(233, 64, 87)",
    offerGradientActive3: "rgb(242, 113, 33)",
    offerShadow: "rgb(38, 103, 184)",
    offerCtaBg: "rgb(234, 78, 90)",
    offerExpiredPillBg: "rgba(255,255,255,0.12)",
    offerExpiredPillBorder: "rgba(255,255,255,0.22)",
    offerExpiredPillText: "rgb(229, 236, 245)",

    // Auth layout (gradient, floating card, showcase) — light: cool top → mid blue-gray → deeper slate (brand-adjacent)
    authGradient1: "rgb(250, 252, 255)",
    authGradient2: "rgb(225, 238, 250)",
    authGradient3: "rgb(196, 218, 238)",
    floatingCardBg: "rgba(255,255,255,0.9)",
    floatingCardBorder: "rgba(15, 23, 42, 0.08)",
    floatingCardShadow: "rgba(15, 23, 42, 0.12)",
    showcaseBg: "rgba(255,255,255,0.7)",
    showcaseBorder: "rgba(15, 23, 42, 0.08)",
    showcaseTitleColor: "rgb(15, 23, 42)",
    showcaseSubtitleColor: "rgba(15, 23, 42, 0.7)",
    showcaseTitleShadow: "rgba(255,255,255,0.3)",

    // Stepper / onboarding dots
    stepDotInactive: "rgba(128,128,128,0.35)",
    stepDotActive: "rgba(128,128,128,0.7)",
    stepDotDone: "rgba(128,128,128,0.55)",
    onboardingStepCircle: "rgba(128,128,128,0.25)",

    // Kanban / CRM (cards, modals)
    cardShadow: "rgba(0,0,0,0.15)",
    borderLight: "rgb(229, 229, 229)",
    surfaceLight: "rgb(243, 244, 246)",

    // Pre-signin / LetsStart
    heroTextShadow: "rgba(0, 0, 0, 0.3)",
    heroTextShadowLight: "rgba(0, 0, 0, 0.2)",
    actionCardBrand1: "rgb(15, 32, 39)",
    actionCardBrand2: "rgb(32, 58, 67)",
    actionCardBrand3: "rgb(44, 83, 100)",
    actionCardInfluencer1: "rgb(255, 81, 47)",
    actionCardInfluencer2: "rgb(221, 36, 118)",
    cardTextOnGradient: "rgba(255,255,255,0.9)",
    // Social brand colors (for pre-signin orbs)
    socialYoutube: "rgb(255, 0, 0)",
    socialInstagram: "rgb(193, 53, 132)",
    socialLinkedin: "rgb(0, 119, 181)",
    socialFacebook: "rgb(24, 119, 242)",
    socialTwitter: "rgb(29, 161, 242)",
    socialTiktok: "rgb(0, 0, 0)",
    socialSnapchat: "rgb(255, 252, 0)",
    socialPinterest: "rgb(230, 0, 35)",
    socialWhatsapp: "rgb(37, 211, 102)",

    // Drawer banner (over gradient)
    drawerBannerButtonBg: "rgba(255,255,255,0.4)",
    drawerBannerButtonPressed: "rgba(255,255,255,0.3)",

    // Drawer sidebar (always dark theme)
    drawerBackground: "rgb(26, 59, 92)",
    drawerHeaderBg: "rgb(42, 72, 104)",
    drawerCardBg: "rgb(33, 56, 80)",
    drawerText: "rgb(229, 236, 245)",
    drawerTextMuted: "rgb(160, 175, 195)",
    drawerProgressTrack: "rgb(70, 85, 105)",
    drawerProgressFill: "rgb(232, 185, 49)",
    drawerInvitesIcon: "rgb(138, 99, 210)",
    drawerBorder: "rgba(255, 255, 255, 0.08)",

    // Overlay / panel shadow
    panelShadow: "rgba(0, 0, 0, 0.18)",

    // Discover survey (light borders / backgrounds)
    surveyOutline: "rgba(0, 0, 0, 0.2)",
    surveyOutlineLight: "rgba(0, 0, 0, 0.08)",
    surveyBgSubtle: "rgba(0, 0, 0, 0.03)",
    surveyBorder: "rgba(0, 0, 0, 0.15)",
    surveyBorderTop: "rgba(0, 0, 0, 0.1)",
    surveyRadioBorder: "rgb(204, 204, 204)",

    // Empty discover (partner brands)
    emptyPhylloPrimary: "rgb(32, 83, 145)",
    emptyPhylloGradient1: "rgb(32, 83, 145)",
    emptyPhylloGradient2: "rgb(59, 130, 246)",
    emptyPhylloContainer: "rgb(240, 245, 255)",
    emptyModashPrimary: "rgb(67, 83, 255)",
    emptyModashGradient1: "rgb(67, 83, 255)",
    emptyModashGradient2: "rgb(122, 136, 255)",
    emptyModashContainer: "rgb(255, 249, 241)",
    emptyPhylloNote: "rgb(111, 123, 143)",
    emptyPhylloAvatar: "rgb(230, 240, 255)",
    emptyPhylloCompareBorder: "rgb(219, 231, 255)",
    emptyPhylloCompareHighlight: "rgb(239, 245, 255)",
    emptyPhylloCompareHeading: "rgb(32, 83, 145)",
    emptyPhylloCompareNote: "rgb(100, 112, 133)",
    emptyPhylloSavingsPill: "rgb(219, 234, 254)",
    emptyPhylloSavingsText: "rgb(30, 64, 175)",
    emptyModashStat: "rgb(222, 133, 40)",
    emptyModashNote: "rgb(156, 123, 95)",
    emptyModashAvatar: "rgb(238, 240, 255)",
    emptyModashCompareBorder: "rgb(255, 228, 204)",
    emptyModashCompareBg: "rgb(255, 247, 237)",
    emptyModashCompareHighlight: "rgb(255, 241, 230)",
    emptyModashCompareHeading: "rgb(180, 83, 9)",
    emptyModashCompareNote: "rgb(107, 114, 128)",
    emptyModashSavingsPill: "rgb(255, 237, 213)",
    emptyModashSavingsText: "rgb(154, 52, 18)",

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
            backdropStrong: ColorsStatic.backdropStrong,
            shimmerBackground: ColorsStatic.gray100,
            shimmerOverlay: ColorsStatic.shimmerOverlayDark,
            InfluencerStatCard: ColorsStatic.secondary,
            influencerCardGradientStart: ColorsStatic.primaryDark,
            influencerCardGradientEnd: ColorsStatic.influencerCardGradientPurpleDark,
            // Glass card / secondary button (dark theme)
            glassSurface: "rgba(255, 255, 255, 0.12)",
            glassBorder: "rgba(255, 255, 255, 0.22)",
            glassShadow: "rgba(140, 200, 240, 0.35)",
            glassHighlight: "rgba(255, 255, 255, 0.06)",
            glassInnerStroke: "rgba(255, 255, 255, 0.34)",
            glassLightCompression: "rgba(255, 255, 255, 0.07)",
            glassOuterStroke: "rgba(255, 255, 255, 0.12)",
            glassAndroidSurface: "rgba(255, 255, 255, 0.14)",
            /** Floating tab bar (glass pill) */
            glassTabBarSurface: "rgba(30, 30, 30, 0.65)",
            glassTabBarBorder: "rgba(255, 255, 255, 0.12)",
            glassTabBarWrapperShadow: "rgba(0, 0, 0, 0.6)",
            secondarySurface: "rgba(255, 255, 255, 0.16)",
            secondaryBorder: "rgba(255, 255, 255, 0.28)",
            secondaryText: ColorsStatic.white,
            drawerBackground: ColorsStatic.drawerBackground,
            drawerHeaderBg: ColorsStatic.drawerHeaderBg,
            drawerCardBg: ColorsStatic.drawerCardBg,
            drawerText: ColorsStatic.drawerText,
            drawerTextMuted: ColorsStatic.drawerTextMuted,
            drawerProgressTrack: ColorsStatic.drawerProgressTrack,
            drawerProgressFill: ColorsStatic.drawerProgressFill,
            drawerInvitesIcon: ColorsStatic.drawerInvitesIcon,
            drawerBorder: ColorsStatic.drawerBorder,
            // Auth: deep navy gradient (readable with light floating card + forms)
            authGradient1: "rgb(28, 42, 62)",
            authGradient2: "rgb(16, 32, 54)",
            authGradient3: "rgb(8, 22, 42)",
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
            backdropStrong: ColorsStatic.backdropStrong,
            shimmerBackground: ColorsStatic.gray200,
            shimmerOverlay: ColorsStatic.shimmerOverlayLight,
            InfluencerStatCard: ColorsStatic.white,
            influencerCardGradientStart: ColorsStatic.primaryLight,
            influencerCardGradientEnd: ColorsStatic.influencerCardGradientPurpleLight,
            // Glass card / secondary button (light theme)
            glassSurface: "rgba(255, 255, 255, 0.12)",
            glassBorder: "rgba(255, 255, 255, 0.22)",
            glassShadow: "rgba(140, 200, 240, 0.55)",
            glassHighlight: "rgba(255, 255, 255, 0.06)",
            glassInnerStroke: "rgba(255, 255, 255, 0.34)",
            glassLightCompression: "rgba(255, 255, 255, 0.07)",
            glassOuterStroke: "rgba(255, 255, 255, 0.12)",
            glassAndroidSurface: "rgba(255, 255, 255, 0.14)",
            /** Floating tab bar (glass pill) */
            glassTabBarSurface: "rgba(245, 245, 248, 0.82)",
            glassTabBarBorder: "rgba(0, 0, 0, 0.08)",
            glassTabBarWrapperShadow: "rgba(0, 0, 0, 0.15)",
            secondarySurface: "rgba(15, 23, 42, 0.16)",
            secondaryBorder: "rgba(15, 23, 42, 0.28)",
            secondaryText: ColorsStatic.secondaryTextLight,
            drawerBackground: ColorsStatic.drawerBackground,
            drawerHeaderBg: ColorsStatic.drawerHeaderBg,
            drawerCardBg: ColorsStatic.drawerCardBg,
            drawerText: ColorsStatic.drawerText,
            drawerTextMuted: ColorsStatic.drawerTextMuted,
            drawerProgressTrack: ColorsStatic.drawerProgressTrack,
            drawerProgressFill: ColorsStatic.drawerProgressFill,
            drawerInvitesIcon: ColorsStatic.drawerInvitesIcon,
            drawerBorder: ColorsStatic.drawerBorder,
        }),
});