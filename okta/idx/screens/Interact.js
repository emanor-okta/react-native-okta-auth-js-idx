import { SafeAreaView, ScrollView, StyleSheet, Text, View, Button, Linking } from 'react-native';
import { useState, useEffect } from 'react';

import Icon from 'react-native-vector-icons/FontAwesome';

import '@okta/okta-auth-js/polyfill';

import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';

// import Hr from 'react-native-hr';

import Identify from '../components/Identify';
import ChallengeAuthenticator from '../components/ChallengeAuthenticator';
import EnrollProfile from '../components/EnrollProfile';
import SelectAuthenticatorEnroll from '../components/SelectAuthenticatorEnroll';
import EnrollAuthenticator from '../components/EnrollAuthenticator';
import SelectAuthenticatorAuthenticate from '../components/SelectAuthenticatorAuthenticate';
import AuthenticatorVerificationData from '../components/AuthenticatorVerificationData';
import SelectAuthenticatorUnlockAccount from '../components/SelectAuthenticatorUnlockAccount';

import Config from '../../Config';

export default function Interact(props) {
    const oktaAuth = props.oktaAuth

    const [ idxScreen, setIDXScreen ] = useState(defaultIDXScreen());
    var temporaryHideSecondary = false;
    
    useEffect(() => {
        if (props.interactionRequired) {
            if (props.oktaAuth.idx.isInteractionRequired(props.interactionRequired)) {
                // if ?error=interaction_required&error_description=Your+client+is+configured+to+use+the+interaction+code+
                // flow+and+user+interaction+is+required+to+complete+the+request
                console.log('@@@@@@@@@ isInteractionRequired TRUE @@@@@@@@@@')
                props.oktaAuth.idx.proceed()
                .then(result => {
                    console.log('>> interactionRequired callback Result <<');
                    //console.log(JSON.stringify(result, '', '  '));
                    hanldeResposne(result);
                })
                .catch(err => {
                    console.log('interactionRequired callback Error: ' + err);
                    props.failure();
                });
            } else {
                // if ?interaction_code=Pgu...&state=pky0q...
                oktaAuth.idx.handleInteractionCodeRedirect(props.interactionRequired)
                .then( () => {
                    // handleInteractionCodeRedirect returns void Promise, tokens should be stored when it resolves
                    props.success();
                })
                .catch(err => {
                    console.log('Failed to exchange intaeraction_code for tokens: ' + err);
                    props.failure();
                });
            }
        }
    }, [props.interactionRequired]);


    useEffect(() => {
        if (props.secondary) {
            setHideSecondary(props.secondary);
        }
        
        oktaAuth.idx.start()
        .then( result => {
            console.log('>> Result <<');
            console.log(JSON.stringify(result, '', '  '));

            hanldeResposne(result);
        })
        .catch(err => {
            console.log('Interact Error: ' + err);
            props.failure();
        });
    }, []);


    function hanldeResposne(result, shoulRefresh) {
        if (result.status === 'SUCCESS') {
            handleSuccess(result);
        } else {
            msg = checkForMessages(result);
            if (msg) {
                console.log('MESSAGES RETURNED: ' + msg.message);
            }

            switch(result.status) {
                case "PENDING":
                    if (msg && !shoulRefresh) {
                        return;
                    }
                    handlePending(result);
                    break;
                case "CANCELED":
                    handleCanceled(result);
                    break;
                case "FAILURE":
                    handleFailure(result);
                    break;
                case "TERMINAL":
                    handleTerminal(result);
                    break; 
                default:
                    console.log('Unknown Response Received: ' + result.statue);
                    props.failure();
            }
        }
    }

    function checkForMessages(result) {
        if (result.messages && result.messages.length > 0) {
            return result.messages[0];
        }
    }

    function handleSuccess(result) {
        if (result.tokens) {
            console.log('setTokens');
            oktaAuth.tokenManager.setTokens(result.tokens);
            props.success();
        } else {
            // TODO - find correct way to handle this
            // Does Interaction Code need to be exchanged
            const step = result.availableSteps.find((element) => element.name === 'issue');
            if (step) {
                step.action()
                .then( result => {
                    hanldeResposne(result);
                })
                .catch(err => {
                    console.log('Unexpected Error trying to exchange InteractionCode: ' + err);
                    props.failure();
                });
            }
        } 
    }

    function handleTerminal(result) {
        console.log('TODO handleTerminal');
    }

    function handleFailure(result) {
        console.log('TODO handleFailure');
        props.failure();
    }

    function handleCanceled(result) {
        console.log('TODO handleCanceled');
        props.failure();
    }

    function handlePending(result) {
        const primaryComponents = new Array();
        const secondaryComponents = new Array();
        const footerComponents = new Array();
        var primaryStepName = '';
        
        console.log('nextStep');
        console.log(JSON.stringify(result.nextStep, '', '  '));
        if (result.nextStep) {
            primaryStepName = result.nextStep.name;
            const compoent = addComponent(result.nextStep, result, true, primaryStepName);
            if (compoent) {
                primaryComponents.push(compoent);
            }
        }
        
        console.log('availableSteps');
        if (result.availableSteps) {
            console.log(JSON.stringify(result.availableSteps, '','  '));
            //console.log(result.availableSteps.inputs);
            var primary = (primaryStepName !== '');
        var identifySeparatorAdded = false;
            result.availableSteps.forEach(remediation => {
                if (primary) {
                    //primaryComponents.push(addComponent(remediation, result, primary));
                    console.log(`Skipping ${remediation.name} should already be added as primaryStep ${primaryStepName}`);
                } else {
                    //secondaryComponents.push(addComponent(remediation, result, primary));
                    if (primaryStepName === '') {
                        primary = true;
                        primaryStepName = remediation.name;
                    }
                    const compoent = addComponent(remediation, result, primary, primaryStepName);
                    if (compoent) {
                        if (isFooterComponent(remediation.name, primary)) {
                            footerComponents.push(compoent);
                        } else {
                            if (primaryComponents.length === 0) {
                                primaryComponents.push(compoent);
                            } else {
        if (!identifySeparatorAdded && primaryStepName === 'identify') {
            // primaryComponents.push(<View><Text>--- or ---</Text></View>);
            // primaryComponents.push(<Hr text="or" />);
            primaryComponents.push(
                <View style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 40, paddingRight: 40, paddingBottom: 25}}>
                    <View style={{flex: 4}} />
                    <View style={{height: 2,
                        width: '100%',
                        backgroundColor: '#aaaaaa',
                        borderRadius: 5,
                        flex: 3
                        }} 
                    />
                    <View style={{flex: 2}}><Text style={{fontSize: 18, textAlign: 'center'}}> or </Text></View>
                    <View style={{height: 2,
                        width: '100%',
                        backgroundColor: '#aaaaaa',
                        borderRadius: 5,
                        flex: 3
                        }} 
                    />
                    <View style={{flex: 4}} />
                </View>
            );

            identifySeparatorAdded = true;
        }
                                secondaryComponents.push(compoent);
                            }
                        }
                    }
                }
                primary = false;
            });
        }
        const components = new Array();
        if (primaryComponents.length > 0) {
            // components.push(<View key={uuid()} style={{flex: 5}}>{primaryComponents}</View>);
            components.push(<View key={uuid()} >{primaryComponents}</View>);
        }
        
        console.log(`HIDE SECONDARY: ${props.config.hideSecondary}, temporaryHideSecondary: ${temporaryHideSecondary}`);
        if (secondaryComponents.length > 0 && (!props.config.hideSecondary && !temporaryHideSecondary)) {
            components.push(<View key={uuid()} >{secondaryComponents}</View>);
            // components.push(<SafeAreaView key={uuid()} style={{flex: 4}}><ScrollView>{secondaryComponents}</ScrollView></SafeAreaView>);
        }
        temporaryHideSecondary = false;
        
        const footer = new Array();
        if (footerComponents.length > 0) {
            //components.push(<View key={uuid()} style={{flex: 1}}><View style={{flexDirection: 'row', justifyContent:'space-evenly'}}>{footerComponents}</View></View>)
            footer.push(<View key={uuid()} style={{flex: 1}}><View style={{flexDirection: 'row', justifyContent:'space-evenly'}}>{footerComponents}</View></View>)
        } else {
            footer.push(<></>);
        }

        //var resp = <View style={{flex: 1}}>{components}</View>
        var resp = <SafeAreaView key={uuid()} style={{flex: 1}}><View style={{flex: 8}}><ScrollView  contentContainerStyle={{ flexGrow: 1 }}>{components}</ScrollView></View><View style={{flex: 1}}>{footer}</View></SafeAreaView>
        components.forEach(c => {
            console.log(c);
        });
        console.log(resp);
        setIDXScreen(resp);
    }

    function addComponent(remediation, result, primary, primaryStepName) {
        //console.log(remediationOption);
        if (primaryStepName === '') {
            // not sure if there is a case auth-js doens't set a nextStep, if so make it the first remediation step
            primaryStepName = remediation.name;
        }
        const key = uuid();

        switch(remediation.name) {
            case "identify":
                console.log("build identify");
                return <Identify key={key} remediation={remediation} proceed={proceed} primary={primary} config={props.config} />
                break;
            case "select-enroll-profile":
                console.log("build select-enroll-profile");
                //return <Button title='Enroll' onPress={selectProfileEnroll} />
                return <Text key={key} style={styles.footerText} onPress={selectProfileEnroll}>Sign Up</Text>
                break;
            case "redirect-idp":
                switch (primaryStepName) {
                    case 'identify':
                    case 'redirect-idp':
                        console.log("build redirect-idp");
                        console.log(remediation);
                        var icon;
                        var title;
                        var backgroundColor;
                        switch (remediation.type) {
                            case 'APPLE':
                                icon = 'apple';
                                title = 'Sign in with Apple'
                                backgroundColor = '#979797'
                                break;
                            case 'FACEBOOK':
                                icon = 'facebook';
                                title = 'Sign in with Facebook'
                                backgroundColor = '#3b5998';
                                break;
                            case 'MICROSOFT':
                                icon = 'windows';
                                title = 'Sign in with Microsoft'
                                backgroundColor = '#00a2ed';
                                break;
                            case 'GITHUB':
                                icon = 'github';
                                title = 'Sign in with Github'
                                backgroundColor = '#14191e';
                                break;
                            default:
                                icon = 'sign-in';
                                title = `Sign in with ${remediation.idp.name}`
                                backgroundColor = '#777';
                                break;
                        }
                        // if (remediation.idp.name === 'Azure Generic OIDC') {
                            // Linking.openURL(remediation.href);
                            // setIDXScreen(<Text key={key}>redirect-idp</Text>);
                            // return <Text key={key} style={styles.text} onPress={() => { redirectIdP(remediation.href) } }>{remediation.idp.name}</Text>
                            return <AppButton onPress={() => { redirectIdP(remediation.href) } } icon={icon} title={title} backgroundColor={backgroundColor}/>
                        // } else {
                        //     return <Text key={key}>redirect-idp</Text>
                        // }
                        break;
                    default:
                        console.log(`SKIPPING build redirect-idp for primary-step: ${primaryStepName}`);
                        break;
                }
            case "challenge-authenticator":
                console.log("build challenge-authenticator");
                return <ChallengeAuthenticator key={key} remediation={remediation} proceed={proceed} primary={primary} config={props.config} />
                break;
            case "select-authenticator-authenticate":
                console.log("build select-authenticator-authenticate");
                if (primary) {
                    // if nextStep show choose authenticator selection
                    return <SelectAuthenticatorAuthenticate key={key} remediation={remediation} proceed={proceed} primary={primary} config={props.config} />
                } else {
                    // if not nextStep show as a footer option. If selected make it the nextStep, remove from available steps, rerender
                    return <Text key={key} style={styles.footerText} onPress={() => {
                        result.nextStep = remediation;
                        result.availableSteps = result.availableSteps.filter((r) => r.name !== remediation.name);
                        handlePending(result);
                    } }>Change Authenticator</Text>
                }
                break;
            case "currentAuthenticatorEnrollment-recover":
                console.log("build currentAuthenticatorEnrollment-recover");
                //return <Button title='Recover' onPress={recover} />
                return <Text key={key} style={styles.footerText} onPress={recover}>Reset Password</Text>
                break;
            case "enroll-profile":
                console.log("build enroll-profile");
                return <EnrollProfile key={key} remediation={remediation} proceed={proceed} primary={primary} config={props.config} />
                break;
            case "select-authenticator-enroll":
                console.log("build select-authenticator-enroll");
               return <SelectAuthenticatorEnroll key={key} authenticators={result.context.authenticators.value} proceed={proceed} primary={primary} config={props.config} />
                break;
            case "enroll-authenticator":
                return <EnrollAuthenticator key={key} remediation={remediation} proceed={proceed} primary={primary} config={props.config} />
                break;
            case "authenticator-verification-data":
                //props.remediation.inputs[0].options.forEach
                if (remediation.inputs && remediation.inputs[0] && remediation.inputs[0].options && remediation.inputs[0].options.length === 1) {
                    temporaryHideSecondary = true;
                }
                return <AuthenticatorVerificationData key={key} remediation={remediation} proceed={proceed} primary={primary} config={props.config} />
                break;
            case "currentAuthenticator-resend":
                console.log("build currentAuthenticator-resend");
                return <Text key={key}>currentAuthenticator-resend</Text>
                break;
            case "currentAuthenticator-poll":
                console.log("build currentAuthenticator-poll");
                return <Text key={key}>currentAuthenticator-poll</Text>
                break;
            case "currentAuthenticatorEnrollment-resend":
                return <Text key={key}>currentAuthenticatorEnrollment-resend</Text>
                break;
            case "currentAuthenticatorEnrollment-poll":
                return <Text key={key}>currentAuthenticatorEnrollment-poll</Text>
                break;
            case "challenge-poll":
                return <Text key={key}>challenge-poll</Text>
                break;
            case "select-enrollment-channel":
                return <Text key={key}>select-enrollment-channel</Text>
                break;
            case "authenticator-enrollment-data":
                return <AuthenticatorVerificationData key={key} remediation={remediation} proceed={proceed} primary={primary} config={props.config} />

                // return <Text key={key}>authenticator-enrollment-data</Text>
                break;
            case "currentAuthenticator-send":
                return <Text key={key}>currentAuthenticator-send</Text>
                break;
            case "select-authenticator-unlock-account":
                return <SelectAuthenticatorUnlockAccount key={key} remediation={remediation} proceed={proceed} result={result} primary={primary} config={props.config} />
                break;
            case "unlock-account":
                console.log("build unlock-account");
                return <Button key={key} title='Unlock Account' onPress={unlockAccount} />
                break;
            case "skip":
                //return <Button title='Skip' onPress={skip} />
                return <Text key={key} style={styles.footerText} onPress={skip}>Skip</Text>
                break;
            case "cancel":
                console.log("build cancel");
                //return <Button title='Cancel' onPress={cancel} />
                return <Text key={key} style={styles.footerText} onPress={cancel}>Cancel</Text>
                break;
            default:
                console.log('Un-Accounted for Remediation step: ' + remediation.name);
        }

        return undefined;
    }

    function isFooterComponent(name, primary) {
        switch (name) {
            case 'select-enroll-profile':
            case 'cancel':
            case 'skip':
            case 'currentAuthenticatorEnrollment-recover':
                return true;
            case 'select-authenticator-authenticate':
                if (!primary) {
                    return true;
                }
            default:
                // return false;
        }
        return false;
    }

    function proceed(proceedBody, refresh) {
        console.log('>>>> To call proceed witb: ' + proceedBody);
        oktaAuth.idx.proceed(proceedBody)
        .then(result => {
            console.log('>>>> To call hanldeResposne witb: ');
            //console.log(result)
            console.log(JSON.stringify(result, '','  '))
            const rerender = refresh === undefined ? true : refresh; 
            hanldeResposne(result, rerender);
        })
        .catch(err => {
            console.log('Error Calling proceed: ' + err);
        }); 
    }

    function selectProfileEnroll() {
        proceed({ step: 'select-enroll-profile' });
    }

    function cancel() {
        oktaAuth.idx.cancel()
        .then(result => {
            hanldeResposne(result);
        })
        .catch(err => {
            console.log('Error Calling cancel: ' + err);
        });
    }

    function skip() {
        proceed({ step: 'skip' });
    }

    function unlockAccount() {
        proceed({ step: 'unlock-account'});
    }

    function recover() {
        proceed({ step: 'recover'});
    }

    function redirectIdP(url) {
        Linking.openURL(url);
    }

    /*
     * Render
     */
    function defaultIDXScreen() {
        return(<></>);
    }



    const AppButton = ({ onPress, icon, title, backgroundColor }) => (
        <View style={styles.appIconButtonContainer}>
          <Icon.Button
            name={icon}
            color='#000000'
            backgroundColor='#eeeeee'
            borderColor='#000000'
            borderWidth={1}
            onPress={onPress}
            style={styles.appIconButton}
          >
            <Text style={styles.appIconButtonText}>{title}</Text>
          </Icon.Button>
        </View>
    );






    return(   
        <>
            {idxScreen}
       </>
    );
}
  

const styles = StyleSheet.create({
    // text: {
    //     alignItems: 'center',
    //     margin: 3,
    //     fontSize: 17,
    //     fontWeight: 'bold',
    //     // color: '#3f8ad9',
    //     color: '#222222'
    // },
    // screenContainer: {
    //     justifyContent: "center",
    //     padding: 80,
    //   },
    //   appButton: {
    //     padding: 12,
    //   },
    //   appButtonText: {
    //     fontSize: 17,
    //   },
    //   appButtonContainer: {
    //     paddingVertical: 2,
    //     paddingHorizontal: 12,
    //   },
    ...Config.styles
});

