import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Theme, useTheme } from "@react-navigation/native";
import React, { PropsWithChildren } from "react";
import {
    Modal,
    Platform,
    StyleSheet,
    View,
} from "react-native";
import { Provider, useTheme as usePaperTheme } from "react-native-paper";
import Toast from "react-native-toast-message";
import Colors from "@/shared-uis/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
    const insets = useSafeAreaInsets();
    const styles = stylesFn(theme, insets.bottom);

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
                        keyboardBehavior={Platform.OS === "android" ? "fillParent" : "extend"}
                        keyboardBlurBehavior="restore"
                        android_keyboardInputMode="adjustResize"
                        bottomInset={insets.bottom}
                        topInset={insets.top}
                        backdropComponent={renderBackdrop}
                        onClose={handleClose}
                        style={styles.bottomSheet}
                        backgroundStyle={styles.sheetBackground}
                        handleStyle={styles.handle}
                        handleIndicatorStyle={styles.handleIndicator}
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

const stylesFn = (theme: Theme, bottomInset: number) => {
    const colors = Colors(theme);
    return StyleSheet.create({
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
        },
        bottomSheet: {
            zIndex: 9999,
        },
        sheetScroll: {
            backgroundColor: colors.modalBackground,
        },
        sheetScrollContent: {
            backgroundColor: colors.modalBackground,
            flexGrow: 1,
            paddingBottom: Math.max(bottomInset, 16) + 24,
        },
        sheetBackground: {
            backgroundColor: colors.modalBackground,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
        },
        handle: {
            backgroundColor: colors.modalBackground,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            paddingTop: 10,
            paddingBottom: 8,
        },
        handleIndicator: {
            width: 44,
            height: 4,
            borderRadius: 2,
            opacity: 0.9,
            backgroundColor: theme.dark ? colors.textSecondary : colors.outline,
        },
    });
};
