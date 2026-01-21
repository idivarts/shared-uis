/**
 * Example implementation of Contract Status Management components
 * 
 * This file demonstrates how to integrate the contract components
 * with Firebase and your React Native application.
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { ActionContainer } from '@/shared-uis/components/contracts';
import { IContracts } from '@/shared-uis/interfaces/IContracts';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FirestoreDB, StorageApp } from '@/shared-libs/utils/firebase';
import Toaster from '@/shared-uis/components/toaster';
import { router } from 'expo-router';

interface ContractPageProps {
  contractId: string;
  userId: string;
}

export const ContractPage: React.FC<ContractPageProps> = ({
  contractId,
  userId,
}) => {
  const theme = useTheme();
  const [contract, setContract] = useState<IContracts | null>(null);
  const [userAddress, setUserAddress] = useState<any>(null);

  useEffect(() => {
    loadContract();
    loadUserAddress();
  }, [contractId, userId]);

  const loadContract = async () => {
    try {
      const contractRef = doc(FirestoreDB, 'contracts', contractId);
      const contractSnap = await getDoc(contractRef);
      if (contractSnap.exists()) {
        setContract({ id: contractSnap.id, ...contractSnap.data() } as IContracts);
      }
    } catch (error) {
      console.error('Error loading contract:', error);
      Toaster.error('Failed to load contract');
    }
  };

  const loadUserAddress = async () => {
    try {
      const userRef = doc(FirestoreDB, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserAddress(userSnap.data().shippingAddress);
      }
    } catch (error) {
      console.error('Error loading user address:', error);
    }
  };

  const handleUpdateAddress = async (address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }) => {
    try {
      const userRef = doc(FirestoreDB, 'users', userId);
      await updateDoc(userRef, {
        shippingAddress: address,
      });

      const contractRef = doc(FirestoreDB, 'contracts', contractId);
      await updateDoc(contractRef, {
        shippingAddress: address,
      });

      setUserAddress(address);
      Toaster.success('Address updated successfully');
    } catch (error) {
      console.error('Error updating address:', error);
      Toaster.error('Failed to update address');
    }
  };

  const handleConfirmDelivery = async (data: {
    notes: string;
    proofImage?: string;
    confirmed: boolean;
  }) => {
    try {
      let proofUrl: string | undefined;

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

      const contractRef = doc(FirestoreDB, 'contracts', contractId);
      await updateDoc(contractRef, {
        status: 6,
        deliveryConfirmedAt: Date.now(),
        deliveryProof: proofUrl,
        deliveryNotes: data.notes,
      });

      await loadContract();
      Toaster.success('Delivery confirmed successfully');
    } catch (error) {
      console.error('Error confirming delivery:', error);
      Toaster.error('Failed to confirm delivery');
    }
  };

  const handleUploadVideo = async (videoUri: string) => {
    try {
      const storageRef = ref(
        StorageApp,
        `/contracts/${contractId}/videos/${Date.now()}.mp4`
      );

      const response = await fetch(videoUri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);

      const contractRef = doc(FirestoreDB, 'contracts', contractId);
      const updateData: any = {
        videoUrl: downloadUrl,
        videoSubmittedAt: Date.now(),
      };

      // If reupload (status 8), keep status 7 for review
      if (contract?.status === 8) {
        updateData.status = 7;
      } else {
        updateData.status = 7;
      }

      await updateDoc(contractRef, updateData);

      await loadContract();
      Toaster.success('Video uploaded successfully');
    } catch (error) {
      console.error('Error uploading video:', error);
      Toaster.error('Failed to upload video');
      throw error;
    }
  };

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

      await loadContract();
      Toaster.success('Feedback submitted successfully');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Toaster.error('Failed to submit feedback');
    }
  };

  const handleVideoPick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Toaster.error('Sorry, we need camera roll permissions to upload videos!');
        return null;
      }

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

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Toaster.error('Sorry, we need camera roll permissions to upload images!');
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

  const handleVideoDownload = async (url: string) => {
    try {
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

  const handleNavigateToMessages = () => {
    router.push(`/messages/${contractId}`);
  };

  if (!contract) {
    return null; // or a loading spinner
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <ActionContainer
        contract={contract}
        theme={theme}
        onUpdateAddress={handleUpdateAddress}
        onConfirmDelivery={handleConfirmDelivery}
        onUploadVideo={handleUploadVideo}
        onSubmitFeedback={handleSubmitFeedback}
        onNavigateToMessages={handleNavigateToMessages}
        onVideoPick={handleVideoPick}
        onImagePick={handleImagePick}
        onVideoDownload={handleVideoDownload}
        userAddress={userAddress}
      />
    </ScrollView>
  );
};
