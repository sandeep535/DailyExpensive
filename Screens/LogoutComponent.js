import React, { useEffect, useRef } from 'react'
import { StyleSheet, View, ActivityIndicator, Animated, Easing } from 'react-native'
import globalConstants from '../Consants/AppContstants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogoutComponent = ({ navigation }) => {

  useEffect(() => {
    AsyncStorage.setItem('loggedinUserData','');
    navigation.navigate('Login')
  }, [])

  return (
    <View style={{ position: "absolute", top: '50%', left: '50%' }}>
       </View>
  )
}

const styles = StyleSheet.create({
  
})

export default LogoutComponent