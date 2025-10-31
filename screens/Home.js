import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function Home({ navigation }) {
  const tasks = [
    { id: 1, title: 'Read a book', completed: false },
    { id: 2, title: 'Exercise', completed: true },
    { id: 3, title: 'Meditate', completed: false },
  ];

  const incompleteTasks = tasks.filter(task => !task.completed);

  return (
    <ScrollView style={styles.container}>
      {/* User Profile Section */}
      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>User Name</Text>
        <Text style={styles.userEmail}>user@example.com</Text>
      </View>

      {/* AI Chat Container */}
      {/* AI Chat Container */}
<View style={styles.aiChatContainer}>
  <TouchableOpacity style={styles.aiChatButton} onPress={() => navigation.navigate('ChatScreen')}>
    <MaterialIcons name="chat" size={24} color="#6C63FF" />
    <Text style={styles.aiChatText}>AI Assistant</Text>
  </TouchableOpacity>
</View>

      {/* Tasks Panel */}
      <TouchableOpacity style={styles.tasksPanel} onPress={() => navigation.navigate('TaskList')}>
        <Text style={styles.tasksTitle}>Tasks to Complete</Text>
        {incompleteTasks.map(task => (
          <View key={task.id} style={styles.taskItem}>
            <Text style={styles.taskText}>{task.title}</Text>
          </View>
        ))}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  profileContainer: {
    backgroundColor: '#6C63FF',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6C63FF',
    borderRadius: 20,
    padding: 5,
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  aiChatContainer: {
    backgroundColor: 'white',
    marginHorizontal: 30,
    marginTop: -20,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 10,
  },
  aiChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  aiChatText: {
    color: '#6C63FF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  tasksPanel: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  tasksTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
});