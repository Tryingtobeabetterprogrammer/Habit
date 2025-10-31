import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function TaskList({ navigation }) {
  const tasks = [
    { id: 1, title: 'Read a book', completed: false },
    { id: 2, title: 'Exercise', completed: true },
    { id: 3, title: 'Meditate', completed: false },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Tasks</Text>
      {tasks.map(task => (
        <TouchableOpacity
          key={task.id}
          style={styles.taskItem}
          onPress={() => navigation.navigate('TaskDetail', { taskTitle: task.title })}
        >
          <Text style={styles.taskText}>{task.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  taskItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  taskText: {
    fontSize: 18,
    color: '#333',
  },
});