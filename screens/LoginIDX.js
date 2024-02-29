import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useState, useEffect } from 'react';

import 'react-native-get-random-values'

import '@okta/okta-auth-js/polyfill';

import Home from './Home';
import Interact from '../okta/idx/screens/Interact';


export default function LoginIDX(props) {
    const [ loginScreen, setLoginScreen ] = useState(loginSelectionScreen());
    
    // const [ socialRedirect, setSocialRedirect ] = useState(false);
    
    
    // console.log('********* props.queryParams: ' + props.queryParams)
    // if (props.queryParams) {
    //   setLoginScreen(<Interact oktaAuth={props.oktaAuthRN.oktaAuth} success={success} failure={failure} config={props.config} />)
    // }
    // useEffect(() => {
    //   console.log('********* props.interactionRequired: ' + props.interactionRequired)
    //   // if (props.queryParams) {
    //   //   if (!socialRedirect) {
    //   //     setSocialRedirect(true);
    //   //     //login();
    //   //   }
    //   //   //login();
    //   // }
    // });

    // useEffect(() => {
    //   if (socialRedirect) {
    //     login(true);
    //   }
    // }, [socialRedirect])

    useEffect(() => {
      console.log('********* props.interactionRequired 2: ' + props.interactionRequired);
      if (props.interactionRequired /*&& props.interactionRequired.interaction_code && props.interactionRequired.state*/) {
        setLoginScreen(<Interact oktaAuth={props.oktaAuthRN.oktaAuth} oktaAuthRN={props.oktaAuthRN} success={success} failure={failure} config={props.config} interactionRequired={props.interactionRequired} />)
      }
    }, [props.interactionRequired]);

    function login(isCallback) {
      console.log(props.oktaAuthRN.oktaAuth.features.isBrowser());
      console.log(props.oktaAuthRN.oktaAuth.features.hasTextEncoder());
      console.log(props.oktaAuthRN.oktaAuth.features.getUserAgent());
      console.log(props.oktaAuthRN.oktaAuth.features.isHTTPS());
      console.log(props.oktaAuthRN.oktaAuth.features.isLocalhost());
      console.log(props.oktaAuthRN.oktaAuth.features.isPKCESupported());
      console.log(props.oktaAuthRN.oktaAuth.features.isIE11OrLess());
      //console.log(typeof webcrypto);
      //console.log(typeof Uint8Array);
      console.log(props.oktaAuthRN.oktaAuth.features);
      console.log('go');
      
      setLoginScreen(<Interact oktaAuth={props.oktaAuthRN.oktaAuth} success={success} failure={failure} config={props.config} />)
    }

    function success() {
      console.log('******** success login');
      props.setScreen(<Home oktaAuthRN={props.oktaAuthRN} loginScreen={test} />);
    }

function test() {
  props.setScreen(<LoginIDX oktaAuthRN={props.oktaAuthRN} setScreen={props.setScreen} config={props.config}/>)
}

    function failure() {
      console.log('******** failure login');
      setLoginScreen(loginSelectionScreen());
    }

    function loginSelectionScreen() {
      return (
        <View style={styles.container1}>
        <View style={styles.container2}>
          <Text style={styles.text} >IDX Login</Text>
        </View>
        <View style={[styles.container2, {alignItems: 'stretch'}]}>
          <Button
              onPress={() => { login(false); } }
              title="Login"
              testID="loginButton"
              color={'#3f8ad9'}
          />
          <StatusBar style="auto" />
        </View>
        </View>
      );
    }

    return (
       <View style={styles.container}>
        {loginScreen}
      </View>
    );
}
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 15,
        marginBottom: 15,
        backgroundColor: 'aliceblue',
    },
    container1: {
      width: '100%',
      marginTop: 10,
      alignItems: 'stretch',
      justifyContent: 'space-evenly',
      flex: 1
    },
    container2: {
      //width: '90%',
      margin: 30,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1
    },
    text: {
      fontSize: 34
    },
});