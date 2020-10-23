import React, {Component} from 'react';
import {Alert, Text, View} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { action, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import LectioStore from '../stores/LectioStore';

const Tab = createBottomTabNavigator();

@inject('lectio')
@observer
export class SkemaScreen extends Component<{lectio: LectioStore}> {
  @observable text = "";

  async componentDidMount() {
    // Here we should fetch the timetable
    try {
      await this.props.lectio.GetBriefLessonList(2020, 43);
    } catch (error) {
      alert("ERROR: " + error)
    }
  }

  render() {
    return (
      <Text>
        {this.text}
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


@inject('lectio')
export class HomeScreen extends Component<{lectio: LectioStore}> {
  async componentDidMount() {
    // First we should check if the login credentials we are given are correct
    
  }

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
