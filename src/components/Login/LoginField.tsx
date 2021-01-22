import { Theme } from '@react-navigation/native';
import { computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import ThemeStore from '../../stores/ThemeStore';

interface LoginFieldProps {
  name?: string;
  secure?: boolean;
  theme?: ThemeStore;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
  value?: string;
  disabled?: boolean;
}


const LoginField = (props: LoginFieldProps) => {
  const colors = props.theme!.colors;
  const styles = StyleSheet.create({
      container: {
        marginVertical: 5
      },
      title: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 10,
        marginBottom: 0,
      },
      textinput: {
        paddingTop: 5,
        fontSize: 17,
        color: colors.text,
        height: 38,
        borderBottomColor: colors.border,
        borderBottomWidth: 1,
      },
    });

    return (
      <TouchableOpacity onPress={props.onPress}>
        <View style={styles.container} pointerEvents={props.disabled ? "none" : "auto"}>
          <Text style={styles.title}>{props.name}</Text>
          <TextInput
            style={styles.textinput}
            onChangeText={props.onChangeText}
            value={props.value}
            secureTextEntry={props.secure}
            autoCapitalize={'none'}
            autoCorrect={false}
            {...(props.disabled ? {selection: {start:0, end:0}} : {})}            
          />
        </View>
      </TouchableOpacity>
    );
}

export default inject("theme")(observer(LoginField));
