import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

import { RootStackParamList } from '../(tabs)/App';

type MenuScreenRouteProp = RouteProp<RootStackParamList, 'Menu'>;


export default function RestaurantMenu() {
    const route = useRoute<MenuScreenRouteProp>();
    const navigation = useNavigation();
    const { name, image } = route.params;
    
    const [cart, setCart] = useState<any[]>([]);

    // Load cart from AsyncStorage
    useEffect(() => {
      const loadCart = async () => {
          try {
              const cartData = await AsyncStorage.getItem('cart');
              if (cartData) {
                  setCart(JSON.parse(cartData));
                  console.log("Cart loaded:", JSON.parse(cartData));
              }
          } catch (error) {
              console.error("Failed to load cart:", error);
          }
      };
      loadCart();
  }, []);
  
  

  const menuItems = [
    { id: '1', name: 'Zinger Sandwich', price: 4.49, description: 'A spicy chicken sandwich with lettuce and mayo.' },
    { id: '2', name: 'Tower Burger', price: 1.99, description: 'A stacked burger with crispy chicken, cheese, and sauce.' },
    { id: '3', name: 'Double Down', price: 5.99, description: 'A bunless sandwich with two fried chicken fillets, bacon, and cheese.' },
];


    // Function to add item to cart
    const addToCart = async (item: any) => {
      try {
          // Get the existing cart data
          const cartData = await AsyncStorage.getItem('cart');
          let updatedCart = cartData ? JSON.parse(cartData) : [];
  
          // Add the new item
          updatedCart.push(item);
  
          // Save to AsyncStorage
          await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
  
          // Update local cart state
          setCart(updatedCart);
  
          console.log("Cart Updated:", updatedCart);
      } catch (error) {
          console.error("Error adding item to cart:", error);
      }
  };
  
  

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with Cart Icon */}
<View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="black" />
    </TouchableOpacity>

    <Text style={styles.title}>{name}</Text>

    <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.cartContainer}>
        <Ionicons name="cart-outline" size={30} color="black" />
        {cart.length > 0 && (
            <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cart.length}</Text>
            </View>
        )}
    </TouchableOpacity>
</View>


            {/* Restaurant Image */}
            <Image source={{ uri: image }} style={styles.image} />

            {/* Menu Items */}
            <FlatList
    data={menuItems}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
        <View style={styles.menuItem}>
            <View style={{ flex: 1 }}>
                <Text style={styles.menuText}>{item.name} - ${item.price.toFixed(2)}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
            </View>
            
            {/* Add to Cart Button */}
            <TouchableOpacity onPress={() => addToCart(item)} style={styles.addButton}>
                <Ionicons name="add-circle-outline" size={30} color="green" />
            </TouchableOpacity>
        </View>
    )}
/>


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white', padding: 16 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    addButton: {
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
  },
  
  cartContainer: {
      position: 'relative',
  },
  
  cartBadge: {
      position: 'absolute',
      top: -5,
      right: -5,
      backgroundColor: 'red',
      borderRadius: 10,
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
  },
  
  cartBadgeText: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
  },
  
  menuItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
  },
  
  menuText: {
      fontSize: 18,
      fontWeight: 'bold',
  },
  
  menuDescription: {
      fontSize: 14,
      color: 'gray',
  },
  
    title: { fontSize: 20, fontWeight: 'bold' },
    image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 16 },
    
});

