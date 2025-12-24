// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      console.log('[Auth] Checking login status...');
      let token = null;
      let userData = null;

      // Try SecureStore (mobile)
      try {
        token = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        console.log('[Auth] SecureStore not available, using AsyncStorage');
        // Fallback to AsyncStorage (web)
        token = await AsyncStorage.getItem('userToken');
      }

      userData = await AsyncStorage.getItem('userData');

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUserToken(token);
        setUser(parsedUser);
        console.log('[Auth] User is logged in:', parsedUser.email);
      } else {
        console.log('[Auth] No user logged in');
      }
    } catch (error) {
      console.error('[Auth] Error checking login status:', error);
    } finally {
      setLoading(false);
    }
  };

  // NOTE: This now expects a single object argument: { name, email, password, phone }
  const register = async ({ name, email, password, phone }) => {
    try {
      console.log('[Auth] register called with:', { name, email, phone });
      setLoading(true);

      const response = await authAPI.register({ name, email, password, phone });
      console.log('[Auth] Registration response:', response.data);

      // Backend returns: { success, token, user }
      const { token, user: userData } = response.data;

      // Save token (try SecureStore first, fallback to AsyncStorage)
      try {
        await SecureStore.setItemAsync('userToken', token);
      } catch (e) {
        console.log('[Auth] Using AsyncStorage for token (web)');
        await AsyncStorage.setItem('userToken', token);
      }

      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      setUserToken(token);
      setUser(userData);

      console.log('[Auth] Registration successful');
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      console.error(
        '[Auth] Registration error:',
        error.response?.data || error.message
      );
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  // Keep this as (email, password) as long as your LoginScreen calls it that way
  const login = async (email, password) => {
    try {
      console.log('[Auth] login called with:', email);
      setLoading(true);

      const response = await authAPI.login({ email, password });
      console.log('[Auth] Login response:', response.data);

      // Backend returns: { success, token, user }
      const { token, user: userData } = response.data;

      // Save token (try SecureStore first, fallback to AsyncStorage)
      try {
        await SecureStore.setItemAsync('userToken', token);
      } catch (e) {
        console.log('[Auth] Using AsyncStorage for token (web)');
        await AsyncStorage.setItem('userToken', token);
      }

      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      setUserToken(token);
      setUser(userData);

      console.log('[Auth] Login successful');
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      console.error(
        '[Auth] Login error:',
        error.response?.data || error.message
      );
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const logout = async () => {
    try {
      console.log('[Auth] Logging out...');
      try {
        await SecureStore.deleteItemAsync('userToken');
      } catch (e) {
        await AsyncStorage.removeItem('userToken');
      }
      await AsyncStorage.removeItem('userData');
      setUserToken(null);
      setUser(null);
      console.log('[Auth] Logout successful');
    } catch (error) {
      console.error('[Auth] Logout error:', error);
    }
  };

  const updateUser = async (userData) => {
    try {
      console.log('[Auth] Updating user profile...');
      setLoading(true);

      const response = await authAPI.updateProfile(userData);
      console.log('[Auth] Update response:', response.data);

      // Backend returns: { success, token, user }
      const updatedUser = response.data.user || response.data;

      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);

      console.log('[Auth] Profile updated successfully');
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      console.error(
        '[Auth] Update error:',
        error.response?.data || error.message
      );
      return {
        success: false,
        message: error.response?.data?.message || 'Update failed',
      };
    }
  };

  const value = {
    user,
    userToken,
    loading,
    register,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};