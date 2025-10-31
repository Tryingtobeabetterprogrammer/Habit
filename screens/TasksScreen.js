import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '',
    time: '12:00',
    reason: '',
    how: ''
  });
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const navigation = useNavigation();

  const addTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now().toString(),
        ...newTask,
        completed: false
      };
      setTasks([...tasks, task]);
      setNewTask({ 
        title: '', 
        description: '',
        time: '12:00',
        reason: '',
        how: ''
      });
      setAddModalVisible(false);
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <View style={styles.container}>
      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.taskItem}
            onPress={() => navigation.navigate('TaskDetail', { task: item })}
          >
            <View style={styles.taskContent}>
              <Text style={[styles.taskTitle, item.completed && styles.completedTask]}>
                {item.title}
              </Text>
              <Text style={styles.taskTime}>⏰ {item.time}</Text>
            </View>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={(e) => {
                e.stopPropagation(); // Prevent navigation when deleting
                deleteTask(item.id);
              }}
            >
              <Text style={styles.deleteText}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.taskList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No tasks yet</Text>
            <Text style={styles.emptyStateSubtext}>Tap + to add a new task</Text>
          </View>
        }
      />

      {/* Add Task Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setAddModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Add Task Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Task</Text>
            
            <Text style={styles.inputLabel}>What's the task?</Text>
            <TextInput
              style={styles.input}
              placeholder="Task name"
              value={newTask.title}
              onChangeText={(text) => setNewTask({...newTask, title: text})}
            />
            
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Add details about the task"
              value={newTask.description}
              onChangeText={(text) => setNewTask({...newTask, description: text})}
              multiline
            />
            
            <Text style={styles.inputLabel}>Time</Text>
            <TouchableOpacity 
              style={styles.timeButton}
              onPress={() => {
                // Time picker implementation would go here
                // For now, just using a simple text input
              }}
            >
              <Text>⏰ {newTask.time}</Text>
            </TouchableOpacity>
            
            <Text style={styles.inputLabel}>Why is this important?</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Why do you want to complete this task?"
              value={newTask.reason}
              onChangeText={(text) => setNewTask({...newTask, reason: text})}
              multiline
            />
            
            <Text style={styles.inputLabel}>How will you complete it?</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Break it down into steps if needed"
              value={newTask.how}
              onChangeText={(text) => setNewTask({...newTask, how: text})}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={addTask}
              >
                <Text style={styles.saveButtonText}>Save Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  taskList: {
    padding: 16,
  },
  taskItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  taskTime: {
    fontSize: 14,
    color: '#666',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteText: {
    fontSize: 20,
    color: '#ff6b6b',
  },
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    lineHeight: 28,
    marginTop: -2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  timeButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});