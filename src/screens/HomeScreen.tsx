import React, {Component} from 'react';
import {Alert, Text, View} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { action, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import LectioStore from '../stores/LectioStore';
import { SkemaScreen } from './SkemaScreen';
import OpgaveScreen from './OpgaveScreen';
import Icon from "react-native-vector-icons/Ionicons";
import { BorderlessButton } from 'react-native-gesture-handler';


const Tab = createBottomTabNavigator();


export class LektieScreen extends Component {
  render() {
    return (
      <Text>
        Lekti
      </Text>
    );
  }
}


@inject('lectio')
export class HomeScreen extends Component<{lectio: LectioStore}> {
  async componentDidMount() {
    // First we should check if the login credentials we are given are correct
    await this.props.lectio.login();

  }

  render() {
    return (
      <Tab.Navigator tabBarOptions={{showLabel: true, showIcon: true}}>
        <Tab.Screen name="Skema" component={SkemaScreen} options={{tabBarIcon: () => <Icon size={20} name={"calendar-sharp"} color={"white"}/>}} />
        <Tab.Screen name="Lektie" component={LektieScreen} />
        <Tab.Screen name="Opgaver" component={OpgaveScreen} />
      </Tab.Navigator>
    );
  }
}

export default HomeScreen;
