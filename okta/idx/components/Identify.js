import { StyleSheet, Button, View, TextInput, Text } from 'react-native';
import { useState } from 'react';


export default function Identify(props) {
    const [username, setUsername] = useState('');

    function usernameHandler(v) {
        setUsername(v);
    }

    function submit() {
        const name = username;
        props.proceed({step: 'identify', identifier: name});
    }

    return (
        <View style={styles.container} >
            <Text style={styles.titleText} >Step: &lt;Identify&gt;</Text>
            <View style={styles.input} >
                <TextInput style={styles.textInput} placeholder={props.remediation.inputs[0].label} onChangeText={usernameHandler} value={username} />
            </View>
            <View style={styles.container1} >
                <Button title='Login' color={'#3f8ad9'} onPress={submit} />
            </View>
        </View>
    );
}
  
const styles = StyleSheet.create({
    //  container: {
    //     padding: 20,
    //     //margin: 5,
    //     alignItems: 'stretch',
    //     width: '100%'
    // },
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    container1: {
        width: '100%',
        //marginTop: 10
    },
    titleText: {
        alignItems: 'center',
        textAlign: 'center',
        margin: 15,
        fontSize: 17,
        justifyContent: 'space-evenly'
    },
    text: {
        fontSize: 15
    },
    textInput: {
        width: '100%',
        height: 35,
        //marginRight: 8,
        backgroundColor: 'powderblue',
        textAlign: 'center',
        justifyContent: 'space-around',
        borderColor: 'aliceblue',
        fontSize: 15
    },
    inputView: {
        flexDirection: 'row', 
        width: '90%', 
        alignItems: 'center', 
        justifyContent: 'space-evenly'
    },
    input: {
        flexDirection: 'row',
        marginBottom: 20
    },
});