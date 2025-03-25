import React, { useRef, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// For TouchableOpacity with animated scale, we can wrap it:
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface SplashScreenProps {
  onStart: () => void; // Callback to switch to the next screen
}

export default function SplashScreen({ onStart }: SplashScreenProps) {
  // Animated values
  const fadeAnimTitle = useRef(new Animated.Value(0)).current;     // Fade for title & subtitle
  const bounceAnimButton = useRef(new Animated.Value(0.5)).current; // Scale for Start button
  const fadeAnimVersion = useRef(new Animated.Value(0)).current;   // Fade for version text

  useEffect(() => {
    // Sequence: fade in title/subtitle → bounce button → fade in version text
    Animated.sequence([
      Animated.timing(fadeAnimTitle, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.spring(bounceAnimButton, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimVersion, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={['#0F2027', '#203A43', '#2C5364']} // You can change these colors
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.container}>
        {/* Title & Subtitle with fade-in */}
        <Animated.Text style={[styles.appTitle, { opacity: fadeAnimTitle }]}>
          Smart Water Monitoring
        </Animated.Text>
        <Animated.Text style={[styles.appSubtitle, { opacity: fadeAnimTitle }]}>
          App
        </Animated.Text>

        {/* Bouncy Start Button */}
        <AnimatedTouchable
          style={[
            styles.startButton,
            { transform: [{ scale: bounceAnimButton }] },
          ]}
          onPress={onStart}
        >
          <Text style={styles.startButtonText}>Start</Text>
        </AnimatedTouchable>

        {/* Version Text with fade-in */}
        <Animated.Text
          style={[styles.versionText, { opacity: fadeAnimVersion }]}
        >
          Version 1.0.0
        </Animated.Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 24,
    fontWeight: '300',
    color: '#EEE',
    marginBottom: 40,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#00C6FF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 80, // Extra space above version text
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
  },
  versionText: {
    position: 'absolute',
    bottom: 20,
    color: '#CCC',
    fontSize: 14,
  },
});
