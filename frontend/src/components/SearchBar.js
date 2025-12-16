import React from 'react';
import { StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { COLORS } from '../utils/constants';

const SearchBar = ({ value, onChangeText, placeholder = 'Search restaurants...' }) => {
  return (
    <Searchbar
      placeholder={placeholder}
      onChangeText={onChangeText}
      value={value}
      style={styles.searchBar}
      iconColor={COLORS.primary}
      inputStyle={styles.input}
    />
  );
};

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: COLORS.light,
    borderRadius: 10,
    elevation: 0,
  },
  input: {
    fontSize: 14,
  },
});

export default SearchBar;