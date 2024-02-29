import { StyleSheet, Button, View, TextInput, Text } from 'react-native';
import { useEffect, useState } from 'react';

import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';

import AppButton from './ui/AppButton';

import Config from '../../Config';

export default function SelectAuthenticatorEnroll(props) {
    const [components, setComponents] = useState(new Array());

    function componentsHandler(id) {
        //call proceed
        props.proceed({ step: 'select-authenticator-enroll', authenticator: { id } });
    }

    useEffect(() => {
        //authenticators = [{"allowedFor": "any", "displayName": "Email", "id": "aut1qct8vyPDDlgXq1d7", "key": "okta_email", "methods": [Array], "type": "email"}, {"allowedFor": "sso", "displayName": "Password", "id": "aut1qct8vxGypBXRj1d7", "key": "okta_password", "methods": [Array], "type": "password"}]
        let c = new Array();
        props.authenticators.forEach(element => {
            c.push(
                <View key={uuid()} style={styles.container1} >
                    {/* <Button title={element.displayName} color={'powderblue'} onPress={() => { componentsHandler(element.id) } } /> */}
                    <AppButton 
                        onPress={() => { componentsHandler(element.id) } } 
                        title={element.displayName}
                        styles={styles}
                    />
                </View>
            );
        });
        setComponents(c);
    }, []);


    return (
        <View style={styles.container} >
            <Text style={styles.text} >{props.config.showTitle ? props.config.titles.selectAuthenticatorEnroll : '' }</Text>
            {components}
        </View>
    );
}
  
const styles = StyleSheet.create({
    ...Config.styles
 });