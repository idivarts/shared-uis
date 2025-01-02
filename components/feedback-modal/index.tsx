import React, { useState } from "react";
import { Modal, Pressable, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";

import { Text, View } from "../theme/Themed";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { Theme } from "@react-navigation/native";
import Colors from "@/shared-uis/constants/Colors";
import Star from "../star";

interface FeedbackModalProps {
  isVisible: boolean;
  onSubmit: (rating: number, feedback: string) => void;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  theme: Theme;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isVisible,
  onSubmit,
  setIsVisible,
  theme,
}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const styles = stylesFn(theme);

  const handleStarPress = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  const handleClose = () => {
    setRating(0);
    setFeedback('');
    setIsVisible(false);
  };

  const handleSubmit = () => {
    onSubmit(rating, feedback);
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
            <Text style={styles.title}>Give Feedback</Text>
            <Pressable
              onPress={handleClose}
            >
              <FontAwesomeIcon
                icon={faClose}
                color={Colors(theme).primary}
                size={24}
              />
            </Pressable>
          </View>

          <Text style={styles.subtitle}>Your feedback is valuable to us</Text>

          <View style={styles.starsContainer}>
            {[...Array(5)].map((_, index) => (
              <Pressable
                key={index}
                onPress={() => handleStarPress(index)}
                style={styles.starButton}
              >
                <Star
                  filled={index < rating}
                  theme={theme}
                />
              </Pressable>
            ))}
          </View>

          <TextInput
            activeOutlineColor={Colors(theme).primary}
            contentStyle={{
              color: Colors(theme).text,
            }}
            mode="outlined"
            multiline
            numberOfLines={4}
            onChangeText={setFeedback}
            outlineColor={Colors(theme).primary}
            placeholder="You Feedback"
            style={styles.input}
            theme={theme}
            value={feedback}
          />

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={handleClose}
              style={{
                borderColor: Colors(theme).primary,
              }}
              textColor={Colors(theme).primary}
              theme={theme}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={{
                backgroundColor: Colors(theme).primary,
              }}
              theme={theme}
            >
              Give Feedback
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FeedbackModal;

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
    gap: 16,
    maxWidth: 400,
    padding: 20,
    width: '90%',
  },
  header: {
    alignItems: 'center',
    backgroundColor: Colors(theme).card,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  subtitle: {
    color: Colors(theme).gray100,
  },
  starsContainer: {
    backgroundColor: Colors(theme).card,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starButton: {
    padding: 8,
  },
  input: {
    backgroundColor: Colors(theme).card,
    borderColor: Colors(theme).primary,
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    backgroundColor: Colors(theme).card,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
});
