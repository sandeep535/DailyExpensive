import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ToastAndroid, TextInput, TouchableOpacity } from 'react-native';
//import {firebase} from './FireBaseConfig';
import { useEffect, useState, useContext } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import { firebase } from '../FireBaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContext from '../Context/appContext';
import globalConstants from '../Consants/AppContstants';
import { RadioButton } from 'react-native-paper';
import LoadingSpinner from '../Components/LoadingSpinner';

export default function HomeScreen({ navigation }) {
    const { handleSubmit, register, setValue, errors } = useForm();
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [amountType, setAmountType] = useState("1");
    const [isLoader,setIsloader] = useState(false);

    const [userData, setUserData] = useState([]);
    const expensiveData = firebase.firestore().collection('ExpensiveData');
    const appContextValue = useContext(AppContext);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
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
        
       // navigation.goBack();
        if (!description) {
            ToastAndroid.show("Please Enter Description", ToastAndroid.SHORT);
            return false;
        }
        if (!amount) {
            ToastAndroid.show("Please Enter Amount", ToastAndroid.SHORT);
            return false;
        }
        setIsloader(true);
        expensiveData.add({
            Amount: amount,
            CapturedDate: date,
            Description: description,
            CapturedBy: userData.UserName,
            CapturedById: userData.UserId,
            isTopupAmount : amountType,
            recordId:"ex"+new Date().valueOf(),
            groupId: (appContextValue && appContextValue.selectedGroupData) ? appContextValue && appContextValue.selectedGroupData.groupId : ''
        }).then((res) => {
            setIsloader(false);
            ToastAndroid.show("Amount Added",ToastAndroid.SHORT);
            appContextValue.setIsUpdateEvent(Math.random().toString());
           // navigation.navigate('ExpensiveList',{selectedGroup:appContextValue.selectedGroupData})
            navigation.goBack();
        })
            .catch((err) => {
                setIsloader(false);
                ToastAndroid.show("Plase try again",ToastAndroid.SHORT);

            });
    }
    async function getLoggedinData() {
        let userDataCopy = await retrieveLoginData();
        userDataCopy = JSON.parse(userDataCopy);
        setUserData(userDataCopy);
    }
    async function retrieveLoginData() {
        try {
            const value = await AsyncStorage.getItem('loggedinUserData');
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
            {isLoader && 
                <LoadingSpinner/>}
            <RadioButton.Group
                onValueChange={value => {
                    setAmountType(value)
                }}
                value={amountType}
            >
                <View style={{ marginLeft: 10, width: '100%', flexDirection: 'row', alignContent: 'center' }}>
                    <View style={{ width: '50%', flexDirection: 'row', alignContent: 'center' }}>
                        <RadioButton value="1" />
                        <Text style={{ marginTop: 8 }}>Add Expense</Text>
                    </View>
                    <View style={{ width: '50%', flexDirection: 'row', alignContent: 'center' }}>
                        <RadioButton value="2" />
                        <Text style={{ marginTop: 8 }}>Topup</Text>
                    </View>
                </View>
            </RadioButton.Group>
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
                    keyboardType='numeric'

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
                <Text style={styles.loginText}>ADD</Text>
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
      //  height:'60%',
        width: '100%',
        margin: 14,
        borderWidth: 0,
        padding: 10,
    },
    inputView: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: "95%",
       // height: '10%',
        marginBottom: 10,
        alignItems: "center",
        marginLeft: 10
    },
    loginBtn:
    {
        borderRadius: 25,
        height: '8%',
        alignItems: "center",
        justifyContent: "center",
        margin: 20,
        backgroundColor: globalConstants.appThemeColor,
    },
    loginText: {
        fontSize: 16,
        color: 'white'
    },
    TextInput: {
       // height: '20%',
        flex: 1,
        padding: 10,
        color: 'black',
        marginLeft: 20,
    }
});
