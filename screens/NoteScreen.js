import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NoteScreen = ({ route, navigation }) => {
  const { note: initialNote } = route.params;
  const [note, setNote] = useState(initialNote);
  const [isEditing, setIsEditing] = useState(false);
  const { theme } = useContext(ThemeContext);
  
  const styles = getStyles(theme);

  const saveNote = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('@notes_app_data');
      let notes = savedNotes ? JSON.parse(savedNotes) : [];
      
      notes = notes.map(n => n.id === note.id ? note : n);
      await AsyncStorage.setItem('@notes_app_data', JSON.stringify(notes));
      
      setIsEditing(false);
      navigation.goBack();
    } catch (error) {
      console.error('Ошибка сохранения заметки:', error);
      alert('Не удалось сохранить изменения');
    }
  };

  return (
    <View style={styles.container}>
      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            value={note.title}
            onChangeText={(text) => setNote({...note, title: text})}
            placeholder="Заголовок"
            placeholderTextColor={theme === 'dark' ? '#aaa' : '#888'}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            value={note.text}
            onChangeText={(text) => setNote({...note, text})}
            placeholder="Текст заметки"
            placeholderTextColor={theme === 'dark' ? '#aaa' : '#888'}
            multiline
          />
          <Button 
            title="Сохранить" 
            onPress={saveNote} 
            color={theme === 'dark' ? '#bb86fc' : '#6200ee'}
          />
        </>
      ) : (
        <>
          <Text style={styles.title}>{note.title}</Text>
          <Text style={styles.text}>{note.text}</Text>
          <Button 
            title="Редактировать" 
            onPress={() => setIsEditing(true)}
            color={theme === 'dark' ? '#bb86fc' : '#6200ee'}
          />
        </>
      )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    color: theme === 'dark' ? '#ddd' : '#333',
  },
});

export default NoteScreen;