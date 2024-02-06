import { StyleSheet, Button, View, TextInput, Text } from 'react-native';
import { useState } from 'react';


export default function ChallengeAuthenticator(props) {
    const [passcode, setPasscode] = useState('');

    function passcodeHandler(v) {
        setPasscode(v);
    }

    function submit() {
        const code = passcode;
        setPasscode('');
        props.proceed({ step: 'challenge-authenticator', credentials: { passcode: code } });
    }

    const placeholder = `${props.remediation.inputs[0].label} from ${props.remediation.type}`;
    console.log(placeholder)
    return (
        <View style={styles.container} >
            <Text style={styles.text} >Step: &lt;challenge-authenticator&gt;</Text>
            <TextInput 
                style={styles.textInput} 
                secureTextEntry={true} 
                placeholder={`${props.remediation.inputs[0].label} from ${props.remediation.type}`} 
                value={passcode} 
                onChangeText={passcodeHandler}
            />
            <View style={styles.container1}>
                <Button title='Submit' color={'#3f8ad9'} onPress={submit} />
            </View>
        </View>
    );
}
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    container1: {
        width: '100%',
        marginTop: 10
    },
    input: {
        flexDirection: 'row',
    },
    text: {
        alignItems: 'flex-start',
        margin: 15,
        fontSize: 17
    },
    textInput: {
      width: '100%',
      //marginRight: 8,
      backgroundColor: 'powderblue',
      textAlign: 'center',
      height: 35
    },
});