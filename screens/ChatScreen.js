import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { chatWithHabit } from '../services/aiService';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { id: Date.now().toString(), text: input, isUser: true };
      console.log('User Message:', userMessage.text);
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInput('');

      try {
        // Show loading state
        const loadingMessage = { 
          id: 'loading-' + Date.now(), 
          text: 'Habit is thinking...', 
          isUser: false 
        };
        setMessages(prev => [...prev, loadingMessage]);

        // Get AI response
        const aiResponseText = await chatWithHabit(input);
        
        // Remove loading message and add AI response
        setMessages(prev => [
          ...prev.filter(msg => msg.id !== loadingMessage.id),
          { id: Date.now().toString(), text: aiResponseText, isUser: false }
        ]);
      } catch (error) {
        console.error('Error fetching AI response:', error);
        const errorMessage = { 
          id: 'error-' + Date.now(), 
          text: 'Sorry, I encountered an error. Please try again.', 
          isUser: false 
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBubble,
            item.isUser ? styles.userBubble : styles.aiBubble
          ]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={handleSend}
          disabled={!input.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#6C63FF',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});