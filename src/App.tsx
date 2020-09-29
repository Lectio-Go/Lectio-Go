/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */

import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  StatusBar,
  NativeModules,
  Button,
} from 'react-native';

import {
  AuthenticatedUser,
  IRequestBody,
  IAuthenticationResponse,
  GetDetailedLessonInfo,
  GetBriefTimetable,
} from 'liblectio';

//@ts-ignore
const {RNAuthLibLectio} = NativeModules;

function authRequest(
  url: string,
  body: IRequestBody,
  cookies: string,
): Promise<IAuthenticationResponse> {
  return new Promise((resolve, _reject) => {
    RNAuthLibLectio.doRequest(
      url,
      body,
      cookies,
      (response: string, responsecookies: string) => {
        resolve({text: response, cookies: responsecookies});
      },
    );
  });
}

interface Props {}

interface State {
  user: AuthenticatedUser;
  username: string;
  password: string;
  schoolID: string;
  outText: string;
}

export default class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      user: new AuthenticatedUser('', '', ''),
      username: '',
      password: '',
      schoolID: '165',
      outText: '',
    };
  }

  onLogin = async () => {
    let user = new AuthenticatedUser(
      this.state.username,
      this.state.password,
      this.state.schoolID,
    );

    user
      .Authenticate(authRequest)
      .then(async () => {
        GetBriefTimetable(user, 2020, 40)
          .catch((error) => console.log('ERROR:' + error))
          .then((result) => {
            this.setState({
              outText: JSON.stringify(result, null, 2),
            });
          });
      })
      .catch((error) => {
        console.log(`ERROR: ${error}`);
      });
  };

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              paddingTop: 100,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 10,
            }}>
            <Text>Username: </Text>
            <TextInput
              style={{
                height: 40,
                width: 100,
                borderColor: 'gray',
                borderWidth: 1,
              }}
              onChangeText={(text) => this.setState({username: text})}
              value={this.state.username}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 10,
            }}>
            <Text>Password: </Text>
            <TextInput
              style={{
                height: 40,
                width: 100,
                borderColor: 'gray',
                borderWidth: 1,
              }}
              secureTextEntry={true}
              onChangeText={(text) => this.setState({password: text})}
              value={this.state.password}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>Skole ID: </Text>
            <TextInput
              style={{
                height: 40,
                width: 100,
                borderColor: 'gray',
                borderWidth: 1,
              }}
              onChangeText={(text) => this.setState({schoolID: text})}
              value={this.state.schoolID}
            />
          </View>

          <Button title="Login" onPress={this.onLogin}></Button>

          <ScrollView style={{height: 200, paddingTop: 50}}>
            <Text>{this.state.outText}</Text>
          </ScrollView>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: 'white',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: 'grey',
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: 'grey',
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
