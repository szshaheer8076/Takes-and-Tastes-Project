import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';

const OrderSuccessScreen = ({ route, navigation }) => {
  const { orderId } = route.params;

  useEffect(() => {
    // Reset navigation stack to prevent going back to checkout
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={100} color={COLORS.success} />
      </View>

      <Text style={styles.title}>Order Placed Successfully!</Text>
      <Text style={styles.subtitle}>
        Your order has been confirmed and will be delivered soon.
      </Text>

      <View style={styles.orderInfo}>
        <Text style={styles.orderLabel}>Order ID</Text>
        <Text style={styles.orderId}>{orderId}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('OrderHistory')}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          View Order Details
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Home')}
          style={[styles.button, styles.outlineButton]}
          labelStyle={styles.outlineButtonLabel}
        >
          Back to Home
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: COLORS.white,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.grey,
    textAlign: 'center',
    marginBottom: 32,
  },
  orderInfo: {
    backgroundColor: COLORS.light,
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
    width: '100%',
    alignItems: 'center',
  },
  orderLabel: {
    fontSize: 14,
    color: COLORS.grey,
    marginBottom: 8,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
  },
  buttonLabel: {
    fontSize: 16,
  },
  outlineButton: {
    borderColor: COLORS.primary,
  },
  outlineButtonLabel: {
    color: COLORS.primary,
    fontSize: 16,
  },
});

export default OrderSuccessScreen;