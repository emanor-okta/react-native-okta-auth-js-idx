import { Text, TouchableOpacity } from 'react-native';

// import Icon from 'react-native-vector-icons/FontAwesome';


// export default AppButton = ({ onPress, icon, title, backgroundColor, borderColor, color, styles }) => (
//     <View style={styles.appButtonContainer}>
//       <Icon.Button
//         name={icon}
//         color={color}
//         backgroundColor={backgroundColor}
//         borderColor={borderColor}
//         borderWidth={1}
//         onPress={onPress}
//         style={styles.appButton}
//       >
//         <Text style={styles.appButtonText}>{title}</Text>
//       </Icon.Button>
//     </View>
// );

export default AppButton = ({ onPress, title, styles }) => (
    <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
      <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
  );