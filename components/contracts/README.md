# Contract Status Management Components

This directory contains all components related to contract status management (Status 0-12) for the influencer app collaboration workflow.

## Components

### ActionContainer
The main component that displays the current contract status and available actions for the influencer.

**Props:**
- `contract` (IContracts): The contract object containing all contract details
- `theme` (Theme): The app theme
- `onUpdateAddress`: Handler for address updates
- `onConfirmDelivery`: Handler for delivery confirmation
- `onUploadVideo`: Handler for video uploads
- `onSubmitFeedback`: Handler for feedback submission
- `onNavigateToMessages`: Optional handler to navigate to messages
- `onVideoPick`: Handler to pick video files
- `onImagePick`: Optional handler to pick images for delivery proof
- `onVideoDownload`: Optional handler to download videos
- `userAddress`: Optional initial user address

**Status Flow:**
- **Status 0**: Application Accepted - Initial state after application approval
- **Status 1**: Contract Sent - Brand sends contract for review
- **Status 2**: Contract Signed - Influencer signs the contract
- **Status 3**: Collaboration Confirmed - Brand confirms the collaboration
- **Status 4**: Shipping Pending (physical_mode only) - Product shipping preparation
- **Status 5**: Delivery Pending (physical_mode only) - Awaiting delivery confirmation
- **Status 6**: Video Pending - Awaiting video upload
- **Status 7**: Review Pending - Video under brand review
- **Status 8**: Revision Pending - Brand requested changes to video
- **Status 9**: Release Pending - Video approved, awaiting schedule
- **Status 10**: Release Scheduled - Video release date set
- **Status 11**: Video Posted - Video published by influencer
- **Status 12**: Settlement Done - Collaboration complete, payment processed

**Example Usage:**
```tsx
import { ActionContainer } from '@/shared-uis/components/contracts';

<ActionContainer
  contract={contract}
  theme={theme}
  onUpdateAddress={handleUpdateAddress}
  onConfirmDelivery={handleConfirmDelivery}
  onUploadVideo={handleUploadVideo}
  onSubmitFeedback={handleSubmitFeedback}
  onNavigateToMessages={() => router.push('/messages')}
  onVideoPick={handleVideoPick}
  onImagePick={handleImagePick}
  onVideoDownload={handleVideoDownload}
  userAddress={user.address}
/>
```

### ShippingAddressModal
Modal for collecting/updating shipping address information.

**Props:**
- `isVisible` (boolean): Controls modal visibility
- `setIsVisible`: State setter for visibility
- `onSubmit`: Handler called with address data
- `theme` (Theme): The app theme
- `initialAddress`: Optional pre-filled address

**Example Usage:**
```tsx
import { ShippingAddressModal } from '@/shared-uis/components/contracts';

<ShippingAddressModal
  isVisible={showModal}
  setIsVisible={setShowModal}
  onSubmit={async (address) => {
    await updateUserAddress(address);
  }}
  theme={theme}
  initialAddress={user.shippingAddress}
/>
```

### ConfirmDeliveryModal
Modal for confirming product delivery with optional proof upload.

**Props:**
- `isVisible` (boolean): Controls modal visibility
- `setIsVisible`: State setter for visibility
- `onSubmit`: Handler called with delivery data
- `theme` (Theme): The app theme
- `onImagePick`: Optional handler to pick delivery proof image

**Example Usage:**
```tsx
import { ConfirmDeliveryModal } from '@/shared-uis/components/contracts';

<ConfirmDeliveryModal
  isVisible={showModal}
  setIsVisible={setShowModal}
  onSubmit={async (data) => {
    await confirmDelivery(data);
  }}
  theme={theme}
  onImagePick={async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    return result.assets?.[0]?.uri || null;
  }}
/>
```

### VideoUploadModal
Modal for uploading or reuploading promotional videos.

**Props:**
- `isVisible` (boolean): Controls modal visibility
- `setIsVisible`: State setter for visibility
- `onSubmit`: Handler called with video URI
- `theme` (Theme): The app theme
- `onVideoPick`: Handler to pick video file
- `isReupload`: Optional flag indicating reupload (for Status 8)

