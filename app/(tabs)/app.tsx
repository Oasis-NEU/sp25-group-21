import 'react-native-gesture-handler';  // This must be the first import
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SignUpScreen from './signup';  // Make sure these paths are correct
import LoginScreen from './login';

import HomeScreen from '.';
import RestaurantScreen from '../screens/RestaurantScreen';
import RestaurantMenu from '../screens/RestaurantMenuScreen';
import CartScreen from '../screens/CartScreen';




export type RootStackParamList = {
  Home: undefined;
  Restaurant: { restaurant: { id: string; name: string; image: string } };
  Menu: {name: string; image: string};
  SignUp: undefined;
  Login: undefined;
  Cart: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Restaurant" component={RestaurantScreen} options={{ title: 'Restaurant Details' }} />
      <Stack.Screen name="Menu" component={RestaurantMenu} options={({ route }) => ({ title: route.params?.name || "Restaurant Menu" })} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Menu" component={RestaurantMenu} />
      <Stack.Screen name="Cart" component={CartScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}