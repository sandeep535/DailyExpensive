import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { firebase, app } from '../FireBaseConfig';
import globalConstants from '../Consants/AppContstants';



export default function AddNewGroup({ navigation }) {
    const [groupName, setGroupName] = useState("");

    const groups = firebase.firestore().collection('GroupMaster');

    function callAddAPI() {
        const fs = getFirestore(app);
        const collectionRef = collection(fs, 'GroupMaster');
        let result = query(collectionRef, where('groupName', '==', groupName));
        getDocs(result).then((querySnapshot) => {
            var isTrue = false;
            querySnapshot.forEach((doc) => {
                isTrue = true;
                console.log(doc.id, " => ", doc.data());
            });
            if (!isTrue) {
                createGroups();
            }
        })
    }
    function createGroups() {
        groups.add({
            groupId : new Date().valueOf(),
            groupName: groupName,
            status: "1"
        }).then((res) => {
            console.log(res);
            navigation.goBack();
        })
            .catch((err) => {
                console.error("Error found: ", err);

            });
    }
    return (
        <View style={styles.container}>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.input}
                    onChangeText={(data) => {
                        setGroupName(data)
                    }}
                    value={groupName}
                    placeholder="Group Name"
                />
            </View>
            <TouchableOpacity style={styles.loginBtn} onPress={() => {
                callAddAPI();
            }}>
                <Text style={styles.loginText}>Create</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        width: '100%',
        margin: 12,
        backgroundColor:'white',
        borderWidth: 0,
        padding: 10,
    },
    loginBtn:
    {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: globalConstants.appThemeColor,
    },
    inputView: {
        backgroundColor: "white",
        borderRadius: 10,
        width: "80%",
        height: 60,
        marginBottom: 10,
        alignItems: "center",
    },
    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
    }
});

