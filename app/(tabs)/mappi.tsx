import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ActivityIndicator, 
    TouchableOpacity 
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { supabase } from '../../supabaseClient';
import { useRouter } from 'expo-router'; // ✅ Use Expo Router

interface Restaurant {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
}

const Mappi: React.FC = () => {
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter(); // ✅ Initialize router

    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    setLoading(false);
                    return;
                }

                let userLocation = await Location.getCurrentPositionAsync({});
                setLocation(userLocation.coords);

                const { data, error } = await supabase
                    .from('store')
                    .select('serialid, businessname, latitude, longitude');

                if (error) {
                    console.error('Error fetching restaurants:', error.message);
                    setErrorMsg('Failed to fetch restaurants');
                } else {
                    const formattedData: Restaurant[] = data
                        .filter((restaurant: any) => restaurant.latitude && restaurant.longitude)
                        .map((restaurant: any) => ({
                            id: restaurant.serialid,
                            name: restaurant.businessname,
                            latitude: parseFloat(restaurant.latitude),
                            longitude: parseFloat(restaurant.longitude),
                        }));

                    setRestaurants(formattedData);
                }
            } catch (err) {
                console.error('Error in useEffect:', err);
                setErrorMsg('An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // ✅ Function to handle navigation when tapping the marker
    const handleMarkerPress = (restaurant: Restaurant) => {
        console.log(`✅ Marker pressed: ${restaurant.name} (ID: ${restaurant.id})`);

        // 🛠 Workaround: Delay navigation so Callout does not immediately close
        setTimeout(() => {
            router.push({
                pathname: "../menu/[id]",
                params: { id: restaurant.id, name: restaurant.name }
            });
        }, 300);
    };

    if (errorMsg) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
        );
    }

    if (loading || !location) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#FF5733" />
                <Text>Fetching your location...</Text>
            </View>
        );
    }

    return (
        <MapView
            style={styles.map}
            initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
        >
            {restaurants.map((restaurant) => (
                <Marker
                    key={restaurant.id}
                    coordinate={{ latitude: restaurant.latitude, longitude: restaurant.longitude }}
                    title={restaurant.name}
                    onPress={() => handleMarkerPress(restaurant)} // ✅ Directly handle tap event
                >
                    <Callout>
                        <View style={styles.callout}>
                            <Text style={styles.calloutTitle}>{restaurant.name}</Text>
                            <TouchableOpacity 
                                style={styles.calloutButton}
                                onPress={() => handleMarkerPress(restaurant)} // ✅ Also allow navigation via button
                            >
                                <Text style={styles.calloutButtonText}>View Menu</Text>
                            </TouchableOpacity>
                        </View>
                    </Callout>
                </Marker>
            ))}
        </MapView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
    map: {
        flex: 1,
    },
    callout: {
        padding: 10,
        alignItems: "center",
    },
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 5,
    },
    calloutButton: {
        marginTop: 5,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: "#FF5733",
        borderRadius: 5,
    },
    calloutButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default Mappi;
