import { RouteProp, useRoute } from '@react-navigation/native';
import {
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    SafeAreaView,
    StyleSheet,
    FlatList,
  } from 'react-native';
import { RootStackParamList } from '@/app/(tabs)/App';
import { useLocalSearchParams } from 'expo-router';


export default function RestaurantMenu () {
    const { id, name, image } = useLocalSearchParams();
    return ( 
    <Text>{id}</Text>);
}

