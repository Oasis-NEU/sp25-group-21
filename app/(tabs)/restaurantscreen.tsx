import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';

const RestaurantScreen = ({ route }) => {
  const { restaurant } = route.params;

  // Dummy menu data (replace with actual API data)
  const menuItems = [
    { id: '1', name: 'Margherita Pizza', price: '$10', image: 'https://via.placeholder.com/100' },
    { id: '2', name: 'Pepperoni Pizza', price: '$12', image: 'https://via.placeholder.com/100' },
    { id: '3', name: 'Garlic Bread', price: '$5', image: 'https://via.placeholder.com/100' },
  ];

  return (
    <View style={styles.container}>
      <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
      <Text style={styles.title}>{restaurant.name}</Text>

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Image source={{ uri: item.image }} style={styles.menuImage} />
            <Text style={styles.menuText}>{item.name} - {item.price}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  restaurantImage: { width: '100%', height: 200, borderRadius: 10 },
  title: { fontSize: 22, fontWeight: 'bold', marginVertical: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  menuImage: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  menuText: { fontSize: 16 },
});

export default RestaurantScreen;
