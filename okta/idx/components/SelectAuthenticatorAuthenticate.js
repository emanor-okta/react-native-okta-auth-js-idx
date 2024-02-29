import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useState, useEffect } from 'react';

import Config from '../../Config';

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
            { props.primary && <Text style={styles.text} >{props.config.showTitle ? props.config.titles.selectAuthenticatorAuthenticate : '' }</Text> }
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
    ...Config.styles
});