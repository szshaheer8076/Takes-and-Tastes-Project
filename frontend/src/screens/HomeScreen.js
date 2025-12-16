import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
} from 'react-native';
import { Text, Snackbar, FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { restaurantAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import RestaurantCard from '../components/RestaurantCard';
import CategoryCard from '../components/CategoryCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { COLORS } from '../utils/constants';

const HomeScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const { getCartCount } = useCart();

  useEffect(() => {
    console.log('[HomeScreen] mounted');
    loadData();
  }, []);

  useEffect(() => {
    console.log('[Filter] search:', searchQuery, 'category:', selectedCategory);
    filterRestaurants();
  }, [searchQuery, selectedCategory, restaurants]);

  const loadData = async () => {
    console.log('[API] Loading restaurants & categories...');
    try {
      const [restaurantsRes, categoriesRes] = await Promise.all([
        restaurantAPI.getAll(),
        restaurantAPI.getCategories(),
      ]);

      console.log('[API] Restaurants response:', restaurantsRes?.data);
      console.log('[API] Categories response:', categoriesRes?.data);

      if (restaurantsRes.data.success) {
        setRestaurants(restaurantsRes.data.data);
        console.log(
          '[State] Restaurants set:',
          restaurantsRes.data.data.length
        );
      }

      if (categoriesRes.data.success) {
        setCategories(categoriesRes.data.data);
        console.log(
          '[State] Categories set:',
          categoriesRes.data.data.length
        );
      }
    } catch (error) {
      console.error('[API ERROR] Failed to load data:', error);
      setSnackbarMessage('Failed to load restaurants');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
      console.log('[API] Loading finished');
    }
  };

  const onRefresh = useCallback(() => {
    console.log('[UI] Pull-to-refresh triggered');
    setRefreshing(true);
    loadData();
  }, []);

  const filterRestaurants = () => {
    let filtered = restaurants;

    if (searchQuery) {
      filtered = filtered.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log('[Filter] After search:', filtered.length);
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (restaurant) => restaurant.category === selectedCategory
      );
      console.log('[Filter] After category:', filtered.length);
    }

    setFilteredRestaurants(filtered);
  };

  const handleCategoryPress = (category) => {
    console.log('[UI] Category pressed:', category.name);

    if (selectedCategory === category.name) {
      console.log('[State] Category cleared');
      setSelectedCategory(null);
    } else {
      console.log('[State] Category selected:', category.name);
      setSelectedCategory(category.name);
    }
  };

  if (loading) {
    console.log('[UI] Showing loading spinner');
    return <LoadingSpinner message="Loading restaurants..." />;
  }

  const popularRestaurants = restaurants.filter((r) => r.isPopular);
  console.log('[Derived] Popular restaurants:', popularRestaurants.length);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hello! 👋</Text>
            <Text style={styles.location}>
              <Ionicons name="location" size={16} color={COLORS.primary} />
              {' '}Rawalpindi, Pakistan
            </Text>
          </View>
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={(text) => {
            console.log('[UI] Search changed:', text);
            setSearchQuery(text);
          }}
          placeholder="Search restaurants or cuisines..."
        />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <CategoryCard
                category={item}
                onPress={() => handleCategoryPress(item)}
              />
            )}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {!searchQuery && !selectedCategory && popularRestaurants.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Restaurants</Text>
            {popularRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant._id}
                restaurant={restaurant}
                onPress={() => {
                  console.log('[Navigation] Open restaurant:', restaurant._id);
                  navigation.navigate('Restaurant', { id: restaurant._id });
                }}
              />
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedCategory
              ? `${selectedCategory} Restaurants`
              : searchQuery
              ? 'Search Results'
              : 'All Restaurants'}
          </Text>

          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant._id}
                restaurant={restaurant}
                onPress={() => {
                  console.log('[Navigation] Open restaurant:', restaurant._id);
                  navigation.navigate('Restaurant', { id: restaurant._id });
                }}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="restaurant-outline" size={64} color={COLORS.grey} />
              <Text style={styles.emptyText}>No restaurants found</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {getCartCount() > 0 && (
        <FAB
          icon="cart"
          label={`${getCartCount()} items`}
          style={styles.fab}
          onPress={() => {
            console.log('[Navigation] Open cart');
            navigation.navigate('Cart');
          }}
          color={COLORS.white}
        />
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => {
          console.log('[UI] Snackbar dismissed');
          setSnackbarVisible(false);
        }}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};
