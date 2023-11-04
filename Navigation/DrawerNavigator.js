import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { MainStackNavigator } from "./StockNavigator";
import HomeScreen from '../Screens/HomeScreen';
import GroupMasterAdd from '../Screens/AddMemberToGroup';
import UserGroupsDashboard from '../Screens/UserGroupsDashboard';
import ExpensiveDashboard from '../Screens/ExpensiveDashboard';
import GroupMasterList from '../Screens/GroupMasterList';
import globalConstants from '../Consants/AppContstants';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator screenOptions={
      {
        drawerStyle: {
          backgroundColor: 'white',
          width: 240,
        },
        headerStyle: {
          backgroundColor:globalConstants.appThemeColor,
        },
        headerTintColor: '#fff',
      }

    }>
      {/* <Drawer.Screen name="HomePage" component={HomeScreen}  /> */}
      <Drawer.Screen
        options={{
          title:'User Dashboard'
        }}
        name="HomePage"
        component={UserGroupsDashboard} />
      <Drawer.Screen options={{
        title: 'Create Group'
      }}
        name="group"
        component={GroupMasterList} />
      {/* <Drawer.Screen name="ExpensiveList" component={ExpensiveDashboard}  />
      <Drawer.Screen name="Add-Expensive" component={HomeScreen}  />
      <Drawer.Screen name="GroupMaster" component={GroupMasterAdd} /> */}
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;