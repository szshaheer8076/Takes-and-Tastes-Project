import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../utils/constants';

const OrderCard = ({ order, onPress }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return COLORS.success;
      case 'Cancelled':
        return COLORS.error;
      case 'On the way':
        return COLORS.info;
      default:
        return COLORS.warning;
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Text style={styles.restaurantName} numberOfLines={1}>
              {order.restaurant?.name}
            </Text>
            <Chip
              style={[styles.statusChip, { backgroundColor: getStatusColor(order.status) }]}
              textStyle={styles.statusText}
              compact
            >
              {order.status}
            </Chip>
          </View>

          <Text style={styles.date}>
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>

          <View style={styles.itemsContainer}>
            <Text style={styles.itemsLabel}>Items:</Text>
            <Text style={styles.itemsText} numberOfLines={2}>
              {order.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}
            </Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Ionicons name="receipt-outline" size={16} color={COLORS.grey} />
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>Rs. {order.totalAmount}</Text>
            </View>

            <Text style={styles.deliveryTime}>
              <Ionicons name="time-outline" size={14} color={COLORS.grey} />
              {' '}{order.estimatedDeliveryTime}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
    flex: 1,
  },
  statusChip: {
    marginLeft: 8,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 10,
  },
  date: {
    fontSize: 12,
    color: COLORS.grey,
    marginBottom: 12,
  },
  itemsContainer: {
    marginBottom: 12,
  },
  itemsLabel: {
    fontSize: 12,
    color: COLORS.grey,
    marginBottom: 4,
  },
  itemsText: {
    fontSize: 13,
    color: COLORS.dark,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 13,
    color: COLORS.grey,
    marginLeft: 4,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 8,
  },
  deliveryTime: {
    fontSize: 12,
    color: COLORS.grey,
  },
});

export default OrderCard;