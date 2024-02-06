import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';

import './okta/Globals'

import PolyfillCrypto from 'react-native-webview-crypto'
import 'react-native-get-random-values'

import '@okta/okta-auth-js/polyfill';

import config from './okta/Config'
import OktaAuthRN from './okta/OktaAuthRN';
import LoginIDX from './screens/LoginIDX';
import Home from './screens/Home';


export default function App() {
  const [ authState, setAuthState ] = useState('unknown');
  const [ screen, setScreen ] = useState(splashScreen());
  var oktaAuthRN;

  useEffect(() => {
    console.log('>>>> IsAuth1 ' + oktaAuthRN)
		oktaAuthRN = new OktaAuthRN(config);

    const initializeOktaAuthRN = async () => {
      await oktaAuthRN.initialAuthClient();
      console.log('>>>> IsAuth2 ' + oktaAuthRN)
      oktaAuthRN.oktaAuth.isAuthenticated()
      .then( result => {
        console.log('result: ' + result);
        if (result) {
          setAuthState('authenticated');
          setScreen(<Home oktaAuthRN={oktaAuthRN} />)
        } else {
          setAuthState('unauthenticated');
          setScreen(<LoginIDX oktaAuthRN={oktaAuthRN} setScreen={setScreen} />)
        }
      })
      .catch( err => {
        console.log('Error: ' + err);
      });
    }
 
    initializeOktaAuthRN();
	}, []);


  function splashScreen() {
    return (
      <>
        <Text>Splash !!</Text>
        <StatusBar style="auto" />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <PolyfillCrypto />
      {screen}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //padding: 20,
    flex: 1,
    backgroundColor: '#efa',
    //alignItems: 'center',
    //width: '100%'
    //justifyContent: 'center',
  },
});
