import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ToastAndroid, TextInput, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { firebase, app } from '../FireBaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../FireBaseConfig';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalConstants from '../Consants/AppContstants';
import AppLogo  from '../Components/AppLogo';


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
       if(!email){
        ToastAndroid.show("Please Enter Email",ToastAndroid.SHORT);
        return false;
       }
       if(!password){
        ToastAndroid.show("Please Password",ToastAndroid.SHORT);
        return false;
       }
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                getUserData(user.email);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                ToastAndroid.show("Invalid Username or Password !",ToastAndroid.SHORT);
                console.log("cache error-->",errorCode, errorMessage)
            });


    }
    function getUserData(email) {
        const fs = getFirestore(app);
        const collectionRef = collection(fs, 'Users');
        let result = query(collectionRef, where('email', '==', email));
        getDocs(result).then((querySnapshot) => {
            let selecedGroupData = [];
            querySnapshot.forEach((doc) => {
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
            <AppLogo />
            <View style={styles.childContainer}>
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
            </View>
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
    childContainer:{
        width:350,
        height:300,
        borderWidth:2,
        borderColor:'#DCDADA',
        alignItems: 'center',
        borderRadius:8,
        justifyContent: 'center'
    },

    logo:{
        width:70,
        height:70,
    },
    headerText:{
        fontSize:30,
        fontWeight:'800',
        marginBottom:30,
        marginTop:10,
        color:globalConstants.appThemeColor,    
    },
    input: {
        height: 40,
        width: 300,
        margin: 10,
        borderWidth: 0,
        padding: 10,
        fontSize:16
    },
    loginBtn:
    {
        width: 320,
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        backgroundColor: globalConstants.appThemeColor,
    },
    loginText:{
        color:'white',
        fontSize:16,
    },
    signupBtn:
    {
        width: 320,
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        backgroundColor: globalConstants.appThemeColor,
    },
    inputView: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: 320,
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
    },
});
