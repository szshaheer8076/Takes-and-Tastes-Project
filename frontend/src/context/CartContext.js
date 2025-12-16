import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    loadCart();
  }, []);

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
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
      if (restaurant) {
        await AsyncStorage.setItem('cartRestaurant', JSON.stringify(restaurant));
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (item, selectedRestaurant) => {
    // Check if item is from a different restaurant
    if (restaurant && restaurant._id !== selectedRestaurant._id) {
      return {
        success: false,
        message: 'You can only order from one restaurant at a time. Clear cart first.',
      };
    }

    // Set restaurant if not set
    if (!restaurant) {
      setRestaurant(selectedRestaurant);
    }

    const existingItem = cartItems.find((i) => i._id === item._id);

    if (existingItem) {
      setCartItems(
        cartItems.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }

    return { success: true };
  };

  const removeFromCart = (itemId) => {
    const newCart = cartItems.filter((item) => item._id !== itemId);
    setCartItems(newCart);

    // Clear restaurant if cart is empty
    if (newCart.length === 0) {
      setRestaurant(null);
    }
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item._id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurant(null);
    AsyncStorage.removeItem('cart');
    AsyncStorage.removeItem('cartRestaurant');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        restaurant,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};