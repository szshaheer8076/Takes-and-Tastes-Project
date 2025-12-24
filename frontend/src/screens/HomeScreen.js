// src/screens/HomeScreen.js
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Searchbar,
  Card,
  ActivityIndicator,
  Chip,
  Badge,
  useTheme,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { restaurantAPI } from '../services/api';
import RestaurantCard from '../components/RestaurantCard';

export default function HomeScreen({ navigation }) {
  const theme = useTheme();
  const { user } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);

  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null); // will store category name (string)
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log('[HomeScreen] mounted');
    loadData();
  }, []);

  useEffect(() => {
    console.log('[Filter] search:', searchQuery, 'category:', selectedCategory);
  }, [searchQuery, selectedCategory]);

  const loadData = async () => {
    try {
      console.log('[API] Loading restaurants & categories...');
      setLoading(true);

      // Fetch restaurants and categories
      const [restaurantsRes, categoriesRes] = await Promise.all([
        restaurantAPI.getAll(),
        restaurantAPI.getCategories(),
      ]);

      console.log('[API] Restaurants:', restaurantsRes.data);
      console.log('[API] Categories:', categoriesRes.data);

      setRestaurants(restaurantsRes.data.data || restaurantsRes.data);
      setCategories(categoriesRes.data.data || categoriesRes.data);
    } catch (error) {
      console.error('[API ERROR] Failed to load data:', error);
      console.error('[API ERROR] Error details:', error.response?.data || error.message);
      // Set empty arrays on error so UI still works
      setRestaurants([]);
      setCategories([]);
    } finally {
      setLoading(false);
      console.log('[API] Loading finished');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || restaurant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularRestaurants = filteredRestaurants.filter((r) => r.isPopular);
  console.log('[Derived] Popular restaurants:', popularRestaurants.length);

  const renderCategoryChip = ({ item }) => {
    // Support both object categories ({ name, icon }) and simple string categories
    const categoryName = typeof item === 'string' ? item : item.name;
    const categoryIcon = typeof item === 'string' ? undefined : item.icon;

    return (
      <Chip
        icon={categoryIcon}
        selected={selectedCategory === categoryName}
        onPress={() =>
          setSelectedCategory(
            selectedCategory === categoryName ? null : categoryName
          )
        }
        style={styles.categoryChip}
        mode="outlined"
      >
        {categoryName}
      </Chip>
    );
  };

  const renderRestaurant = ({ item }) => (
    <RestaurantCard
      restaurant={item}
      onPress={() =>
        navigation.navigate('Restaurant', { restaurantId: item._id })
      }
    />
  );

  if (loading) {
    console.log('[UI] Showing loading spinner');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading restaurants...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text variant="titleMedium" style={styles.greeting}>
              Hello, {user?.name || 'Guest'}!
            </Text>
            <Text variant="bodySmall" style={styles.subtitle}>
              What would you like to eat today?
            </Text>
          </View>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="cart-outline" size={28} color="#FF6B35" />
            {getCartCount() > 0 && (
              <Badge style={styles.cartBadge}>{getCartCount()}</Badge>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <Searchbar
          placeholder="Search restaurants..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor="#FF6B35"
        />

        {/* Categories */}
        {categories.length > 0 && (
          <FlatList
            horizontal
            data={categories}
            renderItem={renderCategoryChip}
            keyExtractor={(item, index) =>
              typeof item === 'string'
                ? item
                : item.name || String(index)
            }
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          />
        )}
      </View>

      {/* Restaurants List */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Popular Restaurants */}
        {popularRestaurants.length > 0 && (
          <View style={styles.section}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Popular Restaurants
            </Text>
            <FlatList
              horizontal
              data={popularRestaurants}
              renderItem={renderRestaurant}
              keyExtractor={(item) => item._id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}

        {/* All Restaurants */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            {selectedCategory
              ? `${selectedCategory} Restaurants`
              : 'All Restaurants'}
          </Text>
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant._id}
                restaurant={restaurant}
                onPress={() =>
                  navigation.navigate('Restaurant', {
                    restaurantId: restaurant._id,
                  })
                }
              />
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>No restaurants found</Text>
              </Card.Content>
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  greeting: {
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    color: '#666',
    marginTop: 5,
  },
  cartButton: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF6B35',
  },
  searchBar: {
    marginBottom: 15,
    elevation: 0,
    backgroundColor: '#F5F5F5',
  },
  categoriesContainer: {
    paddingVertical: 5,
  },
  categoryChip: {
    marginRight: 10,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  horizontalList: {
    paddingRight: 20,
  },
  emptyCard: {
    marginVertical: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
});