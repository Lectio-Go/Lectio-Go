import React, {Component} from 'react';
import {Text, Button, View, StyleSheet, Alert, Keyboard} from 'react-native';

import {NavigationScreenProp} from 'react-navigation';
import {DefaultTheme, NavigationProp} from '@react-navigation/native';
import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import {action, computed, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import ThemeStore from '../stores/ThemeStore';
import LectioStore from '../stores/LectioStore';

import LoginField from '../components/Login/LoginField';
import LoginButton from '../components/Login/LoginButton';
import SchoolPicker from '../components/Login/SchoolPicker';

const Stack = createStackNavigator();

export class LoginNavigator extends Component {
  render() {
    return (
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={({route, navigation}) => ({
          gestureEnabled: true,
          cardOverlayEnabled: true,
          headerStatusBarHeight:
            navigation.dangerouslyGetState().routes.indexOf(route) > 0
              ? 0
              : undefined,
          ...TransitionPresets.ModalPresentationIOS, // Despite the name this does exactly the same on android
        })}
        mode="modal">
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{headerTitle: 'Log Ind'}}
        />
        <Stack.Screen
          name="SchoolPicker"
          component={SchoolPicker}
          options={{
            headerShown: true,
            headerTitle: 'Vælg Skole',
            headerLeft: () => <Text />,
            headerRight: () => (
              <HeaderButtons>
                <Item
                  title="Færdig"
                  color={DefaultTheme.colors.primary}
                  onPress={() => console.log('search')}
                />
              </HeaderButtons>
            ),
          }}
        />
      </Stack.Navigator>
    );
  }
}

interface LoginScreenProps {
  lectio: LectioStore;
  theme: ThemeStore;
  navigation: NavigationProp<any>;
}

@inject('theme')
@inject('lectio')
@observer
export class LoginScreen extends Component<LoginScreenProps, {}> {

  @computed get enableLoginButton() : boolean {
    if (this.props.lectio.username.length > 3 && this.props.lectio.password.length > 3 && this.props.lectio.school != -1) {
      return true;
    } else {
      return false;
    }
  }

  async componentDidMount() {
    console.log("login");
    await this.props.lectio.GetSchoolList();

    // Check async storage to see if we are logged in
    // If we are logged in, we should redirect to homescreen, where we can check whether those login credentials are correct
    // Else we should just continue showing this screen
  }

  @computed get getSchoolName(): string {
    if(this.props.lectio.school !== -1) {
      const schoolList = this.props.lectio!.schoolList;
      const school = schoolList.filter(school => {return school.id === String(this.props.lectio.school)})[0]
      if(school != undefined)
        return school.name;
    }

    return "Vælg Skole";
  } 

  render() {
    return (
      <View style={this.styles.container}>
        <LoginField
          name="BRUGERNAVN"
          onChangeText={(text) => {
            this.props.lectio.username = text;
          }}
          value={this.props.lectio.username}
          secure={false}
          theme={this.props.theme}
        />
        <LoginField
          name="ADGANGSKODE"
          onChangeText={(text) => {
            this.props.lectio.password = text;
          }}
          value={this.props.lectio.password}
          secure={true}
        />
        <LoginField
          name="SKOLE"
          value={this.getSchoolName}
          disabled={true}
          onPress={() => {
            // We recieve the selected school through the lectioStore, which is a bit spaghetti
            this.props.navigation.navigate('SchoolPicker');
          }}
        />
        <LoginButton
          name={'Log ind'}
          disabled={!this.enableLoginButton}
          onPress={async () => {
            Keyboard.dismiss();
            const loginResponse = await this.props.lectio.login();
            if(loginResponse === 'success') {
              
              this.props.navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            }
            else
              alert(loginResponse);
          }}
          theme={this.props.theme}
        />
      </View>
    );
  }

  colors = this.props.theme.colors;
  styles = StyleSheet.create({
    container: {
      paddingTop: 15,
      justifyContent: 'center',
      paddingHorizontal: '20%',
    },
  });
}
