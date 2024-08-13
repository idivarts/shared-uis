import { StyleSheet } from "react-native";
import Colors from "@/shared-uis/constants/Colors";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    position: "relative",
  },
  image: {
    borderRadius: 75,
    width: 100,
    height: 100,
    borderColor: Colors.regular.primary,
    borderWidth: 5,
  },
  cameraButton: {
    backgroundColor: Colors.regular.primary,
    borderRadius: 24,
    padding: 8,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.regular.backdrop,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  modalContent: {
    backgroundColor: Colors.regular.white,
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
    backgroundColor: Colors.regular.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
  },
  modalButtonText: {
    color: Colors.regular.white,
  },
});

export default styles;
