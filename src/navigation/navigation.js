import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen.js';
import Elements from '../screens/Elements.js';
import { LogBox } from 'react-native';

const Stack = createNativeStackNavigator();

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Home" options={{headerShown: false}} component={HomeScreen} />
      <Stack.Screen name="Wind" options={{headerShown: false}} component={Elements} />
      <Stack.Screen name="Humidity" options={{headerShown: false}} component={Elements} />
      <Stack.Screen name="Uv Index" options={{headerShown: false}} component={Elements} />
      <Stack.Screen name="Pressure" options={{headerShown: false}} component={Elements} />
      <Stack.Screen name="Precipitation" options={{headerShown: false}} component={Elements} />
      <Stack.Screen name="Rain Prob" options={{headerShown: false}} component={Elements} />
      <Stack.Screen name="Vision" options={{headerShown: false}} component={Elements} />
      <Stack.Screen name="Sunrise" options={{headerShown: false}} component={Elements} />
      </Stack.Navigator>
    </NavigationContainer>
  )
  
}