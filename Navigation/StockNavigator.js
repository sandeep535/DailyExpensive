import React from "react";


import HomeScreen from '../Screens/HomeScreen'
import Login from '../Screens/Login';
import Signup from '../Screens/Signup';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigator from "./DrawerNavigator";
import GroupMasterList from '../Screens/GroupMasterList';
import AddNewGroup from '../Screens/AddNewGroup';
import AddMemberToGroup from '../Screens/AddMemberToGroup';
import GroupMasterAdd from '../Screens/AddMemberToGroup';
import UserGroupsDashboard from '../Screens/UserGroupsDashboard';
import ExpensiveDashboard from '../Screens/ExpensiveDashboard';
import globalConstants from '../Consants/AppContstants';

const Stack = createNativeStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={
      {
        headerShown: true,
        drawerStyle: {
          backgroundColor: '#c6cbef',
          width: 240,
        }, headerStyle: {
          backgroundColor: globalConstants.appThemeColor,
        },
        headerTintColor: '#fff',
      }

    }>
      <Stack.Screen
        options={{
          title: 'Login'
        }}
        name="Login"
        component={Login} />

      <Stack.Screen
        options={{
          title: 'Add Member'
        }}
        name="add-mem-to-group"
        component={AddMemberToGroup}
      />
      <Stack.Screen
        options={{
          title: 'New Group'
        }}
        name="add-group" component={AddNewGroup} />
      <Stack.Screen
        options={{
          title: 'Expensives'
        }}
        name="ExpensiveList"
        component={ExpensiveDashboard} />
      <Stack.Screen
        options={{
          title: 'Add Expensive'
        }}
        name="Add-Expensive" component={HomeScreen} />
      <Stack.Screen name="GroupMaster" component={GroupMasterAdd} />
      <Stack.Screen
        name="Home"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}

export { MainStackNavigator };