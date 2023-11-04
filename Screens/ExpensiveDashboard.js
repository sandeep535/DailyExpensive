import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, TextInput, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { useEffect, useState, useContext } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import { firebase, app } from '../FireBaseConfig';
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MonthPicker from 'react-native-month-year-picker';
import moment from 'moment';
import { Dropdown } from 'react-native-element-dropdown';
import { Dimensions, ActivityIndicator } from 'react-native';
import LoadingSpinner from '../Components/LoadingSpinner';
import AppContext from '../Context/appContext';
import globalConstants from '../Consants/AppContstants';

const ScreenWidth = Dimensions.get('window').width;

export default function ExpensiveDashboard({ route, navigation }) {
    const { selectedGroup } = route.params;
    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [isMonthView, setIsMonthView] = useState(true);
    const [expensiveDataList, setExpensiveDataList] = useState([])
    const [isLoader,setIsloader] = useState(false);
    const [spentAmount,seSpentAmount] = useState(0);
    const appContextValue = useContext(AppContext);

    const [month, setMonth] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const months = [{
        id: '1',
        value: 'Jan',
        startDate:'01-01',
        endDate:'01-31'
    }, {
        id: '2',
        value: 'Feb',
        startDate:'02-01',
        endDate:'02-29'
    }, {
        id: '3',
        value: 'Mar',
        startDate:'03-01',
        endDate:'03-31'
    }, {
        id: '4',
        value: 'Apr',
        startDate:'04-01',
        endDate:'04-30'
    }, {
        id: '5',
        value: 'May',
        startDate:'05-01',
        endDate:'05-31'
    },{
        id: '6',
        value: 'June',
        startDate:'06-01',
        endDate:'06-30'
    },{
        id: '7',
        value: 'July',
        startDate:'07-01',
        endDate:'07-31'
    },{
        id: '8',
        value: 'Aug',
        startDate:'08-01',
        endDate:'08-31'
    },{
        id: '9',
        value: 'Sep',
        startDate:'09-01',
        endDate:'09-30'
    },{
        id: '10',
        value: 'Oct',
        startDate:'10-01',
        endDate:'10-31'
    },
    {
        id: '11',
        value: 'Nov',
        startDate:'11-01',
        endDate:'11-30'
    },
    {
        id: '12',
        value: 'Dec',
        startDate:'12-01',
        endDate:'12-31'
    }];

    useEffect(() => {
        setIsloader(true);
        getExpensiveData();
    }, []);
    
    async function getExpensiveData(item) {
        const fs = getFirestore(app);
        const collectionRef = collection(fs, 'ExpensiveData');
        let userData = await _retrieveLoginData();
        if (userData) {
            userData = JSON.parse(userData);
        }
        //console.log(useContext(AppContext));
        var formatStartDate = "";
        var formatEndDate = "";
        
        if(item){
            var getFullYear = new Date().getFullYear();
            formatStartDate = ""+getFullYear+"-"+item.startDate;
            formatEndDate = ""+getFullYear+"-"+item.endDate;
        }else{
            var getCurrentMonth = new Date().getMonth();
            var getFullYear = new Date().getFullYear();
            var filterData = months.filter(item => item.id==getCurrentMonth);
            if(filterData && filterData.length !=0){
                formatStartDate = ""+getFullYear+"-"+filterData[0].startDate;
                formatEndDate = ""+getFullYear+"-"+filterData[0].endDate;
            }
        }
        startDate = new Date(formatStartDate);
        endDate = new Date(formatEndDate);
        let result = query(collectionRef, where('CapturedDate', '>=', startDate), where('CapturedDate', '<=', endDate));
        getDocs(result).then((querySnapshot) => {
            setIsloader(false);
            let selectedGroupListcopy = [];
            let spentAmount = 0;
            querySnapshot.forEach((doc) => {
                var obj = {
                    formatDate: doc.data().CapturedDate.toDate()
                }
                spentAmount = spentAmount + Number(doc.data().Amount);
                obj = { ...obj, ...doc.data() }
                selectedGroupListcopy.push(obj);
            });
            seSpentAmount(spentAmount);
            setExpensiveDataList(selectedGroupListcopy);
        })
    }
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
    function changeDayMonthView() {
        let status = isMonthView;
        setIsMonthView(!status);
    }
    return (
        <>


            <View style={styles.container}>
                {isLoader && 
                <LoadingSpinner/>}
                
                <View style={styles.viewContainer}>
                    {isMonthView && <View style={styles.monthView}>
                        <View style={styles.monthItems}>
                            <Dropdown
                                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={months}
                                search
                                maxHeight={300}
                                labelField="value"
                                valueField="id"
                                placeholder={!isFocus ? month : '........'}
                                searchPlaceholder="Search..."
                                value={'ff'}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={item => {
                                    setMonth(item.value);
                                    setIsFocus(false);
                                    getExpensiveData(item);
                                }}
                                renderLeftIcon={() => (
                                    <AntDesign
                                        style={styles.icon}
                                        color={isFocus ? 'blue' : 'black'}
                                        name="Safety"
                                        size={20}
                                    />
                                )}
                            />
                        </View>
                    </View>}
                    {!isMonthView && <View style={styles.monthView}>
                        {show && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={mode}
                                is24Hour={true}
                                onChange={onChange}
                            />
                        )}
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

                    </View>}
                    <View>
                        <Pressable
                            onPress={() => changeDayMonthView()}>
                            <AntDesign name="addusergroup" size={32} color="black" />
                        </Pressable>
                    </View>
                </View>
                <View style={styles.outer1}>
                    <View style={styles.amountField}>
                        <Text style={styles.amountText}>{spentAmount}</Text>
                    </View>
                    <ScrollView contentContainerStyle={styles.outer}>
                        {expensiveDataList.map((expensiveRecord, index) => {
                            return (
                                //<TouchableOpacity  key={group.userId}  onPress={() => navigation.navigate('ExpensiveList')}>
                                <View key={Math.random().toString()} style={[styles.inner, styles.groupContainer]}>
                                    <TouchableOpacity onPress={() => navigation.navigate('ExpensiveList', { selectedGroup: group })}>
                                        <View>
                                            <Text style={styles.groupName} >{expensiveRecord.Description}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                            <Text style={[styles.groupName, { width: '20%' }]} >{expensiveRecord.Amount}</Text>
                                            <Text style={[styles.groupName, { width: '60%' }]} >{expensiveRecord.formatDate.toLocaleString()}</Text>
                                            <Text style={[styles.groupName, { width: '20%' }]} >{expensiveRecord.CapturedBy}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                //</TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                <Pressable
                    onPress={() => navigation.navigate('Add-Expensive')}>
                    <AntDesign name="addusergroup" size={32} color="black" style={{ position: "absolute", bottom: 20, right: 20 }} />
                </Pressable>


            </View>
        </>
    )

}
const styles = StyleSheet.create({
    container1: {
        //flex: 1,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
    },
    amountField:{
       width:'20%',
       //height:'10%',
       borderRadius:10,
       borderWidth:3,
       borderColor:globalConstants.appThemeColor,
       backgroundColor:'red' ,
       margin:5
    },
    amountText:{
        color:'white',
        fontSize:20,
        textAlign:'center'
    },
    outer: {
        //   flex: 1,
        height: '100%',
        //marginTop: 50
    },
    outer1: {
        flex: 1,
        height: '100%',
        //marginTop: 50
    },
    container: {
        flex: 1,
        height: '100%',
        // width: 500
    },
    viewContainer: {
        //flex: 1,
        flexDirection: 'row',
        //alignItems:'flex-end',
        width: '100%',
        marginLeft: 10,
        marginTop: 10
    },
    textData: {
        color: 'black',
        textAlign: 'center',
    },
    monthView: {
        width: '90%'
        // flex: 1,
        //flexDirection: 'row',
        // flexWrap: 'wrap',
        //alignItems: 'flex-start'
    },
    monthItems: {
        //width: '50%' 
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
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    groupContainer: {
        // height: '0%',
        width: '95%',
        borderWidth: 2,
        borderColor: globalConstants.appThemeColor,
        margin: 10,
        borderRadius: 15,
        padding: 10
    },
    groupName: {
        fontSize: 15,
        fontWeight: '700'
    }
});