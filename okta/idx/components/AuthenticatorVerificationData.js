import { StyleSheet, View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';


export default function AuthenticatorVerificationData(props) {
    const [option, setOption] = useState('');
    const [multiOptions, setMultiOptions] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        /*
         * For Authenticators with more then a single method type (phone / verify) display option
         * otherwise just proceed
         */
        console.log(props)
        const d = [];
        props.remediation.inputs[0].options.forEach(element => {
            d.push({ label: element.label, value: element.value });
        });
        console.log(d);
console.log(`D LENGTH ${d.length}`)
        if (d.length === 1) {
            handleOption(d[0].value);
        } else {
            setData(d);
            setMultiOptions(true);
        }
    }, []);


    function handleOption(v) {
        setOption(v);
        props.proceed({ step: props.remediation.name, methodType: v });
    }

    return (
        /*
        <View style={styles.container} >
            <Text style={styles.text} >Step: &lt;authenticator-verification-data&gt;</Text>
            <View style={styles.input} >
                <TextInput style={styles.textInput} secureTextEntry={true} placeholder={props.remediation.inputs[0].label} onChangeText={passcodeHandler} value={passcode} />
                <Button title='Submit' onPress={submit} />
            </View>
        </View>
        */
        <View style={styles.container} >
            { props.primary && multiOptions && <Text style={styles.text} >Step: &lt;authenticator-verification-data&gt;</Text> }
            { multiOptions && <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                //search
                maxHeight={200}
                labelField="label"
                valueField="value"
                placeholder="Select Verify Option"
                //searchPlaceholder="..."
                value={value}
                onChange={item => {
                    handleOption(item.value);
                }}
            /> }
        </View>
    );
}
  
const styles = StyleSheet.create({
    container: {
        //flex: 1,
        padding: 10,
        margin: 5,
        //alignItems: 'center',
        width: '100%'
    },
    text: {
        alignItems: 'flex-start',
        margin: 15,
        fontSize: 17
    },
    dropdown: {
        margin: 16,
        //height: 200,
        //borderBottomColor: 'gray',
        //borderBottomWidth: 0.5,
        backgroundColor: 'powderblue',
    },
    placeholderStyle: {
        fontSize: 15,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
});