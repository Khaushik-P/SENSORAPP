import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  RefreshControl,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function MonitoringScreen() {
  const [turbidity, setTurbidity] = useState<string | null>(null);
  const [ph, setPh] = useState<string | null>(null);
  const [tds, setTds] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch sensor-data from S3; bypass cache by appending a timestamp
  const fetchSensorData = async () => {
    try {
      setError(null);
      const url = `https://esp32-sensorapp.s3.ap-south-1.amazonaws.com/sensor-data.json?t=${new Date().getTime()}`;
      const response = await fetch(url, {
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await response.json();
      setTurbidity(data.turbidity);
      setPh(data.pH);
      setTds(data.tds);
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to fetch sensor data:', err);
    }
  };

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSensorData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchSensorData();
    const intervalId = setInterval(fetchSensorData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Turbidity Color Coding: green if < 5, else red
  const turbidityReading = turbidity ? parseFloat(turbidity) : 0;
  const turbidityColor = turbidityReading < 5 ? '#4CD964' : '#FF3B30';

  // pH Color Coding: green if 6.5 <= pH <= 8.5, else red
  const pHReading = ph ? parseFloat(ph) : 0;
  const pHColor = pHReading >= 6.5 && pHReading <= 8.5 ? '#4CD964' : '#FF3B30';

  // TDS Color Coding: < 300 => green, 300–499 => orange, >= 500 => red
  const tdsReading = tds ? parseFloat(tds) : 0;
  let tdsColor = '#4CD964';
  if (tdsReading >= 500) {
    tdsColor = '#FF3B30';
  } else if (tdsReading >= 300) {
    tdsColor = '#FFA500';
  }

  return (
    <LinearGradient colors={['#1B2735', '#090A0F']} style={styles.gradientBackground}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Text style={styles.dashboardTitle}>Water Quality Dashboard</Text>

          {/* Turbidity Sensor Card */}
          <View style={styles.sensorCard}>
            <LinearGradient colors={['#232526', '#414345']} style={styles.cardGradient}>
              <Text style={styles.sensorName}>Turbidity (NTU)</Text>
              {error ? (
                <Text style={styles.errorText}>Error: {error}</Text>
              ) : turbidity !== null ? (
                <>
                  <Text style={[styles.sensorValue, { color: turbidityColor }]}>
                    {turbidity}
                  </Text>
                  <Text style={styles.infoText}>(EPA recommends {'<'} 5 NTU)</Text>
                </>
              ) : (
                // Show spinner instead of "Loading..."
                <ActivityIndicator size="large" color="#FFF" />
              )}
            </LinearGradient>
          </View>

          {/* pH Sensor Card */}
          <View style={styles.sensorCard}>
            <LinearGradient colors={['#232526', '#414345']} style={styles.cardGradient}>
              <Text style={styles.sensorName}>pH Level</Text>
              {error ? (
                <Text style={styles.errorText}>Error: {error}</Text>
              ) : ph !== null ? (
                <>
                  <Text style={[styles.sensorValue, { color: pHColor }]}>{ph}</Text>
                  <Text style={styles.infoText}>(EPA recommends 6.5 to 8.5)</Text>
                </>
              ) : (
                <ActivityIndicator size="large" color="#FFF" />
              )}
            </LinearGradient>
          </View>

          {/* TDS Sensor Card */}
          <View style={styles.sensorCard}>
            <LinearGradient colors={['#232526', '#414345']} style={styles.cardGradient}>
              <Text style={styles.sensorName}>TDS (ppm)</Text>
              {error ? (
                <Text style={styles.errorText}>Error: {error}</Text>
              ) : tds !== null ? (
                <>
                  <Text style={[styles.sensorValue, { color: tdsColor }]}>{tds}</Text>
                  <Text style={styles.infoText}>(EPA recommends below 500 ppm)</Text>
                </>
              ) : (
                <ActivityIndicator size="large" color="#FFF" />
              )}
            </LinearGradient>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 50, // Extra padding for pull-to-refresh space
  },
  dashboardTitle: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowOpacity: 0.5,
    textShadowRadius: 2,
  },
  sensorCard: {
    width: '90%',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  cardGradient: {
    padding: 25,
    alignItems: 'center',
    borderRadius: 20,
  },
  sensorName: {
    color: '#EEE',
    fontSize: 20,
    marginBottom: 12,
    fontWeight: '600',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowOpacity: 0.3,
    textShadowRadius: 2,
  },
  sensorValue: {
    fontSize: 44,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowOpacity: 0.5,
    textShadowRadius: 3,
  },
  errorText: {
    color: '#FF5252',
    fontSize: 18,
    marginTop: 10,
  },
  infoText: {
    marginTop: 6,
    color: '#AAA',
    fontSize: 14,
  },
});
