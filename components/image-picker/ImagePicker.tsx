import { useState } from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";
import * as ImagePickerExpo from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import Colors from "@/shared-uis/constants/Colors";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import styles from "@/shared-uis/styles/image-picker/ImagePicker.styles";

interface ImagePickerProps {
  editable?: boolean;
  image: string;
  onUploadImage: (image: string) => void;
  setImage: React.Dispatch<React.SetStateAction<string>>;
}

const placeholderImage = "https://via.placeholder.com/300";

const ImagePicker: React.FC<ImagePickerProps> = ({
  editable = true,
  image,
  onUploadImage,
  setImage,
}) => {
  const [openModal, setOpenModal] = useState(false);

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
    setImage(placeholderImage);
    setOpenModal(false);
    Toaster.success("Image is removed!");
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: image ?? placeholderImage,
        }}
        style={styles.image}
      />
      {
        editable && (
          <Pressable onPress={() => setOpenModal(true)} style={styles.cameraButton}>
            <Ionicons name="camera" color={Colors.regular.white} size={28} />
          </Pressable>
        )
      }
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

export default ImagePicker;
