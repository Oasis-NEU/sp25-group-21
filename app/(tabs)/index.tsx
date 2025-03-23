import { Ionicons } from '@expo/vector-icons';

import React, { ReactNode, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Keyboard } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { router, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import {supabase} from '../../supabaseClient';


type RootStackParamList = {
  Home: undefined;
  Restaurant: { restaurant: { id: string; name: string; image: string } };
  Menu: { name: string; image: string };
  Cart: undefined; 
};

// ✅ Define the navigation prop type
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const [error, setError] = useState("");
  const [stores, setStores] = useState<any[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<
    {
      businessname: ReactNode;
      image_url: string | undefined;
      serialid: any; id: string; name: string; image: string 
}[]
  >( []);
  const [searchQuery, setSearchQuery] = useState('');
  
  // ✅ Use the navigation hook
  const router = useRouter();

  useEffect(() => {
    GetStores();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredRestaurants([]);
      return;
    }

    const foundRestaurants = stores.filter((store) =>
      store.businessname.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredRestaurants(foundRestaurants);
    Keyboard.dismiss();
  };

  async function GetStores() {
    const { data, error } = await supabase.from('store').select('*');
    if (error) {
      setError("Failed to fetch data");
      return;
    }
    setStores(data);
  }

  // Group the restaurants into rows of 5 for the grid layout
  const groupRestaurants = (restaurants: any[], groupSize: number) => {
    const grouped = [];
    for (let i = 0; i < restaurants.length; i += groupSize) {
      grouped.push(restaurants.slice(i, i + groupSize));
    }
    return grouped;
  };

  const groupedRestaurants = groupRestaurants(stores, 5);

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

  {/* Cart Icon */}
  <TouchableOpacity onPress={async () => {
  const storedCart = await AsyncStorage.getItem('cart');
  console.log("Cart Data:", storedCart);
  router.push('/screens/CartScreen');
}}>
  <Ionicons name="cart-outline" size={35} color="#4371A7" />
</TouchableOpacity>


  {/* Profile Icon */}
  <TouchableOpacity>
    <Ionicons name="person-outline" size={35} color="#4371A7" />
  </TouchableOpacity>
</View>


      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            placeholder="Search for a restaurant"
            keyboardType="default"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={(event) => handleSearch(event.nativeEvent.text)}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity>
          <Ionicons name="filter" size={24} color="#4371A7" />
        </TouchableOpacity>
      </View>

      {/* FlatList - Main Content */}
      <FlatList
        ListHeaderComponent={
          <>
            {searchQuery && (
              <>
                <Text style={styles.searchTitle}>Search Results:</Text>
                {filteredRestaurants.length > 0 ? (
                  <FlatList
                    data={filteredRestaurants}
                    keyExtractor={(item) => item.serialid.toString()}
                    renderItem={({ item }) => (
                      <View style={styles.restaurantCard}>
                        <Image source={{ uri: item.image_url }} style={styles.restaurantImage} />
                        <View style={styles.restaurantInfo}>
                          <Text style={styles.restaurantName}>{item.businessname}</Text>
                        </View>
                      </View>
                    )}
                  />
                ) : (
                  <Text style={styles.noResults}>No restaurants found</Text>
                )}
              </>
            )}
          </>
        }
        data={groupedRestaurants}
        keyExtractor={(group, index) => index.toString()}
        renderItem={({ item: group }) => (
          <View style={styles.row}>
            <FlatList
              horizontal
              data={group}
              keyExtractor={(restaurant) => restaurant.serialid.toString()}
              renderItem={({ item: restaurant }) => (
                <TouchableOpacity
                  key={restaurant.serialid}
                  style={styles.restaurantCard}
                  onPress={() =>
                    router.push({
                      pathname: "./menu/[id]",
                      params: { id: restaurant.serialid, name: restaurant.businessname, image: restaurant.image_url }
                    })
                  }
                >
                  <Image source={{ uri: restaurant.image_url }} style={styles.restaurantImage} />
                  <View style={styles.restaurantInfo}>
                    <Text style={styles.restaurantName}>{restaurant.businessname}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  profileImage: {
    height: 56,
    width: 56,
    backgroundColor: '#4371A7',
    borderRadius: 28,
  },
  locationContainer: {
    flex: 1,
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: 12,
    color: 'gray',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  currentLocation: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    width: '100%',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e5e5',
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginRight: 5,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
  },
  row: {
    marginBottom: 20,
  },
  restaurantCard: {
    backgroundColor: '#fff',
    width: 120,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10, // Adds space between restaurant cards
    alignItems: 'center',
  },
  restaurantImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  restaurantName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  noResults: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
  restaurantInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
});

export default HomeScreen;
