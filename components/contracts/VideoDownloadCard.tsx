import React, { useState } from 'react';
import { StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import { Text, View } from '../theme/Themed';
import Colors from '@/shared-uis/constants/Colors';
import { faDownload, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Theme } from '@react-navigation/native';
import Toaster from '../toaster/Toaster';

interface VideoDownloadCardProps {
  videoUrl: string;
  theme: Theme;
  onDownload?: (url: string) => Promise<void>;
  showPreview?: boolean;
}

const VideoDownloadCard: React.FC<VideoDownloadCardProps> = ({
  videoUrl,
  theme,
  onDownload,
  showPreview = true,
}) => {
  const [downloading, setDownloading] = useState(false);

  const styles = stylesFn(theme);

  const handleDownload = async () => {
    if (onDownload) {
      setDownloading(true);
      try {
        await onDownload(videoUrl);
      } catch (error) {
        console.error('Error downloading video:', error);
        Toaster.error('Failed to download video. Please try again.');
      } finally {
        setDownloading(false);
      }
    }
  };

  const handlePreview = () => {
    // This would open the video in a native player or modal
    // The implementation depends on the platform and available video player
    console.log('Opening video preview:', videoUrl);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Submitted Video</Text>
      </View>

      {showPreview && (
        <Pressable style={styles.previewContainer} onPress={handlePreview}>
          <View style={styles.playButton}>
            <FontAwesomeIcon icon={faPlay} size={32} color="#fff" />
          </View>
          <Text style={styles.previewText}>Tap to preview</Text>
        </Pressable>
      )}

      <View style={styles.actionsContainer}>
        {onDownload && (
          <Button
            mode="contained"
            onPress={handleDownload}
            style={styles.downloadButton}
            theme={theme}
            disabled={downloading}
            loading={downloading}
            icon={({ size, color }) => (
              <FontAwesomeIcon icon={faDownload} size={16} color={color} />
            )}
          >
            {downloading ? 'Downloading...' : 'Download Video'}
          </Button>
        )}

        <Button
          mode="outlined"
          onPress={() => {
            // Open video URL in browser
            if (typeof window !== 'undefined') {
              window.open(videoUrl, '_blank');
            }
          }}
          style={styles.viewButton}
          textColor={Colors(theme).primary}
          theme={theme}
        >
          View in Browser
        </Button>
      </View>
    </View>
  );
};

export default VideoDownloadCard;

const stylesFn = (theme: Theme) => StyleSheet.create({
  container: {
    backgroundColor: Colors(theme).card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors(theme).primary,
  },
  header: {
    backgroundColor: Colors(theme).card,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  previewContainer: {
    backgroundColor: Colors(theme).gray100,
    borderRadius: 8,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors(theme).primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  previewText: {
    color: Colors(theme).text,
    fontSize: 14,
  },
  actionsContainer: {
    backgroundColor: Colors(theme).card,
    gap: 8,
  },
  downloadButton: {
    backgroundColor: Colors(theme).primary,
  },
  viewButton: {
    borderColor: Colors(theme).primary,
  },
});
