import { StyleSheet, Button, View, TextInput, Text } from 'react-native';
import { useState } from 'react';

import AppButton from './ui/AppButton';

import Config from '../../Config';

export default function Identify(props) {
    const [username, setUsername] = useState('');
    console.log('Identify');

    function usernameHandler(v) {
        setUsername(v);
    }

    function submit() {
        const name = username;
        props.proceed({step: 'identify', identifier: name});
    }

    return (
        <View style={styles.container} >
            <Text style={styles.text} >{props.config.showTitle ? props.config.titles.identify : '' }</Text>
            <View style={styles.input} >
                <TextInput style={styles.textInput} placeholder={props.remediation.inputs[0].label} onChangeText={usernameHandler} value={username} />
            </View>
            <View style={styles.container1} >
                {/* <Button title='Login' color={'#666666'} onPress={submit} /> */}
                <AppButton 
                    onPress={submit} 
                    title='Login'
                    styles={styles}
                />
            </View>
        </View>
    );
}
  
const styles = StyleSheet.create({
    ...Config.styles
});