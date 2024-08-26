import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';

// Component for the loading screen
const LoadingScreen = () => {
  return (
    <View style={styles.loadingContainer}>
      {/* Logo */}
      <Image
        source={require('./assets/logo.png')}
        style={styles.logo}
      />
      {/* Loading indicator */}
      <ActivityIndicator size="large" color="#008080" />
    </View>
  );
};

// Landing page component
const LandingPage = ({ navigation }) => {
  // State to track loading status
  const [loading, setLoading] = useState(true);

  // Effect to simulate loading and navigate to ShoppingList after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Set loading to false after 5 seconds
      navigation.navigate('MainTabs', { screen: 'ShoppingList' }); // Navigate to MainTabs with ShoppingList
    }, 5000); // 5000 milliseconds = 5 seconds

    // Clean up timer
    return () => clearTimeout(timer);
  }, [navigation]);

  // Render loading screen while loading
  if (loading) {
    return <LoadingScreen />;
  }

  // If loading is done, do nothing
  return null;
};

// Styles
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Set background color to white
  },
  logo: {
    width: 500, 
    height: 500, 
    resizeMode: 'contain',
    marginBottom: 20, 
  },
});

export default LandingPage;
