import Colors from "@/shared-uis/constants/Colors";
import { Theme, useTheme } from "@react-navigation/native";
import React, { createContext, useContext, useState } from "react";
import { Modal, Platform, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { Text, View } from "./theme/Themed";

interface ConfirmationModalProps {
  animationType?: "none" | "slide" | "fade";
  cancelAction: () => void;
  cancelText?: string;
  confirmAction: () => void;
  confirmText?: string;
  title?: string,
  description?: string;
  loading?: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  visible: boolean;
}
const ConfirmationModalContext = createContext<{
  openModal: (props: Partial<ConfirmationModalProps>) => void
}>({
  openModal: () => { },
});
export const useConfirmationModel = () => useContext(ConfirmationModalContext)
export const ConfirmationModalProvider = ({ children }: { children: any }) => {
  const [loading, setLoading] = useState(false)
  const [props, setProps] = useState<ConfirmationModalProps>({
    animationType: "fade",
    cancelAction: () => { setProps((prev) => ({ ...prev, visible: false })) },
    confirmAction: () => { },
    confirmText: "Confirm",
    description: "Are you sure?",
    setVisible: () => { },
    visible: false,
  });
  const openModal = (mprops: Partial<ConfirmationModalProps>) => {
    setProps({
      ...props,
      ...mprops,
      visible: true
    });
  }
  return <ConfirmationModalContext.Provider value={{
    openModal
  }}>
    {children}
    <ConfirmationModal {...props} loading={loading} confirmAction={async () => {
      setLoading(true)
      try {
        await props.confirmAction()
      } finally {
        setLoading(false)
        setProps((prev) => ({ ...prev, visible: false }))
      }
    }} setVisible={() => setProps((prev) => ({ ...prev, visible: false }))} />
  </ConfirmationModalContext.Provider>
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  animationType = "fade",
  cancelAction,
  cancelText = "Cancel",
  confirmAction,
  loading = false,
  confirmText = "Confirm",
  title,
  description = "Are you sure?",
  setVisible,
  visible,
}) => {
  const theme = useTheme();
  const styles = stylesFn(theme);

  const handleConfirm = () => {
    confirmAction();
  }

  const handleCancel = () => {
    cancelAction();
  }

  return (
    <Modal
      animationType={animationType}
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {!!title &&
            <Text style={styles.modalTitle}>{title}</Text>}
          <Text style={styles.modalText}>{description}</Text>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleConfirm}
              style={styles.button}
              loading={loading} // You can manage loading state if needed
            >
              {confirmText}
            </Button>
            <Button
              mode="contained"
              onPress={handleCancel}
              style={styles.buttonSecondary}
            >
              <Text style={styles.secondaryText}>{cancelText}</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const stylesFn = (theme: Theme) => StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors(theme).backdrop,
  },
  modalView: {
    margin: 20,
    backgroundColor: Colors(theme).background,
    borderRadius: 16,
    padding: 25,
    // alignItems: "center",
    shadowColor: Colors(theme).backdrop,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    ...(Platform.OS === "web" && { maxWidth: 500 })
  },
  modalTitle: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
  },
  modalText: {
    marginBottom: 20,
    textAlign: "left",
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    gap: 10,
  },
  button: {
    backgroundColor: Colors(theme).primary,
  },
  buttonSecondary: {
    backgroundColor: Colors(theme).background,
    borderColor: Colors(theme).border,
    borderWidth: 2
  },
  secondaryText: {
    color: Colors(theme).primary,
  }
});

export default ConfirmationModal;
