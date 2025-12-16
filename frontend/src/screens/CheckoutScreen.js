import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, TextInput, Button, RadioButton, Snackbar } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import { COLORS } from '../utils/constants';

const CheckoutScreen = ({ route, navigation }) => {
  const { subtotal, deliveryFee, discount, total } = route.params;
  const { user } = useAuth();
  const { cartItems, restaurant, clearCart } = useCart();

  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || 'Rawalpindi');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handlePlaceOrder = async () => {
    if (!street || !city) {
      setSnackbarMessage('Please fill in delivery address');
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        restaurant: restaurant._id,
        items: cartItems.map((item) => ({
          menuItem: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        deliveryAddress: {
          street,
          city,
          postalCode,
          country: 'Pakistan',
        },
        paymentMethod,
        subtotal,
        deliveryFee,
        discount,
        totalAmount: total,
        notes,
      };

      const response = await orderAPI.create(orderData);

      if (response.data.success) {
        clearCart();
        navigation.navigate('OrderSuccess', {
          orderId: response.data.data._id,
        });
      }
    } catch (error) {
      console.error('Order error:', error);
      setSnackbarMessage(
        error.response?.data?.message || 'Failed to place order'
      );
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
      <ScrollView style={styles.scrollView}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>

          <TextInput
            label="Street Address *"
            value={street}
            onChangeText={setStreet}
            mode="outlined"
            style={styles.input}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
          />

          <TextInput
            label="City *"
            value={city}
            onChangeText={setCity}
            mode="outlined"
            style={styles.input}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
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
          />
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          <RadioButton.Group
            onValueChange={setPaymentMethod}
            value={paymentMethod}
          >
            <View style={styles.radioOption}>
              <RadioButton value="cash" color={COLORS.primary} />
              <Text style={styles.radioLabel}>Cash on Delivery</Text>
            </View>

            <View style={styles.radioOption}>
              <RadioButton value="card" color={COLORS.primary} />
              <Text style={styles.radioLabel}>Credit/Debit Card</Text>
            </View>

            <View style={styles.radioOption}>
              <RadioButton value="online" color={COLORS.primary} />
              <Text style={styles.radioLabel}>Online Payment</Text>
            </View>
          </RadioButton.Group>
        </View>

        {/* Order Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Instructions (Optional)</Text>

          <TextInput
            label="Add notes..."
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
          />
        </View>

        {/* Order Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>Rs. {subtotal}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>Rs. {deliveryFee}</Text>
          </View>

          {discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: COLORS.success }]}>
                Discount
              </Text>
              <Text style={[styles.summaryValue, { color: COLORS.success }]}>
                - Rs. {discount}
              </Text>
            </View>
          )}

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>Rs. {total}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handlePlaceOrder}
          loading={loading}
          disabled={loading}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Place Order • Rs. {total}
        </Button>
      </View>

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
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 16,
    color: COLORS.dark,
    marginLeft: 8,
  },
  summary: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.grey,
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.dark,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: COLORS.white,
  },
  button: {
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
  },
  buttonLabel: {
    fontSize: 16,
  },
});

export default CheckoutScreen;