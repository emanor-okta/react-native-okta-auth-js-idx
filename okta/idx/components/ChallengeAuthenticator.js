import { StyleSheet, View, TextInput, Text } from 'react-native';
import { useState } from 'react';

import AppButton from './ui/AppButton';
import Config from '../../Config';

export default function ChallengeAuthenticator(props) {
    const [passcode, setPasscode] = useState('');

    function passcodeHandler(v) {
        setPasscode(v);
    }

    function submit() {
        const code = passcode;
        //setPasscode('');
        props.proceed({ step: 'challenge-authenticator', credentials: { passcode: code } }, false);
    }

    const placeholder = `${props.remediation.inputs[0].label} from ${props.remediation.type}`;
    return (
        <View style={styles.container} >
            <Text style={styles.text} >{props.config.showTitle ? props.config.titles.challengeAuthenticator : '' }</Text>
            <TextInput 
                style={styles.textInput} 
                secureTextEntry={true} 
                placeholder={`${props.remediation.inputs[0].label} from ${props.remediation.type}`} 
                value={passcode} 
                onChangeText={passcodeHandler}
            />
            <View style={styles.container1}>
                {/* <Button title='Submit' color={'#3f8ad9'} onPress={submit} /> */}
                <AppButton 
                    onPress={submit} 
                    title='Submit'
                    styles={styles}
                />
            </View>
        </View>
    );
}
  
const styles = StyleSheet.create({
    ...Config.styles
});