**Example Usage:**
```tsx
import { VideoUploadModal } from '@/shared-uis/components/contracts';
import * as ImagePicker from 'expo-image-picker';

<VideoUploadModal
  isVisible={showModal}
  setIsVisible={setShowModal}
  onSubmit={async (videoUri) => {
    await uploadVideoToFirebase(videoUri);
  }}
  theme={theme}
  onVideoPick={async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });
    if (result.assets?.[0]) {
      return {
        uri: result.assets[0].uri,
        name: result.assets[0].fileName || 'video.mp4',
        size: result.assets[0].fileSize || 0,
      };
    }
    return null;
  }}
  isReupload={false}
/>
```

### VideoDownloadCard
Component for displaying video preview and download options.

**Props:**
- `videoUrl` (string): URL of the uploaded video
- `theme` (Theme): The app theme
- `onDownload`: Optional handler to download video
- `showPreview`: Optional flag to show preview (default: true)

**Example Usage:**
```tsx
import { VideoDownloadCard } from '@/shared-uis/components/contracts';

<VideoDownloadCard
  videoUrl={contract.videoUrl}
  theme={theme}
  onDownload={async (url) => {
    await downloadVideo(url);
  }}
  showPreview={true}
/>
```

### CustomCheckbox
Custom checkbox component that follows design specifications (no react-native-paper).

**Props:**
- `checked` (boolean): Checkbox state
- `onPress`: Handler called when checkbox is pressed
- `theme` (Theme): The app theme

**Example Usage:**
```tsx
import { CustomCheckbox } from '@/shared-uis/components/contracts';

<CustomCheckbox
  checked={isChecked}
  onPress={() => setIsChecked(!isChecked)}
  theme={theme}
/>
```

## Implementation Guide

### Firebase Integration

The ActionContainer requires several Firebase handler functions. Here's how to implement them:

#### 1. Update Address Handler
```typescript
import { doc, updateDoc } from 'firebase/firestore';
import { FirestoreDB } from '@/shared-libs/utils/firebase/firestore';

const handleUpdateAddress = async (address: ShippingAddress) => {
  try {
    const userRef = doc(FirestoreDB, 'users', userId);
    await updateDoc(userRef, {
      shippingAddress: address,
    });
    Toaster.success('Address updated successfully');
  } catch (error) {
    console.error('Error updating address:', error);
    Toaster.error('Failed to update address');
  }
};
```

#### 2. Confirm Delivery Handler
```typescript
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FirestoreDB, StorageApp } from '@/shared-libs/utils/firebase';

const handleConfirmDelivery = async (data: {
  notes: string;
  proofImage?: string;
  confirmed: boolean;
}) => {
  try {
    let proofUrl: string | undefined;
    
    // Upload delivery proof if provided
    if (data.proofImage) {
      const storageRef = ref(
        StorageApp,
        `/contracts/${contractId}/delivery-proof/${Date.now()}.jpg`
      );
      const response = await fetch(data.proofImage);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      proofUrl = await getDownloadURL(storageRef);
    }
    
    // Update contract
    const contractRef = doc(FirestoreDB, 'contracts', contractId);
    await updateDoc(contractRef, {
      status: 6,
      deliveryConfirmedAt: Date.now(),
      deliveryProof: proofUrl,
      deliveryNotes: data.notes,
    });
    
    Toaster.success('Delivery confirmed successfully');
  } catch (error) {
    console.error('Error confirming delivery:', error);
    Toaster.error('Failed to confirm delivery');
  }
};
```

