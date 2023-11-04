import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, TextInput, TouchableOpacity } from 'react-native';
//import {firebase} from './FireBaseConfig';
import { useEffect, useState,useContext } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import { firebase } from '../FireBaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContext from '../Context/appContext';

export default function HomeScreen({ navigation }) {
    const { handleSubmit, register, setValue, errors } = useForm();
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    
    const [userData,setUserData] = useState([]);
    const expensiveData = firebase.firestore().collection('ExpensiveData');
    const appContextValue = useContext(AppContext);
    
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        console.log(currentDate)
        setShow(false);
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };
    function callAddExpensiveAPI() {
        // var obj = {
        //     amount: amount,
        //     date: date,
        //     description: description
        // }
        // console.log("---------------d",userData)
        console.log('sssssssssssss-----',userData)
        expensiveData.add({
            Amount: amount,
            CapturedDate: date,
            Description: description,
            CapturedBy: userData.UserName,
            CapturedById: userData.UserId,
            groupId:(appContextValue && appContextValue.selectedGroupData) ? appContextValue && appContextValue.selectedGroupData.groupId:''
        }).then((res) => {
            console.log(res);
            navigation.goBack();
        })
            .catch((err) => {
                console.error("Error found: ", err);

            });
    }
    async function getLoggedinData() {
        let userDataCopy = await retrieveLoginData();
        userDataCopy = JSON.parse(userDataCopy);
        console.log("Sandeep-----------",userDataCopy)
        setUserData(userDataCopy);
    }
    async function retrieveLoginData(){
        try {
            const value = await AsyncStorage.getItem('loggedinUserData');
            console.log("ssssddddddddddd",value)
            if (value !== null) {
                return value;
            }
        } catch (error) {
            // Error retrieving data
        }
    };
    useEffect(() => {
        getLoggedinData()
    }, [])
    return (
        <View style={styles.container}>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    onChange={onChange}
                />
            )}
            <View style={styles.inputView}>
                <TextInput
                    style={styles.input}
                    onChangeText={(data) => {
                        setDescription(data)
                    }}
                    value={description}
                    placeholder="Description"
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.input}
                    onChangeText={(data) => {
                        setAmount(data)
                    }}
                    value={amount}
                    placeholder="Amount"
                    keyboardType="numeric"

                />
            </View>
            <View style={[{ flexDirection: "row", width: '100%' }, styles.inputView]}>
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    onChangeText={(data) => {
                        setDate(data)
                    }}
                    value={date.toLocaleString()}
                    placeholder="Date"
                />
                <AntDesign name="calendar" size={24} color="black" onPress={showDatepicker} style={{ marginRight: 10 }} />
                <Entypo name="time-slot" size={24} color="black" onPress={showTimepicker} style={{ marginRight: 10 }} />
            </View>
            <TouchableOpacity style={styles.loginBtn} onPress={() => {
                callAddExpensiveAPI();
            }}>
                <Text style={styles.loginText}>Add</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //  backgroundColor: '#fff',
        paddingTop: 10,
        // alignItems: 'center',
        //justifyContent: 'center',
    },
    input: {
        height: 40,
        width: '100%',
        margin: 12,
        borderWidth: 0,
        padding: 10,
    },
    inputView: {
        backgroundColor: "#90EE90",
        borderRadius: 10,
        width: "95%",
        height: 60,
        marginBottom: 10,
        alignItems: "center",
        marginLeft: 10
    },
    loginBtn:
    {
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        margin: 20,
        backgroundColor: "#6B8E23",
    },
    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
    }
});
