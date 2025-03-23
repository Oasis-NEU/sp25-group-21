import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Feather } from "@expo/vector-icons";

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const savedDarkMode = await AsyncStorage.getItem("darkMode");
    const savedNotifications = await AsyncStorage.getItem("notifications");

    if (savedDarkMode !== null) setDarkMode(JSON.parse(savedDarkMode));
    if (savedNotifications !== null) setNotifications(JSON.parse(savedNotifications));
  };

  const toggleDarkMode = async () => {
    setDarkMode((prev) => !prev);
    await AsyncStorage.setItem("darkMode", JSON.stringify(!darkMode));
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => navigation.navigate("Login") },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>

        {/* 🔹 Section Header: Account Settings */}
        <Text style={styles.sectionHeader}>Account Settings</Text>

        <TouchableOpacity style={styles.listItem}>
          <Text style={styles.listItemTitle}>Manage Account</Text>
          <Text style={styles.listItemSubtitle}>Update information and manage your account</Text>
          <AntDesign name="right" size={18} color="gray" style={styles.iconRight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem}>
          <Text style={styles.listItemTitle}>Payment</Text>
          <Text style={styles.listItemSubtitle}>Manage payment methods and credits</Text>
          <AntDesign name="right" size={18} color="gray" style={styles.iconRight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem}>
          <Text style={styles.listItemTitle}>Business Profile</Text>
          <Text style={styles.listItemSubtitle}>Make expensing effortless</Text>
          <AntDesign name="right" size={18} color="gray" style={styles.iconRight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem}>
          <Text style={styles.listItemTitle}>Address</Text>
          <Text style={styles.listItemSubtitle}>Add or remove a delivery address</Text>
          <AntDesign name="right" size={18} color="gray" style={styles.iconRight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem}>
          <Text style={styles.listItemTitle}>Privacy</Text>
          <Text style={styles.listItemSubtitle}>Learn about privacy and manage settings</Text>
          <AntDesign name="right" size={18} color="gray" style={styles.iconRight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem}>
          <Text style={styles.listItemTitle}>Notifications</Text>
          <Text style={styles.listItemSubtitle}>Manage delivery and promotional notifications</Text>
          <AntDesign name="right" size={18} color="gray" style={styles.iconRight} />
        </TouchableOpacity>

        {/* 🔹 Dark Mode Toggle */}
        <TouchableOpacity style={styles.listItem}>
          <Text style={styles.listItemTitle}>Dark Mode</Text>
          <Text style={styles.listItemSubtitle}>Manage Dark Mode appearance</Text>
          <Text style={styles.newLabel}>New</Text>
          <Switch value={darkMode} onValueChange={toggleDarkMode} />
        </TouchableOpacity>

        {/* 🔹 Logout Button */}
        <TouchableOpacity style={[styles.listItem, styles.logoutItem]} onPress={handleLogout}>
          <Text style={[styles.listItemTitle, { color: "red" }]}>Logout</Text>
          <AntDesign name="right" size={18} color="red" style={styles.iconRight} />
        </TouchableOpacity>

        {/* 🔹 App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>App Version 1.0.0</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    paddingVertical: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F5F5F5",
  },
  listItem: {
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    position: "relative",
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  listItemSubtitle: {
    fontSize: 13,
    color: "gray",
  },
  iconRight: {
    position: "absolute",
    right: 20,
    top: "50%",
    transform: [{ translateY: -9 }],
  },
  logoutItem: {
    marginTop: 20,
    borderTopWidth: 0.5,
    borderTopColor: "#ccc",
  },
  newLabel: {
    position: "absolute",
    right: 60,
    top: "50%",
    transform: [{ translateY: -9 }],
    backgroundColor: "#FFE5E5",
    color: "red",
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 20,
  },
  versionText: {
    fontSize: 14,
    color: "gray",
  },
});

export default SettingsScreen;
