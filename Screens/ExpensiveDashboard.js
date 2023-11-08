import { StyleSheet, Text, View, TextInput, Dimensions, FlatList,ScrollView, Pressable, TouchableOpacity, ToastAndroid } from 'react-native';
import { useEffect, useState, useContext } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import LoadingSpinner from '../Components/LoadingSpinner';
import AppContext from '../Context/appContext';
import globalConstants from '../Consants/AppContstants';
import { firebase, app } from '../FireBaseConfig';

export default function ExpensiveDashboard({ route, navigation }) {
    const { selectedGroup } = route.params;
    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [isMonthView, setIsMonthView] = useState(true);
    const [expensiveDataList, setExpensiveDataList] = useState([])
    const [isLoader, setIsloader] = useState(false);
    const [spentAmount, seSpentAmount] = useState(0);
    const [topupAmount, seTopupAmount] = useState(0);
    const {isUpdate,setIsUpdate} = useContext(AppContext);
    const  appContextValue =useContext(AppContext);
    const [month, setMonth] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    //console.log("main page Expensive ----------------",date,show,mode,isFocus,month,topupAmount,spentAmount,isLoader)
    const ExpensiveDataDb = firebase.firestore().collection('ExpensiveData');
    const months = [{
        id: '1',
        value: 'Jan',
        startDate: '01-01',
        endDate: '01-31'
    }, {
        id: '2',
        value: 'Feb',
        startDate: '02-01',
        endDate: '02-29'
    }, {
        id: '3',
        value: 'Mar',
        startDate: '03-01',
        endDate: '03-31'
    }, {
        id: '4',
        value: 'Apr',
        startDate: '04-01',
        endDate: '04-30'
    }, {
        id: '5',
        value: 'May',
        startDate: '05-01',
        endDate: '05-31'
    }, {
        id: '6',
        value: 'June',
        startDate: '06-01',
        endDate: '06-30'
    }, {
        id: '7',
        value: 'July',
        startDate: '07-01',
        endDate: '07-31'
    }, {
        id: '8',
        value: 'Aug',
        startDate: '08-01',
        endDate: '08-31'
    }, {
        id: '9',
        value: 'Sep',
        startDate: '09-01',
        endDate: '09-30'
    }, {
        id: '10',
        value: 'Oct',
        startDate: '10-01',
        endDate: '10-31'
    },
    {
        id: '11',
        value: 'Nov',
        startDate: '11-01',
        endDate: '11-30'
    },
    {
        id: '12',
        value: 'Dec',
        startDate: '12-01',
        endDate: '12-31'
    }];
    useEffect(() => {
        setIsloader(true);
        setTimeout(function(){
            getExpensiveData();
        },1000)
       
    }, []);

    async function getExpensiveData(item) {
       // console.log("--------called111");
        const fs = getFirestore(app);
        const collectionRef = collection(fs, 'ExpensiveData');
        let userData = await _retrieveLoginData();
        if (userData) {
            userData = JSON.parse(userData);
        }
        var formatStartDate = "";
        var formatEndDate = "";

        if (item) {
            var getFullYear = new Date().getFullYear();
            formatStartDate = "" + getFullYear + "-" + item.startDate;
            formatEndDate = "" + getFullYear + "-" + item.endDate;
        } else {
            var getCurrentMonth = new Date().getMonth() + 1;
            var getFullYear = new Date().getFullYear();
            var filterData = months.filter(item => item.id == getCurrentMonth);
            if (filterData && filterData.length != 0) {
                formatStartDate = "" + getFullYear + "-" + filterData[0].startDate;
                formatEndDate = "" + getFullYear + "-" + filterData[0].endDate;
            }
        }
        startDate = new Date(formatStartDate);
        endDate = new Date(formatEndDate);
        var groupId = appContextValue.selectedGroupData;

        if (groupId) {
            groupId = groupId.groupId
        }
       // console.log("--------called2222222222",groupId);
        let result = query(collectionRef, where('groupId', '==', groupId), where('CapturedDate', '>=', startDate), where('CapturedDate', '<=', endDate));
        getDocs(result).then((querySnapshot) => {
          //  console.log("--------333333333333333333");
            setIsloader(false);
            let selectedGroupListcopy = [];
            let spentAmount = 0;
            let topupAmount = 0;
            querySnapshot.forEach((doc) => {
                var obj = {
                    formatDate: doc.data().CapturedDate.toDate()
                }
                if (doc.data().isTopupAmount && doc.data().isTopupAmount == "2") {
                    topupAmount = topupAmount + Number(doc.data().Amount);
                } else {
                    spentAmount = spentAmount + Number(doc.data().Amount);
                }
                obj = { ...obj, ...doc.data() }
                selectedGroupListcopy.push(obj);
            });
            seSpentAmount(spentAmount);
            seTopupAmount(topupAmount);
            setExpensiveDataList(selectedGroupListcopy);
            //console.log("--------444444444444444444",selectedGroupListcopy.length);
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
    async function deleteExpense(item) {
        ExpensiveDataDb.where("recordId", "==", item.recordId).get()
            .then(querySnapshot => {
                querySnapshot.docs[0].ref.delete();
            });
    }
    return (
        <View style={styles.container}>
            {isLoader &&
                <LoadingSpinner />}

            <View style={styles.viewContainer}>
                {isMonthView && <View style={styles.monthView}>
                    <View style={styles.monthItems}>
                        <Dropdown
                            style={[styles.dropdown, isFocus && { borderColor: globalConstants.appThemeColor }]}
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
                        <MaterialCommunityIcons name="home-switch-outline" size={45} color={globalConstants.appThemeColor} style={{ marginLeft: 10 }} />
                    </Pressable>
                </View>
            </View>

            <View style={styles.outer1}>
                <ScrollView contentContainerStyle={styles.outer}>
                    <FlatList
                        data={expensiveDataList}
                        renderItem={({ item, index }) =>
                            <View key={Math.random().toString()} style={[styles.groupContainer]}>
                                <TouchableOpacity>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={styles.groupName} >{item.Description}</Text>
                                        <Pressable onPress={() => { deleteExpense(item) }}>
                                            <Entypo style={styles.Delete} name="cross" size={18} />
                                        </Pressable>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingTop: 4 }}>
                                        <Text style={[styles.groupName, { width: '20%' }]} >{item.Amount}</Text>
                                        <Text style={[styles.groupName, { width: '60%' }]} >{item.formatDate.toLocaleString()}</Text>
                                        <Text style={[styles.groupName, { width: '20%' }]} >{item.CapturedBy}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            }
                    />
                    {/* {expensiveDataList.map((expensiveRecord, index) => {
                        return (
                            //<TouchableOpacity  key={group.userId}  onPress={() => navigation.navigate('ExpensiveList')}>
                            <View key={Math.random().toString()} style={[styles.groupContainer]}>
                                <TouchableOpacity>
                                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                        <Text style={styles.groupName} >{expensiveRecord.Description}</Text>
                                        <Pressable onPress={() => {deleteExpense(expensiveRecord) }}>
                                            <Entypo style={styles.Delete} name="cross" size={18} />
                                        </Pressable>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingTop: 4 }}>
                                        <Text style={[styles.groupName, { width: '20%' }]} >{expensiveRecord.Amount}</Text>
                                        <Text style={[styles.groupName, { width: '60%' }]} >{expensiveRecord.formatDate.toLocaleString()}</Text>
                                        <Text style={[styles.groupName, { width: '20%' }]} >{expensiveRecord.CapturedBy}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            //</TouchableOpacity>
                        );
                    })} */}
                </ScrollView>
            </View>
            <View style={[{ flexDirection: 'row' }]}>
                <View style={[styles.amountField3]}>
                    <Text style={styles.amountText3}>{topupAmount}</Text>
                </View>
                <View style={[styles.amountField1]}>
                    <Text style={styles.amountText1}>{spentAmount}</Text>
                </View>
                <View style={[styles.amountField2]}>
                    <Text style={styles.amountText2}>{topupAmount - spentAmount}</Text>
                </View>
                <Pressable onPress={() => navigation.navigate('Add-Expensive')}>
                    <AntDesign name="addusergroup" size={32} color="black" style={styles.AddExpenses} />
                </Pressable>
            </View>

        </View>
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
    Delete: {
        color: 'red',
       // marginLeft: 335
    },
    amountField1: {
        backgroundColor: '#F94931',
        width: '25%',
        justifyContent: 'center',
        height: 50,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#F94931',
        marginLeft: 2,
        margin: 5
    },
    amountText1: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center'
    },
    amountField2: {
        backgroundColor: '#26CF16',
        width: '25%',
        justifyContent: 'center',
        height: 50,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#26CF16',
        marginLeft: 2,
        margin: 5
    },
    amountText2: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center'
    },
    amountField3: {
        backgroundColor: '#c2c0c0',
        width: '25%',
        justifyContent: 'center',
        height: 50,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#c2c0c0',
        marginLeft: 10,
        margin: 5
    },
    amountText3: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center'
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
        width: '80%',
        borderColor: globalConstants.appThemeColor,
    },
    monthItems: {
        //width: '50%' 
    },
    input: {
        backgroundColor: 'white',
        height: 40,
        width: '100%',
        margin: 12,
        borderWidth: 0,
        padding: 10,
    },
    inputView: {
        backgroundColor: "white",
        borderRadius: 10,
        width: "100%",
        height: 50,
        borderColor: '#cdcdcd',
        marginBottom: 10,
        alignItems: "center"
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        backgroundColor: "white",
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
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
        height: 'auto',
        width: '95%',
        borderWidth: 1,
        backgroundColor: '#ffffff',
        borderColor: globalConstants.appThemeColor,//'#D3AEFB',
        marginTop: 7,
        marginLeft: 10,
        borderRadius: 4,
        padding: 5
    },
    groupName: {
        fontSize: 12,
        fontWeight: '800',
        color: globalConstants.appThemeColor
    },
    AddExpenses: {
        backgroundColor: globalConstants.appThemeColor,
        marginLeft: 20,
        marginTop: 25,
        color: 'white',
        padding: 8,
        borderRadius: 8,
        bottom: 20,
        right: 20
    }
});