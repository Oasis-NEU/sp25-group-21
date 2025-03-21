import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// Import screens
import HomeScreen from './screens/index'; // Ensure correct path
import RestaurantScreen from './screens/RestaurantScreen'; // The screen to navigate to
import ProfileScreen from './screens/ProfileScreen'; // Example tab
import SettingsScreen from './screens/SettingsScreen'; // Example tab
import { Ionicons } from '@expo/vector-icons';

// ✅ Define the navigation types
export type RootStackParamList = {
  HomeStack: undefined; // Represents the stack inside the Home tab
  Restaurant: { restaurant: { id: string; name: string; image: string } }; // Needs params
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  Restaurant: { restaurant: { id: string; name: string; image: string } };
};

// ✅ Create a Stack Navigator for Home
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
    <HomeStack.Screen name="Restaurant" component={RestaurantScreen} options={{ title: 'Restaurant Details' }} />
  </HomeStack.Navigator>
);

// ✅ Create Bottom Tab Navigator
const Tab = createBottomTabNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'HomeStack') {
              iconName = 'home-outline';
            } else if (route.name === 'Profile') {
              iconName = 'person-outline';
            } else if (route.name === 'Settings') {
              iconName = 'settings-outline';
            }
            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4371A7',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        {/* ✅ Instead of using HomeScreen directly, use HomeStackNavigator */}
        <Tab.Screen name="HomeStack" component={HomeStackNavigator} options={{ title: 'Home' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return <AppNavigator />;
}
