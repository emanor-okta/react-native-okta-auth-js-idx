import { StyleSheet, Button, View, TextInput, Text } from 'react-native';
import { useEffect, useState } from 'react';

import AppButton from './ui/AppButton';

import Config from '../../Config';

export default function EnrollAuthenticator(props) {
    //const [components, setComponents] = useState(new Array());
    const [passcode, setPassCode] = useState('');

    
    useEffect(() => {
        // {"authenticator": {"displayName": "Password", "id": "aut1qct8vxGypBXRj1d7", "key": "okta_password", "methods": [Array], "settings": [Object], "type": "password"}, "authenticatorEnrollments": [], "inputs": [[Object]], "name": "enroll-authenticator", "type": "password"}
        /*
        let c = new Array();
        props.authenticators.forEach(element => {
            //c.push(addComponent(element));
            c.push(<Button title={element.displayName} onPress={() => { componentsHandler(element.id) } } />)
        });
        setComponents(c);
        */
       setPassCode('');
       console.log('props.remediation.inputs[0]')
        console.log(JSON.stringify(props.remediation, '','  '))
    }, [props]);
    



    function passCodeHandler(v) {
        setPassCode(v);
    }

    function submit() {
        //const code = passcode;
        const key = props.remediation.inputs[0].name;
        props.proceed({ step: 'enroll-authenticator', credentials: { passcode } });
    }

    /*
     * Simple authenticators only - don't check methods
     */
    /*
    function addComponent(element) {
        switch (element.type) {
            case 'string':
                return(
                    <Button title={element.displayName} onPress={() => { componentsHandler(element.id) } } />
                );
                break;
            default:
                console.log('**** Need to configure Enroll for ' + element.type);
                break;
        }
    }
    */

/*
    return (
        <View style={styles.container} >
            <Text style={styles.text} >Step: &lt;select-authenticator-enroll&gt;</Text>
            {components}
            <View style={styles.input} >
                <Button title='Enroll' onPress={submit} />
            </View>
        </View>
    );
*/
    return (
        <View style={styles.container} >
            <Text style={styles.text} >{props.config.showTitle ? props.config.titles.enrollAuthenticator : '' }</Text>
            <View style={styles.input} >
                <TextInput 
                    style={styles.textInput} 
                    secureTextEntry={props.remediation.inputs[0].secret} 
                    placeholder={`${props.remediation.inputs[0].label} for ${props.remediation.type} Authenticator`} 
                    onChangeText={passCodeHandler} 
                    value={passcode} 
                />
            </View>
            {/* <Button title='Submit' color={'#3f8ad9'} onPress={submit} /> */}
            <View style={styles.container1}>
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