import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { firebase } from './FireBaseConfig';
import { useEffect, useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DrawerNavigator from "./Navigation/DrawerNavigator";
import { MainStackNavigator } from "./Navigation/StockNavigator";
import AppProvider from './Context/appProvider';

const Stack = createNativeStackNavigator();
export default function App() {
  const user = firebase.firestore().collection('Users');
  const [name, setName] = useState("");
  useEffect(() => {
    
  })
  return (
    <AppProvider>
    <View style={styles.container}>
      <NavigationContainer>
        <MainStackNavigator />
      </NavigationContainer >
    </View>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    paddingTop: 30
  },
});
