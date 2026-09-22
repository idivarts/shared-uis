import Colors from "@/shared-uis/constants/Colors";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Theme } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import React from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import ImageViewing from 'react-native-image-viewing';


interface AssetPreviewModalProps {
    previewImage: boolean;
    previewImageUrl: string | null;
    /** When set, the modal shows a full-screen video player instead of the image viewer. */
    previewVideoUrl?: string | null;
    setPreviewImage: React.Dispatch<React.SetStateAction<boolean>>;
    theme: Theme;
}

const AssetPreviewModal: React.FC<AssetPreviewModalProps> = ({
    previewImage,
    previewImageUrl,
    previewVideoUrl,
    setPreviewImage,
    theme,
}) => {
    const colors = Colors(theme);
    const styles = stylesFn(colors);

    if (previewVideoUrl) {
        return (
            <Modal
                visible={previewImage}
                transparent
                animationType="fade"
                onRequestClose={() => setPreviewImage(false)}
            >
                <View style={styles.backdrop}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Close preview"
                        onPress={() => setPreviewImage(false)}
                        style={styles.closeBtn}
                    >
                        <FontAwesomeIcon icon={faXmark} size={20} color={colors.white} />
                    </Pressable>
                    <Video
                        source={{ uri: previewVideoUrl }}
                        style={styles.player}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        shouldPlay
                    />
                </View>
            </Modal>
        );
    }

    return (
        <ImageViewing
            images={[{ uri: previewImageUrl || "" }]}
            imageIndex={0}
            visible={previewImage}
            onRequestClose={() => setPreviewImage(false)}
        />
    );
};

const stylesFn = (colors: ReturnType<typeof Colors>) =>
    StyleSheet.create({
        backdrop: {
            flex: 1,
            backgroundColor: colors.backdropStrong,
            justifyContent: "center",
            alignItems: "center",
        },
        player: {
            width: "100%",
            height: "80%",
            backgroundColor: colors.reverseBackground,
        },
        closeBtn: {
            position: "absolute",
            top: 40,
            right: 20,
            zIndex: 2,
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.backdrop,
        },
    });

export default AssetPreviewModal;
