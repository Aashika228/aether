import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../src/contexts/AppContext';

const STORAGE_KEY = 'treeGame';
const DECAY_INTERVAL_MINUTES = 10;
const DECAY_AMOUNT = 10;

const getNow = () => new Date().getTime();
function minutesBetween(ts1: number, ts2: number) {
  return Math.floor(Math.abs((ts1 - ts2) / 60000));
}

export default function TreeScreen() {
  const { state, dispatch } = useAppContext();
  const [lastWatered, setLastWatered] = useState<number>(getNow());
  const [streak, setStreak] = useState<number>(1);
  const [health, setHealth] = useState<number>(100);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          const data = JSON.parse(json);
          setLastWatered(data.lastWatered ?? getNow());
          setStreak(data.streak ?? 1);
          setHealth(data.health ?? 100);
        }
      } catch (e) {
        setLastWatered(getNow());
        setStreak(1);
        setHealth(100);
      }
    })();
  }, []);

  useEffect(() => {
    const tick = async () => {
      const now = getNow();
      const minsAgo = minutesBetween(now, lastWatered);
      const intervals = Math.floor(minsAgo / DECAY_INTERVAL_MINUTES);
      if (intervals > 0) {
        const decayed = Math.max(0, health - intervals * DECAY_AMOUNT);
        setHealth(decayed);
        setMessage('Your tree is getting thirsty! Don’t forget to water.');
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
          lastWatered,
          streak,
          health: decayed,
        }));
      }
    };
    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, [lastWatered, health, streak]);

  const handleWaterTree = async () => {
    const now = getNow();
    if (minutesBetween(now, lastWatered) < 2) return;
    const newStreak = streak + 1;
    const newHealth = Math.min(health + 20, 100);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
      lastWatered: now,
      streak: newStreak,
      health: newHealth,
    }));
    setLastWatered(now);
    setStreak(newStreak);
    setHealth(newHealth);
    dispatch({ type: 'PLANT_TREE' });
    setMessage("You watered your tree! It's healthier now.");
  };

  const treeIcon = health > 80 ? '🌳' : health > 40 ? '🌲' : '🪴';
  const waterBtnDisabled = minutesBetween(getNow(), lastWatered) < 2;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Bar */}
      <LinearGradient colors={['#43b480', '#8fd9ef']} style={styles.headerBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
          <MaterialCommunityIcons name="tree" size={32} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.header}>Care For Your Tree</Text>
        </View>
      </LinearGradient>
      {/* Motivation card */}
      <LinearGradient colors={['#eafce1', '#e3f9e4']} style={styles.infoBox}>
        <Text style={styles.infoTitle}>Trees Matter</Text>
        <Text style={styles.infoText}>
          Every tree absorbs carbon, refreshes air, provides habitat, and cools cities.
          Your virtual tree symbolizes real-life eco care. Stay green!
        </Text>
        <View style={styles.badgeRow}>
          <MaterialCommunityIcons name="seed" size={19} color="#4CAF50" />
          <MaterialCommunityIcons name="sprout" size={21} color="#43b480" style={{ marginLeft: 8 }} />
          <MaterialCommunityIcons name="leaf" size={20} color="#6ac47e" style={{ marginLeft: 8 }} />
        </View>
      </LinearGradient>
      {/* Tree Card */}
      <View style={styles.treeCard}>
        <Text style={styles.treeLabel}>🌳 Your Virtual Tree</Text>
        <Text style={styles.streakTxt}>
          <MaterialCommunityIcons name="fire" color="#ff9800" /> Streak: <Text style={{ color: '#388E3C', fontWeight: 'bold' }}>{streak}</Text>
        </Text>
        <View style={styles.treeVisual}>
          <Text style={{ fontSize: 68 }}>{treeIcon}</Text>
          <Text style={{ fontSize: 20, color: '#2c5939', marginVertical: 5, fontWeight: "bold" }}>Health: {health}%</Text>
          <LinearGradient
            colors={['#a2f098', '#43b480']}
            style={[styles.healthBar, { width: `${health}%` }]}
          />
        </View>
        <Text style={styles.fact}>
          {health > 80
            ? "Your tree is thriving! 🌱 Keep up the care."
            : health > 40
              ? "Tree needs more care. Water it regularly to grow."
              : "Tree is wilted! Water it to restore its strength."}
        </Text>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: waterBtnDisabled ? '#BDBDBD' : '#388E3C' },
          ]}
          onPress={handleWaterTree}
          disabled={waterBtnDisabled}
          activeOpacity={0.87}
        >
          <MaterialCommunityIcons name="watering-can" color="#fff" size={21} />
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 6 }}>
            {waterBtnDisabled ? 'Already Watered!' : 'Water My Tree'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.message}>{message}</Text>
      </View>
      {/* Footer tip + stats */}
      <LinearGradient colors={['#e8fcd7', '#fff']} style={styles.footerTip}>
        <MaterialCommunityIcons name="earth" color="#7bd560" size={18} />
        <Text style={styles.footerText}>
          Each tree you grow makes the world greener. Plant more!
        </Text>
      </LinearGradient>
      <Text style={styles.counter}>
        <MaterialCommunityIcons name="tree" color="#43b480" size={19} /> Trees Grown: {state.user.treesPlanted}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0, // no extra padding, cards handle it
    backgroundColor: '#f5fff7',
    alignItems: 'center',
    flexGrow: 1,
  },
  headerBar: {
    width: '100%',
    paddingTop: 54,
    paddingBottom: 18,
    borderBottomRightRadius: 18,
    borderBottomLeftRadius: 18,
    alignItems: "center",
    marginBottom: 8,
    elevation: 4,
    shadowColor: "#43b480",
  },
  header: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1.2,
    marginLeft: 3
  },
  infoBox: {
    backgroundColor: '#eafce1',
    borderRadius: 13,
    padding: 15,
    marginHorizontal: 18,
    marginVertical: 9,
    width: '90%',
    alignItems: "center",
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#388E3C',
    marginBottom: 4,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 15,
    color: '#2c5939',
    marginBottom: 8,
    textAlign: 'center',
  },
  badgeRow: {
    flexDirection: "row", alignItems: "center", marginTop: 3, justifyContent: "center"
  },
  treeCard: {
    width: '90%',
    backgroundColor: "#fcfff6",
    padding: 18,
    marginBottom: 18,
    borderRadius: 17,
    alignItems: 'center',
    elevation: 5,
    shadowColor: "#a4ecb3",
  },
  treeLabel: {
    fontSize: 18,
    color: '#43b480',
    fontWeight: "bold",
    marginBottom: 12,
  },
  streakTxt: {
    fontSize: 16,
    fontWeight: "600",
    color: "#117733",
    marginBottom: 8,
  },
  treeVisual: {
    alignItems: 'center',
    width: '90%',
  },
  healthBar: {
    height: 18,
    borderRadius: 8,
    marginTop: 7,
    marginBottom: 7,
    width: "100%",
    alignSelf: "flex-start",
  },
  button: {
    marginTop: 9,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 9,
    elevation: 3,
  },
  fact: {
    marginTop: 2,
    marginBottom: 6,
    textAlign: 'center',
    fontSize: 15,
    color: '#388E3C',
    fontWeight: '500',
  },
  message: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 15,
    color: '#7d8628',
    fontWeight: "500"
  },
  footerTip: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 11,
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation: 1,
    marginHorizontal: 14,
  },
  footerText: { color: "#438733", fontSize: 15, marginLeft: 6 },
  counter: {
    marginTop: 14,
    fontSize: 16,
    color: '#388E3C',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 19
  },
});
