import { Slot } from 'expo-router';
import React from 'react';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import LoginScreen from './login'; // make sure this is correct path

function RootContent() {
  const { user, loading } = useAuth();

  if (loading) return null; // Or a loading spinner
  if (!user) return <LoginScreen />;
  return <Slot />; // renders the in-app navigation (tabs/dashboard)
}

export default function AppLayout() {
  return (
    <AuthProvider>
      <RootContent />
    </AuthProvider>
  );
}
