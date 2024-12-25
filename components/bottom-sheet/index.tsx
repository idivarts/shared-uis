import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Theme, useTheme } from "@react-navigation/native";
import BottomSheet, { BottomSheetProps, BottomSheetView } from "@gorhom/bottom-sheet";

interface BottomSheetContainerProps extends BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

const BottomSheetContainer: React.FC<BottomSheetContainerProps> = ({
  isVisible,
  onClose,
  children,
  ...props
}) => {
  const sheetRef = React.useRef<BottomSheet>(null);

  const theme = useTheme();
  const styles = stylesFn(theme);

  const handleClose = () => {
    if (sheetRef.current) {
      sheetRef.current.close();
    }
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.bottomSheetContainer}>
        <BottomSheet
          ref={sheetRef}
          backdropComponent={() => {
            return <Pressable style={styles.overlay} onPress={handleClose} />;
          }}
          onClose={handleClose}
          style={styles.bottomSheet}
          {...props}
        >
          <BottomSheetView>
            {children}
          </BottomSheetView>
        </BottomSheet>
      </View>
    </Modal>
  );
};

export default BottomSheetContainer;

const stylesFn = (theme: Theme) => StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomSheetContainer: {
    flex: 1,
    justifyContent: "flex-end",
    zIndex: 2,
  },
  bottomSheet: {
    zIndex: 9999,
  },
});
