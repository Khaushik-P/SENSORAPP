import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SplashScreen from './screens/SplashScreen';  // Animated splash
import MonitoringScreen from './screens/MonitoringScreen';

export default function App() {
  // Toggle between "SPLASH" and "MONITORING" screens
  const [currentScreen, setCurrentScreen] = useState<'SPLASH' | 'MONITORING'>('SPLASH');

  if (currentScreen === 'SPLASH') {
    return <SplashScreen onStart={() => setCurrentScreen('MONITORING')} />;
  } else {
    return <MonitoringScreen />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
