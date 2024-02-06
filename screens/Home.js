import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';


export default function Home(props) {
    const tokens = props.oktaAuthRN.getTokens();
    
    return (
        <View style={styles.container}>
            <Text>Hello {tokens.idToken.claims.name}</Text>
            <Text>id_token:</Text>
            <Text>{tokens.idToken.idToken}</Text>
            <Text>access_token:</Text>
            <Text>{tokens.accessToken.accessToken}</Text>
            <StatusBar style="auto" />
        </View>
    );
}
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});