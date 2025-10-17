import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CommunityDrivesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Community Drives</Text>
      <View style={styles.card}>
        <MaterialCommunityIcons name="tree" size={32} color="#43b480" style={{ marginBottom: 6 }} />
        <Text style={styles.title}>Tree Planting Drive</Text>
        <Text style={styles.desc}>Help plant 300 saplings at Seawoods Park. All are welcome! Oct 28, 2025</Text>
        <TouchableOpacity
          onPress={() => Linking.openURL("https://www.treeplantingcommunity.com")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Learn More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5fff7', alignItems: 'center', justifyContent: 'center' },
  header: { fontSize: 26, fontWeight: 'bold', color: "#43b480", marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 4,
    width: '85%',
    alignItems: 'center'
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#43b480', marginBottom: 7 },
  desc: { color: '#222', fontSize: 15, textAlign: 'center', marginBottom: 10 },
  button: {
    marginTop: 8,
    backgroundColor: "#43b480",
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 17,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});
