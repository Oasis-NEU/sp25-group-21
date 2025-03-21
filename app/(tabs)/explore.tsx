import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  ScrollView
} from "react-native";
import Swiper from "react-native-deck-swiper";
import { supabase } from "../../supabaseClient";

const { width, height } = Dimensions.get("window");

const categories = ["Fast Food", "Restaurant", "Cafe"];

const ExplorePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (!selectedCategory) {
      setFoodItems([]);
      return;
    }
    fetchFoodItems();
  }, [selectedCategory]);

  const fetchFoodItems = async () => {
    let query = supabase
      .from("store")
      .select("serialid, businessname, image_url, category, rating, description")
      .eq("category", selectedCategory)
      .limit(50); 
  
    const { data, error } = await query;
  
    if (error) {
      console.error("Error fetching food items:", error);
    } else {
      const shuffledData = data
        .map((restaurant: any) => ({
          id: restaurant.serialid,
          name: restaurant.businessname,
          image: restaurant.image_url,
          rating: restaurant.rating,
          description: restaurant.description,
        }))
        .sort(() => Math.random() - 0.5); // Shuffle restaurants
  
      // 🛠 Duplicate the list to create even more cards
      const expandedData = [...shuffledData, ...shuffledData, ...shuffledData]; // Tripled data size
  
      setFoodItems(expandedData);
    }
  };
  

  const handleSwipeRight = (index: number) => {
    setFoodItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSwipeLeft = async (index: number) => {
    setFoodItems((prev) => prev.filter((_, i) => i !== index));

    let query = supabase
      .from("store")
      .select("serialid, businessname, image_url, category, rating, description")
      .eq("category", selectedCategory)
      .limit(1);

    const { data, error } = await query;

    if (!error && data.length > 0) {
      const newRestaurant = {
        id: data[0].serialid,
        name: data[0].businessname,
        image: data[0].image_url,
        rating: data[0].rating,
        description: data[0].description,
      };
      setFoodItems((prev) => [...prev, newRestaurant]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Category Selection Bar at the Top */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((item) => (
            <TouchableOpacity
  key={item}
  style={[
    styles.categoryButton,
    selectedCategory === item && styles.selectedCategoryButton,
  ]}
  onPress={() => {
    setSelectedCategory(item); // 🛠 Set new category
    setFoodItems([]); // 🛠 Reset food items immediately
    fetchFoodItems(); // 🛠 Fetch new items for the new category
  }}
>
  <Text
    style={[
      styles.categoryText,
      selectedCategory === item && styles.selectedCategoryText,
    ]}
  >
    {item}
  </Text>
</TouchableOpacity>

          ))}
        </ScrollView>
      </View>

      {/* Swiper Cards Below */}
      {selectedCategory ? (
        foodItems.length > 0 ? (
          <View style={styles.swiperContainer}>
            <Swiper
              ref={swiperRef}
              cards={foodItems.length > 0 ? foodItems : [{}]} 
              renderCard={(card) =>
                card && card.image ? (
                  <View style={styles.card}>
                    <Image source={{ uri: card.image }} style={styles.cardImage} />
                    <Text style={styles.cardText}>{card.name}</Text>
                    <Text style={styles.cardRating}>⭐ {card.rating}</Text>
                    <Text style={styles.cardDescription}>{card.description}</Text>
                  </View>
                ) : (
                  <View style={styles.card}>
                    <Text style={styles.noResultsText}>No more restaurants available.</Text>
                  </View>
                )
              }
              onSwipedRight={handleSwipeRight}
              onSwipedLeft={handleSwipeLeft}
              stackSize={3}
              backgroundColor="transparent"
              overlayLabels={{
                left: {
                  title: "DISLIKE",
                  style: {
                    label: {
                      backgroundColor: "red",
                      color: "white",
                      fontSize: 16,
                      padding: 6,
                      borderRadius: 5,
                    },
                    wrapper: {
                      flexDirection: "column",
                      alignItems: "flex-end",
                      justifyContent: "flex-start",
                      marginTop: 8,
                      marginLeft: -8,
                    },
                  },
                },
                right: {
                  title: "LIKE",
                  style: {
                    label: {
                      backgroundColor: "green",
                      color: "white",
                      fontSize: 16,
                      padding: 6,
                      borderRadius: 5,
                    },
                    wrapper: {
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      marginTop: 8,
                      marginLeft: 8,
                    },
                  },
                },
              }}
            />
          </View>
        ) : (
          <Text style={styles.noResultsText}>No more restaurants available.</Text>
        )
      ) : (
        <Text style={styles.selectedCategoryText}>Select a category to see restaurants</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingTop: 10,
    alignItems: "center",
  },
  categoryContainer: {
    width: "100%",
    height: 50, // Slimmer category bar
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryButton: {
    marginHorizontal: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
  },
  selectedCategoryButton: {
    backgroundColor: "#000",
  },
  categoryText: {
    fontSize: 14,
    color: "#000",
  },
  selectedCategoryText: {
    color: "#000",
  },
  swiperContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.9,
  },
  card: {
    width: width * 0.85,
    height: height * 0.6,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    padding: 12,
  },
  cardImage: {
    width: "95%",
    height: "55%",
    borderRadius: 12,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
    color: "#333",
  },
  cardRating: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFA500",
    marginTop: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  noResultsText: { 
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});

export default ExplorePage;