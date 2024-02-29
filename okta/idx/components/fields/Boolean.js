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
            trackColor={{false: '#dddddd', true: '#666666'}}
            thumbColor={'#eeeeee'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={valueHandler}
            value={value}
        />
    );
}
