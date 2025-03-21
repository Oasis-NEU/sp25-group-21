import React, { useState, useRef } from "react";
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

const { width, height } = Dimensions.get("window");

// Food Categories for Filtering (Smaller, Pill-Shaped)
const categories = ["Fast Food", "Italian", "Mexican", "Burgers", "Chinese", "Pizza", "Desserts"];

// Updated Food Data with Correct Image URLs
const foodItems = [
  {
    id: "1",
    name: "Cheeseburger",
    image: "https://source.unsplash.com/400x400/?cheeseburger", 
    category: "Burgers",
  },
  {
    id: "2",
    name: "Margherita Pizza",
    image: "https://source.unsplash.com/400x400/?pizza",
    category: "Pizza",
  },
  {
    id: "3",
    name: "Tacos",
    image: "https://source.unsplash.com/400x400/?tacos",
    category: "Mexican",
  },
  {
    id: "4",
    name: "Pasta Alfredo",
    image: "https://source.unsplash.com/400x400/?pasta",
    category: "Italian",
  },
  {
    id: "5",
    name: "French Fries",
    image: "https://source.unsplash.com/400x400/?fries",
    category: "Fast Food",
  },
];

const ExplorePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const swiperRef = useRef<any>(null);

  // Filtering food items based on selected category
  const filteredFoodItems = selectedCategory
    ? foodItems.filter((item) => item.category === selectedCategory)
    : foodItems;

  return (
    <View style={styles.container}>
      {/* Categories Filter Section (Horizontal Scroll) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.categoryButton,
              selectedCategory === item && styles.selectedCategoryButton,
            ]}
            onPress={() => setSelectedCategory(item === selectedCategory ? null : item)}
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

      {/* Swiper Section */}
      <View style={styles.swiperContainer}>
        <Swiper
          ref={swiperRef}
          cards={filteredFoodItems}
          renderCard={(card) => (
            <View style={styles.card}>
              <Image source={{ uri: card.image }} style={styles.cardImage} />
              <Text style={styles.cardText}>{card.name}</Text>
            </View>
          )}
          onSwipedRight={(index) => console.log(`Liked: ${filteredFoodItems[index].name}`)}
          onSwipedLeft={(index) => console.log(`Disliked: ${filteredFoodItems[index].name}`)}
          stackSize={3}
          backgroundColor="transparent"
          overlayLabels={{
            left: {
              title: "NOPE",
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

      {/* Swipe Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: "red" }]} onPress={() => swiperRef.current.swipeLeft()}>
          <Text style={styles.buttonText}>Dislike</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: "green" }]} onPress={() => swiperRef.current.swipeRight()}>
          <Text style={styles.buttonText}>Like</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Updated Styles (Pill-Shaped Buttons & Tags)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  categoryContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  categoryButton: {
    marginHorizontal: 5,
    paddingVertical: 4,
    paddingHorizontal: 12, // Shorter, pill-like width
    borderRadius: 50, // Makes it pill-shaped
    borderWidth: 1,
    borderColor: "#000",
  },
  selectedCategoryButton: {
    backgroundColor: "#000",
  },
  categoryText: {
    fontSize: 10, // Small text
    color: "#000",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  swiperContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  card: {
    width: width * 0.85,
    height: height * 0.55,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  cardImage: {
    width: "100%",
    height: "80%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 20,
  },
  button: {
    paddingVertical: 4,  // Smaller vertical size
    paddingHorizontal: 20, // Wide and pill-like
    borderRadius: 50, // Pill shape
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ExplorePage;
