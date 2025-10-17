import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50',
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '🌱 Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: '🔍 Explore',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={28} color={color} />
          ),
        }}
      />
            <Tabs.Screen
        name="community-drives" // should match app/community-drives.tsx
        options={{
          title: 'Community',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={size ?? 28} />
          ),
        }}
      />
     
      <Tabs.Screen
        name="tree"
        options={{
          title: '🌳 Tree',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'leaf' : 'leaf-outline'} size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          title: '🏆 Challenges',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'trophy' : 'trophy-outline'} size={28} color={color} />
          ),
        }}
      />
       <Tabs.Screen
        name="routes"
        options={{
          title: '🛣️ Routes',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'map' : 'map-outline'} size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
