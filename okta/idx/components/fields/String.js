import { StyleSheet, TextInput, Text } from 'react-native';
import { useState } from 'react';


export default function String(props) {
    const [value, setValue] = useState('');

    function valueHandler(v) {
        setValue(v);
        props.childUpdated(props.attrName, v);
    }

    
    return (
        <TextInput 
            //style={styles.textInput} 
            style={props.style}
            secureTextEntry={props.secure} 
            placeholder={props.placeholder} 
            value={value} 
            onChangeText={valueHandler}
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