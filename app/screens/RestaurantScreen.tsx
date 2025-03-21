import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Define the navigation param types
type RootStackParamList = {
  Home: undefined;
  Restaurant: { restaurant: { id: string; name: string; image: string } };
};

// Define screen props
type Props = NativeStackScreenProps<RootStackParamList, 'Restaurant'>;

const RestaurantScreen: React.FC<Props> = ({ route, navigation }) => {
  const { restaurant } = route.params; // Get restaurant data from navigation

  return (
    <View style={styles.container}>
      <Image source={{ uri: restaurant.image }} style={styles.image} />
      <Text style={styles.name}>{restaurant.name}</Text>
      <Text style={styles.description}>
        More details about {restaurant.name} will be displayed here.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20, backgroundColor: 'white' },
  image: { width: '100%', height: 200, borderRadius: 10 },
  name: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  description: { fontSize: 16, marginTop: 10, textAlign: 'center', color: 'gray' },
  button: { marginTop: 20, padding: 12, backgroundColor: '#4371A7', borderRadius: 8 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default RestaurantScreen;
