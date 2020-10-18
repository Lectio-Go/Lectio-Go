import {Theme} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';

interface LoginFieldProps {
  name: string;
  secure: boolean;
  theme: Theme;
  onChangeText: (text: string) => void;
  value: string;
}

const LoginField = (props: LoginFieldProps) => {
  const colors = props.theme.colors;
  const styles = StyleSheet.create({
    title: {
      color: colors.primary,
      fontWeight: 'bold',
      fontSize: 10,
    },
    textinput: {
      marginVertical: 12,
      paddingBottom: 5,
      fontSize: 15,
      color: colors.text,
      height: 20,
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
    },
  });

  return (
    <View>
      <Text style={styles.title}>{props.name}</Text>
      <TextInput
        style={styles.textinput}
        onChangeText={props.onChangeText}
        value={props.value}
        secureTextEntry={props.secure}
        autoCapitalize={'none'}
        autoCorrect={false}
      />
    </View>
  );
};

export default LoginField;
