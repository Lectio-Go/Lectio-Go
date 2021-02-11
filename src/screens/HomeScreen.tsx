import React, {Component} from 'react';
import {Alert, Text, View} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { action, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import LectioStore from '../stores/LectioStore';
import { SkemaScreen } from './SkemaScreen';
import OpgaveScreen from './OpgaveScreen';
import { UploadDocument } from 'liblectio';


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


@inject('lectio')
export class HomeScreen extends Component<{lectio: LectioStore}> {
  async componentDidMount() {
    // First we should check if the login credentials we are given are correct
    await this.props.lectio.user.Authenticate(this.props.lectio.requestHelper);
    // await UploadDocument(this.props.lectio.user, this.props.lectio.requestHelper, "S31487804135_FS45421176491_", "myfile.txt", "ZGFzZHNhZGFzZGE=");
    console.log((await this.props.lectio.requestHelper.DownloadLectio("https://www.lectio.dk/lectio/165/dokumenthent.aspx?documentid=46026311581")).data)
  
  }

  render() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Skema" component={SkemaScreen} />
        <Tab.Screen name="Lektie" component={LektieScreen} />
        <Tab.Screen name="Opgaver" component={OpgaveScreen} />
      </Tab.Navigator>
    );
  }
}

export default HomeScreen;
