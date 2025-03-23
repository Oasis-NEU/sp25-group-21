import React, { useState, useEffect } from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const savedDarkMode = await AsyncStorage.getItem("darkMode");
    const savedNotifications = await AsyncStorage.getItem("notifications");
    const savedLanguage = await AsyncStorage.getItem("language");
    
    if (savedDarkMode !== null) setDarkMode(JSON.parse(savedDarkMode));
    if (savedNotifications !== null) setNotifications(JSON.parse(savedNotifications));
    if (savedLanguage !== null) setLanguage(savedLanguage);
  };

  const toggleDarkMode = async () => {
    setDarkMode((prev) => !prev);
    await AsyncStorage.setItem("darkMode", JSON.stringify(!darkMode));
  };

  const toggleNotifications = async () => {
    setNotifications((prev) => !prev);
    await AsyncStorage.setItem("notifications", JSON.stringify(!notifications));
  };

  const changeLanguage = async (lang: string) => {
    setLanguage(lang);
    await AsyncStorage.setItem("language", lang);
  };
  
  return (
    <View className="flex-1 p-4 bg-white dark:bg-gray-900">
      <Text className="text-xl font-bold mb-4 dark:text-white">Settings</Text>
      
      <View className="flex-row justify-between items-center mb-4">
        <Text className="dark:text-white">Dark Mode</Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>
      
      <View className="flex-row justify-between items-center mb-4">
        <Text className="dark:text-white">Notifications</Text>
        <Switch value={notifications} onValueChange={toggleNotifications} />
      </View>

      <View className="mb-4">
        <Text className="dark:text-white mb-2">Language</Text>
        <Picker selectedValue={language} onValueChange={changeLanguage}>
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Spanish" value="es" />
          <Picker.Item label="French" value="fr" />
        </Picker>
      </View>
    </View>
  );
};

export default SettingsScreen;