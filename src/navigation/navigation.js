import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen.js';
import Info from '../screens/Info.js';
import Wind from '../screens/Wind.js';
import { LogBox, Text, View } from 'react-native';

const Stack = createNativeStackNavigator();

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Home" options={{headerShown: false}} component={HomeScreen} />
      <Stack.Screen name="Info" options={{headerShown: false}} component={Info} />
      <Stack.Screen name="Wind" options={{headerShown: false}} component={Wind} />
      </Stack.Navigator>
    </NavigationContainer>
  )
  
}