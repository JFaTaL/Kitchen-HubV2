import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, Image } from 'react-native'; 
import LandingPage from './landingPage';
import ShoppingList from './shoppingList';
import KitchenScreen from './kitchenScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Import your icon images
const ShoppingTabIcon = require('./assets/cart-icon.png');
const KitchenIcon = require('./assets/kitchenIcon.png');

function App() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#008080" />
      <Stack.Navigator
        initialRouteName="LandingPage"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="LandingPage" component={LandingPage} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#008080', // Color of the active tab icon
        tabBarInactiveTintColor: 'gray',  // Color of the inactive tab icon
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="ShoppingList"
        component={ShoppingList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image source={ShoppingTabIcon} style={{ tintColor: color, width: size, height: size }} />
          ),
        }}
      />
      <Tab.Screen
        name="KitchenScreen"
        component={KitchenScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image source={KitchenIcon} style={{ tintColor: color, width: size, height: size }} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default App;
