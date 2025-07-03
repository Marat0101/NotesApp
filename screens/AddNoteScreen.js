import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddNoteScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const { theme } = useContext(ThemeContext);
  
  const styles = getStyles(theme);

  const saveNote = async () => {
    if (!title.trim()) return;

    try {
      const newNote = {
        id: Date.now(),
        title,
        text,
        createdAt: new Date().toISOString(),
      };
      
      const savedNotes = await AsyncStorage.getItem('@notes_app_data');
      const notes = savedNotes ? JSON.parse(savedNotes) : [];
      const updatedNotes = [...notes, newNote];
      
      await AsyncStorage.setItem('@notes_app_data', JSON.stringify(updatedNotes));
      navigation.goBack();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Не удалось сохранить заметку');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Заголовок"
        placeholderTextColor={theme === 'dark' ? '#aaa' : '#888'}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        value={text}
        onChangeText={setText}
        placeholder="Текст заметки"
        placeholderTextColor={theme === 'dark' ? '#aaa' : '#888'}
        multiline
      />
      <Button 
        title="Сохранить заметку" 
        onPress={saveNote} 
        disabled={!title.trim()}
        color={theme === 'dark' ? '#bb86fc' : '#6200ee'}
      />
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5',
  },
  input: {
    height: 40,
    borderColor: theme === 'dark' ? '#555' : '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: theme === 'dark' ? '#333' : '#fff',
    color: theme === 'dark' ? '#fff' : '#000',
  },
  textArea: {
    height: 200,
    textAlignVertical: 'top',
  },
});

export default AddNoteScreen;