#### 3. Upload Video Handler
```typescript
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FirestoreDB, StorageApp } from '@/shared-libs/utils/firebase';

const handleUploadVideo = async (videoUri: string) => {
  try {
    // Upload to Firebase Storage
    const storageRef = ref(
      StorageApp,
      `/contracts/${contractId}/videos/${Date.now()}.mp4`
    );
    
    const response = await fetch(videoUri);
    const blob = await response.blob();
    await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(storageRef);
    
    // Update contract
    const contractRef = doc(FirestoreDB, 'contracts', contractId);
    await updateDoc(contractRef, {
      status: 7,
      videoUrl: downloadUrl,
      videoSubmittedAt: Date.now(),
    });
    
    Toaster.success('Video uploaded successfully');
  } catch (error) {
    console.error('Error uploading video:', error);
    Toaster.error('Failed to upload video');
    throw error;
  }
};
```

#### 4. Submit Feedback Handler
```typescript
import { doc, updateDoc } from 'firebase/firestore';
import { FirestoreDB } from '@/shared-libs/utils/firebase/firestore';

const handleSubmitFeedback = async (rating: number, feedback: string) => {
  try {
    const contractRef = doc(FirestoreDB, 'contracts', contractId);
    await updateDoc(contractRef, {
      feedbackFromInfluencer: {
        rating,
        feedback,
        submittedAt: Date.now(),
      },
    });
    
    Toaster.success('Feedback submitted successfully');
  } catch (error) {
    console.error('Error submitting feedback:', error);
    Toaster.error('Failed to submit feedback');
  }
};
```

#### 5. Video Pick Handler
```typescript
import * as ImagePicker from 'expo-image-picker';

const handleVideoPick = async () => {
  try {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to upload videos!');
      return null;
    }
    
    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
      allowsEditing: false,
    });
    
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        name: asset.fileName || `video-${Date.now()}.mp4`,
        size: asset.fileSize || 0,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error picking video:', error);
    return null;
  }
};
```

#### 6. Image Pick Handler
```typescript
import * as ImagePicker from 'expo-image-picker';

const handleImagePick = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to upload images!');
      return null;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });
    
    if (!result.canceled && result.assets?.[0]) {
      return result.assets[0].uri;
    }
    
    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
};
```

#### 7. Video Download Handler
```typescript
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const handleVideoDownload = async (url: string) => {
  try {
    if (Platform.OS === 'web') {
      // For web, open in new tab
      window.open(url, '_blank');
      return;
    }
    
    // For mobile, download to device
    const filename = `video-${Date.now()}.mp4`;
    const downloadPath = `${FileSystem.documentDirectory}${filename}`;
    
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      downloadPath
    );
    
    const result = await downloadResumable.downloadAsync();
    if (result?.uri) {
      Toaster.success('Video downloaded successfully');
    }
  } catch (error) {
    console.error('Error downloading video:', error);
    Toaster.error('Failed to download video');
  }
};
```

## TypeScript Interface

```typescript
export interface IContracts {
  id?: string;
  status: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  collaborationType?: 'physical_mode' | 'digital_mode' | 'service_mode';
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  deliveryConfirmedAt?: number;
  deliveryProof?: string;
  deliveryNotes?: string;
  videoUrl?: string;
  videoSubmittedAt?: number;
  revisionRequest?: {
    reason: string;
    requestedAt: number;
  };
  releaseScheduledFor?: number;
  releasePostedAt?: number;
  feedbackFromInfluencer?: {
    rating: number;
    feedback: string;
    submittedAt: number;
  };
  createdAt?: number;
  updatedAt?: number;
}
```

## Important Notes

- Status 4 and 5 are only shown for `physical_mode` collaboration types
- All modals follow the same styling pattern as the existing `FeedbackModal`
- Custom checkbox component is used instead of react-native-paper Checkbox
- Video file size limit is 500MB
- All Firebase operations should include proper error handling
- Use the Toaster component for user notifications
- Support both mobile and web platforms where applicable

## Dependencies

Required packages:
- `expo-image-picker` - For image and video selection
- `expo-file-system` - For file downloads
- `firebase/firestore` - For database operations
- `firebase/storage` - For file storage
- `react-native-paper` - For UI components
- `@fortawesome/react-native-fontawesome` - For icons
- `@react-navigation/native` - For theming
