import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, FlatList, TextInput, TouchableOpacity, Modal,Pressable } from 'react-native';
import React,{ useEffect, useState,useContext } from 'react';
import { firebase } from '../FireBaseConfig';
import { AntDesign } from '@expo/vector-icons';
import GroupMasterAdd  from './AddMemberToGroup';
import LoadingSpinner from '../Components/LoadingSpinner';
import AppContext from '../Context/appContext';
import globalConstants from '../Consants/AppContstants';

export default function GroupMasterList({ navigation }) {

    const [groupName, setGroupName] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoader,setIsLoader] = useState(false);
    const groups = firebase.firestore().collection('GroupMaster');
   // setIsLoader(true);
   const value = useContext(AppContext);
    
    useEffect(() => {
        groups.onSnapshot((snapshot) => {
            setIsLoader(false);
            const postData = [];
            snapshot.forEach((doc) => postData.push({ ...doc.data(), id: doc.id }));
            console.log(postData);
            setGroupName(postData);
        });
    }, [])
    function navigateToAddmemPage (selectedItem,index){
          //  value.setSelectedGroupDataEvent(selectedItem
            navigation.navigate('add-mem-to-group',{selectedItem:selectedItem})
    }
    
    return (
        <View style={styles.container}>
             {/* <GroupMasterAdd/> */}
             {isLoader && 
             <LoadingSpinner/>}
            
            <FlatList
                data={groupName}
                renderItem={({ item,index }) => 
                <TouchableOpacity onPress={() => navigateToAddmemPage(item,index)}>
                    <View style ={[styles.listContainer,index%2 ==0? styles.listContainerOdd:styles.listContainerEven]}>
                        <Text style={styles.item}>{item.groupName}</Text>
                    </View>   
                </TouchableOpacity> }
            />
            <Pressable
                onPress={() => navigation.navigate('add-group')}>
               <AntDesign name="addusergroup" size={32} color="black" style={{ position: "absolute", bottom: 20, right: 20 }} />
            </Pressable>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    listContainer:{
        borderColor:globalConstants.appThemeColor,
        borderWidth: 1,
        borderRadius: 15,
        margin:5
    },
    listContainerOdd:{
        backgroundColor: globalConstants.appThemeColor,
    },
    listContainerEven:{
        backgroundColor: 'white',
    },
    //----Modal start--------------
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        width:'100%',
        //height:'auto',
        padding: 35,
        //alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      
     
      buttonClose: {
        backgroundColor: '#2196F3',
      },
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
      },//----Modal End--------------
});
