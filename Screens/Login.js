import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, TextInput, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import { firebase, app } from '../FireBaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../FireBaseConfig';
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalConstants from '../Consants/AppContstants';

export default function Login({ navigation }) {
    const user = firebase.firestore().collection('Users');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    _retrieveLoginData = async () => {
        try {
            const value = await AsyncStorage.getItem('loggedinUserData');
            if (value !== null) {
                return value;
            }
        } catch (error) {
            // Error retrieving data
        }
    };
    async function callAddAPI() {
       // let userData = await _retrieveLoginData();
        //if (userData) {
        //  userData = JSON.parse(userData);
        // navigation.navigate('Home');
        //}else{
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                getUserData(user.email);

                //  console.log('---->',user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });
        // }


    }
    function getUserData(email) {
        const fs = getFirestore(app);
        const collectionRef = collection(fs, 'Users');
        let result = query(collectionRef, where('email', '==', email));
        getDocs(result).then((querySnapshot) => {
            let selecedGroupData = [];
            querySnapshot.forEach((doc) => {
                console.log(doc.data());
                AsyncStorage.setItem(
                    'loggedinUserData',
                    JSON.stringify(doc.data()),
                );
            });
            navigation.navigate('Home')
            // setAddedUserList(selecedGroupData);
        })
    }
    async function isNavigation() {
        let userData = await _retrieveLoginData();
        if (userData) {
            userData = JSON.parse(userData);
              navigation.navigate('Home');
        }
    }
    useEffect(() => {
        isNavigation();
    }, [])
    return (
        <View style={styles.container}>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.input}
                    onChangeText={(data) => {
                        setEmail(data)
                    }}
                    value={email}
                    placeholder="Email"
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={(data) => {
                        setPassword(data)
                    }}
                    value={password}
                    placeholder="Password"

                />
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={() => {
                callAddAPI();
            }}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginBtn} onPress={() => {
                navigation.navigate('Signup')
            }}>
                <Text style={styles.loginText}>Signup</Text>
            </TouchableOpacity>
            <StatusBar style="auto" />
        </View>
    );
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
        borderWidth: 0,
        padding: 10,
        fontSize:20
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
        backgroundColor: globalConstants.appThemeColor,
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
        fontSize:18
    }
});
