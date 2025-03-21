import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import TabBar from '../components/TabBar'
import React from 'react'
import { View, Text, StyleSheet } from 'react-native';


export default function TabLayout() {
  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: 'purple', // Active tab color
      tabBarInactiveTintColor: 'black', // Inactive tab color
      tabBarStyle: {
        position: 'absolute',
        bottom: 20, // Lifted above the bottom
        left: 500,
        right: 500,
        elevation: 10, // Android shadow
        backgroundColor: 'white',
        borderRadius: 30, // Rounded shape
        height: 70, // More height for better look
        paddingBottom: 10, // Adjust padding
        shadowColor: '#000', // iOS shadow
        shadowOpacity: 0,
        shadowOffset: { width: 0, height: 4 },
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      },
    }}
  >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color="black" />,
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <AntDesign name="rocket1" size={24} color="black" />,
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <AntDesign name="barchart" size={24} color="black" />,
        }}
      />

      <Tabs.Screen
        name="mappi"
        options={{
          title: 'Mappi',
          tabBarIcon: ({ color }) => <Feather name="map" size={24} color="black" />,
        }}
        />
      
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Feather name="settings" size={24} color="black" />,
        }}
        />
        
    </Tabs>


  );
}


