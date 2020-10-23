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

const Stack = createStackNavigator();

@observer
export default class App extends Component {

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
                <Stack.Navigator initialRouteName={stores.lectio.isLoggedIn()? "Home" : "Login"}>
                  <Stack.Screen name="Home" component={HomeScreen} />
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
