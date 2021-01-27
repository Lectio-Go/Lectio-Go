import React, { Component } from "react";
import { Button, ScrollView, StyleSheet, Text, View, TouchableHighlight, FlatListProps, Platform, RefreshControl } from "react-native";

import { NavigationScreenProp } from 'react-navigation';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';



import { CollapsibleHeaderFlatList } from 'react-native-collapsible-header-views';
// import { ListItem, ThemeProvider } from 'react-native-elements'


import { computed, observable, observe } from 'mobx';
import { inject, observer } from 'mobx-react';

import SchoolSearchBar from '../components/Login/SchoolSearchBar';
import ThemeStore, { ThemeProps } from '../stores/ThemeStore';
import LectioStore from '../stores/LectioStore';
import { Opgave } from "liblectio/lib/Opaver/opgaver";
import { FlatList } from "react-native-gesture-handler";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Cell, Section, Separator, TableView } from "react-native-tableview-simple";

const Tab = createMaterialTopTabNavigator();

function OpgaveTabs() {
  return (
    <>
      <View style={{ marginVertical: -5 }}></View>
      <Tab.Navigator initialRouteName="Venter">
        <Tab.Screen name="Alle" component={OpgaveList} />
        <Tab.Screen name="Afleveret" component={OpgaveList} />
        <Tab.Screen name="Venter" component={OpgaveList} />
        <Tab.Screen name="Mangler" component={OpgaveList} />
      </Tab.Navigator>
    </>

  );
}

enableScreens();
const Stack = createNativeStackNavigator();


interface OpgaveListProps {
  lectio: LectioStore;
  theme: ThemeStore;
  navigation: NavigationScreenProp<any, any>;
}

@inject('theme')
@inject('lectio')
@observer
class OpgaveList extends Component<OpgaveListProps> {
  @observable refreshing = false;
  @observable taskWeeks: { week: number, opgaver: Opgave[] }[] = [];

  reloadOpgaver = () => {
    if(this.props.lectio != undefined && this.props.lectio.opgaveList != undefined) {
      let tempTaskWeeks: { week: number, opgaver: Opgave[] }[] = [];

      for(let opgave of this.props.lectio.opgaveList) {
        if(opgave.frist == undefined)
          return;
        // Get week for opgave
        let opgaveDate: Date = new Date(opgave.frist!)
        let onejan = new Date(opgaveDate.getFullYear(), 0, 1);
        let week = Math.ceil( (((opgaveDate.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7 );
  
        // Now we check whether this taskweek exists, and add it if it doesnt
        let taskWeekIndex = -1;
  
        tempTaskWeeks.forEach((taskweek, index) => {
          if(taskweek.week == week)
          taskWeekIndex = index;
        })
  
        if(taskWeekIndex == -1) {
          tempTaskWeeks.push({week: week, opgaver: []});
          taskWeekIndex = tempTaskWeeks.length - 1;
        }
  
        // Now we add the opgave to the taskweek
        tempTaskWeeks[taskWeekIndex].opgaver.push(opgave);
      }

      this.taskWeeks = tempTaskWeeks;
    }
  }

  async componentDidMount() {
    observe(this.props.lectio, ()=> {
      this.reloadOpgaver()
    })
  }

  onRefresh = async () => {
    this.refreshing = true;
    await this.props.lectio.GetOpgaver();
    this.refreshing = false;
  }

  render() {
    return (
      <ScrollView bounces={true} refreshControl={
        <RefreshControl refreshing={this.refreshing} onRefresh={this.onRefresh} />
      }>
        <TableView key={"tableview"} style={{ flex: 1, paddingHorizontal: 1 }}>
          <View key={"top margin"} style={{ marginVertical: -3 }}></View>
          {this.taskWeeks.map((taskWeek, index: number) => {
            return (
            <View key={taskWeek.week + " wrapper"}>
              <Section key={taskWeek.week + " section"} header={"Uge " + taskWeek.week}>
                {taskWeek.opgaver.map((opgave) => {
                  return (
                    <Cell key={opgave.id} title={opgave.opgavetitel} onPress={()=> {
                      this.props.navigation.navigate("Opgavedetalje")
                    }} accessory="DisclosureIndicator" />
                  )
                })}
              </Section>
              {/* Remove spacing in section */}
              {index != this.taskWeeks.length-1? <View key={taskWeek.week + " bottom margin"} style={{ marginVertical: -10 }}></View> : <View key={Math.random()*10000000}></View>}
            </View>
            )
          })}
        </TableView>
      </ScrollView>
    )
  }
}


interface OpgaveDetailProps {
  lectio: LectioStore;
  theme: ThemeStore;
  navigation: NavigationScreenProp<any, any>;
}
class OpgaveDetail extends Component<OpgaveDetailProps> {
  render() {
    return (
      <View>
        <Button title="List" onPress={() => {
          this.props.navigation.goBack();
        }}></Button>
        <Text>
          Detalje
        </Text>
      </View>
    )
  }
}

interface OpgaveScreenProps {
  lectio: LectioStore;
  theme: ThemeStore;
  navigation: NavigationScreenProp<any, any>;
}



@inject('theme')
@inject('lectio')
@observer
export class OpgaveScreen extends Component<OpgaveScreenProps> {
  @observable search = '';

  async componentDidMount() {
    await this.props.lectio.GetOpgaver();
    console.log(this.props.lectio.opgaveList)
  }

  render() {
    return (
      <Stack.Navigator initialRouteName="Opgaveliste">
        <Stack.Screen name="Opgaveliste" component={OpgaveTabs} options={{ title: "Opgaver", headerTopInsetEnabled: false }} />
        <Stack.Screen name="Opgavedetalje" component={OpgaveDetail} options={{ headerTopInsetEnabled: false }} />
      </Stack.Navigator>
    )
  }

  colors = this.props.theme.colors;
  styles = StyleSheet.create({
    scrollView: {
      backgroundColor: 'pink',
    },
    text: {
      fontSize: 42,
    },
  });
}

export default OpgaveScreen;