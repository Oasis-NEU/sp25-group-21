import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AccountScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      setIsAuthenticated(!!userToken);
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken'); // Remove token
    setIsAuthenticated(false);
    router.replace('./login'); // Redirect to login screen
  };

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userEmail}>john.doe@example.com</Text>
      </View>

      {/* Account Options */}
      <View style={styles.menu}>
        <Link href="/account_pages/orderHist" asChild>
          <Pressable style={styles.menuItem}>
            <AntDesign name="profile" size={24} color="black" />
            <Text style={styles.menuText}>Order History</Text>
          </Pressable>
        </Link>

        <Pressable style={styles.menuItem} onPress={() => console.log('Navigate to Settings')}>
          <Feather name="settings" size={24} color="black" />
          <Text style={styles.menuText}>Settings</Text>
        </Pressable>

        {isAuthenticated ? (
          <Pressable style={styles.menuItem} onPress={handleLogout}>
            <AntDesign name="logout" size={24} color="red" />
            <Text style={[styles.menuText, { color: 'red' }]}>Log Out</Text>
          </Pressable>
        ) : (
          <Link href="/signup" asChild>
            <Pressable style={styles.menuItem}>
              <AntDesign name="login" size={24} color="green" />
              <Text style={[styles.menuText, { color: 'green' }]}>Register</Text>
            </Pressable>
          </Link>
        )}
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    paddingTop: 50,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  menu: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    fontSize: 18,
    marginLeft: 15,
    color: '#333',
  },
});
