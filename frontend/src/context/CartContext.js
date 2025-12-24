// src/context/CartContext.js
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);

  // Load cart from storage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    saveCart();
  }, [cartItems, restaurant]);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      const savedRestaurant = await AsyncStorage.getItem('cartRestaurant');

      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      if (savedRestaurant) {
        setRestaurant(JSON.parse(savedRestaurant));
      }
    } catch (error) {
      console.error('[Cart] Error loading cart:', error);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cartItems));

      if (restaurant) {
        await AsyncStorage.setItem(
          'cartRestaurant',
          JSON.stringify(restaurant)
        );
      } else {
        await AsyncStorage.removeItem('cartRestaurant');
      }
    } catch (error) {
      console.error('[Cart] Error saving cart:', error);
    }
  };

  /**
   * Add an item to the cart.
   * If there is already a cart from another restaurant,
   * it clears the cart and starts a new one for the new restaurant.
   */
  const addToCart = (item, restaurantInfo) => {
    console.log('[Cart] Adding item:', item.name);

    // Check if adding from different restaurant
    if (restaurant && restaurant._id !== restaurantInfo._id) {
      console.log('[Cart] Different restaurant detected, clearing cart');
      // Start new cart for new restaurant
      setCartItems([{ ...item, quantity: item.quantity || 1 }]);
      setRestaurant(restaurantInfo);
      return { success: true, cleared: true };
    }

    // Check if item already in cart
    const existingIndex = cartItems.findIndex(
      (cartItem) => cartItem._id === item._id
    );

    if (existingIndex > -1) {
      // Update quantity
      const updatedCart = [...cartItems];
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity:
          (updatedCart[existingIndex].quantity || 0) + (item.quantity || 1),
      };
      setCartItems(updatedCart);
      console.log('[Cart] Updated quantity for:', item.name);
    } else {
      // Add new item
      setCartItems([
        ...cartItems,
        { ...item, quantity: item.quantity || 1 },
      ]);
      console.log('[Cart] Added new item:', item.name);
    }

    // Set restaurant if first item
    if (!restaurant) {
      setRestaurant(restaurantInfo);
    }

    return { success: true, cleared: false };
  };

  const removeFromCart = (itemId) => {
    console.log('[Cart] Removing item:', itemId);
    const updatedCart = cartItems.filter((item) => item._id !== itemId);
    setCartItems(updatedCart);

    // Clear restaurant if cart is empty
    if (updatedCart.length === 0) {
      setRestaurant(null);
    }
  };

  const updateQuantity = (itemId, quantity) => {
    console.log('[Cart] Updating quantity for:', itemId, 'to:', quantity);

    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item._id === itemId ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
  };

  const clearCart = () => {
    console.log('[Cart] Clearing cart');
    setCartItems([]);
    setRestaurant(null);
    AsyncStorage.removeItem('cart');
    AsyncStorage.removeItem('cartRestaurant');
  };

  const getCartTotal = () => {
    const subtotal = cartItems.reduce(
      (total, item) =>
        total + (item.price || 0) * (item.quantity || 0),
      0
    );
    const deliveryFee = restaurant?.deliveryFee || 0;
    return {
      subtotal: subtotal.toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      total: (subtotal + deliveryFee).toFixed(2),
    };
  };

  const getCartCount = () => {
    return cartItems.reduce(
      (count, item) => count + (item.quantity || 0),
      0
    );
  };

  const value = {
    cartItems,
    restaurant,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
};

// Custom hook to use the cart in components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};