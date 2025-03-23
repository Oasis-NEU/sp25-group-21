import { useEffect, useState } from "react";
import {
  Image,
  Text,
  View,
  SafeAreaView,
  SectionList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "../../supabaseClient";

type MenuItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
};

type Section = {
  title: string;
  data: MenuItem[];
};

export default function RestaurantMenu() {
  const params = useLocalSearchParams();
  const restaurantName = (params.name as string) || "Unknown Restaurant";
  const restaurantId = (params.id as string) || "";

  const [serialid, setSerialid] = useState<string | null>(null);
  const [menuSections, setMenuSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(params.image || "");
  const [retryCount, setRetryCount] = useState(0);

  // ✅ Step 1: Fetch `serialid` from Supabase
  const fetchSerialId = async () => {
    try {
      console.log(`📌 Fetching serialid for restaurantId: ${restaurantId}`);

      const { data: storeData, error: storeError } = await supabase
        .from("store")
        .select("serialid, image_url")
        .eq("serialid", restaurantId)
        .single();

      if (storeError || !storeData) {
        console.error("🔴 Store Fetch Error:", storeError);
        throw new Error(
          `Failed to fetch restaurant details: ${
            storeError?.message || "No data found"
          }`
        );
      }

      console.log("✅ Retrieved Serial ID:", storeData.serialid);
      setSerialid(storeData.serialid);
      setImageUrl(storeData.image_url || "");

      return storeData.serialid;
    } catch (err: any) {
      console.error("❌ Serial ID Fetch Error:", err.message);
      setError(err.message);
      setLoading(false);
    }
  };

  // ✅ Step 2: Fetch Menu from Table & Group by Category
  const fetchMenuData = async (serialid: string) => {
    try {
      if (!serialid) {
        throw new Error("No restaurant serial ID found.");
      }

      const tableName = `${serialid}_menu`;
      console.log(`🔍 Fetching entire menu from: ${tableName}`);

      const { data: menuData, error: menuError } = await supabase
        .from(tableName)
        .select("itemname, category, price, description");

      if (menuError) {
        console.error("🔴 Menu Fetch Error:", menuError);
        throw new Error(`Failed to fetch menu: ${menuError.message}`);
      }

      if (!menuData || menuData.length === 0) {
        console.warn("⚠️ No menu items found.");
        setMenuSections([]);
        setLoading(false);
        return;
      }

      console.log("✅ Retrieved Menu Items:", menuData);

      // 🔥 Group menu items by category
      const categoryMap: { [key: string]: MenuItem[] } = {};

      menuData.forEach((item: any, index: number) => {
        if (!categoryMap[item.category]) {
          categoryMap[item.category] = [];
        }
        categoryMap[item.category].push({
          id: index + 1, // Assign a unique ID
          name: item.itemname,
          category: item.category || "Uncategorized",
          price: item.price,
          description: item.description || "No description available",
        });
      });

      // Convert categoryMap to a list of sections
      const sections: Section[] = Object.keys(categoryMap).map((category) => ({
        title: category,
        data: categoryMap[category],
      }));

      setMenuSections(sections);
      setError(null);
      setLoading(false);
    } catch (err: any) {
      console.error("❌ Menu Fetch Error:", err.message);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("📩 Received Params:", params);

    if (!restaurantId) {
      setError("No restaurant ID provided.");
      setLoading(false);
      return;
    }

    fetchSerialId().then((serialid) => {
      if (serialid) {
        fetchMenuData(serialid);
      }
    });
  }, [restaurantId, retryCount]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>
          Loading menu for {restaurantName}...
        </Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>⚠️ Error: {error}</Text>
        <View style={styles.debugButton}>
          <Text
            style={styles.debugButtonText}
            onPress={() => setRetryCount((prev) => prev + 1)}
          >
            Try Again
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {imageUrl ? (
          <Image
            source={{
              uri: Array.isArray(imageUrl)
                ? imageUrl[0]
                : imageUrl || "https://via.placeholder.com/150",
            }}
            style={styles.restaurantImage}
          />
        ) : (
          <View style={[styles.restaurantImage, styles.placeholderImage]} />
        )}
        <Text style={styles.restaurantName}>{restaurantName}</Text>
      </View>

      <SectionList
        sections={menuSections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text style={styles.menuItemName}>{item.name}</Text>
            <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
            <Text style={styles.menuItemDescription}>{item.description}</Text>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>{title}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No menu items available for {restaurantName}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "white" },
  header: { alignItems: "center", marginBottom: 20, paddingVertical: 16 },
  restaurantImage: { width: 150, height: 150, borderRadius: 75 },
  placeholderImage: { backgroundColor: "#e0e0e0" },
  restaurantName: { fontSize: 24, fontWeight: "bold", marginTop: 10, textAlign: "center" },
  categoryHeader: { backgroundColor: "#ddd", padding: 10, marginTop: 10 },
  categoryTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  menuItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  menuItemName: { fontSize: 16, fontWeight: "bold" },
  menuItemPrice: { fontSize: 16, fontWeight: "bold", color: "#4371A7", textAlign: "right" },
  menuItemDescription: { fontSize: 14, color: "gray", marginTop: 4 },
  emptyContainer: { alignItems: "center", padding: 20 },
  emptyText: { fontSize: 16, color: "gray", textAlign: "center" },
  loadingText: { fontSize: 16, textAlign: "center", marginBottom: 10, color: "#555" }, 
  errorText: { fontSize: 18, color: "red", textAlign: "center", marginBottom: 10 }, // Error message styling
  debugButton: { 
    backgroundColor: "#4371A7", 
    padding: 12, 
    borderRadius: 8, 
    marginTop: 10, 
    alignSelf: "center" 
  }, // Button styling
  debugButtonText: { 
    color: "white", 
    fontWeight: "bold", 
    textAlign: "center" 
  },
});

