import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import NoteScreen from './screens/NoteScreen';
import AddNoteScreen from './screens/AddNoteScreen';
import { ThemeProvider } from './context/ThemeContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Мои заметки' }} 
          />
          <Stack.Screen 
            name="Note" 
            component={NoteScreen} 
            options={{ title: 'Заметка' }} 
          />
          <Stack.Screen 
            name="AddNote" 
            component={AddNoteScreen} 
            options={{ title: 'Новая заметка' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}