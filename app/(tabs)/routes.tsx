import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline, UrlTile } from "react-native-maps";

// Example coordinates (Nerul West → Nerul East)
const routeCoordinates = [
  { latitude: 19.0333, longitude: 73.0185 },
  { latitude: 19.0340, longitude: 73.0210 },
  { latitude: 19.0355, longitude: 73.0240 },
  { latitude: 19.0370, longitude: 73.0275 },
  { latitude: 19.0380, longitude: 73.0305 },
];

export default function RoutesScreen() {
  return (
    <View style={styles.container}>
      {/* Gradient App Bar */}
      <LinearGradient colors={["#6fd6b8", "#8fd9ef"]} style={styles.headerBar}>
        <View style={styles.headerRow}>
          <MaterialCommunityIcons name="walk" size={30} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.header}>Green Routes</Text>
        </View>
      </LinearGradient>
      {/* Description Card */}
      <View style={styles.topCard}>
        <Text style={styles.descTitle}>Walk the Cleanest Path!</Text>
        <Text style={styles.descText}>
          These routes keep you away from high-pollution zones for a healthier journey.
        </Text>
      </View>
      {/* Map Section */}
      <View style={styles.mapWrapper}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 19.035,
            longitude: 73.025,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          <UrlTile
            urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
          />
          <Marker
            coordinate={routeCoordinates[0]}
            title="Nerul West"
            description="Start Point"
            pinColor="#49b86a"
          >
            <MaterialCommunityIcons name="home-map-marker" color="#43b480" size={28} />
          </Marker>
          <Marker
            coordinate={routeCoordinates[routeCoordinates.length - 1]}
            title="Nerul East"
            description="Destination"
            pinColor="#49b86a"
          >
            <MaterialCommunityIcons name="flag-checkered" color="#388e3c" size={28} />
          </Marker>
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#3ce373"
            strokeWidth={7}
          />
        </MapView>
        <LinearGradient
          colors={["#ffffffcc", "#eaf2fc99"]}
          style={styles.mapBadge}
        >
          <MaterialCommunityIcons name="leaf" size={18} color="#4CAF50" />
          <Text style={styles.mapBadgeText}>Eco-Friendly Direction</Text>
        </LinearGradient>
      </View>
      {/* Tip Card */}
      <View style={styles.tipCard}>
        <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color="#ffd600" style={{ marginRight: 5 }} />
        <Text style={styles.tipText}>Tip: Green routes help you avoid areas with high air pollution!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5fff7" },
  headerBar: {
    paddingTop: 54,
    paddingBottom: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    alignItems: "center",
    marginBottom: 8,
    elevation: 5,
    shadowColor: "#4caf50",
  },
  headerRow: { flexDirection: 'row', alignItems: "center", justifyContent: "center" },
  header: { fontSize: 26, fontWeight: "bold", color: "#fff", letterSpacing: 1.1 },
  topCard: {
    alignItems: 'center',
    margin: 16,
    marginTop: 18,
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "#eaf2fc",
    elevation: 3,
    shadowColor: "#4caf50"
  },
  descTitle: { fontSize: 20, fontWeight: "bold", color: "#43b480", marginBottom: 6 },
  descText: { fontSize: 15, color: "#388e3c", textAlign: "center" },
  mapWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  map: {
    width: Dimensions.get("window").width * 0.92,
    height: Dimensions.get("window").height * 0.45,
    borderRadius: 18,
    overflow: "hidden"
  },
  mapBadge: {
    position: "absolute",
    bottom: 16,
    left: 22,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 14,
    elevation: 2,
    shadowColor: "#b9e792",
    marginTop: 8,
  },
  mapBadgeText: {
    color: "#43b480", fontWeight: "600", marginLeft: 7, fontSize: 14
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fffbe1",
    borderRadius: 12,
    marginHorizontal: 26,
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation: 1,
  },
  tipText: { color: "#7a6926", fontSize: 15, marginLeft: 2, flex: 1 }
});
