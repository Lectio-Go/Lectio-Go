import React, { Component } from "react";
import { Button, ScrollView, StyleSheet, Text, View, TouchableHighlight, FlatListProps, Platform, RefreshControl, OpaqueColorValue } from "react-native";

import { NavigationParams, NavigationScreenProp } from 'react-navigation';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { format, differenceInCalendarWeeks } from 'date-fns';
import da from 'date-fns/locale/da'

import { computed, observable, observe } from 'mobx';
import { inject, observer } from 'mobx-react';

import SchoolSearchBar from '../components/Login/SchoolSearchBar';
import ThemeStore, { ThemeProps } from '../stores/ThemeStore';
import LectioStore from '../stores/LectioStore';
import { detailedOpgaver, Opgave } from "liblectio/lib/Opaver/opgaver";
import { FlatList } from "react-native-gesture-handler";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Cell, Section, Separator, TableView } from "react-native-tableview-simple";
import { Icon } from "native-base";

const Tab = createMaterialTopTabNavigator();

function OpgaveTabs() {
  return (
    <>
      <View style={{ marginVertical: -5 }}></View>
      <Tab.Navigator initialRouteName="Venter" tabBarOptions={{ upperCaseLabel: false, labelStyle: { fontSize: 15, fontWeight: "normal", textTransform: "none" } }}>
        <Tab.Screen name="Alle" component={OpgaveList} options={{ tabBarOptions: { upperCaseLabel: false } }} />
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

function getArrowColor(end: Date) {
  // Under 2 dage: Rød
  // Mellem 2 og 5 dage: Orange
  // Mellem 5 og 14 dage: Gul
  // Over 14 dage: ingen farve
  let diff = end.getTime() - new Date().getTime();
  let days = diff / 24 / 60 / 60 / 1000;

  if (days < 2)
    return "red"
  else if (days < 5)
    return "#ff8800";
  else if (days < 14)
    return "#ffbf00";
  else
    return "";
}

function prettyDate(mydate: Date) {
  return format(mydate, "d'.' MMMM Y 'kl.' HH'.'mm", { locale: da });
}

function getFormattedDuration(start: Date, end: Date): string {
  // Under 1 time:              57 minutter og 47 sekunder
  // Mellem 1 time og 24 timer: 14 timer og 7 minutter
  // Mellem 1 dag og 14 dage:   6 dage og 7 timer
  // Over 14 dage:              7. marts 2021 kl. 23.30

  let diff = end.getTime() - start.getTime();
  let days = Math.floor(diff / 24 / 60 / 60 / 1000);
  let hours = Math.floor((diff - days * 24 * 60 * 60 * 1000) / 60 / 60 / 1000);
  let minutes = Math.floor((diff - days * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000) / 60 / 1000);
  let seconds = Math.floor((diff - days * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000 - minutes * 60 * 1000) / 1000);

  if (days >= 14 || diff < 0) {
    // 7. marts 2021 kl. 23.30
    return prettyDate(end);
  } else {
    let datearray = [];

    if (days >= 1) {
      minutes = 0;
      seconds = 0;
    } else if (hours >= 1) {
      seconds = 0;
    }

    if (days != 0)
      datearray.push(days + " " + (days == 1 ? "dag" : "dage"));
    if (hours != 0)
      datearray.push(hours + " " + (hours == 1 ? "time" : "timer"));
    if (minutes != 0)
      datearray.push(minutes + " " + (minutes == 1 ? "minut" : "minutter"));
    if (seconds != 0)
      datearray.push(seconds + " " + (seconds == 1 ? "sekund" : "sekunder"));

    return datearray.join(" og ");
  }
}

@inject('theme')
@inject('lectio')
@observer
class OpgaveList extends Component<OpgaveListProps> {
  @observable refreshing = false;
  @observable taskWeeks: { week: number, elevtimer: number, opgaver: Opgave[] }[] = [];

  constructor(props: OpgaveListProps) {
    super(props);
    // this.props.navigation.setOptions(() => { title: 'Updated!' })
  }

  reloadOpgaver = () => {
    if (this.props.lectio != undefined && this.props.lectio.opgaveList != undefined) {
      let tempTaskWeeks: { week: number, elevtimer: number, opgaver: Opgave[] }[] = [];

      for (let opgave of this.props.lectio.opgaveList) {
        if (opgave.frist == undefined || new Date(opgave.frist!).getTime() < Date.now())
          continue;
        // Get week for opgave
        let opgaveDate: Date = new Date(opgave.frist!)
        let onejan = new Date(opgaveDate.getFullYear(), 0, 1);

        let week = differenceInCalendarWeeks(opgaveDate, onejan);

        // Now we check whether this taskweek exists, and add it if it doesnt
        let taskWeekIndex = -1;

        tempTaskWeeks.forEach((taskweek, index) => {
          if (taskweek.week == week)
            taskWeekIndex = index;
        })

        if (taskWeekIndex == -1) {
          tempTaskWeeks.push({ week: week, elevtimer: 0, opgaver: [] });
          taskWeekIndex = tempTaskWeeks.length - 1;
        }

        // Now we add the opgave to the taskweek
        tempTaskWeeks[taskWeekIndex].opgaver.push(opgave);
        tempTaskWeeks[taskWeekIndex].elevtimer += Number(opgave.elevtid?.replace(',', '.'));
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
      <ScrollView style={{ backgroundColor: this.props.theme.colors.background }} bounces={true} refreshControl={
        <RefreshControl refreshing={this.refreshing} onRefresh={this.onRefresh} />
      }>
        <TableView key={"tableview"} style={{ flex: 1, paddingHorizontal: 1 }}>
          <View key={"top margin"} style={{ marginVertical: -3 }}></View>
          {this.taskWeeks.map((taskWeek, index: number) => {
            return (
              <View key={taskWeek.week + " wrapper"} style={{ marginHorizontal: 5 }}>
                <Section key={taskWeek.week + " section"}
                  headerComponent={(
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", padding: 2 }}>
                      <Text style={{ color: "#aaaaaa", fontWeight: "bold" }}>{"Uge " + taskWeek.week} </Text>
                      <Text style={{ color: "#aaaaaa" }}>{taskWeek.elevtimer} elevtime{taskWeek.elevtimer == 1 ? "" : "r"}</Text>
                    </View>)}
                  roundedCorners={true} hideSurroundingSeparators={true}>
                  {taskWeek.opgaver.map((opgave) => {
                    return (
                      <Cell key={opgave.id} cellStyle="Subtitle" title={opgave.opgavetitel} detail={opgave.hold + ", " + getFormattedDuration(new Date(), new Date(opgave.frist!))} onPress={() => {
                        this.props.navigation.navigate("Opgavedetalje", { opgave: opgave })
                      }} accessory="DisclosureIndicator" accessoryColorDisclosureIndicator={getArrowColor(new Date(opgave.frist!))} />
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

@inject('lectio')
@inject('theme')
@observer
class OpgaveDetail extends Component<OpgaveDetailProps> {
  @observable opgave = this.props.route.params.opgave as Opgave;

  async componentDidMount() {
    console.log(JSON.stringify(this.props.theme, null, 4))
    Object.assign(this.opgave, await detailedOpgaver(this.props.lectio.user, this.props.lectio.requestHelper, this.opgave.id!))
  }

  render() {
    return (
      <ScrollView>
        <TableView>
          <Section header="INFO OM OPGAVEN">
            <Cell title="Hold" cellAccessoryView={<Text style={this.style.subtitle}>{this.opgave.hold}</Text>} ></Cell>
            <Cell title="Ansvarlig" cellAccessoryView={<Text style={this.style.subtitle}></Text>}></Cell>
            <Cell title="Frist" cellAccessoryView={<Text style={this.style.subtitle}>{prettyDate(new Date(this.opgave.frist!))}</Text>} ></Cell>
            <Cell title="Elevtid" cellAccessoryView={<Text style={this.style.subtitle}>{this.opgave.elevtid}</Text>} ></Cell>
            <Cell title="Status" cellAccessoryView={<Text style={this.style.subtitle}>{this.opgave.status}</Text>} ></Cell>
            {this.opgave.opgavenote == "" ? <></> :
              <Cell title="Opgavenote" cellStyle="Subtitle" cellContentView={
                <View style={{ paddingVertical: 3 }}>
                  <Text style={this.style.title}>Opgavenote</Text>
                  <Text style={this.style.detail}>{this.opgave.opgavenote}</Text>
                </View>}>
              </Cell>}
            <Cell title="Afventer" cellAccessoryView={<Text style={this.style.subtitle}>{this.opgave.afventer}</Text>} ></Cell>
            <Cell title="Karakterskala" cellAccessoryView={<Text style={this.style.subtitle}></Text>} ></Cell>
          </Section>
          <View style={{ marginVertical: -6 }}></View>
          <Section header="OPGAVEBESKRIVELSER">
            <Cell title="Yeet" ></Cell>
          </Section>
          <View style={{ marginVertical: -6 }}></View>
          <Section header="OPGAVEINDLÆG">
            <Cell title="Yeet" ></Cell>
          </Section>
        </TableView>
      </ScrollView>
    )
  }

  style = StyleSheet.create({
    title: {
      fontSize: 16,
      letterSpacing: -0.32,
      flexGrow: 1,
    },
    detail: {
      color: this.props.theme.colors.greyText,
      fontSize: 12
    }
    ,
    subtitle: {
      color: this.props.theme.colors.greyText,
    }
  });
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
        <Stack.Screen name="Opgaveliste" component={OpgaveTabs} options={{ title: "Opgaver", headerTopInsetEnabled: false }} />
        <Stack.Screen name="Opgavedetalje" component={OpgaveDetail} options={{ headerTopInsetEnabled: false }} />
      </Stack.Navigator>
    )
  }
}

export default OpgaveScreen;