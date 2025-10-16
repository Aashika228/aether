import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../src/contexts/AppContext';
import { useAuth } from '../../src/contexts/AuthContext';

const AQI_API_KEY = 'bf11bc7f23f3ed1478721601f35290d0';

async function fetchAQIData(lat: number, lon: number) {
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${AQI_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch AQI');
  const data = await res.json();
  return { aqi: data.list[0].main.aqi };
}

const AQI_LABELS = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
const AQI_COLORS = ['#49b86a', '#aacb37', '#fff692', '#ffbb54', '#ff6289'];
const MOTIVATION_QUOTES = [
  "One small action can change the world! 🌎",
  "Breathe easy, live green!",
  "Eco heroes unite!",
  "Every step counts for the planet.",
  "Green choices, bright future! 🌱",
];
const ECO_FACTS = [
  "Did you know? One tree absorbs up to 22kg of CO₂ each year.",
  "Making green choices helps reduce air pollution.",
  "Cycling instead of driving lowers your carbon footprint.",
  "Challenging friends to eco-tasks builds a cleaner community.",
  "Caring for trees cools down entire neighborhoods!",
];

export default function DashboardScreen() {
  const { logout } = useAuth();
  const { state, dispatch } = useAppContext();
  const [aqi, setAqi] = useState<number | null>(null);
  const [aqiStatus, setAqiStatus] = useState<string>('Loading...');
  const [loading, setLoading] = useState(true);
  const [fact, setFact] = useState('');
  const [quote, setQuote] = useState('');
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    setFact(ECO_FACTS[Math.floor(Math.random() * ECO_FACTS.length)]);
    setQuote(MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)]);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAqiStatus('Location permission denied');
        setLoading(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      try {
        const aq = await fetchAQIData(location.coords.latitude, location.coords.longitude);
        setAqi(aq.aqi);
        setAqiStatus(AQI_LABELS[aq.aqi - 1] + ` (AQI ${aq.aqi})`);
      } catch (e) {
        setAqiStatus('Failed to load AQI');
      }
      setLoading(false);
    })();
  }, []);

  function handleSpin() {
    if (spinning) return;
    setSpinning(true);
    setTimeout(() => {
      const bonus = [0, 10, 20, 40, 50, 80][Math.floor(Math.random() * 6)];
      setSpinning(false);
      if (bonus > 0) {
        dispatch({ type: 'ADD_POINTS', payload: bonus });
      }
      Alert.alert(
        "🍀 Spin Result",
        bonus === 0 ? "Better luck next time!" : `You won ${bonus} bonus points!`
      );
    }, 1250);
  }

  // Responsive color for AQI
  const aqiColor = typeof aqi === "number" ? AQI_COLORS[aqi - 1] : '#4CAF50';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5fff7' }} contentContainerStyle={{ paddingBottom: 46 }}>
      {/* Header Bar */}
      <LinearGradient colors={['#43b480', '#8fd9ef']} style={styles.headerBar}>
        <View style={styles.headerRow}>
          <MaterialCommunityIcons name="leaf" size={32} color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.header}>Eco Dashboard</Text>
        </View>
      </LinearGradient>

      {/* Welcome / Facts Card */}
      <LinearGradient colors={['#c3f5d4', '#eaf2fc']} style={styles.topCard}>
        <Text style={styles.greeting}>
          <MaterialCommunityIcons name="sprout" size={22} /> Hi, {state.user.name}!
        </Text>
        <Text style={styles.subline}>{quote}</Text>
        <Text style={styles.fact}>{fact}</Text>
      </LinearGradient>

      {/* AQI Section */}
      <View style={styles.section}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="air-filter" size={26} color={aqiColor} style={{ marginRight: 7 }} />
          <Text style={styles.sectionHeader}>Air Quality Near You</Text>
        </View>
        {loading ? (
          <ActivityIndicator color="#4CAF50" style={{ marginVertical: 10 }} />
        ) : (
          <Text style={[styles.aqiText, { color: aqiColor }]}>{aqiStatus}</Text>
        )}
      </View>

      {/* Progress Section */}
      <View style={styles.section}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="star-circle" size={26} color="#ffe066" style={{ marginRight: 7 }} />
          <Text style={styles.sectionHeader}>Your Progress</Text>
        </View>
        <View style={styles.progressRow}>
          <Text style={styles.label}>Points</Text>
          <Text style={styles.pointsValue}>{state.user.points}</Text>
        </View>
        <View style={styles.progressBarBg}>
          <LinearGradient
            colors={['#ffdb58', '#43b480']}
            start={[0, 0]}
            end={[1, 0]}
            style={[styles.progressBar, { width: `${Math.min(state.user.points / 12, 100)}%` }]}
          />
        </View>
        <Text style={styles.label}>Eco Level {state.user.level}</Text>
        <View style={styles.progressBarBg}>
          <LinearGradient
            colors={['#aafd8d', '#43b480']}
            start={[0, 0]}
            end={[1, 0]}
            style={[styles.progressBar, { width: `${Math.min(state.user.level * 20, 100)}%`, backgroundColor: 'transparent' }]}
          />
        </View>
      </View>

      {/* Spin The Wheel */}
      <View style={styles.section}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="dice-multiple" size={26} color="#49b86a" style={{ marginRight: 7 }} />
          <Text style={styles.sectionHeader}>Daily Spin To Win!</Text>
        </View>
        <TouchableOpacity onPress={handleSpin} style={styles.spinBtn} disabled={spinning} activeOpacity={0.82}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
            {spinning ? "Spinning..." : "Spin Now"}
          </Text>
        </TouchableOpacity>
        <Text style={{ color: '#888', fontSize: 15, marginTop: 2 }}>Try your luck for a bonus every day!</Text>
      </View>

      {/* Challenges Overview */}
      <View style={styles.section}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="target" size={24} color="#50a7c2" style={{ marginRight: 7 }} />
          <Text style={styles.sectionHeader}>Challenges Overview</Text>
        </View>
        {state.challenges.slice(0, 3).map(ch => (
          <Text key={ch.id} style={{ fontSize: 16, color: ch.completed ? '#388E3C' : '#d28516', marginTop: 2 }}>
            {ch.icon ? <MaterialCommunityIcons name={ch.icon} size={18} /> : null}{" "}
            {ch.title}: {ch.completed ? "Done!" : "Pending"}
          </Text>
        ))}
      </View>

      {/* Logout */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <MaterialCommunityIcons name="logout" size={20} color="#fff" style={{ marginRight: 6 }} />
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    paddingTop: 54,
    paddingBottom: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    marginBottom: 8,
    elevation: 4,
    alignItems: "center",
    shadowColor: "#388e3c",
  },
  headerRow: { flexDirection: 'row', alignItems: "center", justifyContent: "center" },
  header: { fontSize: 28, fontWeight: 'bold', color: "#fff", letterSpacing: 1.1 },
  topCard: {
    alignItems: 'center',
    margin: 16,
    padding: 18,
    borderRadius: 18,
    elevation: 4,
    shadowColor: '#43b480',
  },
  greeting: { fontSize: 22, color: '#43b480', fontWeight: '700', marginBottom: 2 },
  subline: { fontSize: 17, color: '#00897b', fontWeight: '500', marginTop: 2 },
  fact: { fontSize: 15, color: '#388E3C', textAlign: 'center', marginTop: 8, marginBottom: 2 },
  section: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#888',
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionHeader: { fontSize: 19, fontWeight: 'bold', color: '#388E3C', marginBottom: 5 },
  aqiText: { fontSize: 27, fontWeight: '700', marginVertical: 5 },
  progressRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3,
  },
  pointsValue: { color: '#43b480', fontSize: 17, fontWeight: 'bold', marginLeft: 14 },
  progressBarBg: {
    backgroundColor: '#cbe9d4', borderRadius: 6, height: 16, width: '100%', marginVertical: 4,
  },
  progressBar: { height: '100%', borderRadius: 6 },
  label: { fontSize: 16, fontWeight: '600', color: '#3a6073', marginTop: 5 },
  spinBtn: {
    backgroundColor: '#ffa928', borderRadius: 12, alignItems: 'center',
    marginTop: 10, paddingHorizontal: 22, paddingVertical: 10,
    flexDirection: 'row', justifyContent: "center"
  },
  logoutBtn: {
    flexDirection: "row",
    backgroundColor: '#e57373', borderRadius: 12, alignItems: 'center',
    justifyContent: "center",
    paddingHorizontal: 30, paddingVertical: 12, marginTop: 6,
  },
});
