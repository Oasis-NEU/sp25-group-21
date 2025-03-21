import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { supabase } from '../../supabaseClient';

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

    useEffect(() => {
        (async () => {
            try {
                // Request location permission
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    setLoading(false);
                    return;
                }

                // Get user's current location
                let userLocation = await Location.getCurrentPositionAsync({});
                setLocation(userLocation.coords);

                // Fetch restaurant data from Supabase
                const { data, error } = await supabase
                    .from('store')  // Ensure table name is correct
                    .select('serialid, businessname, latitude, longitude'); // Ensure correct column names

                if (error) {
                    console.error('Error fetching restaurants:', error.message);
                    setErrorMsg('Failed to fetch restaurants');
                } else {
                    // Debugging: Log the data to check if Supabase returns valid values
                    console.log('Fetched restaurants:', data);

                    // Filter out any records with missing coordinates
                    const formattedData: Restaurant[] = data
                        .filter((restaurant: any) => restaurant.latitude && restaurant.longitude)
                        .map((restaurant: any) => ({
                            id: restaurant.serialid,
                            name: restaurant.businessname,
                            latitude: parseFloat(restaurant.latitude),  // Ensure they are numbers
                            longitude: parseFloat(restaurant.longitude),
                        }));

                    console.log('Formatted restaurant data:', formattedData);

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
                >
                    <Callout>
                        <View style={styles.callout}>
                            <Text style={styles.calloutTitle}>{restaurant.name}</Text>
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
    },
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default Mappi;