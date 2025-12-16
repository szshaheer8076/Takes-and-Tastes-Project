import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List, Avatar, Button, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/constants';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Avatar.Text
          size={80}
          label={user?.name?.substring(0, 2).toUpperCase() || 'U'}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('EditProfile')}
          style={styles.editButton}
          icon="pencil"
        >
          Edit Profile
        </Button>
      </View>

      <Divider />

      {/* Menu Items */}
      <View style={styles.menu}>
        <List.Item
          title="Order History"
          description="View your past orders"
          left={(props) => (
            <List.Icon {...props} icon="history" color={COLORS.primary} />
          )}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('OrderHistory')}
          style={styles.menuItem}
        />

        <List.Item
          title="Delivery Addresses"
          description="Manage your addresses"
          left={(props) => (
            <List.Icon {...props} icon="map-marker" color={COLORS.primary} />
          )}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
          style={styles.menuItem}
        />

        <List.Item
          title="Payment Methods"
          description="Manage payment options"
          left={(props) => (
            <List.Icon {...props} icon="credit-card" color={COLORS.primary} />
          )}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
          style={styles.menuItem}
        />

        <List.Item
          title="Help & Support"
          description="Get help and FAQs"
          left={(props) => (
            <List.Icon {...props} icon="help-circle" color={COLORS.primary} />
          )}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
          style={styles.menuItem}
        />

        <List.Item
          title="About"
          description="App version 1.0.0"
          left={(props) => (
            <List.Icon {...props} icon="information" color={COLORS.primary} />
          )}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {}}
          style={styles.menuItem}
        />
      </View>

      <Divider />

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          icon="logout"
          buttonColor={COLORS.error}
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.light,
  },
  avatar: {
    backgroundColor: COLORS.primary,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: COLORS.grey,
    marginBottom: 16,
  },
  editButton: {
    borderColor: COLORS.primary,
  },
  menu: {
    paddingVertical: 8,
  },
  menuItem: {
    paddingVertical: 4,
  },
  logoutContainer: {
    padding: 16,
    marginTop: 16,
  },
  logoutButton: {
    paddingVertical: 8,
  },
});

export default ProfileScreen;