import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function TimerScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Timer Screen 🕐</Text>
    </View>
  );
}

function WaterScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Water Screen 💧</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Timer" component={TimerScreen} />
        <Tab.Screen name="Water" component={WaterScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});
