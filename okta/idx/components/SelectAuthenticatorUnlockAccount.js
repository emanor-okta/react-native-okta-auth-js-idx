import { StyleSheet, Button, View, TextInput, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';


export default function SelectAuthenticatorUnlockAccount(props) {
    const [option, setOption] = useState('');
    const [username, setUsername] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
         console.log(props)
        const d = [];
        //props.remediation.inputs[1].options.forEach(element => {
        props.result.neededToProceed[0].value[1].options.forEach(element => {
            console.log(JSON.stringify(element.value.form, '', '  '))
            d.push({ label: element.label, value: element.value.form.value[0].value });
            //d.push({ label: element.label, value: element.value });
        });
        console.log(d);
        setData(d);
           
    }, []);


    function handleSubmit(v) {
        if (username === '' || option === '') {
            console.log('Handle Validation Error');
            return;
        }

        props.proceed({ step: props.remediation.name, identifier: username, authenticator: { id: option } });
    }

    function handleUnlockSelection(v) {
        setOption(v);
    }

    return (
        <View style={styles.container} >
            { props.primary && <Text style={styles.text} >Step: &lt;{props.remediation.name}&gt;</Text> }
            <View style={styles.input} >
            <TextInput style={styles.textInput} placeholder={props.remediation.inputs[0].label} onChangeText={setUsername} value={username} />
            </View>
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                //search
                maxHeight={200}
                minHeight={200}
                labelField="label"
                valueField="value"
                placeholder="Select Unlock Option"
                //searchPlaceholder="..."
                value={value}
                onChange={item => {
                    handleUnlockSelection(item.value);
                }}
            /> 
            <Button title='Unlock' color={'#3f8ad9'} onPress={handleSubmit} />
        </View>
    );
}
  
const styles = StyleSheet.create({
    container: {
        padding: 10,
        margin: 5,
        width: '100%'
    },
    text: {
        alignItems: 'flex-start',
        margin: 15,
        fontSize: 17
    },
    textInput: {
        width: '90%',
        //alignItems: 'flex-end',
        //flexDirection: 'row',
        //flex: 1,
        fontSize: 16,
        //marginRight: 16,
        margin: 15,
        backgroundColor: 'powderblue',
        textAlign: 'center'
    },
    input: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    dropdown: {
        margin: 16,
        width: '90%',
        backgroundColor: 'powderblue',
    },
    placeholderStyle: {
        fontSize: 15,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
});