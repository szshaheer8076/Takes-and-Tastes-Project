import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import { COLORS, SHADOWS } from '../utils/constants';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <Image source={{ uri: item.image }} style={styles.image} />

        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.price}>Rs. {item.price}</Text>
        </View>

        <View style={styles.controls}>
          <IconButton
            icon="minus"
            size={20}
            iconColor={COLORS.primary}
            style={styles.controlButton}
            onPress={() => onUpdateQuantity(item._id, item.quantity - 1)}
          />
          <Text style={styles.quantity}>{item.quantity}</Text>
          <IconButton
            icon="plus"
            size={20}
            iconColor={COLORS.primary}
            style={styles.controlButton}
            onPress={() => onUpdateQuantity(item._id, item.quantity + 1)}
          />
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.total}>Rs. {item.price * item.quantity}</Text>
          <IconButton
            icon="delete"
            size={20}
            iconColor={COLORS.error}
            onPress={() => onRemove(item._id)}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  container: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: COLORS.grey,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  controlButton: {
    margin: 0,
    backgroundColor: COLORS.light,
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
    color: COLORS.dark,
  },
  totalContainer: {
    alignItems: 'center',
  },
  total: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default CartItem;