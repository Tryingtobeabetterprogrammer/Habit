import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Habit</Text>
      <Text style={styles.subtitle}>Your personal habit tracker</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('MainHome')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6C63FF',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});