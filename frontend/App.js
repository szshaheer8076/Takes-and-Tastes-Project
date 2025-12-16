import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/utils/constants';

const theme = {
  colors: {
    primary: COLORS.primary,
    accent: COLORS.secondary,
    background: COLORS.white,
    surface: COLORS.white,
    text: COLORS.dark,
    error: COLORS.error,
    disabled: COLORS.grey,
    placeholder: COLORS.grey,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <CartProvider>
            <StatusBar style="dark" />
            <AppNavigator />
          </CartProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
