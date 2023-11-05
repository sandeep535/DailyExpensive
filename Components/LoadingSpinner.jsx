import React, { useEffect, useRef } from 'react'
import { StyleSheet, View, ActivityIndicator, Animated, Easing } from 'react-native'
import globalConstants from '../Consants/AppContstants';

const LoadingSpinner = ({
  color,
  durationMs = 1000
}) => {

  useEffect(() => {

  }, [])

  return (
    <View style={{ position: "absolute", top: '50%', left: '50%' }}>
      <ActivityIndicator size="large" number = '100' color={globalConstants.appThemeColor}  style = {styles.activityIndicator}/>
    </View>
  )
}

const styles = StyleSheet.create({
  activityIndicator:{
    fontSize:100
  },
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default LoadingSpinner