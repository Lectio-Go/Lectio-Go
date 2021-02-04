import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component, createRef, RefObject, useRef } from "react";
import { Button, ScrollView, StyleSheet, View, Text, Dimensions, Route, Alert } from "react-native";
import { FlatList, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import DailySkema from "../components/skema/DailySkema"
import LectioStore from "../stores/LectioStore";
import ThemeStore from "../stores/ThemeStore";
import WeeklySkemaPaging from "../components/skema/WeeklySkemaPaging"
import SkemaTimeStamps from "../components/skema/SkemaTimeStamps"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { addWeeks, getISOWeek, startOfWeek, addDays } from 'date-fns'
import ViewPagerAdapter from 'react-native-tab-view-viewpager-adapter';
import ViewPager from "@react-native-community/viewpager";
import moment from 'moment'
import { HentSkemaUge, Lesson, TimetableWeek } from 'liblectio/lib/Skema/Timetable';

const { width } = Dimensions.get('window');

interface SkemaScreenProps {
  lectio: LectioStore;
  theme: ThemeStore
}

const weekTab = createMaterialTopTabNavigator();



@inject('theme')
@inject('lectio')
@observer
export class SkemaScreen extends Component<SkemaScreenProps> {

  @observable skemaUger: TimetableWeek[] = [];



async componentDidMount() {

    let now = new Date();
    
    this.skemaUger.push(await HentSkemaUge(this.props.lectio.user, this.props.lectio.requestHelper, now.getFullYear(), getISOWeek(now)));
  }


  render() {
    return (
      <>
        <ScrollView
        horizontal
        pagingEnabled
        >
              {this.skemaUger.map((skemaUge, i) => (
                <>
                  <View style={{ flexDirection: "row" }} >
                    <SkemaTimeStamps start={8} end={17} />
                    <DailySkema lessons={skemaUge.mon} width={width} />
                  </View>
                  <View style={{ flexDirection: "row" }} >
                    <SkemaTimeStamps start={8} end={17} />
                    <DailySkema lessons={skemaUge.tue} width={width} />
                  </View>
                  <View style={{ flexDirection: "row" }} >
                    <SkemaTimeStamps start={8} end={17} />
                    <DailySkema lessons={skemaUge.wed} width={width} />
                  </View>
                  <View style={{ flexDirection: "row" }} >
                    <SkemaTimeStamps start={8} end={17} />
                    <DailySkema lessons={skemaUge.thu} width={width} />
                  </View>
                  <View style={{ flexDirection: "row" }} >
                    <SkemaTimeStamps start={8} end={17} />
                    <DailySkema lessons={skemaUge.fri} width={width} />
                  </View>
                  <View style={{ flexDirection: "row" }} >
                    <SkemaTimeStamps start={8} end={17} />
                    <DailySkema lessons={skemaUge.sat} width={width} />
                  </View>
                  <View style={{ flexDirection: "row" }} >
                    <SkemaTimeStamps start={8} end={17} />
                    <DailySkema lessons={skemaUge.sun} width={width} />
                  </View>
                </>
              ))}
        </ScrollView>



      </>
    )
  }

}

export default SkemaScreen;