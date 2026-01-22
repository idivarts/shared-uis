import React, { useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Button } from 'react-native-paper';
import { Text, View } from '../theme/Themed';
import Colors from '@/shared-uis/constants/Colors';
import {
  faClock,
  faCheckCircle,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Theme } from '@react-navigation/native';
import { IContracts } from '@/shared-uis/interfaces/IContracts';
import ShippingAddressModal from './ShippingAddressModal';
import ConfirmDeliveryModal from './ConfirmDeliveryModal';
import VideoUploadModal from './VideoUploadModal';
import VideoDownloadCard from './VideoDownloadCard';
import FeedbackModal from '../feedback-modal';

interface ActionContainerProps {
  contract: IContracts;
  theme: Theme;
  onUpdateAddress: (address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }) => Promise<void>;
  onConfirmDelivery: (data: {
    notes: string;
    proofImage?: string;
    confirmed: boolean;
  }) => Promise<void>;
  onUploadVideo: (videoUri: string) => Promise<void>;
  onSubmitFeedback: (rating: number, feedback: string) => Promise<void>;
  onNavigateToMessages?: () => void;
  onVideoPick: () => Promise<{ uri: string; name: string; size: number } | null>;
  onImagePick?: () => Promise<string | null>;
  onVideoDownload?: (url: string) => Promise<void>;
  userAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

interface StatusConfig {
  title: string;
  message: string;
  warningBox?: {
    type: 'warning' | 'success' | 'info';
    message: string;
  };
  buttons?: Array<{
    label: string;
    mode: 'contained' | 'outlined' | 'text';
    action: () => void;
  }>;
  videoCard?: boolean;
  warningAboveButtons?: boolean;
  videoCardAboveButtons?: boolean;
}

