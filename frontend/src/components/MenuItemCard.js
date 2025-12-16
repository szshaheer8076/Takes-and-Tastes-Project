import React from 'react';
import { TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { COLORS, SHADOWS } from '../utils/constants';

const MenuItemCard = ({ item, onAddToCart }) => {
  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <View style={styles.leftContent}>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.price}>Rs. {item.price}</Text>
          {item.discount > 0 && (
            <Text style={styles.discount}>{item.discount}% OFF</Text>
          )}
        </View>

        <View style={styles.rightContent}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Button
            mode="contained"
            style={styles.addButton}
            labelStyle={styles.addButtonText}
            onPress={() => onAddToCart(item)}
            compact
          >
            ADD
          </Button>
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
  },
  leftContent: {
    flex: 1,
    paddingRight: 12,
  },
  rightContent: {
    width: 120,
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: COLORS.grey,
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  discount: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default MenuItemCard;