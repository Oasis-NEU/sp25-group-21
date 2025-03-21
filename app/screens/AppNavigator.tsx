import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../(tabs)/index'; 
import RestaurantScreen from '../screens/RestaurantScreen'; 

// ✅ Define navigation types
export type RootStackParamList = {
  Home: undefined;
  Restaurant: { restaurant: { id: string; name: string; image: string } };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Restaurant" component={RestaurantScreen} options={{ title: 'Restaurant Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
