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
import { RootStackParamList } from '../(tabs)/App';

type MenuScreenRouteProp = RouteProp<RootStackParamList, 'Menu'>;

export default function RestaurantMenu () {
  const route = useRoute<MenuScreenRouteProp>();
  const { name, image } = route.params;
    return ( 
    <Text>{name}</Text>);
}

