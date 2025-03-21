import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Keyboard } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { router } from 'expo-router';
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
import {supabase} from '../../supabaseClient';

// Dummy restaurant categories with images
const restaurantCategories = [
  {
    id: '1',
    title: 'Top Rated',
    description: 'Highly rated restaurants',
    image: 'https://via.placeholder.com/300x150', // Category image
    restaurants: [
      { id: '626', name: 'Dunkin', image: 'https://embroideres.com/files/3416/1239/3221/Dunkin_donuts_round_logo_embroidery_design.jpg' },
      { id: '102', name: 'Sushi Central', image: 'https://images.rappi.com.mx/restaurants_logo/sushi-central-logo1-1567727663518-1671543413280.png' },
      { id: '103', name: 'Burger Hub', image: 'https://static.wixstatic.com/media/9a1d3f_98137e3ad55a455c866d8b5bbd444988~mv2.png/v1/fill/w_563,h_251,al_c,lg_1,q_85,enc_avif,quality_auto/Burger%20Hub%20Logo%20_%20Located%20at%206231%20S%2027th%20St%20Greenfield%2C%20WI%2053221%20_edited.png' },
      { id: '104', name: 'Pasta House', image: 'https://images.getbento.com/accounts/37f1434cf89df96a29c06808001134ce/media/images/Catering_Logo_24-removebg-preview.png?w=1000&fit=max&auto=compress,format&h=1000' },
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
      { id: '204', name: 'Taco Fiesta', image: 'https://media-cdn.grubhub.com/image/upload/d_search:browse-images:default.jpg/w_300,q_100,fl_lossy,dpr_2.0,c_fit,f_auto,h_300/oxpywb3ibcqd6vtszdfq' },
    ],
  },
  {
    id: '3',
    title: 'Healthy Choices',
    description: 'Fresh and nutritious',
    image: 'https://via.placeholder.com/300x150',
    restaurants: [
      { id: '301', name: 'Green Bowl', image: 'https://scontent-bos5-1.xx.fbcdn.net/v/t39.30808-6/299429507_430244989128172_7591400791845350871_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=yUvb0rS1AJEQ7kNvgEfblwv&_nc_zt=23&_nc_ht=scontent-bos5-1.xx&_nc_gid=rPWGnOIy9D35HKqY6PkZqA&oh=00_AYGUiMhsC4ERpzzBYLsQTDIOmQdMoILJW3NY1c4p5R6bLQ&oe=67DA5F42' },
      { id: '302', name: 'Smoothie Heaven', image: 'https://via.placeholder.com/150' },
      { id: '303', name: 'Vegan Delights', image: 'https://via.placeholder.com/150' },
      { id: '304', name: 'Organic Bites', image: 'https://via.placeholder.com/150' },
    ],
  },
];

type RootStackParamList = {
  Home: undefined;
  Restaurant: { restaurant: { id: string; name: string; image: string } };
  Menu: {name: string; image: string};
};

// ✅ Define the navigation type
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

 
const HomeScreen: React.FC = () => {
  const [error, setError] = useState("");
  const [stores, setStores] = useState<any[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<
  { id: string; name: string; image: string }[]
>([]);
const [searchQuery, setSearchQuery] = useState('');
 // ✅ Use the correctly typed navigation hook
 const navigation = useNavigation<HomeScreenNavigationProp>();
  useEffect(()=>{
    GetStores();
  },[])

  const handleSearch = (query: string) => {
    setSearchQuery(query);
 
    if (!query.trim()) {
      setFilteredRestaurants([]);
      return;
    }
 
    const foundRestaurants = restaurantCategories
      .flatMap(category => category.restaurants)
      .filter(restaurant => restaurant.name.toLowerCase().includes(query.toLowerCase()));
 
    setFilteredRestaurants(foundRestaurants);
    Keyboard.dismiss();
  };

  async function GetStores (){
    const { data, error} = await supabase.from('store').select('*');
    if (error){
      setError("Failed to fetch data");
      return        
    }
    console.log(data);
    setStores(data);
  }

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
            <Categories />
            {searchQuery && (
              <>
                <Text style={styles.searchTitle}>Search Results:</Text>
                {filteredRestaurants.length > 0 ? (
                  <FlatList
                    data={filteredRestaurants}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <View style={styles.restaurantCard}>
                        <Image source={{ uri: item.image }} style={styles.restaurantImage} />
                        <View style={styles.restaurantInfo}>
                          <Text style={styles.restaurantName}>{item.name}</Text>
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
        data={stores}
        keyExtractor={(category) => category.id}
        renderItem={({ item: category }) => (
          <FlatList
            data={stores}
            keyExtractor={(item) => item.id.toString()}
             numColumns={4}  // Ensures 4 restaurants per row
            columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 10 }} // Ensures proper spacing
            renderItem={({ item }) => (
              <TouchableOpacity
              style={styles.restaurantCard}
              onPress={() =>
                router.push({
                  pathname: '/menu/[id]',
                  params: { id: item.id, name: item.businessname, image: item.image_url }
                })
              } 
            >
              <Image source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} style={styles.restaurantImage} />
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{item.businessname}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

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
  scrollContent: {
    paddingBottom: 80,
    alignItems: 'center',
  },
  featuredRowContainer: {
    width: '100%',
    marginVertical: 10,
  },
  categoryImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 5,
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  restaurantCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  restaurantImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 100,
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
  detailsButton: { marginLeft: 10, padding: 5 },
 

});

export default HomeScreen;