import { Stack } from 'expo-router/stack';
import RestaurantMenu from './screens/RestaurantMenuScreen';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="menu/[id]" 
        options={{
          title: "Restaurant Menu"
        }} 
      />
    </Stack>
  );
}
