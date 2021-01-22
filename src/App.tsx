import React, {Component} from 'react';

// Used for iphone X notch
import {SafeAreaProvider} from 'react-native-safe-area-context';

// React navigation
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// Themes
import {AppearanceProvider} from 'react-native-appearance';

// State managment
import {observer, Provider} from 'mobx-react';
import stores from './stores';

// Screens
import HomeScreen from './screens/HomeScreen';
import {LoginNavigator} from './screens/LoginScreen';
import {OverflowMenuProvider} from 'react-navigation-header-buttons';
import { observable } from 'mobx';

const Stack = createStackNavigator();

@observer
export default class App extends Component {
  @observable initialScreen = "";

  async componentDidMount() {
    this.initialScreen = (await stores.lectio.isLoggedIn())? "Home" : "Login"
  }

  render() {
    return (
      <SafeAreaProvider>
        <AppearanceProvider>
          <Provider {...stores}>
            <NavigationContainer
              theme={
                stores.theme.colorscheme === 'dark' ? DarkTheme : DefaultTheme
              }>
              <OverflowMenuProvider>
                <Stack.Navigator initialRouteName={this.initialScreen}>
                  <Stack.Screen name="Home" component={HomeScreen} options={{title: "Skema"}}/>
                  <Stack.Screen
                    name="Login"
                    component={LoginNavigator}
                    options={{headerShown: false}}
                  />
                </Stack.Navigator>
              </OverflowMenuProvider>
            </NavigationContainer>
          </Provider>
        </AppearanceProvider>
      </SafeAreaProvider>
    );
  }
}
