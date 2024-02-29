export default config = {
  oktaAuth: {
    issuer: 'https://{DOMAIN}/oauth2/default',
    clientId: '0oa3nwni....',
    redirectUri: 'com.{DOMAIN}.oie://callback',
    scopes: ['openid', 'profile', 'email', 'offline_access'],  
  },

  appConfig: {
    hideSecondary: false,
    showTitle: true,
    titles: {
      challengeAuthenticator: 'Step: <challenge-authenticator>',
      authenticatorVerificationData: 'Step: <authenticator-verification-data>',
      enrollAuthenticator: 'Step: <enroll-authenticator>',
      enrollProfile: 'Step: <enroll-profile>',
      identify: 'Step: <identify>',
      selectAuthenticatorAuthenticate: 'Step: <select-authenticator-authenticate>',
      selectAuthenticatorUnlockAccount: 'Step: <select-authenticator-unlock-account>',
      selectAuthenticatorEnroll: 'Step: <select-authenticator-enroll>'
    }
  },

  styles: {
    container: {
      flex: 1,
      padding: 20,
      alignItems: 'center',
    },
    container1: {
      width: '100%',
      marginTop: 10
    },
    text: {
      alignItems: 'center',
      textAlign: 'center',
      margin: 15,
      fontSize: 17,
      justifyContent: 'space-evenly'
    },
    textInput: {
      width: '100%',
      height: 45,
      //marginRight: 8,
      // backgroundColor: 'powderblue',
      backgroundColor: '#dddddd',
      textAlign: 'center',
      justifyContent: 'space-around',
      borderColor: '#000000',
      borderWidth: 1,
      fontSize: 17
    },
    inputView: {
      flexDirection: 'row', 
      width: '90%', 
      alignItems: 'center', 
      justifyContent: 'space-evenly'
    },
    input: {
      flexDirection: 'row',
      marginBottom: 5
    },
    appButtonContainer: {
      elevation: 8,
      backgroundColor: "#666666",
      borderRadius: 5,
      paddingVertical: 12,
      //paddingHorizontal: 12
    },
    appButtonText: {
      fontSize: 18,
      color: "#ffffff",
      fontWeight: "bold",
      alignSelf: "center",
    },

    footerText: {
      alignItems: 'center',
      margin: 3,
      fontSize: 17,
      fontWeight: 'bold',
      // color: '#3f8ad9',
      color: '#222222'
    },
    screenContainer: {
      justifyContent: "center",
      padding: 80,
    },
    appIconButton: {
      padding: 12,
    },
    appIconButtonText: {
      fontSize: 17,
    },
    appIconButtonContainer: {
      paddingVertical: 2,
      paddingHorizontal: 12,
    },
    dropdown: {
      margin: 16,
      backgroundColor: '#eeeeee',
    },
    placeholderStyle: {
        fontSize: 15,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
  }
}
