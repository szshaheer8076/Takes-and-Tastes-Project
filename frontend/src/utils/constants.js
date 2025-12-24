// src/utils/constants.js

// IMPORTANT: Change 192.168.X.X to your PC's IPv4 address from `ipconfig`
export const API_BASE_URL = 'http://192.168.1.17:5000/api';
// Example: 'http://192.168.0.23:5000/api'

export const COLORS = {
  primary: '#FF6B35',
  secondary: '#F7931E',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  dark: '#212121',
  light: '#F5F5F5',
  white: '#FFFFFF',
  grey: '#9E9E9E',
  border: '#E0E0E0',
};

export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  extraLarge: 24,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
};