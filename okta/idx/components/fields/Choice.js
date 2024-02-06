import { StyleSheet, } from 'react-native';
import { useState } from 'react';

import { Dropdown } from 'react-native-element-dropdown';


export default function Choice(props) {
    const [value, setValue] = useState('');

    function valueHandler(v) {
        setValue(v);
        props.childUpdated(props.attrName, v);
    }

    
    return (
        <Dropdown
            style={props.styles.dropdown}
            placeholderStyle={props.styles.placeholderStyle}
            selectedTextStyle={props.styles.selectedTextStyle}
            inputSearchStyle={props.styles.inputSearchStyle}
            iconStyle={props.styles.iconStyle}
            data={props.data}
            //search
            maxHeight={200}
            minHeight={200}
            labelField="label"
            valueField="value"
            placeholder={props.placeholder}
            //searchPlaceholder="..."
            value={value}
            onChange={valueHandler}
            itemTextStyle='center'
        /> 
    );
}
  
const styles = StyleSheet.create({
    textInput: {
      width: '100%',
      //marginRight: 8,
      backgroundColor: 'powderblue',
      textAlign: 'center',
      height: 35
    },
});