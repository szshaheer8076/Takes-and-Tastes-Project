import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../utils/constants';

const RestaurantCard = ({ restaurant, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: restaurant.image }} style={styles.image} />
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name} numberOfLines={1}>
              {restaurant.name}
            </Text>
            {restaurant.discount > 0 && (
              <Chip
                style={styles.discountChip}
                textStyle={styles.discountText}
                compact
              >
                {restaurant.discount}% OFF
              </Chip>
            )}
          </View>

          <Text style={styles.description} numberOfLines={1}>
            {restaurant.description}
          </Text>

          <View style={styles.footer}>
            <View style={styles.infoItem}>
              <Ionicons name="star" size={16} color={COLORS.warning} />
              <Text style={styles.infoText}>{restaurant.rating}</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={16} color={COLORS.grey} />
              <Text style={styles.infoText}>{restaurant.deliveryTime}</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="bicycle-outline" size={16} color={COLORS.grey} />
              <Text style={styles.infoText}>Rs. {restaurant.deliveryFee}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
  },
  image: {
    height: 180,
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    flex: 1,
  },
  discountChip: {
    backgroundColor: COLORS.success,
    marginLeft: 8,
  },
  discountText: {
    color: COLORS.white,
    fontSize: 10,
  },
  description: {
    fontSize: 13,
    color: COLORS.grey,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 4,
    fontSize: 12,
    color: COLORS.grey,
  },
});

export default RestaurantCard;