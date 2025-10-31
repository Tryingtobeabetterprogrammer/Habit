import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import Home from './screens/Home';
import TaskDetail from './screens/TaskDetail';
import TaskList from './screens/TaskList';
import ChatScreen from './screens/ChatScreen'; // Import ChatScreen

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ 
            headerShown: false,
            title: 'Habit Tracker',
            headerStyle: {
              backgroundColor: '#6C63FF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} 
        />
        <Stack.Screen 
          name="TaskList" 
          component={TaskList} 
          options={{
            headerShown: true,
            title: 'Task List',
            headerStyle: {
              backgroundColor: '#6C63FF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen 
          name="TaskDetail" 
          component={TaskDetail} 
          options={{
            headerShown: true,
            title: 'Task Details',
            headerStyle: {
              backgroundColor: '#6C63FF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen 
          name="ChatScreen" 
          component={ChatScreen} 
          options={{
            headerShown: true,
            title: 'AI Assistant',
            headerStyle: {
              backgroundColor: '#6C63FF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}