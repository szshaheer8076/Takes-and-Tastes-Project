import React, { useState, useEffect } from 'react';
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

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const { register } = useAuth();

  useEffect(() => {
    console.log('[RegisterScreen] mounted');
  }, []);

  const handleRegister = async () => {
    console.log('[Register] Button pressed');

    if (!name || !email || !password || !confirmPassword) {
      console.warn('[Register][Validation] Missing required fields');
      setSnackbarMessage('Please fill in all required fields');
      setSnackbarVisible(true);
      return;
    }

    if (password !== confirmPassword) {
      console.warn('[Register][Validation] Passwords do not match');
      setSnackbarMessage('Passwords do not match');
      setSnackbarVisible(true);
      return;
    }

    if (password.length < 6) {
      console.warn('[Register][Validation] Password too short');
      setSnackbarMessage('Password must be at least 6 characters');
      setSnackbarVisible(true);
      return;
    }

    try {
      setLoading(true);
      console.log('[Register] Sending data', {
        name,
        email,
        phone,
      });

      const result = await register({ name, email, phone, password });

      console.log('[Register] Response', result);

      if (!result.success) {
        console.error('[Register] Failed:', result.message);
        setSnackbarMessage(result.message);
        setSnackbarVisible(true);
      } else {
        console.log('[Register] Success');
      }
    } catch (error) {
      console.error('[Register] Unexpected error', error);
      setSnackbarMessage('Something went wrong');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Takes and Tastes today!</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Full Name *"
            value={name}
            onChangeText={(text) => {
              console.log('[Input] Name:', text);
              setName(text);
            }}
            mode="outlined"
            style={styles.input}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="Email *"
            value={email}
            onChangeText={(text) => {
              console.log('[Input] Email:', text);
              setEmail(text);
            }}
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
            onChangeText={(text) => {
              console.log('[Input] Phone:', text);
              setPhone(text);
            }}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
            left={<TextInput.Icon icon="phone" />}
          />

          <TextInput
            label="Password *"
            value={password}
            onChangeText={(text) => {
              console.log('[Input] Password changed');
              setPassword(text);
            }}
            mode="outlined"
            secureTextEntry={!showPassword}
            style={styles.input}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => {
                  console.log('[UI] Toggle password visibility');
                  setShowPassword(!showPassword);
                }}
              />
            }
          />

          <TextInput
            label="Confirm Password *"
            value={confirmPassword}
            onChangeText={(text) => {
              console.log('[Input] Confirm password changed');
              setConfirmPassword(text);
            }}
            mode="outlined"
            secureTextEntry={!showPassword}
            style={styles.input}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
            left={<TextInput.Icon icon="lock-check" />}
          />

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Register
          </Button>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Button
              mode="text"
              onPress={() => {
                console.log('[Navigation] Go to Login');
                navigation.navigate('Login');
              }}
              labelStyle={styles.loginButton}
            >
              Login
            </Button>
          </View>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => {
          console.log('[UI] Snackbar dismissed');
          setSnackbarVisible(false);
        }}
        duration={3000}
        action={{
          label: 'Close',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.grey,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
    backgroundColor: COLORS.white,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
  },
  buttonLabel: {
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    color: COLORS.grey,
    fontSize: 14,
  },
  loginButton: {
    color: COLORS.primary,
    fontSize: 14,
  },
});


export default RegisterScreen;
