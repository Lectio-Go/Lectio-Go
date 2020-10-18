import {Theme} from '@react-navigation/native';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';

interface LoginButtonProps {
  name: string;
  theme: Theme;
  onPress: () => void;
  disabled: boolean;
}

const LoginButton = (props: LoginButtonProps) => {
  const colors = props.theme.colors;
  const styles = StyleSheet.create({
    buttonContainer: {
      opacity: props.disabled ? 0.3 : 1,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 18,
      backgroundColor: props.disabled ? 'grey' : colors.primary,

      height: 36,
      width: 120,
    },
    buttonText: {
      color: 'white',
      fontSize: 15,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.button}
        onPress={props.onPress}
        disabled={props.disabled}>
        <Text style={styles.buttonText}>{props.name}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginButton;
