import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, FlatList, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState,useContext, useCallback } from 'react';
import { firebase, app } from '../FireBaseConfig';
import Autocomplete from 'react-native-autocomplete-input';
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import AppContext from '../Context/appContext';
import globalConstants from '../Consants/AppContstants';

function AddMemberToGroup({ route, navigation }) {
    const [usersDataList, setUsersDataList] = useState([]);
    const [autoquery, setAutoQuery] = useState('');
    const [addedUserList, setAddedUserList] = useState([]);
    const usersFb = firebase.firestore().collection('Users');
    const [selecedGroupDataittemState, setSeselecedGroupDataittemState] = useState([]);
    const { selectedItem } = route.params;
    const addMemRef = firebase.firestore().collection("GroupMasterUserLink");
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        if(route.params && route.params.selectedItem){
            usersFb.onSnapshot((snapshot) => {
                const postData = [];
                snapshot.forEach((doc) => postData.push({ ...doc.data(), id: doc.id }));
                setUsersDataList(postData);
                 //-------------Get list of mem under the group-------------
                    getSelectedGroupData(postData);
                
            });
        }
    }, [route.params?.selectedItem]);
    function getSelectedGroupData(postData) {
        const fs = getFirestore(app);
        const collectionRef = collection(fs, 'GroupMasterUserLink');
        let result = query(collectionRef, where('groupId', '==', selectedItem.groupId));
        getDocs(result).then((querySnapshot) => {
            let selecedGroupData = [];
            querySnapshot.forEach((doc) => {
                let filterdata = postData.filter(item => {
                    return item.UserId == doc.data().userId
                });
                if(filterdata && filterdata.length !=0){
                    selecedGroupData.push(filterdata[0]);
                }
               
            });
            
            setAddedUserList(selecedGroupData);
        })
    }

    function callAddAPI() {
        const batch = firebase.firestore().batch();
        let copyData = [...addedUserList];
        var resultObj = [];
        copyData.forEach((item, index) => {
            resultObj = {
                groupId: selectedItem.groupId,
                id: 'addMem' + index + "" + new Date().valueOf(),
                status: 1,
                userId: item.UserId
            }
            const docRef = addMemRef.doc();
            batch.set(docRef, resultObj);
        });
        // Commit the batch write operation
        batch
            .commit()
            .then(() => {
                console.log("Batch write operation completed");
            })
            .catch((error) => {
                console.error("Batch write operation failed: ", error);
            });

    }
    return (
        <View style={styles.container}>

            <View style={styles.inputView}>
                <View style={styles.autocompleteContainer}>
                    <Autocomplete
                        editable={true}
                        autoCorrect={false}
                        data={userData}
                        value={autoquery}
                        onChangeText={(text) => {
                            setAutoQuery(text);
                            let filterData = [];
                            if (text) {
                                
                                filterData = usersDataList.filter(item => {
                                    console.log("`-------------",item)
                                    return item.UserName.toLowerCase().startsWith(text.toLowerCase());
                                });
                            }
                            setUserData(filterData)
                        }}
                        placeholder={'Search User'}
                        flatListProps={{
                            keyboardShouldPersistTaps: 'always',
                            keyExtractor: (user) => user.UserId,
                            renderItem: ({ item }) => (
                                <TouchableOpacity onPress={() => {
                                    setAutoQuery("");
                                    let data = [...addedUserList];
                                    let isData = data.filter(item1 => item1.UserId == item.UserId);
                                    if (isData && isData.length == 0) {
                                        data.push(item)
                                        setAddedUserList(data);
                                    } else {
                                        alert("duplicate")
                                    }

                                }}>
                                    <Text style={styles.itemText}>{item.UserName}</Text>
                                </TouchableOpacity>
                            ),
                        }}
                    />
                </View>
            </View>

            <View style={styles.FlatListcontainer}>
                <FlatList
                    data={addedUserList}
                    renderItem={({ item, index }) => <View style={[styles.listContainer, index % 2 == 0 ? styles.listContainerOdd : styles.listContainerEven]}>
                        <Text style={styles.item}>{item && item.UserName ? item.UserName:''}</Text>
                    </View>}
                />
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={() => {
                callAddAPI();
            }}>
                <Text style={styles.loginText}>Create</Text>
            </TouchableOpacity>
            <StatusBar style="auto" />
        </View>
    );
}
export default AddMemberToGroup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    listContainer: {
        borderColor: globalConstants.appThemeColor,
        borderWidth: 1,
        borderRadius: 15,
        margin: 5
    },
    listContainerOdd: {
        backgroundColor: globalConstants.appThemeColor,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    listContainerEven: {
        backgroundColor: 'white',
    },
    FlatListcontainer: {
        flex: 1
    },
    input: {
        height: 40,
        width: '100%',
        margin: 12,
        borderWidth: 0,
        padding: 10,
    },
    loginBtn:
    {
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        margin: 20,
        backgroundColor: globalConstants.appThemeColor,
    },
    inputView: {
        //backgroundColor: "#90EE90",
        marginTop: 10,
        borderRadius: 15,
        width: "100%",
        height: 60,
        marginBottom: 10,
        alignItems: "center",
    },
    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
    },
    itemText: {
        fontSize: 15,
        margin: 2,
    },
    descriptionContainer: {
        // `backgroundColor` needs to be set otherwise the
        // autocomplete input will disappear on text input.
        backgroundColor: globalConstants.appThemeColor,
        marginTop: 8,
    },
    infoText: {
        textAlign: 'center',
    },

    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1,
        padding: 5,
    },
});
