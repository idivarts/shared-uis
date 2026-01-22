import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Text, View } from '../theme/Themed';
import Colors from '@/shared-uis/constants/Colors';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Theme } from '@react-navigation/native';
import CustomCheckbox from './CustomCheckbox';

interface ConfirmDeliveryModalProps {
  isVisible: boolean;
  onSubmit: (data: { notes: string; proofImage?: string; confirmed: boolean }) => void;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  theme: Theme;
  onImagePick?: () => Promise<string | null>;
}

const ConfirmDeliveryModal: React.FC<ConfirmDeliveryModalProps> = ({
  isVisible,
  onSubmit,
  setIsVisible,
  theme,
  onImagePick,
}) => {
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const styles = stylesFn(theme);

  const handleClose = () => {
    setNotes('');
    setConfirmed(false);
    setProofImage(null);
    setIsVisible(false);
  };

  const handleSubmit = () => {
    if (!confirmed) return;
    onSubmit({
      notes,
      proofImage: proofImage || undefined,
      confirmed,
    });
    handleClose();
  };

  const handleImagePick = async () => {
    if (onImagePick) {
      setUploading(true);
      try {
        const imageUri = await onImagePick();
        if (imageUri) {
          setProofImage(imageUri);
        }
      } catch (error) {
        console.error('Error picking image:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onDismiss={() => setIsVisible(false)}
      onRequestClose={() => setIsVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Confirm Delivery</Text>
            <Pressable onPress={handleClose}>
              <FontAwesomeIcon
                icon={faClose}
                color={Colors(theme).primary}
                size={24}
              />
            </Pressable>
          </View>

          <ScrollView style={styles.scrollView}>
            <Text style={styles.subtitle}>
              Please confirm that you have received the product
            </Text>

            <TextInput
              label="Notes (Optional)"
              value={notes}
              onChangeText={setNotes}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
              theme={theme}
              activeOutlineColor={Colors(theme).primary}
              outlineColor={Colors(theme).primary}
              contentStyle={{ color: Colors(theme).text }}
              placeholder="Add any notes about the delivery"
            />

            {onImagePick && (
              <View style={styles.imagePickerContainer}>
                <Button
                  mode="outlined"
                  onPress={handleImagePick}
                  style={{ borderColor: Colors(theme).primary }}
                  textColor={Colors(theme).primary}
                  theme={theme}
                  loading={uploading}
                  disabled={uploading}
                >
                  {proofImage ? 'Change Proof Image' : 'Upload Proof Image (Optional)'}
                </Button>
                {proofImage && (
                  <Text style={styles.imageUploadedText}>✓ Image uploaded</Text>
                )}
              </View>
            )}

            <Pressable
              style={styles.checkboxContainer}
              onPress={() => setConfirmed(!confirmed)}
            >
              <CustomCheckbox
                checked={confirmed}
                onPress={() => setConfirmed(!confirmed)}
                theme={theme}
              />
              <Text style={styles.checkboxLabel}>
                I confirm that I have received the product
              </Text>
            </Pressable>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={handleClose}
              style={{ borderColor: Colors(theme).primary }}
              textColor={Colors(theme).primary}
              theme={theme}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={{ backgroundColor: Colors(theme).primary }}
              theme={theme}
              disabled={!confirmed}
            >
              Confirm Delivery
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmDeliveryModal;

const stylesFn = (theme: Theme) => StyleSheet.create({
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: Colors(theme).card,
    borderRadius: 12,
    maxWidth: 500,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  header: {
    alignItems: 'center',
    backgroundColor: Colors(theme).card,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  subtitle: {
    color: Colors(theme).gray100,
    marginBottom: 16,
  },
  scrollView: {
    maxHeight: 400,
  },
  input: {
    backgroundColor: Colors(theme).card,
    marginBottom: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  imagePickerContainer: {
    backgroundColor: Colors(theme).card,
    marginBottom: 16,
  },
  imageUploadedText: {
    color: Colors(theme).success,
    marginTop: 8,
    fontSize: 14,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors(theme).card,
    paddingVertical: 8,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
  },
  buttonContainer: {
    backgroundColor: Colors(theme).card,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    marginTop: 16,
  },
});
