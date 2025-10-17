import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type AirSphereProps = {
  aqi: number; // 1 to 5
};

const AQI_COLORS = ['#49b86a', '#aacb37', '#ffeb3b', '#ff9800', '#f44336'];
const AQI_LABELS = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];

export default function AirSphere({ aqi }: AirSphereProps) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 10, duration: 800, useNativeDriver: false, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(anim, { toValue: -10, duration: 800, useNativeDriver: false, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();
  }, []);

  const color = AQI_COLORS[aqi - 1] || '#49b86a';
  const label = AQI_LABELS[aqi - 1] || 'Good';

  return (
    <View style={styles.center}>
      <Animated.View style={{ transform: [{ translateY: anim }] }}>
        <Svg width={140} height={140}>
          <Circle
            cx={70}
            cy={70}
            r={60}
            fill={color}
            stroke="#fff"
            strokeWidth={5}
            opacity={0.9}
          />
        </Svg>
      </Animated.View>
      <Text style={styles.aqiLabel}>Air Quality: <Text style={{ color, fontWeight: 'bold' }}>{label}</Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', marginVertical: 24 },
  aqiLabel: { fontSize: 19, marginTop: 13 }
});
