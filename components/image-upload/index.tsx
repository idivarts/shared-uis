import { useState } from "react";
import { Image, Modal, Pressable } from "react-native";
import * as ImagePickerExpo from "expo-image-picker";

import Colors from "@/shared-uis/constants/Colors";
import Toaster from "@/shared-uis/components/toaster/Toaster";
import { Theme } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCamera, faClose } from "@fortawesome/free-solid-svg-icons";
import stylesFn from "@/shared-uis/styles/image-upload/ImageUpload.styles";
import { imageUrl } from "@/shared-uis/utils/url";
import { Text, View } from "../theme/Themed";

interface ImageUploadProps {
  editable?: boolean;
  initialImage?: string;
  onUploadImage: (image: string) => void;
  rounded?: boolean;
  theme: Theme;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  editable = true,
  initialImage,
  onUploadImage,
  rounded = false,
  theme,
}) => {
  const [image, setImage] = useState<string>(initialImage || "");
  const [openModal, setOpenModal] = useState(false);
  const styles = stylesFn(theme);

  const uploadImage = async () => {
    try {
      const { status } =
        await ImagePickerExpo.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("We need camera permissions");
        return;
      }

      const result = await ImagePickerExpo.launchImageLibraryAsync({
        mediaTypes: ImagePickerExpo.MediaTypeOptions.Images,
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
    setImage("");
    setOpenModal(false);
    Toaster.success("Image is removed!");
  };

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        if (image) {
          setOpenModal(true);
        } else {
          uploadImage();
        }
      }}
    >
      <View style={styles.innerContainer}>
        <Image
          source={imageUrl(image)}
          style={[
            styles.image,
            {
              borderRadius: rounded ? 75 : 10,
            },
          ]}
        />
        {editable && (
          <Pressable
            onPress={() => {
              if (image) {
                setOpenModal(true);
              } else {
                uploadImage();
              }
            }}
            style={[
              styles.cameraButton,
              {
                borderRadius: rounded ? 24 : 10,
              },
            ]}
          >
            <FontAwesomeIcon
              icon={faCamera}
              size={20}
              color={Colors(theme).white}
            />
          </Pressable>
        )}
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={openModal}
        onDismiss={() => setOpenModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload Image</Text>
              <Pressable onPress={() => setOpenModal(false)}>
                <FontAwesomeIcon
                  icon={faClose}
                  size={20}
                  color={Colors(theme).primary}
                />
              </Pressable>
            </View>
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
    </Pressable>
  );
};

export default ImageUpload;
