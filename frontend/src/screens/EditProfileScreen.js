import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, TextInput, Button, Snackbar } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/constants';

const EditProfileScreen = ({ navigation }) => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleUpdate = async () => {
    if (!name || !email) {
      setSnackbarMessage('Name and email are required');
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);

    const userData = {
      name,
      email,
      phone,
      address: {
        street,
        city,
        postalCode,
      },
    };

    const result = await updateUser(userData);
    setLoading(false);

    if (result.success) {
      setSnackbarMessage('Profile updated successfully');
      setSnackbarVisible(true);
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } else {
      setSnackbarMessage(result.message);
      setSnackbarVisible(true);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <TextInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
            left={<TextInput.Icon icon="phone" />}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>

          <TextInput
            label="Street Address"
            value={street}
            onChangeText={setStreet}
            mode="outlined"
            style={styles.input}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
            left={<TextInput.Icon icon="home" />}
          />

          <TextInput
            label="City"
            value={city}
            onChangeText={setCity}
            mode="outlined"
            style={styles.input}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
            left={<TextInput.Icon icon="city" />}
          />

          <TextInput
            label="Postal Code"
            value={postalCode}
            onChangeText={setPostalCode}
            mode="outlined"
            keyboardType="number-pad"
            style={styles.input}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
            left={<TextInput.Icon icon="mailbox" />}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleUpdate}
            loading={loading}
            disabled={loading}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Update Profile
          </Button>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
    backgroundColor: COLORS.white,
  },
  buttonContainer: {
    padding: 16,
  },
  button: {
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
  },
  buttonLabel: {
    fontSize: 16,
  },
});

export default EditProfileScreen;