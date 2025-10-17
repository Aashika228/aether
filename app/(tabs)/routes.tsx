import { StyleSheet, Text, View } from 'react-native';

export default function RoutesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Routes</Text>
      <Text style={styles.comingSoon}>This feature is coming soon!</Text>
      <Text style={styles.description}>
        The Routes page will help you find and choose eco-friendly paths for your journeys, showing the greenest walking, cycling, or transportation options in your area. You’ll be able to discover low-pollution routes, track your carbon savings, and compete with friends for the most planet-friendly commute!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 28, backgroundColor: "#f5fff7" },
  header: { fontSize: 28, fontWeight: "bold", color: "#43b480", marginBottom: 18 },
  comingSoon: { fontSize: 18, color: "#888", marginBottom: 18 },
  description: { fontSize: 16, color: "#388E3C", textAlign: "center" }
});
