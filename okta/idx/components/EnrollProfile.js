import { StyleSheet, Button, View, Text } from 'react-native';
import { useEffect, useState } from 'react';

import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import String from './fields/String';
import Boolean from './fields/Boolean';
import Choice from './fields/Choice';



export default function EnrollProfile(props) {
    const [components, setComponents] = useState(new Array());
    const [values, setValues] = useState(new Object());
    var childValues;


    useEffect(() => {
        let c = new Array();
        props.remediation.inputs.forEach(element => {
            c.push(addComponent(element));
        });

        childValues = new Object();
        setComponents(c);
    }, []);


    function addComponent(element, index) {
        switch (element.type) {
            case 'string':
            case undefined:
                // number & integer don't seem to have a type attribute and are sent as strings
                if (element.options && element.options[0]) {
                    // type select
                    if (element.options[0].value.value.inputType === 'select') {
                        const data = [];
                        element.options[0].value.value.options.forEach(element => {
                            data.push(element);
                        });
                        const placeHolder = `${element.name}${element.required ? ' *' : '' }`

                        return(
                            <View style={styles.inputView}>
                                <Choice 
                                    attrName={element.name} 
                                    value={values[element.name] ? values[element.name] : ''} 
                                    childUpdated={childUpdated} 
                                    placeholder={placeHolder} 
                                    data={data} 
                                    styles={styles} 
                                />
                            </View>
                        );
                    }
                } else {
                    return(
                        <View style={styles.inputView}>
                            <String 
                                attrName={element.name} 
                                value={values[element.name] ? values[element.name] : ''} 
                                childUpdated={childUpdated} 
                                placeholder={element.label + (element.required ? ' *' : '') } 
                                secure={false} 
                                style={styles.textInput} 
                            />
                        </View>
                    );
                }
                break;
            case 'boolean':
                return(
                    <View style={[styles.inputView, {alignItems: 'center'}]} >
                        <View >
                            <Text style={styles.text}>{element.label + (element.required ? ' *' : '')}</Text>
                        </View>
                        <View>
                            <Boolean 
                                attrName={element.name} 
                                childUpdated={childUpdated} 
                            />
                        </View>
                    </View>
                );
                break;
            default:
                console.log('**** Need to configure Enroll for ' + element.type);
                break;
        }
    }

    function submit() {
        console.log('values');
        console.log(values);
        const payload = Object();
        payload['step'] ='enroll-profile'
        const userProfile = Object();
        Object.keys(values).forEach(key => {
            if (values[key].value && values[key].value !== '') {
                userProfile[key] = values[key].value;
            } else if (values[key] && values[key] !== '') {
                userProfile[key] = values[key];
            }
        });
        payload['userProfile'] = userProfile;
        console.log({...payload});
        props.proceed(payload, false);
    }

    function childUpdated(key, value) {
        // console.log(childValues);
        // console.log(values);
        childValues[key] = value;
        // console.log(childValues);
        setValues(childValues);
    }



    return (
        <View style={styles.container} >
            <Text style={styles.titleText} >Step: &lt;{props.remediation.name}&gt;</Text>
            {components}
            <View style={[styles.container1, {paddingTop: 20, }]} >
                <Button title='Enroll' color={'#3f8ad9'} onPress={submit} />
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
    input: {
        flexDirection: 'row',
        justifyContent:'space-around',
        alignItems: 'center',
        padding: 5,
        marginLeft: 20,
        marginRight: 20
        //flex: 2
    },
    titleText: {
        alignItems: 'center',
        textAlign: 'center',
        margin: 15,
        fontSize: 17,
        justifyContent: 'space-evenly'
    },
    text: {
        fontSize: 15
    },
    textInput: {
        width: '100%',
        //marginRight: 8,
        backgroundColor: 'powderblue',
        textAlign: 'center',
        height: 35
     },
    dropdown: {
        //margin: 16,
        width: '100%',
        backgroundColor: 'powderblue',
        borderColor: 'aliceblue',
        borderTopWidth: 3,
        borderBottomWidth: 3,
    },
    placeholderStyle: {
        fontSize: 15,
    },
    selectedTextStyle: {
        fontSize: 15,
    },
    inputView: {
        justifyContent:'space-around',
        alignItems: 'stretch',
        padding: 5,
        flexDirection: 'row',
    },
});