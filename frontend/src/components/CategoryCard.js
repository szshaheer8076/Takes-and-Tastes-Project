import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { COLORS, SHADOWS } from '../utils/constants';

const CategoryCard = ({ category, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Text style={styles.icon}>{category.icon}</Text>
          <Text style={styles.name} numberOfLines={1}>
            {category.name}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 100,
    marginRight: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  content: {
    alignItems: 'center',
    padding: 12,
  },
  icon: {
    fontSize: 32,
    marginBottom: 4,
  },
  name: {
    fontSize: 12,
    textAlign: 'center',
    color: COLORS.dark,
  },
});

export default CategoryCard;