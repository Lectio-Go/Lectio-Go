import React, {Component, useRef} from 'react';
import {Text, TextInput, Button, View, StyleSheet, Platform} from 'react-native';

import {ISchool, GetAllSchools} from 'liblectio';

import LectioStore from '../stores/LectioStore';
import {action, computed, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import {NavigationScreenProp} from 'react-navigation';

import LoginField from '../components/LoginField';
import LoginButton from '../components/LoginButton';

import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';
import SearchBar from 'react-native-search-bar';

import {
  HeaderButtons,
  HeaderButton,
  Item,
} from 'react-navigation-header-buttons';
import {DefaultTheme} from '@react-navigation/native';

import { CollapsibleHeaderFlatList } from 'react-native-collapsible-header-views';
import { SchoolPicker } from '../components/SchoolPicker';

const Stack = createStackNavigator();


export class LoginNavigator extends Component {
  render() {
    return (
      <Stack.Navigator
        initialRouteName="Home"
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
          name="Home"
          component={LoginScreen}
          options={{headerTitle: 'Log Ind'}}
        />
        <Stack.Screen
          name="Picker"
          component={SchoolPicker}
          options={{
            headerShown: true,
            headerTitle: 'Vælg Skole',
            headerLeft: () => <Text />,
            headerRight: () => (
              <HeaderButtons>
                <Item
                  title="Done"
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
  navigation: NavigationScreenProp<any, any>;
}

@inject('lectio')
@observer
export class LoginScreen extends Component<LoginScreenProps, {}> {
  @observable username = '';
  @observable password = '';
  @observable schoolList: ISchool[] = [];

  @computed get enableLoginButton(): boolean {
    if (this.username.length > 3 && this.password.length > 3) {
      return true;
    } else {
      return false;
    }
  }

  async componentDidMount() {
    this.schoolList = await GetAllSchools();
    // Check async storage to see if we are logged in
    // If we are logged in, we should redirect to homescreen, where we can check whether those login credentials are correct
    // Else we should just continue showing this screen
  }

  render() {
    return (
      <View style={this.styles.container}>
        <LoginField
          name="BRUGERNAVN"
          onChangeText={(text) => {
            this.username = text;
          }}
          value={this.username}
          secure={false}
          theme={this.props.lectio.colors}
        />
        <LoginField
          name="ADGANGSKODE"
          onChangeText={(text) => {
            this.password = text;
          }}
          value={this.password}
          secure={true}
          theme={this.props.lectio.colors}
        />
        <LoginButton
          name={'Log ind'}
          disabled={!this.enableLoginButton}
          theme={this.props.lectio.colors}
          onPress={() => {
            console.log('Log ind');
          }}
        />
        <Button
          title={'Open Picker'}
          onPress={() => {
            this.props.navigation.navigate('Picker');
          }}
        />
      </View>
    );
  }

  // Declared here for dynamic theming, there might be an easier way
  colors = this.props.lectio.colors.colors;
  styles = StyleSheet.create({
    container: {
      paddingTop: 12,
      justifyContent: 'center',
      paddingHorizontal: '20%',
    },
  });
}
