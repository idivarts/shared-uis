import { Theme } from "@react-navigation/native";

const tintColorLight = "#ff6d2d";
const tintColorDark = "#fff";

export default (theme: Theme) => ({
  ...theme.colors,
  ...(theme.dark
    ? {
        card: "#1E1E1E",
        text: "#fff",
        background: "#000",
        tint: tintColorDark,
        tabIconDefault: "#ccc",
        tabIconSelected: tintColorDark,
        inputBackground: "#1b1b1b",
        primary: "#538BA6",
        onSurface: "#538BA6",
        tag: "#5f6368",
        tagForeground: "#f1f3f4",
        outline: "#538BA6",
        shimmerBackground: "#1E1E1E",
        shimmerOverlay: "#1b1b1b",
      }
    : {
        card: "#fff",
        text: "#000",
        background: "#fff",
        tint: tintColorLight,
        tabIconDefault: "#ccc",
        tabIconSelected: tintColorLight,
        inputBackground: "#fff",
        primary: "#054463",
        onSurface: "#054463",
        tag: "#f1f3f4",
        tagForeground: "#5f6368",
        outline: "#054463",
        shimmerBackground: "#f1f3f4",
        shimmerOverlay: "#eee",
      }),
  aliceBlue: "#E9F1F7",
  amber: "#FFBF00",
  yellow: "#E8B931",
  unicornSilver: "#e8e8e8",
  eerieBlack: "#1b1b1b",
  whiteSmoke: "#f5f5f5",
  success: "#d4edda",
  successForeground: "#28a745",
  pink: "#f8d7da",
  pinkForeground: "#dc3545",
  backdrop: "rgba(0, 0, 0, 0.5)",
  black: "#000",
  lightgray: "lightgray",
  modalBackground: "rgba(0, 0, 0, 0.5)",
  orange: "#F64740",
  platinum: "#DBDBDB",
  red: "red",
  notificationDot: "red",
  gray100: "#555",
  gray200: "#f9f9f9",
  gray300: "#757575",
  onPrimary: "#ffffff",
  secondary: "#054463",
  secondaryContainer: "#538BA6",
  onSecondaryContainer: "#ffffff",
  surface: "#ffffff",
  surfaceVariant: "#ffffff",
  transparent: "transparent",
  white: "#ffffff",
});
