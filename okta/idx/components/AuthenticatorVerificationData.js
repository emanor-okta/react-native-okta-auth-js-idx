import { StyleSheet, View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';

import Config from '../../Config';

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
        <View style={styles.container} >
            {/* { props.primary && multiOptions && <Text style={styles.text} >Step: &lt;authenticator-verification-data&gt;</Text> } */}
            { props.primary && multiOptions && <Text style={styles.text} >{props.config.showTitle ? props.config.titles.authenticatorVerificationData : '' }</Text> }
            <View style={styles.container1}>
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
        </View>
    );
}
  
const styles = StyleSheet.create({
    ...Config.styles
});