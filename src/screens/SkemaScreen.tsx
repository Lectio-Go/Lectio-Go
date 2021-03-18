import React, { Component, createRef, RefObject, useRef } from "react";
import { Button, ScrollView, StyleSheet, View, Text, Dimensions, Route, Alert, ViewToken } from "react-native";

import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";

import { addWeeks, getISOWeek, startOfISOWeek, addDays, getISODay, differenceInWeeks, differenceInCalendarWeeks, differenceInCalendarISOWeeks, differenceInCalendarDays, getWeek, getYear } from 'date-fns'
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { enableScreens } from "react-native-screens";
import Paging from 'react-native-infinite-swiper';

import { HentSkemaUge, Lesson, LessonState, LessonType, TimetableWeek } from 'liblectio/lib/Skema/Timetable';

import LectioStore from "../stores/LectioStore";
import ThemeStore from "../stores/ThemeStore";

import SkemaTimeStamps from "../components/skema/SkemaTimeStamps"
import WeeklySkemaPaging from "../components/skema/WeeklySkemaPaging"
import DailySkema from "../components/skema/DailySkema"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
  },
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
})

function GetDayIndex(day: Date): number {
  return differenceInCalendarDays(day, new Date(0));
}

function GetWeekIndex(date: Date): number {
  return differenceInCalendarISOWeeks(date, new Date(0));
}

function GetWeekDayIndex(date: Date): number {
  return getISODay(date) - 1;
}

function GetDateFromDayIndex(dayindex: number): Date {
  return addDays(new Date(0), dayindex);
}

function GetDateFromWeekIndex(weekIndex: number): Date {
  // TODO: Check why we need to subtract 3
  return GetDateFromDayIndex(GetDayIndex(addWeeks(new Date(0), weekIndex)) - 3)
}

function GetWeekFromDate(date: Date) {
  // TODO: Check why we need to subtract 1
  return getWeek(date, {weekStartsOn: 1}) - 1
}



interface SkemaListeProps {
  lectio: LectioStore;
  theme: ThemeStore;
}

interface SkemaListeState {
  currentDay: number;
  currentWeek: number;
  weekStartIndex: number;
  currentSkema: TimetableWeek;
}

@inject('theme')
@inject('lectio')
class SkemaListe extends Component<SkemaListeProps, SkemaListeState> {
  constructor(props: SkemaListeProps) {
    super(props)
    this.state = {
      currentDay: GetDayIndex(new Date()),
      currentWeek: GetWeekIndex(new Date()),
      weekStartIndex: GetDayIndex(startOfISOWeek(new Date())),
      currentSkema: {
        year: getYear(new Date()),
        week: GetWeekFromDate(new Date()),
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: [],
        sun: [],
        dailyMessage: [],
        moduleTimes: [],
      },
    }
  }

  prevIndex = 0;
  cachedSkemas: { weekIndex: number, skema: TimetableWeek }[] = []
  pagerRef = createRef<Paging>();

  loadSkema = async (weekIndex: number): Promise<TimetableWeek> => {
    // First we check whether a cached skema is stored
    let cachedSkemaForWeek = this.cachedSkemas.filter((skema) => {
      return skema.weekIndex == weekIndex;
    })

    if(cachedSkemaForWeek.length != 0)
      return cachedSkemaForWeek[0].skema

    // No cached skema for this week, so we fetch a new one with liblectio

    // Convert weekIndex to week number and year
    let week = GetWeekFromDate(GetDateFromWeekIndex(weekIndex));
    let year = getYear(GetDateFromWeekIndex(weekIndex));
    console.log("YEAR: " + year + ", WEEK: " + week)

    this.cachedSkemas.push({ 
      weekIndex: weekIndex, 
      skema: (await HentSkemaUge(this.props.lectio.user, this.props.lectio.requestHelper, year, week)) 
    })

    // With the new schema in place, we can call the function again
    return this.loadSkema(weekIndex)
  }

  componentDidMount = async () => {
    this.pagerRef.current.setPage(GetWeekDayIndex(new Date()));
    this.setState({currentSkema: await this.loadSkema(this.state.currentWeek)})
  }

  onNextWeek = () => {

  }

