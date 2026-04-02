import * as ImagePickerExpo from "expo-image-picker";
import { useState } from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native";

import Toaster from "@/shared-uis/components/toaster/Toaster";
import Colors from "@/shared-uis/constants/Colors";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Theme, useTheme } from "@react-navigation/native";

interface ImagePickerProps {
    editable?: boolean;
    image: string;
    onUploadImage: (image: string) => void;
    setImage: React.Dispatch<React.SetStateAction<string>>;
    theme?: Theme;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
    editable = true,
    image,
    onUploadImage,
    setImage,
    theme,
}) => {
    const [openModal, setOpenModal] = useState(false);
    const defaultTheme = theme ? theme : useTheme();
    const styles = useStyles(defaultTheme);

    const uploadImage = async () => {
        try {
            await ImagePickerExpo.requestCameraPermissionsAsync();
            let result = await ImagePickerExpo.launchCameraAsync({
                cameraType: ImagePickerExpo.CameraType.front,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
                onUploadImage(result.assets[0].uri);
                setOpenModal(false);
                Toaster.success("Image is uploaded successfully!");
            }
        } catch (error: any) {
            Toaster.error(`Failed to upload image: ${error.message}`);
        }
    };

    const removeImage = () => {
        setImage('');
        setOpenModal(false);
        Toaster.success("Image is removed!");
    };

    return (
        <View style={styles.container}>
            <Image
                source={
                    image ? {
                        uri: image,
                    } : require('../../assets/images/placeholder-image.jpg')
                }
                style={styles.image}
            />
            {editable && (
                <Pressable
                    onPress={() => setOpenModal(true)}
                    style={styles.cameraButton}
                >
                    <FontAwesomeIcon
                        icon={faCamera}
                        size={24}
                        color={Colors(defaultTheme).white}
                    />
                </Pressable>
            )}
            <Modal animationType="fade" transparent={true} visible={openModal}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Upload Image</Text>
                        <View style={styles.modalButtons}>
                            <Pressable onPress={uploadImage} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Upload</Text>
                            </Pressable>
                            <Pressable onPress={removeImage} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Remove</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const useStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            alignItems: "center",
            position: "relative",
        },
        image: {
            borderRadius: 75,
            width: 100,
            height: 100,
            borderColor: Colors(theme).border,
            borderWidth: 5,
        },
        cameraButton: {
            backgroundColor: Colors(theme).primary,
            borderRadius: 24,
            padding: 8,
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
            backgroundColor: Colors(theme).primary,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 4,
        },
        modalButtonText: {
            color: Colors(theme).white,
        },
    });

export default ImagePicker;
