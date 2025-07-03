import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, TextInput, Button, StyleSheet, Text, TouchableOpacity, Switch } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const styles = getStyles(theme);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadNotes);
    return unsubscribe;
  }, [navigation]);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('@notes_app_data');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error('Ошибка загрузки заметок:', error);
    }
  };

  const deleteNote = async (id) => {
    try {
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      await AsyncStorage.setItem('@notes_app_data', JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Ошибка удаления заметки:', error);
    }
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.themeSwitchContainer}>
        <Text style={styles.themeText}>Тёмная тема</Text>
        <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme}
        />
      </View>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Поиск заметок..."
        placeholderTextColor={theme === 'dark' ? '#aaa' : '#888'}
        value={searchText}
        onChangeText={setSearchText}
      />
      
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.noteItem}
            onPress={() => navigation.navigate('Note', { note: item })}
          >
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Text style={styles.notePreview}>
              {item.text.length > 50 ? item.text.substring(0, 50) + '...' : item.text}
            </Text>
            <Button 
              title="Удалить" 
              onPress={() => deleteNote(item.id)} 
              color="#ff4444"
            />
          </TouchableOpacity>
        )}
      />
      
      <Button
        title="Добавить заметку"
        onPress={() => navigation.navigate('AddNote')}
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
  themeSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  themeText: {
    marginRight: 10,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  searchInput: {
    height: 40,
    borderColor: theme === 'dark' ? '#555' : '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: theme === 'dark' ? '#333' : '#fff',
    color: theme === 'dark' ? '#fff' : '#000',
  },
  noteItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: theme === 'dark' ? '#333' : '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme === 'dark' ? 0.1 : 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  notePreview: {
    fontSize: 14,
    color: theme === 'dark' ? '#aaa' : '#666',
    marginBottom: 10,
  },
});

export default HomeScreen;