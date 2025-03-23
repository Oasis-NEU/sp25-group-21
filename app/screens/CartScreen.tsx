import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';


// Function to add an item to the cart
const addToCart = async (item: { id: any; }) => {
    try {
      const cartData = await AsyncStorage.getItem("cart");
      let cart = cartData ? JSON.parse(cartData) : [];
  
      // Check if item already exists (Optional: increase quantity)
      const existingItem = cart.find((cartItem: { id: any; }) => cartItem.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...item, quantity: 1 });
      }
  
      await AsyncStorage.setItem("cart", JSON.stringify(cart));
      console.log("Item added:", item);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

const CartScreen = () => {
  const [cart, setCart] = useState<any[]>([]);
  const navigation = useNavigation();

  // Load cart items from AsyncStorage
  useFocusEffect(
    React.useCallback(() => {
      const loadCart = async () => {
        const cartData = await AsyncStorage.getItem('cart');
        if (cartData) {
          setCart(JSON.parse(cartData));
        }
      };
      loadCart();
    }, [])
  );

  // Remove an item from cart
  const removeItem = async (id: any) => {
    try {
      const updatedCart = cart.filter(item => item.id !== id);
      setCart(updatedCart);
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };
  

  // Calculate total price
  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0).toFixed(2);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Cart</Text>
        <Ionicons name="cart" size={30} color="black" />
      </View>

      {/* Cart Items */}
      {cart.length > 0 ? (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Text style={styles.itemText}>
                {item.name} - ${item.price.toFixed(2)}
              </Text>
              <TouchableOpacity onPress={() => removeItem(item.id)}>
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyCart}>Your cart is empty</Text>
      )}

      {/* Total Price and Checkout Button */}
      {cart.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalText}>Total: ${totalPrice}</Text>
          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: { fontSize: 18 },
  emptyCart: { fontSize: 18, textAlign: 'center', marginTop: 20, color: 'gray' },
  footer: { paddingVertical: 16, alignItems: 'center' },
  totalText: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  checkoutButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  checkoutText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default CartScreen;
