import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Strict type for icon names
type Challenge = {
  id: number;
  title: string;
  points: number;
  completed: boolean;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
};

const initialChallenges: Challenge[] = [
  { id: 1, title: "Recycle Plastic Bottles", points: 10, completed: false, icon: "recycle" },
  { id: 2, title: "Bike Instead of Car", points: 15, completed: false, icon: "bike" },
  { id: 3, title: "Plant a Tree", points: 20, completed: false, icon: "tree" },
  { id: 4, title: "Three-Minute Shower", points: 5, completed: false, icon: "water" },
];

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState(initialChallenges);
  const [totalPoints, setTotalPoints] = useState(0);

  const handleComplete = (id: number) => {
    setChallenges((prev) =>
      prev.map((challenge) =>
        challenge.id === id ? { ...challenge, completed: true } : challenge
      )
    );
    const challenge = challenges.find((c) => c.id === id);
    if (challenge && !challenge.completed) {
      setTotalPoints((prev) => prev + challenge.points);
      Alert.alert("Great job!", `You earned ${challenge.points} points!`);
    }
  };

  const renderItem = ({ item }: { item: Challenge }) => (
    <LinearGradient
      colors={item.completed ? ['#e4ffe8', '#eaf2fc'] : ['#b7f8db', '#50a7c2']}
      style={[styles.challengeCard, item.completed && styles.completedCard]}
      start={[0, 0]} end={[1, 1]}
    >
      <View style={styles.iconBadge}>
        <MaterialCommunityIcons
          name={item.icon}
          size={30}
          color={item.completed ? "#bdbdbd" : "#388e3c"}
        />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text
          style={[
            styles.challengeText,
            item.completed && styles.completedChallengeText,
          ]}>
          {item.title}
        </Text>
        <Text style={styles.challengePoints}>{item.points} Points</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.button,
          item.completed && styles.buttonCompleted,
        ]}
        onPress={() => handleComplete(item.id)}
        disabled={item.completed}
        activeOpacity={0.88}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          {item.completed ? "✓ Done" : "Complete"}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#6fd6b8', '#8fd9ef']} style={styles.headerBar}>
        <Text style={styles.header}>🌱 Eco Challenges</Text>
      </LinearGradient>
      <View style={styles.pointsContainer}>
        <MaterialCommunityIcons name="star-circle" size={34} color="#ffe066" />
        <Text style={styles.pointsBig}>{totalPoints}</Text>
        <Text style={styles.pointsLabel}>Total Points</Text>
      </View>
      <FlatList
        data={challenges}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5fff7' },
  headerBar: {
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    alignItems: "center",
    marginBottom: 10,
    elevation: 6
  },
  header: { fontSize: 30, fontWeight: 'bold', color: "#1b4332", letterSpacing: 1.5 },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#edfff2",
    borderRadius: 22,
    alignSelf: "center",
    marginVertical: 20,
    paddingVertical: 8,
    paddingHorizontal: 28,
    elevation: 2,
    shadowColor: "#bbb"
  },
  pointsBig: {
    fontSize: 30, fontWeight: "800", color: "#43b480", marginHorizontal: 8
  },
  pointsLabel: {
    fontSize: 16, color: "#43b480", fontWeight: "500", marginLeft: 6
  },
  challengeCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 25,
    marginVertical: 10,
    padding: 18,
    backgroundColor: '#f8fff5',
    borderRadius: 14,
    elevation: 4,
    shadowColor: "#4CAF50"
  },
  completedCard: {
    opacity: 0.66
  },
  iconBadge: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: "#edfff2", alignItems: "center", justifyContent: "center",
    borderColor: "#43b480", borderWidth: 1
  },
  challengeText: { fontSize: 19, color: '#222', fontWeight: "bold", marginBottom: 6 },
  completedChallengeText: { textDecorationLine: 'line-through', color: '#9e9e9e' },
  challengePoints: { fontSize: 15, color: "#388e3c", fontWeight: "500" },
  button: {
    backgroundColor: '#43b480', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10,
    marginLeft: 10, shadowColor: "#bbb", shadowOpacity: 0.19, shadowOffset: { width: 0, height: 2 }
  },
  buttonCompleted: { backgroundColor: '#9becc4', },
});
