import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
} from 'react-native';

import Categories from '../components/Categories';

// Dummy restaurant categories with images
const restaurantCategories = [
  {
    id: '1',
    title: 'Top Rated',
    description: 'Highly rated restaurants',
    image: 'https://via.placeholder.com/300x150',
    restaurants: [
      { id: '101', name: 'Pizza Palace', image: 'https://bellowsfallsvt.org/wp-content/uploads/2021/09/Pizza-Palace.jpg' },
      { id: '102', name: 'Sushi Central', image: 'https://images.rappi.com.mx/restaurants_logo/sushi-central-logo1-1567727663518-1671543413280.png' },
      { id: '103', name: 'Burger Hub', image: 'https://static.wixstatic.com/media/9a1d3f_98137e3ad55a455c866d8b5bbd444988~mv2.png' },
      { id: '104', name: 'Pasta House', image: 'https://images.getbento.com/accounts/37f1434cf89df96a29c06808001134ce/media/images/Catering_Logo_24-removebg-preview.png' },
    ],
  },
  {
    id: '2',
    title: 'Fast Food',
    description: 'Quick and delicious',
    image: 'https://via.placeholder.com/300x150',
    restaurants: [
      { id: '201', name: 'McBurger', image: 'https://static.vecteezy.com/system/resources/previews/007/166/415/non_2x/burger-logo-design-template-vector.jpg' },
      { id: '202', name: 'Fries & More', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScP5QnmqugI2I0zVyZ3IUbt6zNL37C7IbntQ&s' },
      { id: '203', name: 'KFC', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/57/KFC_logo-image.svg/1200px-KFC_logo-image.svg.png' },
      { id: '204', name: 'Taco Fiesta', image: 'https://media-cdn.grubhub.com/image/upload/d_search:browse-images:default.jpg/w_300,q_100' },
    ],
  },
  {
    id: '3',
    title: 'Healthy Choices',
    description: 'Fresh and nutritious',
    image: 'https://via.placeholder.com/300x150',
    restaurants: [
      { id: '301', name: 'Green Bowl', image: 'https://scontent-bos5-1.xx.fbcdn.net/v/t39.30808-6/299429507_430244989128172_7591400791845350871_n.jpg' },
      { id: '302', name: 'Smoothie Heaven', image: 'https://via.placeholder.com/150' },
      { id: '303', name: 'Vegan Delights', image: 'https://via.placeholder.com/150' },
      { id: '304', name: 'Organic Bites', image: 'https://via.placeholder.com/150' },
    ],
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState({});

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  useEffect(() => {
    filterRestaurants(searchQuery);
  }, [searchQuery]);

  const filterRestaurants = (query) => {
    if (!query.trim()) {
      setFilteredRestaurants({});
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const newFilteredRestaurants = {};

    restaurantCategories.forEach((category) => {
      const filtered = category.restaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(lowercaseQuery)
      );
      if (filtered.length > 0) {
        newFilteredRestaurants[category.id] = filtered;
      }
    });

    setFilteredRestaurants(newFilteredRestaurants);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />

      {/* Header */}
      <View style={styles.header}>
        <Image style={styles.profileImage} source={{ uri: 'https://via.placeholder.com/56' }} />
        <View style={styles.locationContainer}>
          <Text style={styles.deliveryText}>Deliver Now?</Text>
          <TouchableOpacity>
            <Text style={styles.currentLocation}>
              Current Location <Ionicons name="chevron-down" size={20} color="#4371A7" />
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Ionicons name="person-outline" size={35} color="#4371A7" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            placeholder="Restaurants and cuisines"
            keyboardType="default"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Body */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Categories />

        {/* Restaurant Rows with Images */}
        {restaurantCategories.map((category) => (
          <View key={category.id} style={styles.featuredRowContainer}>
            {/* Category Image */}
            <Image source={{ uri: category.image }} style={styles.categoryImage} />

            {/* Title & Arrow */}
            <View style={styles.rowHeader}>
              <Text style={styles.rowTitle}>{category.title}</Text>
              <TouchableOpacity>
                <Ionicons name="arrow-forward" size={24} color="#4371A7" />
              </TouchableOpacity>
            </View>

            {/* Restaurants */}
            <FlatList
              data={
                searchQuery && filteredRestaurants[category.id] !== undefined
                  ? filteredRestaurants[category.id]
                  : category.restaurants
              }
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.restaurantCard}>
                  <Image source={{ uri: item.image }} style={styles.restaurantImage} />
                  <Text style={styles.restaurantName}>{item.name}</Text>
                </View>
              )}
            />
          </View>
        ))}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  profileImage: {
    height: 56,
    width: 56,
    borderRadius: 28,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e5e5',
    flex: 1,
    padding: 10,
    borderRadius: 8,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
  },
});

export default HomeScreen;
