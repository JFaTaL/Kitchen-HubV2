import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Image, Text } from 'react-native';
import { Platform } from 'react-native';



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
    setLoading(false);
    if (Platform.OS === 'web') {
      navigation.navigate('MainTabs', { screen: 'ShoppingList' });
    } else {
      navigation.replace('MainTabs', { screen: 'ShoppingList' });
    }
  }, 5000);

  return () => clearTimeout(timer);
}, [navigation]);

  // Render loading screen while loading
  if (loading) {
    return <LoadingScreen />;
  }

// Return null because navigation.replace takes over
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
