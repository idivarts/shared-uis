import React, { useState, useEffect } from 'react';
import { Modal, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Text, View } from '../theme/Themed';
import Colors from '@/shared-uis/constants/Colors';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Theme } from '@react-navigation/native';

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface ShippingAddressModalProps {
  isVisible: boolean;
  onSubmit: (address: ShippingAddress) => void;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  theme: Theme;
  initialAddress?: ShippingAddress;
}

const ShippingAddressModal: React.FC<ShippingAddressModalProps> = ({
  isVisible,
  onSubmit,
  setIsVisible,
  theme,
  initialAddress,
}) => {
  const [address, setAddress] = useState<ShippingAddress>({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const styles = stylesFn(theme);

  useEffect(() => {
    if (initialAddress) {
      setAddress(initialAddress);
    }
  }, [initialAddress]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = () => {
    if (!address.street || !address.city || !address.state || !address.zip || !address.country) {
      return;
    }
    onSubmit(address);
  };

  const isFormValid = address.street && address.city && address.state && address.zip && address.country;

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
            <Text style={styles.title}>Shipping Address</Text>
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
              Please provide your shipping address
            </Text>

            <TextInput
              label="Street Address"
              value={address.street}
              onChangeText={(text) => setAddress({ ...address, street: text })}
              mode="outlined"
              style={styles.input}
              theme={theme}
              activeOutlineColor={Colors(theme).primary}
              outlineColor={Colors(theme).primary}
              contentStyle={{ color: Colors(theme).text }}
            />

            <TextInput
              label="City"
              value={address.city}
              onChangeText={(text) => setAddress({ ...address, city: text })}
              mode="outlined"
              style={styles.input}
              theme={theme}
              activeOutlineColor={Colors(theme).primary}
              outlineColor={Colors(theme).primary}
              contentStyle={{ color: Colors(theme).text }}
            />

            <View style={styles.row}>
              <TextInput
                label="State"
                value={address.state}
                onChangeText={(text) => setAddress({ ...address, state: text })}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                theme={theme}
                activeOutlineColor={Colors(theme).primary}
                outlineColor={Colors(theme).primary}
                contentStyle={{ color: Colors(theme).text }}
              />

              <TextInput
                label="ZIP Code"
                value={address.zip}
                onChangeText={(text) => setAddress({ ...address, zip: text })}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                theme={theme}
                activeOutlineColor={Colors(theme).primary}
                outlineColor={Colors(theme).primary}
                contentStyle={{ color: Colors(theme).text }}
                keyboardType="numeric"
              />
            </View>

            <TextInput
              label="Country"
              value={address.country}
              onChangeText={(text) => setAddress({ ...address, country: text })}
              mode="outlined"
              style={styles.input}
              theme={theme}
              activeOutlineColor={Colors(theme).primary}
              outlineColor={Colors(theme).primary}
              contentStyle={{ color: Colors(theme).text }}
            />
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
              disabled={!isFormValid}
            >
              Submit
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ShippingAddressModal;

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
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Colors(theme).card,
  },
  halfInput: {
    flex: 1,
  },
  buttonContainer: {
    backgroundColor: Colors(theme).card,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    marginTop: 16,
  },
});
