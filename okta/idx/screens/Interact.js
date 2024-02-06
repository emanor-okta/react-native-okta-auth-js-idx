import { StyleSheet, Text, View, Button } from 'react-native';
import { useState, useEffect } from 'react';

import '@okta/okta-auth-js/polyfill';

import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';

import Identify from '../components/Identify';
import ChallengeAuthenticator from '../components/ChallengeAuthenticator';
import EnrollProfile from '../components/EnrollProfile';
import SelectAuthenticatorEnroll from '../components/SelectAuthenticatorEnroll';
import EnrollAuthenticator from '../components/EnrollAuthenticator';
import SelectAuthenticatorAuthenticate from '../components/SelectAuthenticatorAuthenticate';
import AuthenticatorVerificationData from '../components/AuthenticatorVerificationData';
import SelectAuthenticatorUnlockAccount from '../components/SelectAuthenticatorUnlockAccount';

export default function Interact(props) {
    const oktaAuth = props.oktaAuth

    const [ idxScreen, setIDXScreen ] = useState(defaultIDXScreen());
    const [ hideSecondary, setHideSecondary ] = useState(false);

    var temporaryHideSecondary = false;
    
    useEffect(() => {
        if (props.secondary) {
            setHideSecondary(props.secondary);
        }
        
        oktaAuth.idx.start()
        .then( result => {
            console.log('>> Result <<');
            console.log(JSON.stringify(result, '', '  '));

            /*if (result.status === 'SUCCESS') {
                handleSuccess(result);
            } else {
                //return this.oktaAuth.idx.proceed({step: "identify", username: "emanor.okta2@gmail.com" });
                console.log('Do Next Step');
                //props.success();
            }*/

            hanldeResposne(result);
            //return authClient.transactionManager.load();
        })
        .catch(err => {
            console.log('Interact Error: ' + err);
            props.failure();
        });
    }, []);

    function hanldeResposne(result, refresh) {
        if (result.status === 'SUCCESS') {
            handleSuccess(result);
        } else {
            msg = checkForMessages(result);
            if (msg) {
                console.log('MESSAGES RETURNED: ' + msg.message);
            }

            switch(result.status) {
                case "PENDING":
                    if (msg && !refresh) {
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
        //var { nextStep: { inputs } } = result;
        const primaryComponents = new Array();
        const secondaryComponents = new Array();
        const footerComponents = new Array();
        var primaryStepName = '';
        
        console.log('nextStep');
        console.log(JSON.stringify(result.nextStep, '', '  '));
        if (result.nextStep) {
            //console.log(result.nextStep);
            //console.log(result.nextStep.inputs);
            
            //components.push(addComponent(result.nextStep));

            primaryStepName = result.nextStep.name;
            const compoent = addComponent(result.nextStep, result, true, primaryStepName);
            if (compoent) {
                primaryComponents.push(compoent);
            }
        }
        
        //var { availableSteps: { inputs } } = result;
        console.log('availableSteps');
        if (result.availableSteps) {
            console.log(JSON.stringify(result.availableSteps, '','  '));
            //console.log(result.availableSteps.inputs);
            var primary = (primaryStepName !== '');
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
                        if (isFooterComponent(remediation.name)) {
                            footerComponents.push(compoent);
                        } else {
                            secondaryComponents.push(compoent);
                        }
                    }
                }
                primary = false;
            });
        }
        const components = new Array();
        if (primaryComponents.length > 0) {
            components.push(<View key={uuid()} style={{flex: 5}}>{primaryComponents}</View>);
        }
        
        console.log(`HIDE SECONDARY: ${hideSecondary}, temporaryHideSecondary: ${temporaryHideSecondary}`);
        if (secondaryComponents.length > 0 && (!hideSecondary && !temporaryHideSecondary)) {
            components.push(<View key={uuid()} style={{flex: 4}}>{secondaryComponents}</View>);
        }
        temporaryHideSecondary = false;
        
        if (footerComponents.length > 0) {
            components.push(<View key={uuid()} style={{flex: 1}}><View style={{flexDirection: 'row', justifyContent:'space-evenly'}}>{footerComponents}</View></View>)
        }

        var resp = <View style={{flex: 1}}>{components}</View>
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
                return <Identify key={key} remediation={remediation} proceed={proceed} primary={primary} />
                break;
            case "select-enroll-profile":
                console.log("build select-enroll-profile");
                //return <Button title='Enroll' onPress={selectProfileEnroll} />
                return <Text key={key} style={styles.text} onPress={selectProfileEnroll}>Sign Up</Text>
                break;
            case "redirect-idp":
                switch (primaryStepName) {
                    case 'identify':
                    case 'redirect-idp':
                        console.log("build redirect-idp");
                        return <Text key={key}>redirect-idp</Text>
                        break;
                    default:
                        console.log(`SKIPPING build redirect-idp for primary-step: ${primaryStepName}`);
                        break;
                }
            case "challenge-authenticator":
                console.log("build challenge-authenticator");
                return <ChallengeAuthenticator key={key} remediation={remediation} proceed={proceed} primary={primary} />
                break;
            case "select-authenticator-authenticate":
                console.log("build select-authenticator-authenticate");
                //return <Text>select-authenticator-authenticate</Text>
                return <SelectAuthenticatorAuthenticate key={key} remediation={remediation} proceed={proceed} primary={primary} />
                break;
            case "currentAuthenticatorEnrollment-recover":
                console.log("build currentAuthenticatorEnrollment-recover");
                //return <Button title='Recover' onPress={recover} />
                return <Text key={key} style={styles.text} onPress={recover}>Reset Password</Text>
                break;
            case "enroll-profile":
                console.log("build enroll-profile");
                return <EnrollProfile key={key} remediation={remediation} proceed={proceed} primary={primary} />
                break;
            case "select-authenticator-enroll":
                console.log("build select-authenticator-enroll");
                /*
                console.log(remediation);
                console.log(remediation.inputs);
                if (remediation.inputs) {
                    remediation.inputs[0].options.forEach( e => {
                        console.log(e);
                    })
                }
                console.log(result.context)
                if (result.context) {
                    console.log(result.context.authenticators)
                    // LOG  {"type": "array", "value": [{"allowedFor": "any", "displayName": "Email", "id": "aut1qct8vyPDDlgXq1d7", "key": "okta_email", "methods": [Array], "type": "email"}, {"allowedFor": "sso", "displayName": "Password", "id": "aut1qct8vxGypBXRj1d7", "key": "okta_password", "methods": [Array], "type": "password"}]}
                }
                //return <Text>select-authenticator-enroll</Text>
                */
                return <SelectAuthenticatorEnroll key={key} authenticators={result.context.authenticators.value} proceed={proceed} primary={primary} />
                break;
            case "enroll-authenticator":
                return <EnrollAuthenticator key={key} remediation={remediation} proceed={proceed} primary={primary} />
                break;
            case "authenticator-verification-data":
                //props.remediation.inputs[0].options.forEach
                if (remediation.inputs && remediation.inputs[0] && remediation.inputs[0].options && remediation.inputs[0].options.length === 1) {
                    temporaryHideSecondary = true;
                }
                return <AuthenticatorVerificationData key={key} remediation={remediation} proceed={proceed} primary={primary} />
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
                return <Text key={key}>authenticator-enrollment-data</Text>
                break;
            case "currentAuthenticator-send":
                return <Text key={key}>currentAuthenticator-send</Text>
                break;
            case "select-authenticator-unlock-account":
                return <SelectAuthenticatorUnlockAccount key={key} remediation={remediation} proceed={proceed} result={result} primary={primary} />
                break;
            case "unlock-account":
                console.log("build unlock-account");
                return <Button key={key} title='Unlock Account' onPress={unlockAccount} />
                break;
            case "skip":
                //return <Button title='Skip' onPress={skip} />
                return <Text key={key} style={styles.text} onPress={skip}>Skip</Text>
                break;
            case "cancel":
                console.log("build cancel");
                //return <Button title='Cancel' onPress={cancel} />
                return <Text key={key} style={styles.text} onPress={cancel}>Cancel</Text>
                break;
            default:
                console.log('Un-Accounted for Remediation step: ' + remediation.name);
        }

        return undefined;
    }

    function isFooterComponent(name) {
        switch (name) {
            case 'select-enroll-profile':
            case 'cancel':
            case 'skip':
            case 'currentAuthenticatorEnrollment-recover':
                return true;
                break;
            default:
                return false;
                break;
        }
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

    /*
     * Render
     */
    function defaultIDXScreen() {
        return(<></>);
    }

    return(   
        <>
            {idxScreen}
       </>
    );
}
  
//fontWeight: 'bold', color: "#7da2c9", 

const styles = StyleSheet.create({
    text: {
        alignItems: 'flex-start',
        margin: 15,
        fontSize: 17,
        fontWeight: 'bold',
        color: '#3f8ad9',
    },
});

