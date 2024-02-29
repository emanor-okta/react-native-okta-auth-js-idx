import { TextInput } from 'react-native';
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
  
