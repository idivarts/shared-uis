import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import { Text, View } from '../theme/Themed';
import Colors from '@/shared-uis/constants/Colors';
import { faClose, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Theme } from '@react-navigation/native';

interface VideoUploadModalProps {
  isVisible: boolean;
  onSubmit: (videoUri: string) => Promise<void>;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  theme: Theme;
  onVideoPick: () => Promise<{ uri: string; name: string; size: number } | null>;
  isReupload?: boolean;
}

const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  isVisible,
  onSubmit,
  setIsVisible,
  theme,
  onVideoPick,
  isReupload = false,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<{
    uri: string;
    name: string;
    size: number;
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const styles = stylesFn(theme);

  const handleClose = () => {
    if (!uploading) {
      setSelectedVideo(null);
      setUploadProgress(0);
      setIsVisible(false);
    }
  };

  const handleVideoPick = async () => {
    try {
      const video = await onVideoPick();
      if (video) {
        // Check file size (500MB limit)
        const maxSize = 500 * 1024 * 1024; // 500MB in bytes
        if (video.size > maxSize) {
          alert('Video file size exceeds 500MB limit. Please select a smaller file.');
          return;
        }
        setSelectedVideo(video);
      }
    } catch (error) {
      console.error('Error picking video:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedVideo) return;

    setUploading(true);
    try {
      await onSubmit(selectedVideo.uri);
      setSelectedVideo(null);
      setUploadProgress(0);
      setIsVisible(false);
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onDismiss={() => !uploading && setIsVisible(false)}
      onRequestClose={() => !uploading && setIsVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isReupload ? 'Reupload Video' : 'Upload Video'}
            </Text>
            {!uploading && (
              <Pressable onPress={handleClose}>
                <FontAwesomeIcon
                  icon={faClose}
                  color={Colors(theme).primary}
                  size={24}
                />
              </Pressable>
            )}
          </View>

          <Text style={styles.subtitle}>
            {isReupload
              ? 'Upload a revised version of your video'
              : 'Upload your promotional video (Max 500MB)'}
          </Text>

          {!selectedVideo ? (
            <Pressable style={styles.uploadArea} onPress={handleVideoPick}>
              <FontAwesomeIcon
                icon={faUpload}
                size={48}
                color={Colors(theme).primary}
              />
              <Text style={styles.uploadText}>Tap to select video</Text>
            </Pressable>
          ) : (
            <View style={styles.videoInfo}>
              <Text style={styles.videoName}>{selectedVideo.name}</Text>
              <Text style={styles.videoSize}>
                {formatFileSize(selectedVideo.size)}
              </Text>
              {!uploading && (
                <Button
                  mode="text"
                  onPress={handleVideoPick}
                  textColor={Colors(theme).primary}
                  theme={theme}
                >
                  Change Video
                </Button>
              )}
            </View>
          )}

          {uploading && (
            <View style={styles.uploadingContainer}>
              <ActivityIndicator size="large" color={Colors(theme).primary} />
              <Text style={styles.uploadingText}>Uploading video...</Text>
              {uploadProgress > 0 && (
                <Text style={styles.progressText}>{uploadProgress}%</Text>
              )}
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={handleClose}
              style={{ borderColor: Colors(theme).primary }}
              textColor={Colors(theme).primary}
              theme={theme}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={{ backgroundColor: Colors(theme).primary }}
              theme={theme}
              disabled={!selectedVideo || uploading}
              loading={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default VideoUploadModal;

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
    marginBottom: 20,
  },
  uploadArea: {
    backgroundColor: Colors(theme).card,
    borderWidth: 2,
    borderColor: Colors(theme).primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  uploadText: {
    color: Colors(theme).primary,
    fontSize: 16,
    marginTop: 12,
  },
  videoInfo: {
    backgroundColor: Colors(theme).gray200,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  videoName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  videoSize: {
    fontSize: 14,
    color: Colors(theme).gray100,
    marginBottom: 12,
  },
  uploadingContainer: {
    backgroundColor: Colors(theme).card,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 20,
  },
  uploadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors(theme).text,
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors(theme).primary,
    fontWeight: '600',
  },
  buttonContainer: {
    backgroundColor: Colors(theme).card,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
});
