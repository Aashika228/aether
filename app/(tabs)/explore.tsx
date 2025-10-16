import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const AQI_API_KEY = 'bf11bc7f23f3ed1478721601f35290d0';

const AQI_LABELS = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
const AQI_COLORS = ['#388e3c', '#8bc34a', '#ffeb3b', '#ff9800', '#f44336'];

async function fetchAQIData(lat: number, lon: number) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${AQI_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return { aqi: data.list[0].main.aqi };
  } catch {
    return null;
  }
}

export default function ExploreScreen() {
  const [region, setRegion] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [aqiPoints, setAqiPoints] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      const center = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setRegion({
        latitude: center.latitude,
        longitude: center.longitude,
        latitudeDelta: 0.09,
        longitudeDelta: 0.09,
      });
      const offsets = [
        { dLat: 0, dLon: 0, label: 'You' },
        { dLat: 0.015, dLon: 0.012, label: 'NE' },
        { dLat: 0.015, dLon: -0.012, label: 'NW' },
        { dLat: -0.015, dLon: 0.012, label: 'SE' },
        { dLat: -0.015, dLon: -0.012, label: 'SW' },
        { dLat: 0, dLon: 0.02, label: 'East' },
        { dLat: 0, dLon: -0.02, label: 'West' },
      ];
      const areaPoints = offsets.map(({ dLat, dLon, label }) => ({
        lat: center.latitude + dLat,
        lon: center.longitude + dLon,
        place: label,
      }));
      const results = await Promise.all(
        areaPoints.map(async (pt) => {
          const data = await fetchAQIData(pt.lat, pt.lon);
          return {
            ...pt,
            aqi: data?.aqi ?? null,
          };
        })
      );
      setAqiPoints(results);
      setLoading(false);
    })();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#f5fff7" }}>
      {/* Gradient Header */}
      <LinearGradient colors={["#43b480", "#7be8d7"]} style={styles.headerBar}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <MaterialCommunityIcons name="map-marker-radius" size={30} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.header}>Explore Air Quality</Text>
        </View>
        <Text style={styles.subText}>Green = Clean | Red = Polluted</Text>
      </LinearGradient>
      {/* Info card */}
      <View style={styles.infoCard}>
        <MaterialCommunityIcons name="leaf-map" color="#43b480" size={27} style={{ marginRight: 10 }} />
        <Text style={styles.infoCardText}>
          <Text style={{ fontWeight: "bold", color: "#43b480" }}>Tap location markers</Text> for detailed AQI info near you!
        </Text>
      </View>
      {loading || !region ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#4CAF50" />
      ) : (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={region}
        >
          {aqiPoints.map((point, idx) =>
            point.aqi ? (
              <Marker
                key={idx}
                coordinate={{ latitude: point.lat, longitude: point.lon }}
                title={point.place}
                description={`${AQI_LABELS[point.aqi - 1]} (AQI ${point.aqi})`}
                pinColor={AQI_COLORS[point.aqi - 1]}
              >
                <View style={{
                  backgroundColor: AQI_COLORS[point.aqi - 1],
                  paddingVertical: 4,
                  paddingHorizontal: 10,
                  borderRadius: 17,
                  minWidth: 60,
                  alignItems: "center",
                  elevation: 2,
                  borderWidth: point.place === "You" ? 2 : 0,
                  borderColor: point.place === "You" ? "#388e3c" : "transparent"
                }}>
                  <Text style={{
                    color: point.aqi <= 2 ? '#fff' : '#222',
                    fontWeight: 'bold',
                    fontSize: 13,
                  }}>
                    {point.place === "You" ? "🧑 " : ""}
                    {AQI_LABELS[point.aqi - 1]}
                  </Text>
                  <Text style={{ color: "#555", fontSize: 11 }}>AQI {point.aqi}</Text>
                </View>
              </Marker>
            ) : null
          )}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    width: "100%",
    paddingTop: 52,
    paddingBottom: 14,
    borderBottomRightRadius: 18,
    borderBottomLeftRadius: 18,
    alignItems: "center",
    marginBottom: 4,
    elevation: 5,
    shadowColor: "#43b480"
  },
  header: { fontSize: 26, fontWeight: "bold", color: "#fff", letterSpacing: 1.1 },
  subText: { marginTop: 2, fontSize: 14, color: "#e8fcd7", fontWeight: "500" },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e9f9e2",
    borderRadius: 12,
    marginHorizontal: 18,
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: "#43b480"
  },
  infoCardText: {
    fontSize: 15,
    color: "#24723b",
    flex: 1,
    lineHeight: 21
  },
  map: {
    flex: 1,
    height: Dimensions.get('window').height - 180,
    marginHorizontal: 12,
    marginVertical: 12,
    borderRadius: 15,
    overflow: "hidden"
  }
});
