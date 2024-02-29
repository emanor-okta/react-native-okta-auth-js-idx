import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Button } from 'react-native';
// import LoginIDX from './LoginIDX';



export default function Home(props) {
    
    const [idToken, setIdToken] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        populateFields();
    }, []);

    function populateFields() {
        const tokens = props.oktaAuthRN.getTokens();
        setIdToken((tokens.idToken) ? tokens.idToken.idToken : '');
        setAccessToken((tokens.accessToken) ? tokens.accessToken.accessToken : '');
        setName((tokens.idToken) ? tokens.idToken.claims.name : '');
    }

    function refresh() {
        props.oktaAuthRN.refreshTokens(populateFields, renderLogin);
    }

    function renderLogin() {
        props.oktaAuthRN.removeTokens();
        console.log(props)
        props.loginScreen();
        //props.setScreen(<LoginIDX oktaAuthRN={props.oktaAuthRN} setScreen={props.setScreen} config={props.config}/>)
    }

    function revoke() {
        props.oktaAuthRN.revokeTokens(populateFields, () => {});
    }

    function logout() {
        props.oktaAuthRN.signOut(renderLogin, () => {});
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={{flex: 1}} >
                <Text style={styles.text} >Hello {name}</Text>
            </View>
            <View style={styles.tokenContainer}>
                <Text style={styles.text} >id_token</Text>
                <ScrollView style={styles.scrollView} >
                    <Text selectable={true} >{idToken}</Text>
                </ScrollView>
                <Text style={styles.text}>access_token</Text>
                <ScrollView style={styles.scrollView} >
                    <Text selectable={true} >{accessToken}</Text>
                </ScrollView>
            </View>
            <View style={{flex: 1}} >
                <View style={styles.buttonContainer} >
                    <View style={styles.buttonPadding}><Button title='Refresh' onPress={refresh} /></View>
                    <View style={styles.buttonPadding}><Button title='Revoke' onPress={revoke} /></View>
                    <View style={styles.buttonPadding}><Button title='Logout' onPress={logout} /></View>
                </View>
            </View>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'aliceblue',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tokenContainer: {
        width: '100%',
        //marginTop: 10,
        marginHorizontal: 15,
        padding: 20,
        flex: 9
    },
    scrollView: {
        backgroundColor: 'powderblue',
    },
    text: {
        textAlign: 'center',
        margin: 15,
        fontSize: 17
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent:'space-evenly',
        //paddingLeft: 20
        alignItems: 'center'
    },
    buttonPadding: {
        paddingLeft: 10,
        paddingRight: 10
    }
});