import { StyleSheet } from "react-native";
import { Theme } from "@react-navigation/native";

import Colors from "@/shared-uis/constants/Colors";

const stylesFn = (theme: Theme) => StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: 120,
    position: "relative",
  },
  image: {
    width: 120,
    height: 120,
    borderColor: Colors(theme).border,
    borderWidth: 5,
  },
  cameraButton: {
    backgroundColor: Colors(theme).primary,
    padding: 10,
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
    width: 280,
  },
  modalHeader: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "space-between",
    width: "100%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 16,
  },
  modalButton: {
    backgroundColor: Colors(theme).primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
  },
  modalButtonText: {
    color: Colors(theme).white,
  },
});

export default stylesFn;
