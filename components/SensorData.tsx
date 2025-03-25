import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SensorDataType {
  turbidity: string;
  timestamp: string;
}

const SensorData: React.FC = () => {
  const [data, setData] = useState<SensorDataType | null>(null);

  const fetchData = async () => {
    try {
      // Replace with your actual bucket name and file path
        const response = await fetch('https://esp32-sensorapp.s3.ap-south-1.amazonaws.com/sensor-data.json');
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error('Failed to fetch sensor data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {data ? (
        <>
          <Text style={styles.text}>Turbidity: {data.turbidity}</Text>
          <Text style={styles.text}>Timestamp: {data.timestamp}</Text>
        </>
      ) : (
        <Text style={styles.text}>Loading sensor data...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18 },
});

export default SensorData;
