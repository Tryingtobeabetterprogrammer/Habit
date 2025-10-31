import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const TaskDetailScreen = ({ route }) => {
  const { task } = route.params || {};

  if (!task) {
    return (
      <View style={styles.container}>
        <Text>No task details available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Title</Text>
        <Text style={styles.value}>{task.title}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>When</Text>
        <Text style={styles.value}>{task.when || 'Not specified'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Time</Text>
        <Text style={styles.value}>{task.time || 'Not specified'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>How</Text>
        <Text style={styles.value}>{task.how || 'Not specified'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Why</Text>
        <Text style={styles.value}>{task.why || 'Not specified'}</Text>
      </View>

      {task.notes && (
        <View style={styles.section}>
          <Text style={styles.label}>Additional Notes</Text>
          <Text style={styles.value}>{task.notes}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  section: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    paddingBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});

export default TaskDetailScreen;