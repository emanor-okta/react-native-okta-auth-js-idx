import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect, useRef } from 'react';

import * as Linking from 'expo-linking';

import './okta/Globals'

import PolyfillCrypto from 'react-native-webview-crypto'
import 'react-native-get-random-values'

import '@okta/okta-auth-js/polyfill';

import config from './okta/Config'
import OktaAuthRN from './okta/OktaAuthRN';
import LoginIDX from './screens/LoginIDX';
import Home from './screens/Home';

// azure.user2@emanoroktagmail.onmicrosoft.com
// Nodu41250
export default function App() {
  const [ screen, setScreen ] = useState(splashScreen());
  const [ launchURL, setLaunchURL ] = useState('');
  var oktaAuthRN;
  const oktaAuthRNRef = useRef(null);

  const url = Linking.useURL();
  console.log('launchURL: ' +url);
  if (url !== launchURL) {
    setLaunchURL(url);
  }

  const initializeOktaAuthRN = async () => {
    await oktaAuthRN.initialAuthClient();
    oktaAuthRNRef.current = oktaAuthRN
    console.log('>>>> IsAuth2 ' + oktaAuthRN)
    console.log(`launchURL: ${launchURL}`)

    if (launchURL && launchURL !== '') {
      const { hostname, path, queryParams } = Linking.parse(launchURL);
      console.log(queryParams)
      console.log(oktaAuthRN)
      if (queryParams && queryParams.interaction_code && queryParams.state) {
console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
        setScreen(<LoginIDX oktaAuthRN={oktaAuthRN} setScreen={setScreen} config={config.appConfig} interactionRequired={queryParams} />)
      }
    }

    oktaAuthRN.oktaAuth.isAuthenticated()
    .then( result => {
      console.log('result: ' + result);
      if (result) {
        setScreen(<Home oktaAuthRN={oktaAuthRN} setScreen={setScreen} config={config.appConfig} />)
      } else {
        setScreen(<LoginIDX oktaAuthRN={oktaAuthRN} setScreen={setScreen} config={config.appConfig} interactionRequired={undefined} />)
      }
    })
    .catch( err => {
      console.log('Error: ' + err);
    });
  }

  useEffect(() => {
    console.log('>>>> IsAuth1 ' + oktaAuthRN)
    oktaAuthRN = new OktaAuthRN(config);
    initializeOktaAuthRN();
	}, []);

  useEffect(() => {
    // check if launched from social IdP callback
    if (launchURL && launchURL !== '' && oktaAuthRNRef.current) {
      const { queryParams } = Linking.parse(launchURL);
      console.log(queryParams)
      console.log(queryParams.interaction_code + ' : ' + queryParams.state)
      if (queryParams && queryParams.state) {
        console.log('--------- Setting Launch URL Blank')
        setLaunchURL('');
        console.log('--------- Setting Screen')
        setScreen(<LoginIDX oktaAuthRN={oktaAuthRNRef.current} setScreen={setScreen} config={config.appConfig} interactionRequired={launchURL} />)
      }
    } else {
      console.log('>>>>> not launchURL')
    }
  }, [launchURL]);


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
