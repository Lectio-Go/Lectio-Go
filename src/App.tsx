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
import {Provider} from 'mobx-react';
import stores from './stores';

// Screens
import HomeScreen from './screens/HomeScreen';
import {LoginNavigator} from './screens/LoginScreen';
import {OverflowMenuProvider} from 'react-navigation-header-buttons';

const Stack = createStackNavigator();

export default class App extends Component {
  render() {
    return (
      <SafeAreaProvider>
        <AppearanceProvider>
          <Provider {...stores}>
            <NavigationContainer
              theme={
                stores.lectio.colorscheme === 'dark' ? DarkTheme : DefaultTheme
              }>
              <OverflowMenuProvider>
                <Stack.Navigator initialRouteName="Login">
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

// import React, {Component} from 'react';
// import {
//   StyleSheet,
//   ScrollView,
//   View,
//   Text,
//   TextInput,
//   StatusBar,
//   Button,
// } from 'react-native';

// import {
//   AuthenticatedUser,
//   IRequestBody,
//   IAuthenticationResponse,
//   GetDetailedLessonInfo,
//   GetBriefTimetable,
// } from 'liblectio';

// import {RNRequest} from './RNLectioRequest'

// interface Props {}

// interface State {
//   user: AuthenticatedUser;
//   username: string;
//   password: string;
//   schoolID: string;
//   outText: string;
// }

// let requestHelper: RNRequest = new RNRequest();

// import {NativeModules} from 'react-native';

// export default class App extends Component<Props, State> {
//   constructor(props: Props) {
//     super(props);

//     this.state = {
//       user: new AuthenticatedUser('', '', ''),
//       username: '',
//       password: '',
//       schoolID: '165',
//       outText: '',
//     };
//   }

//   onLogin = async () => {
//     let user = new AuthenticatedUser(
//       this.state.username,
//       this.state.password,
//       this.state.schoolID,
//     );

//     try {
//       await user.Authenticate(requestHelper);
//       let result = await GetBriefTimetable(user, requestHelper, 2020, 40);
//       this.setState({
//         outText: JSON.stringify(result, null, 2),
//       });
//     } catch (error) {
//       console.log(`ERROR: ${error}`);
//     }
//   };

//   render() {
//     return (
//       <>
//         <StatusBar barStyle="dark-content" />
//         <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
//           <View
//             style={{
//               paddingTop: 100,
//               flexDirection: 'row',
//               justifyContent: 'center',
//               alignItems: 'center',
//               paddingBottom: 10,
//             }}>
//             <Text>Username: </Text>
//             <TextInput
//               style={{
//                 height: 40,
//                 width: 100,
//                 borderColor: 'gray',
//                 borderWidth: 1,
//               }}
//               onChangeText={(text) => this.setState({username: text})}
//               value={this.state.username}
//             />
//           </View>

//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'center',
//               alignItems: 'center',
//               paddingBottom: 10,
//             }}>
//             <Text>Password: </Text>
//             <TextInput
//               style={{
//                 height: 40,
//                 width: 100,
//                 borderColor: 'gray',
//                 borderWidth: 1,
//               }}
//               secureTextEntry={true}
//               onChangeText={(text) => this.setState({password: text})}
//               value={this.state.password}
//             />
//           </View>

//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//             <Text>Skole ID: </Text>
//             <TextInput
//               style={{
//                 height: 40,
//                 width: 100,
//                 borderColor: 'gray',
//                 borderWidth: 1,
//               }}
//               onChangeText={(text) => this.setState({schoolID: text})}
//               value={this.state.schoolID}
//             />
//           </View>

//           <Button title="Login" onPress={this.onLogin}></Button>

//           <ScrollView style={{height: 200, paddingTop: 50}}>
//             <Text>{this.state.outText}</Text>
//           </ScrollView>
//         </View>
//       </>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: 'white',
//   },
//   engine: {
//     position: 'absolute',
//     right: 0,
//   },
//   body: {
//     backgroundColor: 'white',
//   },
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: 'black',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//     color: 'grey',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
//   footer: {
//     color: 'grey',
//     fontSize: 12,
//     fontWeight: '600',
//     padding: 4,
//     paddingRight: 12,
//     textAlign: 'right',
//   },
// });
