import { StyleSheet, Text, View,Image } from 'react-native';
import globalConstants from '../Consants/AppContstants';
const PlaceholderImage = require('../assets/home_logo.png');

export default function AppLogo() {
    return (
        <View style={styles.container}>
            <Image
                    style={styles.logo}
                    source={PlaceholderImage}
                />
               <Text style={styles.headerText}>HOME EXPENSES</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
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
    }
    
});