  onPrevWeek = () => {

  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <Paging style={{ height: 60 }}>
          <View style={{ flex: 1, backgroundColor: "red", }}>
            <Text>Indsæt uger her</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: "red" }}>
            <Text>dsad</Text>
          </View>
        </Paging>
        <Paging
          ref={this.pagerRef}
          style={{ flex: 1 }}
          loop
          onIndexChanged={async (index: number) => {
            if (index > this.prevIndex) {
              this.state.currentDay = this.state.currentDay + 1
            }
            if (index < this.prevIndex) {
              this.state.currentDay = this.state.currentDay - 1
            }

            if (index == 6 && this.prevIndex == 0) {
              this.state.currentWeek--
              this.setState({ currentSkema: await this.loadSkema(this.state.currentWeek) })
              console.log("Prev week")
            }

            if (index == 0 && this.prevIndex == 6) {
              this.state.currentWeek++
              this.setState({ currentSkema: await this.loadSkema(this.state.currentWeek) })
              console.log("Next week")
            }

            this.prevIndex = index;
          }}
        >
          <View style={{ flexDirection: "row" }} key="1">
            <Text style={{position: "absolute", top: -2, left: 50}}>Mandag {addDays(GetDateFromWeekIndex(this.state.currentWeek), 0).toISOString()}</Text>
            <SkemaTimeStamps start={8} end={17} />
            <DailySkema width={width} lessons={this.state.currentSkema.mon} />
          </View>
          <View style={{ flexDirection: "row" }} key="2">
            <Text style={{position: "absolute", top: -2, left: 50}}>Tirsdag {addDays(GetDateFromWeekIndex(this.state.currentWeek), 1).toISOString()}</Text>
            <SkemaTimeStamps start={8} end={17} />
            <DailySkema width={width} lessons={this.state.currentSkema.tue} />
          </View>
          <View style={{ flexDirection: "row" }} key="3">
            <Text style={{position: "absolute", top: -2, left: 50}}>Onsdag {addDays(GetDateFromWeekIndex(this.state.currentWeek), 2).toISOString()}</Text>
            <SkemaTimeStamps start={8} end={17} />
            <DailySkema width={width} lessons={this.state.currentSkema.wed} />
          </View>
          <View style={{ flexDirection: "row" }} key="4">
            <Text style={{position: "absolute", top: -2, left: 50}}>Torsdag {addDays(GetDateFromWeekIndex(this.state.currentWeek), 3).toISOString()}</Text>
            <SkemaTimeStamps start={8} end={17} />
            <DailySkema width={width} lessons={this.state.currentSkema.thu} />
          </View>
          <View style={{ flexDirection: "row" }} key="5">
            <Text style={{position: "absolute", top: -2, left: 50}}>Fredag {addDays(GetDateFromWeekIndex(this.state.currentWeek), 4).toISOString()}</Text>
            <SkemaTimeStamps start={8} end={17} />
            <DailySkema width={width} lessons={this.state.currentSkema.fri} />
          </View>
          <View style={{ flexDirection: "row" }} key="6">
            <Text style={{position: "absolute", top: -2, left: 50}}>Lørdag {addDays(GetDateFromWeekIndex(this.state.currentWeek), 5).toISOString()}</Text>
            <SkemaTimeStamps start={8} end={17} />
            <DailySkema width={width} lessons={this.state.currentSkema.sat} />
          </View>
          <View style={{ flexDirection: "row" }} key="7">
            <Text style={{position: "absolute", top: -2, left: 50}}>Søndag {addDays(GetDateFromWeekIndex(this.state.currentWeek), 6).toISOString()}</Text>
            <SkemaTimeStamps start={8} end={17} />
            <DailySkema width={width} lessons={this.state.currentSkema.sun} />
          </View>
        </Paging>
      </View>

    );
  }
}


class SkemaDetalje extends Component {
  render() {
    return (
      <Text>
        Lekti
      </Text>
    );
  }
}

enableScreens();
const Stack = createNativeStackNavigator();


export class SkemaScreen extends Component {
  render() {
    return (
      <Stack.Navigator initialRouteName="Skemaliste">
        <Stack.Screen name="Skemaliste" component={SkemaListe} options={{ title: "Skema", headerTopInsetEnabled: false }} />
        <Stack.Screen name="Skemadetalje" component={SkemaDetalje} options={{ headerTopInsetEnabled: false }} />
      </Stack.Navigator>
    )
  }

}

export default SkemaScreen;