const ActionContainer: React.FC<ActionContainerProps> = ({
  contract,
  theme,
  onUpdateAddress,
  onConfirmDelivery,
  onUploadVideo,
  onSubmitFeedback,
  onNavigateToMessages,
  onVideoPick,
  onImagePick,
  onVideoDownload,
  userAddress,
}) => {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const styles = stylesFn(theme);

  const handleOpenMessages = () => {
    if (onNavigateToMessages) {
      onNavigateToMessages();
    }
  };

  const statusMap: Record<number, StatusConfig> = {
    0: {
      title: 'Application Accepted',
      message:
        'Congratulations! Your application has been accepted. The brand will now review and proceed with the collaboration.',
      warningBox: {
        type: 'success',
        message: 'Your application was successful! Wait for the brand to proceed.',
      },
      warningAboveButtons: false,
    },
    1: {
      title: 'Contract Sent',
      message:
        'The brand has sent you a contract. Please review the terms and sign to proceed.',
      warningBox: {
        type: 'info',
        message: 'Review the contract carefully before signing.',
      },
      buttons: [
        {
          label: 'View Contract',
          mode: 'contained',
          action: handleOpenMessages,
        },
      ],
      warningAboveButtons: false,
    },
    2: {
      title: 'Contract Signed',
      message:
        'You have signed the contract. The brand is reviewing your signature.',
      warningBox: {
        type: 'success',
        message: 'Contract signed successfully! Waiting for brand confirmation.',
      },
      warningAboveButtons: false,
    },
    3: {
      title: 'Collaboration Confirmed',
      message:
        'The brand has confirmed the collaboration. Next steps will be communicated soon.',
      warningBox: {
        type: 'success',
        message: 'Collaboration is confirmed! Get ready for the next steps.',
      },
      buttons: [
        {
          label: 'Message Brand',
          mode: 'contained',
          action: handleOpenMessages,
        },
      ],
      warningAboveButtons: false,
    },
    4: {
      title: 'Shipping Pending',
      message:
        'The brand is preparing to ship the product to you. Please ensure your shipping address is correct.',
      warningBox: {
        type: 'warning',
        message: 'Brand is preparing shipment. Verify your address is correct.',
      },
      buttons: [
        {
          label: 'Update Address',
          mode: 'contained',
          action: () => setShowAddressModal(true),
        },
        {
          label: 'Message Brand',
          mode: 'outlined',
          action: handleOpenMessages,
        },
      ],
      warningAboveButtons: false,
    },
    5: {
      title: 'Delivery Pending',
      message:
        'The product has been shipped. Once you receive it, please confirm the delivery.',
      warningBox: {
        type: 'warning',
        message: 'Product is on the way. Confirm delivery once you receive it.',
      },
      buttons: [
        {
          label: 'Confirm Delivery',
          mode: 'contained',
          action: () => setShowDeliveryModal(true),
        },
        {
          label: 'Message Brand',
          mode: 'outlined',
          action: handleOpenMessages,
        },
      ],
      warningAboveButtons: false,
    },
    6: {
      title: 'Video Pending',
      message:
        'Please create and upload your promotional video for the brand to review.',
      warningBox: {
        type: 'warning',
        message: 'Create your video and upload it for brand review.',
      },
      buttons: [
        {
          label: 'Upload Video',
          mode: 'contained',
          action: () => setShowVideoModal(true),
        },
        {
          label: 'Message Brand',
          mode: 'outlined',
          action: handleOpenMessages,
        },
      ],
      warningAboveButtons: false,
    },
    7: {
      title: 'Review Pending',
      message:
        'Your video has been submitted. The brand is reviewing it and will provide feedback soon.',
      warningBox: {
        type: 'info',
        message: 'Video submitted successfully! Waiting for brand review.',
      },
      videoCard: true,
      buttons: [
        {
          label: 'Message Brand',
          mode: 'outlined',
          action: handleOpenMessages,
        },
      ],
      warningAboveButtons: false,
      videoCardAboveButtons: false,
    },
    8: {
      title: 'Revision Pending',
      message: contract.revisionRequest?.reason
        ? `The brand has requested revisions: "${contract.revisionRequest.reason}". Please update your video accordingly.`
        : 'The brand has requested revisions to your video. Please update and reupload.',
      warningBox: {
        type: 'warning',
        message: 'Brand requested changes. Review the feedback and reupload.',
      },
      videoCard: true,
      buttons: [
        {
          label: 'Reupload Video',
          mode: 'contained',
          action: () => setShowVideoModal(true),
        },
        {
          label: 'Message Brand',
          mode: 'outlined',
          action: handleOpenMessages,
        },
      ],
      warningAboveButtons: true,
      videoCardAboveButtons: false,
    },
    9: {
      title: 'Release Pending',
      message:
        'Your video has been approved! The brand will schedule the release date soon.',
      warningBox: {
        type: 'success',
        message: 'Video approved! Waiting for release schedule.',
      },
      videoCard: true,
      buttons: [
        {
          label: 'Message Brand',
          mode: 'outlined',
          action: handleOpenMessages,
        },
      ],
      warningAboveButtons: false,
      videoCardAboveButtons: false,
    },
    10: {
      title: 'Release Scheduled',
      message: contract.releaseScheduledFor
        ? `Your video is scheduled to be released on ${new Date(
            contract.releaseScheduledFor
          ).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}. Make sure to post it on time.`
        : 'Your video release has been scheduled. Please post it on the scheduled date.',
      warningBox: {
        type: 'info',
        message: 'Release date is set. Post your video on the scheduled date.',
      },
      videoCard: true,
      buttons: [
        {
          label: 'Message Brand',
          mode: 'outlined',
          action: handleOpenMessages,
        },
      ],
      warningAboveButtons: false,
      videoCardAboveButtons: false,
    },
    11: {
      title: 'Video Posted',
      message:
        'Great! Your video has been posted. The brand will now process the payment.',
      warningBox: {
        type: 'success',
        message: 'Video posted successfully! Payment processing in progress.',
      },
      videoCard: true,
      buttons: [
        {
          label: 'Message Brand',
          mode: 'outlined',
          action: handleOpenMessages,
        },
      ],
      warningAboveButtons: false,
      videoCardAboveButtons: false,
    },
    12: {
      title: 'Settlement Done',
      message:
        'Congratulations! The collaboration is complete and payment has been processed.',
      warningBox: {
        type: 'success',
        message: 'Collaboration completed successfully! Thank you for your work.',
      },
      buttons: [
        {
          label: 'Give Feedback',
          mode: 'contained',
          action: () => setShowFeedbackModal(true),
        },
        {
          label: 'Message Brand',
          mode: 'outlined',
          action: handleOpenMessages,
        },
      ],
      warningAboveButtons: false,
    },
  };

  const currentStatus = statusMap[contract.status];

  // Check if this is a physical collaboration for status 4 and 5
  const isPhysicalMode = contract.collaborationType === 'physical_mode';
  const shouldShowStatus = () => {
    if ((contract.status === 4 || contract.status === 5) && !isPhysicalMode) {
      return false;
    }
    return true;
  };

  if (!shouldShowStatus()) {
    return null;
  }

  const renderWarningBox = (warningBox: StatusConfig['warningBox']) => {
    if (!warningBox) return null;

    const boxStyle =
      warningBox.type === 'warning'
        ? styles.warningBox
        : warningBox.type === 'success'
        ? styles.successBox
        : styles.infoBox;

    const icon =
      warningBox.type === 'warning'
        ? faClock
        : warningBox.type === 'success'
        ? faCheckCircle
        : faCircleInfo;

    const iconColor =
      warningBox.type === 'warning'
        ? '#000'
        : warningBox.type === 'success'
        ? '#1B5E20'
        : Colors(theme).text;

    return (
      <View style={boxStyle}>
        <FontAwesomeIcon icon={icon} size={20} color={iconColor} />
        <Text style={styles.warningText}>{warningBox.message}</Text>
      </View>
    );
  };

  const renderButtons = (buttons?: StatusConfig['buttons']) => {
    if (!buttons || buttons.length === 0) return null;

    return (
      <View style={styles.buttonsContainer}>
        {buttons.map((button, index) => (
          <Button
            key={index}
            mode={button.mode}
            onPress={button.action}
            style={[
              button.mode === 'contained' && {
                backgroundColor: Colors(theme).primary,
              },
              button.mode === 'outlined' && {
                borderColor: Colors(theme).primary,
              },
            ]}
            textColor={
              button.mode === 'contained' ? '#fff' : Colors(theme).primary
            }
            theme={theme}
          >
            {button.label}
          </Button>
        ))}
      </View>
    );
  };

  const renderVideoCard = () => {
    if (!currentStatus.videoCard || !contract.videoUrl) return null;

    return (
      <VideoDownloadCard
        videoUrl={contract.videoUrl}
        theme={theme}
        onDownload={onVideoDownload}
        showPreview={true}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currentStatus.title}</Text>
      <Text style={styles.message}>{currentStatus.message}</Text>

      {currentStatus.warningAboveButtons && renderWarningBox(currentStatus.warningBox)}
      {renderButtons(currentStatus.buttons)}
      {!currentStatus.warningAboveButtons && renderWarningBox(currentStatus.warningBox)}
      {renderVideoCard()}

      {/* Modals */}
      <ShippingAddressModal
        isVisible={showAddressModal}
        setIsVisible={setShowAddressModal}
        onSubmit={onUpdateAddress}
        theme={theme}
        initialAddress={userAddress || contract.shippingAddress}
      />

      <ConfirmDeliveryModal
        isVisible={showDeliveryModal}
        setIsVisible={setShowDeliveryModal}
        onSubmit={onConfirmDelivery}
        theme={theme}
        onImagePick={onImagePick}
      />

      <VideoUploadModal
        isVisible={showVideoModal}
        setIsVisible={setShowVideoModal}
        onSubmit={onUploadVideo}
        theme={theme}
        onVideoPick={onVideoPick}
        isReupload={contract.status === 8}
      />

      <FeedbackModal
        isVisible={showFeedbackModal}
        setIsVisible={setShowFeedbackModal}
        onSubmit={onSubmitFeedback}
        theme={theme}
      />
    </View>
  );
};

export default ActionContainer;

const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors(theme).card,
      borderRadius: 12,
      padding: 20,
      gap: 16,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
    },
    message: {
      fontSize: 16,
      color: Colors(theme).textSecondary,
      lineHeight: 24,
    },
    warningBox: {
      backgroundColor: '#FFC107',
      padding: 16,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    successBox: {
      backgroundColor: '#C8E6C9',
      padding: 16,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    infoBox: {
      backgroundColor: Colors(theme).gray200,
      padding: 16,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    warningText: {
      flex: 1,
      fontSize: 14,
      lineHeight: 20,
    },
    buttonsContainer: {
      backgroundColor: Colors(theme).card,
      flexDirection: 'row',
      gap: 12,
      flexWrap: 'wrap',
    },
  });
