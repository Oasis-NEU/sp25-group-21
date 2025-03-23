import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';

export default function OrderHistoryScreen() {
  const navigation = useNavigation();

useEffect(() => {
  navigation.setOptions({ title: "Order History" });
}, []);

  const [pastOrders, setPastOrders] = useState<any[]>([]);

  useEffect(() => {
    loadPastOrders();
  }, []);

  const loadPastOrders = async () => {
    try {
      const ordersData = await AsyncStorage.getItem('pastOrders');
      if (ordersData) {
        setPastOrders(JSON.parse(ordersData));
      } else {
        // If no past orders exist, initialize with sample data
        const sampleOrders = [
          { id: '1', restaurant: 'McDonalds', items: ['Big Mac', 'Fries'], total: 8.99, date: '2024-03-01' },
          { id: '2', restaurant: 'Subway', items: ['Turkey Sub', 'Chips'], total: 6.49, date: '2024-03-05' },
          { id: '3', restaurant: 'Starbucks', items: ['Latte', 'Croissant'], total: 7.99, date: '2024-03-10' },
          { id: '4', restaurant: 'Taco Bell', items: ['Burrito', 'Taco'], total: 5.99, date: '2024-03-15' },
        ];
        await AsyncStorage.setItem('pastOrders', JSON.stringify(sampleOrders));
        setPastOrders(sampleOrders);
      }
    } catch (error) {
      console.error('❌ Failed to load past orders:', error);
    }
  };

  const clearPastOrders = async () => {
    try {
      await AsyncStorage.removeItem('pastOrders');
      setPastOrders([]);
      console.log('🛒 Past Orders Cleared');
    } catch (error) {
      console.error('❌ Error clearing past orders:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Past Orders</Text>

      {pastOrders.length === 0 ? (
        <Text style={styles.emptyText}>No past orders found.</Text>
      ) : (
        <FlatList
          data={pastOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Text style={styles.restaurantName}>{item.restaurant}</Text>
              <Text style={styles.orderItems}>{item.items.join(', ')}</Text>
              <Text style={styles.orderTotal}>Total: ${item.total.toFixed(2)}</Text>
              <Text style={styles.orderDate}>{item.date}</Text>
            </View>
          )}
        />
      )}

      {pastOrders.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearPastOrders}>
          <Text style={styles.clearButtonText}>Clear Past Orders</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
  },
  orderItem: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 16,
    color: '#555',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4371A7',
    marginTop: 4,
  },
  orderDate: {
    fontSize: 14,
    color: 'gray',
    marginTop: 2,
  },
  clearButton: {
    marginTop: 20,
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
