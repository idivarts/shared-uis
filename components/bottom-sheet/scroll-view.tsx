import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Theme, useTheme } from "@react-navigation/native";
import React, { PropsWithChildren } from "react";
import {
    Modal,
    StyleSheet,
    View,
} from "react-native";
import { Provider, useTheme as usePaperTheme } from "react-native-paper";
import Toast from "react-native-toast-message";
import Colors from "@/shared-uis/constants/Colors";

interface BottomSheetContainerProps extends PropsWithChildren {
    isVisible: boolean;
    snapPointsRange: [string, string];
    onClose: () => void;
}

const BottomSheetScrollContainer: React.FC<BottomSheetContainerProps> = ({
    isVisible,
    snapPointsRange,
    onClose,
    children,
}) => {
    const sheetRef = React.useRef<BottomSheet>(null);

    const theme = useTheme();
    const styles = stylesFn(theme);

    const snapPoints = React.useMemo(
        () => [snapPointsRange[0], snapPointsRange[1]],
        [snapPointsRange]
    );

    const handleClose = () => {
        if (sheetRef.current) {
            sheetRef.current.close();
        }
        onClose();
    };

    const paperTheme = usePaperTheme();
    const renderBackdrop = React.useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                pressBehavior="close"
                style={styles.overlay}
            />
        ),
        [styles.overlay]
    );

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <Provider theme={paperTheme}>
                <View style={styles.bottomSheetContainer}>
                    <BottomSheet
                        ref={sheetRef}
                        index={0}
                        snapPoints={snapPoints}
                        enablePanDownToClose
                        backdropComponent={renderBackdrop}
                        onClose={handleClose}
                        style={styles.bottomSheet}
                    >
                        <BottomSheetScrollView
                            contentContainerStyle={styles.sheetContentContainer}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            {children}
                        </BottomSheetScrollView>
                    </BottomSheet>
                    <Toast />
                </View>
            </Provider>
        </Modal>
    );
};

export default BottomSheetScrollContainer;

const stylesFn = (theme: Theme) => StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors(theme).backdrop,
    },
    bottomSheetContainer: {
        flex: 1,
        justifyContent: "flex-end",
        zIndex: 2,
    },
    bottomSheet: {
        zIndex: 9999,
    },
    sheetContentContainer: {
        flexGrow: 1,
    },
});
