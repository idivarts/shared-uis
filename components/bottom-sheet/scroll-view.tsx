import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useTheme } from "@react-navigation/native";
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
    const colors = Colors(theme);
    const styles = stylesFn(colors);

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
                        keyboardBehavior="interactive"
                        keyboardBlurBehavior="restore"
                        android_keyboardInputMode="adjustResize"
                        backdropComponent={renderBackdrop}
                        onClose={handleClose}
                        style={styles.bottomSheet}
                        backgroundStyle={styles.sheetBackground}
                        handleIndicatorStyle={styles.sheetHandle}
                    >
                        <BottomSheetScrollView
                            style={styles.sheetScroll}
                            contentContainerStyle={styles.sheetScrollContent}
                            keyboardShouldPersistTaps="handled"
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

const stylesFn = (colors: ReturnType<typeof Colors>) =>
    StyleSheet.create({
        overlay: {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.backdrop,
        },
        bottomSheetContainer: {
            flex: 1,
            justifyContent: "flex-end",
            zIndex: 2,
            backgroundColor: colors.transparent,
        },
        bottomSheet: {
            zIndex: 9999,
        },
        /** Default @gorhom/bottom-sheet surface is light; match app theme (fixes white strip in dark mode). */
        sheetBackground: {
            backgroundColor: colors.modalBackground ?? colors.card,
        },
        sheetHandle: {
            backgroundColor: colors.gray300,
        },
        sheetScroll: {
            backgroundColor: colors.modalBackground ?? colors.card,
        },
        sheetScrollContent: {
            backgroundColor: colors.modalBackground ?? colors.card,
            flexGrow: 1,
        },
    });
