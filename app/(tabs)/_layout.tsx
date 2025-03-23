import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import React from 'react';

// ✅ Only include the necessary tabs
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'purple',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          elevation: 10,
          backgroundColor: 'white',
          borderRadius: 30,
          height: 70,
          paddingBottom: 10,
          shadowColor: '#000',
          shadowOpacity: 0,
          shadowOffset: { width: 0, height: 4 },
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      {/* ✅ Home Screen */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
        }}
      />

      {/* ✅ Explore Screen */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <AntDesign name="rocket1" size={24} color={color} />,
        }}
      />

      {/* ✅ Mappi Screen (Moved before Account) */}
      <Tabs.Screen
        name="mappi"
        options={{
          title: 'Mappi',
          tabBarIcon: ({ color }) => <Feather name="map" size={24} color={color} />,
        }}
      />

      {/* ✅ Account Screen (Moved after Mappi) */}
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <AntDesign name="barchart" size={24} color={color} />,
        }}
      />

      {/* ✅ Settings Screen */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Feather name="settings" size={24} color={color} />,
        }}
      />
      
      {/* ❌ EXCLUDE login, signup, and app pages from the tab navigator */}
      <Tabs.Screen
        name="login"
        options={{
          href: null, // This will prevent it from showing in the tab bar
        }}
      />

      <Tabs.Screen
        name="signup"
        options={{
          href: null, // This will prevent it from showing in the tab bar
        }}
      />

      <Tabs.Screen
        name="app"
        options={{
          href: null, // This will prevent it from showing in the tab bar
        }}
      />
      
    </Tabs>
  );
}
