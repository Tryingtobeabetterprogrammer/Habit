import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TaskDetail({ route }) {
  const { taskTitle } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{taskTitle}</Text>
      <Text style={styles.description}>Here you can add more details about the task.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
});