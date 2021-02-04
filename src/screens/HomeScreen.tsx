import React, { Component } from 'react';
import { Alert, StatusBar, Text, View } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { action, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import LectioStore from '../stores/LectioStore';
import ThemeStore from '../stores/ThemeStore';
import { SkemaScreen } from './SkemaScreen';
import OpgaveScreen from './OpgaveScreen';
import Icon from "react-native-vector-icons/Ionicons";
import { BorderlessButton } from 'react-native-gesture-handler';


const Tab = createBottomTabNavigator();


export class LektieScreen extends Component {
  render() {
    return (
      <Text>
        Lektie
      </Text>
    );
  }
}

@inject('theme')
@inject('lectio')
export class HomeScreen extends Component<{ lectio: LectioStore; theme?: ThemeStore }> {
  async componentDidMount() {
    // First we should check if the login credentials we are given are correct

  }

  render() {
    return (
      <>
        <View>
          <StatusBar 
            backgroundColor={this.props.theme?.colors.background}
          />
        </View>
        <Tab.Navigator >
          <Tab.Screen name="Skema" component={SkemaScreen} />
          <Tab.Screen name="Lektie" component={LektieScreen} />
          <Tab.Screen name="Opgaver" component={OpgaveScreen} />
        </Tab.Navigator>
      </>


    );
  }
}

export default HomeScreen;
