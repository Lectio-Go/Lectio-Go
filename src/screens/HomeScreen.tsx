import React, {Component} from 'react';
import {Text, View} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export class SkemaScreen extends Component {
  render() {
    return (
      <Text>
        Skema
      </Text>
    );
  }
}

export class LektieScreen extends Component {
  render() {
    return (
      <Text>
        Lektie
      </Text>
    );
  }
}

export class HomeScreen extends Component {
  render() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Skema" component={SkemaScreen} />
        <Tab.Screen name="Lektie" component={LektieScreen} />
      </Tab.Navigator>
    );
  }
}

export default HomeScreen;
