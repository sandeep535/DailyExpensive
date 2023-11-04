import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ToastAndroid,TextInput, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { firebase } from '../FireBaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../FireBaseConfig';
import globalConstants from '../Consants/AppContstants';
import AppLogo from '../Components/AppLogo';


export default function Signup({ navigation }) {
    //const user = firebase.firestore().collection('Users');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    function saveUserTpapp() {
        const groups = firebase.firestore().collection('Users');
        groups.add({
            UserId: "US" + new Date().valueOf(),
            MobileNo: mobileNumber,
            UserName: name,
            email: email
        }).then((res) => {
            navigation.navigate('Login');
        })
            .catch((err) => {
                console.error("Error found: ", err);

            });
    }
    function callAddAPI() {
        
        if(!name){
            ToastAndroid.show("Please Enter User Name",ToastAndroid.SHORT);
            return false;
        }
        if(!mobileNumber){
            ToastAndroid.show("Please Enter Mobile Number",ToastAndroid.SHORT);
            return false;
        }
        if(!email){
            ToastAndroid.show("Please Enter Email",ToastAndroid.SHORT);
            return false;
        }
        if(!password){
            ToastAndroid.show("Please Enter Password",ToastAndroid.SHORT);
            return false;
        }
       
        console.log("sign")
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
                saveUserTpapp(user)
                //navigate("/login")
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                // ..
            });
    }
    function callBackToLogin(){
        navigation.navigate('Login');
    }
    useEffect(() => {

    })
    return (
        <View style={styles.container}>
            <AppLogo />
            <View style={styles.inputView}>
                <TextInput
                    style={styles.input}
                    onChangeText={(data) => {
                        setName(data)
                    }}
                    value={name}
                    placeholder="Name"
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.input}
                    onChangeText={(data) => {
                        setMobileNumber(data)
                    }}
                    value={mobileNumber}
                    placeholder="Mobile No"
                />
            </View>
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
                <Text style={styles.loginText}>Signup</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginBtn} onPress={() => {
                callBackToLogin();
            }}>
                <Text style={styles.loginText}>LOGIN</Text>
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
    }
});
