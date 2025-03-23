import { useEffect, useState } from 'react';
import { Image, Text, View, SafeAreaView, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '../../supabaseClient';

// Define a type for menu items
type MenuItem = {
    id: number;
    'Item Name': string;
    'Description'?: string;
    'Price (USD)': number | string;
    image_url?: string;  
};

export default function RestaurantMenu() {
    const params = useLocalSearchParams();
    const serialid = params.serialid as string || ''; 
    const name = params.name as string || 'Unknown Restaurant';

    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [retryCount, setRetryCount] = useState(0);

    const getErrorMessage = (err: any): string => {
        if (err instanceof Error) return err.message;
        if (typeof err === 'string') return err;
        if (err && typeof err === 'object') {
            if ('message' in err) return String(err.message);
            try {
                return JSON.stringify(err);
            } catch (e) {
                return 'Unknown error occurred';
            }
        }
        return String(err || 'Unknown error occurred');
    };

    const fetchRestaurantData = async () => {
        try {
            console.log('🔄 Fetching data from Supabase...');
            setLoading(true);

            if (!serialid) {
                throw new Error('No restaurant ID provided');
            }


            console.log('📸 Fetching restaurant image...');
            const { data: restaurantData, error: restaurantError } = await supabase
                .from('store')
                .select('image_url')
                .eq('serialid', serialid)
                .single();

            if (restaurantError) {
                console.error('Restaurant Fetch Error:', restaurantError);
                throw new Error(`Failed to fetch restaurant: ${restaurantError.message}`);
            }

            console.log('Restaurant data:', restaurantData);
            setImageUrl(restaurantData?.image_url || '');

            // Fetch menu items
            const menuTable = `${serialid}_menu`;
            console.log(`Fetching menu from table: ${menuTable}`);

            const { data: menuData, error: menuError } = await supabase
                .from(menuTable)
                .select('*');

            if (menuError) {
                console.error('Menu Fetch Error:', menuError);
                throw new Error(`Failed to fetch menu: ${menuError.message}`);
            }

            console.log('Menu Data:', menuData);

            // Set menu data correctly
            setMenuItems(menuData || []);
            setError(null);
            setLoading(false);

        } catch (err: any) {
            const errorMessage = getErrorMessage(err);
            console.error('Fetch Error:', errorMessage);
            setError(errorMessage);
            setLoading(false);

            Alert.alert('Error', errorMessage);
        }
    };

    useEffect(() => {
        console.log('Received params:', params); // Log the params for debugging
        console.log('Serialid:', serialid); // Log serialid for debugging
        console.log('Restaurant name:', name); // Log restaurant name for debugging

        if (!serialid) {
            setError('No restaurant ID provided');
            setLoading(false);
            return;
        }

        fetchRestaurantData();
    }, [serialid, retryCount]);

    // If still loading, show the loading screen
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.loadingText}>Loading menu for {name}...</Text>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.debugText}>Restaurant ID: {serialid}</Text>
            </SafeAreaView>
        );
    }

    // If there is an error, display the error message
    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>⚠️ Error: {error}</Text>
                <Text style={styles.debugText}>🔎 Check database table: {serialid}_menu</Text>
                <View style={styles.debugButton}>
                    <Text style={styles.debugButtonText} onPress={() => setRetryCount(prev => prev + 1)}>
                        Try Again
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.restaurantImage} />
                ) : (
                    <View style={[styles.restaurantImage, styles.placeholderImage]} />
                )}
                <Text style={styles.restaurantName}>{name}</Text>
            </View>

            <FlatList
                data={menuItems}
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.menuItem}>
                        {item.image_url && (
                            <Image source={{ uri: item.image_url }} style={styles.menuItemImage} />
                        )}
                        <Text style={styles.menuItemName}>{item['Item Name']}</Text>
                        <Text style={styles.menuItemDescription}>{item['Description'] || 'No description'}</Text>
                        <Text style={styles.menuItemPrice}>
                            ${typeof item['Price (USD)'] === 'number'
                                ? item['Price (USD)'].toFixed(2)
                                : item['Price (USD)']}
                        </Text>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No menu items available for {name}</Text>
                        <View style={styles.debugButton}>
                            <Text style={styles.debugButtonText} onPress={() => setRetryCount(prev => prev + 1)}>
                                Retry Load
                            </Text>
                        </View>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
        paddingVertical: 16,
    },
    restaurantImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    placeholderImage: {
        backgroundColor: '#e0e0e0',
    },
    restaurantName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
    },
    menuItem: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
    },
    menuItemImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
    },
    menuItemName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    menuItemDescription: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 8,
    },
    menuItemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4371A7',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    loadingText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 8,
    },
    debugText: {
        fontSize: 14,
        color: '#888',
        marginTop: 5,
    },
    debugButton: {
        backgroundColor: '#4371A7',
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
        alignSelf: 'center',
    },
    debugButtonText: {
        color: 'white',
        fontWeight: 'bold',
    }
});
