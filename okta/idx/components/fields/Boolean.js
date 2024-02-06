import { StyleSheet, Switch } from 'react-native';
import { useState } from 'react';


export default function Boolean(props) {
    const [value, setValue] = useState(false);

    function valueHandler(v) {
        setValue(v);
        props.childUpdated(props.attrName, v);
    }

    
    return (
        <Switch
            trackColor={{false: 'powderblue', true: '#3f8ad9'}}
            thumbColor={'#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={valueHandler}
            value={value}
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