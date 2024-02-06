import { StyleSheet, Button, View, TextInput, Text } from 'react-native';
import { useEffect, useState } from 'react';

import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';

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
                <View key={uuid()} style={styles.input} >
                    <Button title={element.displayName} color={'powderblue'} onPress={() => { componentsHandler(element.id) } } />
                </View>
            );
        });
        setComponents(c);
    }, []);


    return (
        <View style={styles.container} >
            <Text key={uuid()}style={styles.titleText} >Step: &lt;select-authenticator-enroll&gt;</Text>
            {components}
        </View>
    );
}
  
const styles = StyleSheet.create({
    container: {
        padding: 10,
        alignItems: 'stretch',
        width: '100%'
    },
    input: {
        justifyContent:'space-around',
        alignItems: 'stretch',
        padding: 5,
        marginBottom: 3,
        marginTop: 3,
        paddingBottom: 3,
        paddingTop: 3,
        //flex: 1
    },
    titleText: {
        alignItems: 'center',
        textAlign: 'center',
        margin: 15,
        fontSize: 17,
        justifyContent: 'space-evenly'
    },
    
});