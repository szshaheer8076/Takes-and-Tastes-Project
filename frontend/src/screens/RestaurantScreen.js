import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  RefreshControl,
} from 'react-native';
import { Text, Chip, Snackbar, FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { restaurantAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import MenuItemCard from '../components/MenuItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { COLORS, SHADOWS } from '../utils/constants';

const RestaurantScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const { addToCart, getCartCount } = useCart();

  useEffect(() => {
    loadRestaurant();
  }, [id]);

  const loadRestaurant = async () => {
    try {
      const response = await restaurantAPI.getById(id);

      if (response.data.success) {
        setRestaurant(response.data.data);
        setMenuItems(response.data.data.menuItems || []);
      }
    } catch (error) {
      console.error('Error loading restaurant:', error);
      setSnackbarMessage('Failed to load restaurant');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadRestaurant();
  };

  const handleAddToCart = (item) => {
    const result = addToCart(item, restaurant);

    if (result.success) {
      setSnackbarMessage(`${item.name} added to cart`);
    } else {
      setSnackbarMessage(result.message);
    }
    setSnackbarVisible(true);
  };

  if (loading) {
    return <LoadingSpinner message="Loading restaurant..." />;
  }

  if (!restaurant) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Restaurant not found</Text>
      </View>
    );
  }

  // Group menu items by category
  const menuCategories = menuItems.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Image source={{ uri: restaurant.image }} style={styles.image} />

        <View style={styles.infoContainer}>
          <View style={styles.header}>
            <Image source={{ uri: restaurant.logo }} style={styles.logo} />
            <View style={styles.headerInfo}>
              <Text style={styles.name}>{restaurant.name}</Text>
              <Text style={styles.description}>{restaurant.description}</Text>
            </View>
          </View>

          <View style={styles.detailsRow}>
            <Chip icon="star" style={styles.chip}>
              {restaurant.rating}
            </Chip>
            <Chip icon="clock-outline" style={styles.chip}>
              {restaurant.deliveryTime}
            </Chip>
            <Chip icon="bike" style={styles.chip}>
              Rs. {restaurant.deliveryFee}
            </Chip>
          </View>

          {restaurant.discount > 0 && (
            <View style={styles.discountBanner}>
              <Ionicons name="pricetag" size={20} color={COLORS.white} />
              <Text style={styles.discountText}>
                {restaurant.discount}% OFF on all orders!
              </Text>
            </View>
          )}

          {/* Menu Section */}
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>Menu</Text>

            {Object.keys(menuCategories).length > 0 ? (
              Object.keys(menuCategories).map((category) => (
                <View key={category} style={styles.categorySection}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  {menuCategories[category].map((item) => (
                    <MenuItemCard
                      key={item._id}
                      item={item}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </View>
              ))
            ) : (
              <View style={styles.emptyMenu}>
                <Ionicons name="fast-food-outline" size={64} color={COLORS.grey} />
                <Text style={styles.emptyMenuText}>No menu items available</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {getCartCount() > 0 && (
        <FAB
          icon="cart"
          label={`View Cart (${getCartCount()})`}
          style={styles.fab}
          onPress={() => navigation.navigate('Cart')}
          color={COLORS.white}
        />
      )}

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
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
  },
  infoContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginTop: -40,
    ...SHADOWS.medium,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: COLORS.grey,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    backgroundColor: COLORS.light,
  },
  discountBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  discountText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  menuContainer: {
marginTop: 8,
},
menuTitle: {
fontSize: 22,
fontWeight: 'bold',
color: COLORS.dark,
marginBottom: 16,
},
categorySection: {
marginBottom: 24,
},
categoryTitle: {
fontSize: 18,
fontWeight: '600',
color: COLORS.dark,
marginBottom: 12,
paddingLeft: 4,
},
emptyMenu: {
alignItems: 'center',
paddingVertical: 40,
},
emptyMenuText: {
fontSize: 16,
color: COLORS.grey,
marginTop: 16,
},
errorContainer: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
},
errorText: {
fontSize: 16,
color: COLORS.error,
},
fab: {
position: 'absolute',
margin: 16,
right: 0,
bottom: 0,
backgroundColor: COLORS.primary,
},
});
export default RestaurantScreen;