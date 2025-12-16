import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Button, Divider, Snackbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { COLORS, SHADOWS } from '../utils/constants';

const CartScreen = ({ navigation }) => {
  const {
    cartItems,
    restaurant,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
  } = useCart();

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const subtotal = getCartTotal();
  const deliveryFee = restaurant?.deliveryFee || 50;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
    setSnackbarMessage('Item removed from cart');
    setSnackbarVisible(true);
  };

  const handleClearCart = () => {
    clearCart();
    setSnackbarMessage('Cart cleared');
    setSnackbarVisible(true);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setSnackbarMessage('Your cart is empty');
      setSnackbarVisible(true);
      return;
    }

    navigation.navigate('Checkout', {
      subtotal,
      deliveryFee,
      discount,
      total,
    });
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={100} color={COLORS.grey} />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>Add items from restaurants to get started</Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Home')}
          style={styles.browseButton}
        >
          Browse Restaurants
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Restaurant Info */}
        {restaurant && (
          <View style={styles.restaurantInfo}>
            <Image source={{ uri: restaurant.logo }} style={styles.restaurantLogo} />
            <View style={styles.restaurantDetails}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <Text style={styles.restaurantDelivery}>
                <Ionicons name="time-outline" size={14} color={COLORS.grey} />
                {' '}{restaurant.deliveryTime}
              </Text>
            </View>
            <Button
              mode="text"
              onPress={handleClearCart}
              textColor={COLORS.error}
              compact
            >
              Clear
            </Button>
          </View>
        )}

        {/* Cart Items */}
        <View style={styles.itemsContainer}>
          {cartItems.map((item) => (
            <CartItem
              key={item._id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={handleRemoveItem}
            />
          ))}
        </View>

        {/* Price Breakdown */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceTitle}>Bill Summary</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>Rs. {subtotal}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Delivery Fee</Text>
            <Text style={styles.priceValue}>Rs. {deliveryFee}</Text>
          </View>

          {discount > 0 && (
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: COLORS.success }]}>
                Discount
              </Text>
              <Text style={[styles.priceValue, { color: COLORS.success }]}>
                - Rs. {discount}
              </Text>
            </View>
          )}

          <Divider style={styles.divider} />

          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>Rs. {total}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <Button
          mode="contained"
          onPress={handleCheckout}
          style={styles.checkoutButton}
          labelStyle={styles.checkoutButtonLabel}
        >
          Proceed to Checkout • Rs. {total}
        </Button>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
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
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  restaurantLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  restaurantDetails: {
    flex: 1,
    marginLeft: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  restaurantDelivery: {
    fontSize: 12,
    color: COLORS.grey,
    marginTop: 2,
  },
  itemsContainer: {
    padding: 16,
  },
  priceContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    ...SHADOWS.small,
  },
  priceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.grey,
  },
  priceValue: {
    fontSize: 14,
    color: COLORS.dark,
  },
  divider: {
    marginVertical: 12,
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
  checkoutContainer: {
    padding: 16,
    backgroundColor: COLORS.white,
    ...SHADOWS.large,
  },
  checkoutButton: {
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
  },
  checkoutButtonLabel: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: COLORS.white,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.grey,
    marginTop: 8,
    textAlign: 'center',
  },
  browseButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    backgroundColor: COLORS.primary,
  },
});

export default CartScreen;