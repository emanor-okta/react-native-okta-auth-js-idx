import { StyleSheet, Button, View, TextInput, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useState, useEffect } from 'react';


export default function SelectAuthenticatorAuthenticate(props) {
    const [authenticator, setAuthenticator] = useState('');
    const [placeHolderText, setPlaceHolderText] = useState(true);
    const [data, setData] = useState([]);
    //const data = [];
   
    useEffect(() => {
        console.log(props)
        const d = [];
        props.remediation.inputs[0].options.forEach(element => {
            d.push({ label: element.label, value: element.value });
        });
        console.log(d);
        setData(d);
        if (props.primary) {
            setPlaceHolderText("Select Authenticator");
        } else {
            setPlaceHolderText("Verify With Something Else");
        }
    }, [props]);

    function onChangeHandler(v) {
        setAuthenticator(v);
        props.proceed({ step: props.remediation.name, authenticator: v });
    }

    return (
        <View style={styles.container}>
            { props.primary && <Text style={styles.text} >Step: &lt;select-authenticator-authenticate&gt;</Text> }
            <View style={styles.container1}>
                <Dropdown
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
                    placeholder={placeHolderText}
                    //searchPlaceholder="..."
                    value={value}
                    onChange={item => {
                        onChangeHandler(item.value);
                    }}
                />
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