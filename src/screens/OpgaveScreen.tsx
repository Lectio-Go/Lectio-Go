import React, { Component } from "react";
import { Button, ScrollView, StyleSheet, Text, View, TouchableHighlight, FlatListProps, Platform, RefreshControl } from "react-native";

import { NavigationParams, NavigationScreenProp } from 'react-navigation';
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
import { Icon } from "native-base";

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
    if (this.props.lectio != undefined && this.props.lectio.opgaveList != undefined) {
      let tempTaskWeeks: { week: number, opgaver: Opgave[] }[] = [];

      for (let opgave of this.props.lectio.opgaveList) {
        if (opgave.frist == undefined)
          return;
        // Get week for opgave
        let opgaveDate: Date = new Date(opgave.frist!)
        let onejan = new Date(opgaveDate.getFullYear(), 0, 1);
        let week = Math.ceil((((opgaveDate.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);

        // Now we check whether this taskweek exists, and add it if it doesnt
        let taskWeekIndex = -1;

        tempTaskWeeks.forEach((taskweek, index) => {
          if (taskweek.week == week)
            taskWeekIndex = index;
        })

        if (taskWeekIndex == -1) {
          tempTaskWeeks.push({ week: week, opgaver: [] });
          taskWeekIndex = tempTaskWeeks.length - 1;
        }

        // Now we add the opgave to the taskweek
        tempTaskWeeks[taskWeekIndex].opgaver.push(opgave);
      }

      this.taskWeeks = tempTaskWeeks;
    }
  }

  async componentDidMount() {
    observe(this.props.lectio, () => {
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
      <ScrollView style={{backgroundColor: this.props.theme.colors.background}} bounces={true} refreshControl={
        <RefreshControl refreshing={this.refreshing} onRefresh={this.onRefresh} />
      }>
        <TableView key={"tableview"} style={{ flex: 1, paddingHorizontal: 1 }} customAppearances={{background: "red"}}>
          <View key={"top margin"} style={{ marginVertical: -3 }}></View>
          {this.taskWeeks.map((taskWeek, index: number) => {
            return (
              <View key={taskWeek.week + " wrapper"} style={{marginHorizontal: 5}}>
                <Section key={taskWeek.week + " section"} header={"Uge " + taskWeek.week} roundedCorners={true} hideSurroundingSeparators={true}>
                  {taskWeek.opgaver.map((opgave) => {
                    return (
                      <Cell key={opgave.id} title={opgave.opgavetitel} onPress={() => {
                        this.props.navigation.navigate("Opgavedetalje", { name: opgave.opgavetitel })
                      }} accessory="DisclosureIndicator" />
                    )
                  })}
                </Section>
                {/* Remove spacing in section */}
                {index != this.taskWeeks.length - 1 ? <View key={taskWeek.week + " bottom margin"} style={{ marginVertical: -10 }}></View> : <View key={Math.random() * 10000000}></View>}
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
  route: NavigationParams;
}

@inject('theme')
class OpgaveDetail extends Component<OpgaveDetailProps> {
  render() {
    return (
      <TableView>
        <Section header="INFO OM OPGAVEN">
          <Cell title="Hold" cellAccessoryView={<Text style={{color: this.props.theme.colors.skemaRubrik}}>{this.props.route.params.name}</Text>} ></Cell>
          <Cell title="Ansvarlig" ></Cell>
          <Cell title="Frist" ></Cell>
          <Cell title="Elevtid" ></Cell>
          <Cell title="Status" ></Cell>
          <Cell title="Opgavenote" ></Cell>
          <Cell title="Afventer" ></Cell>
          <Cell title="Karakterskala" ></Cell>
        </Section>
        <View style={{ marginVertical: -6 }}></View>
        <Section header="OPGAVEBESKRIVELSER">
          <Cell title="Yeet" ></Cell>
        </Section>
        <View style={{ marginVertical: -6 }}></View>
        <Section header="OPGAVEINDLÆG">
          <Cell title="Yeet" ></Cell>
        </Section>

{/*         
        <Text style={{ color: this.props.theme.colors.text }}>
          {this.props.route.params.name}
        </Text>
        <View style={{ marginVertical: 130 }}></View>
        <Button title="Aflever" onPress={() => {
          this.props.navigation.goBack();
        }}></Button> */}

      </TableView>
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
  async componentDidMount() {
    await this.props.lectio.GetOpgaver();
  }

  render() {
    return (
      <Stack.Navigator initialRouteName="Opgaveliste">
        <Stack.Screen name="Opgaveliste" component={OpgaveTabs} options={{ title: "Opgaver", headerTopInsetEnabled: false, headerTranslucent: true }} />
        <Stack.Screen name="Opgavedetalje" component={OpgaveDetail} options={{ headerTopInsetEnabled: false , headerTranslucent: true}} />
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