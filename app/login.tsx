import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../src/contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register } = useAuth();

  const handleLogin = async () => {
    if (!email.includes('@') || password.length < 6) {
      Alert.alert('Error', 'Valid email and password of 6+ characters required');
      return;
    }
    try {
      await login(email, password);
    } catch (e: any) {
      Alert.alert('Login Failed', e.message || String(e));
    }
  };

  const handleRegister = async () => {
    if (!email.includes('@') || password.length < 6) {
      Alert.alert('Error', 'Valid email and password of 6+ characters required');
      return;
    }
    try {
      await register(email, password);
      Alert.alert('Registration Success', 'Account created! Please login.');
    } catch (e: any) {
      Alert.alert('Registration Failed', e.message || String(e));
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : undefined} 
      style={styles.container}
    >
      <LinearGradient
        colors={['#6ee7b7', '#3b82f6']}
        style={styles.gradientBg}
      >
        <MaterialCommunityIcons name="leaf" size={90} color="white" />
        <Text style={styles.header}>Welcome Back</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#666"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#666"
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.registerBtn]} onPress={handleRegister} activeOpacity={0.85}>
            <Text style={[styles.buttonText, { color: '#3b82f6' }]}>Register</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 32,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    paddingVertical: 12,
    marginBottom: 28,
    color: '#222',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  registerBtn: {
    backgroundColor: '#ecf0ff',
  },
});
