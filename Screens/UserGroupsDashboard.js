import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, TextInput,ScrollView,Pressable,TouchableOpacity } from 'react-native';
import { useEffect, useState,useContext } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import { firebase, app } from '../FireBaseConfig';
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingSpinner from '../Components/LoadingSpinner';
import AppContext from '../Context/appContext';
import globalConstants from '../Consants/AppContstants';
import Notification from '../Components/Notification';

export default function UserGroupsDashboard({ navigation }) {
    const [selectedUserGroupList, setSelectedUserGroupList] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    const value = useContext(AppContext);
    console.log("sssssssssssssdddddddddddddddddd",value);
    useEffect(() => {
        getAllGroupsData();
        getSelectedGroup();
    }, []);
    function getAllGroupsData() {

    }

    async function _retrieveLoginData() {
        try {
            const value = await AsyncStorage.getItem('loggedinUserData');
            if (value !== null) {
                return value;
            }
        } catch (error) {
            // Error retrieving data
        }
    };
    function getGroupBasedongroupId(userGoupData) {
        let userGroupData = [];
        const groups = firebase.firestore().collection('GroupMaster');
        setIsLoading(true);
        groups.onSnapshot((snapshot) => {
            const postData = [];
            setIsLoading(false);
            snapshot.forEach((doc) => {
                let filterData = userGoupData.filter(userGr => {
                    return userGr.groupId == doc.data().groupId
                })
                if (filterData && filterData.length != 0) {
                    postData.push({ ...doc.data(), id: doc.id })
                }

            });
            console.log("-------->", postData);
            setSelectedUserGroupList(postData);

        });
    }
    async function getSelectedGroup() {
        setIsLoading(true);
        const fs = getFirestore(app);
        const collectionRef = collection(fs, 'GroupMasterUserLink');
        let userData = await _retrieveLoginData();
        if (userData) {
            userData = JSON.parse(userData);
        }
        //console.log("ssssssssssssssssssssssss",userData);
        let result = query(collectionRef, where('userId', '==', userData.UserId));
        getDocs(result).then((querySnapshot) => {
            setIsLoading(false);
            let selectedGroupListcopy = [];
            querySnapshot.forEach((doc) => {
                selectedGroupListcopy.push(doc.data());
            });
            // setSelectedUserGroupList(selectedGroupListcopy);
            getGroupBasedongroupId(selectedGroupListcopy);
        })
    }
    function callSelectedGroup (group){
        value.setSelectedGroupDataEvent(group)
        //AppContext.setSelectedGroupDataEvent(group);
        navigation.navigate('ExpensiveList',{selectedGroup:group})
    }

    return (
        <View style={styles.container}>
            {isLoading &&
            <LoadingSpinner/>}
            <ScrollView contentContainerStyle={styles.outer}>
                {selectedUserGroupList.map((group, index) => {
                    return (
                        //<TouchableOpacity  key={group.userId}  onPress={() => navigation.navigate('ExpensiveList')}>
                        <View key={""+index} style={[styles.inner,styles.groupContainer]}>
                            <TouchableOpacity onPress={() =>callSelectedGroup(group)}>
                                <Text style={styles.groupName} >{group.groupName}</Text>
                            </TouchableOpacity>
                        </View>
                        //</TouchableOpacity>
                    );
                })}
            </ScrollView>
            {/* <Pressable
                onPress={() => navigation.navigate('Add-Expensive')}>
               <AntDesign name="addusergroup" size={32} color="black" style={{ position: "absolute", bottom: 20, right: 20 }} />
            </Pressable> */}
        </View>
    )

}
const styles = StyleSheet.create({
    outer: {
        flex: 1,
        height:'100%'
      },
      
    container: {
        flex: 1,
        height: '100%'
    },
    groupContainer: {
        height: 60,
        width: '95%',
        borderWidth: 2,
        borderColor: globalConstants.appThemeColor,
        margin:10,
        borderRadius:10,
        padding:13
    },
    groupName:{
        fontSize:20,
        fontWeight:'700',
        color:globalConstants.appThemeColor
    }
});