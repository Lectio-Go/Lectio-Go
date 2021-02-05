import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component, createRef, RefObject, useRef } from "react";
import { Button, ScrollView, StyleSheet, View, Text, Dimensions, Route } from "react-native";
import { FlatList, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import DailySkema from "../components/skema/DailySkema"
import Lesson from "liblectio/lib/Skema/Timetable"
import LectioStore from "../stores/LectioStore";
import ThemeStore from "../stores/ThemeStore";
import WeeklySkemaPaging from "../components/skema/WeeklySkemaPaging"
import SkemaTimeStamps from "../components/skema/SkemaTimeStamps"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { addWeeks, getISOWeek, startOfWeek } from 'date-fns'
import ViewPagerAdapter from 'react-native-tab-view-viewpager-adapter';
import ViewPager from "@react-native-community/viewpager";
import CalendarStrip from 'react-native-calendar-strip'

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
  weekSkema: Lesson.Lesson[][] = [[], [], [], [], [], [], []];
  @observable weeks: Date[] = [];
  @observable year: number = 0;
  @observable pageIndex: number = 0;
  @observable mondayDate: number = 0;

  async componentDidMount() {
    //console.log(this.props.lectio.password)
    // Here we should fetch the timetable
    this.pageIndex = new Date().getDay() - 1;

    if (this.pageIndex < 0) {
      this.pageIndex = 6;
    }



    let now = new Date();
    let onejan = new Date(now.getFullYear(), 0, 1);
    this.weeks = [addWeeks(now, -1), now, addWeeks(now, 1)];
    this.year = now.getFullYear();
  }

  updateWeekList(index: number) {
    if (index <= 0)
      this.weeks.unshift(addWeeks(this.weeks[0], -1));
    else if (index >= this.weeks.length - 1)
      this.weeks.push(addWeeks(this.weeks[this.weeks.length - 1], 1));
  }

  render() {
    return (
      <>

        {this.year == 0 || this.weeks.length < 2 ? <></> :

           <weekTab.Navigator
             pager={props => <ViewPagerAdapter {...props} onIndexChange={(index) => this.updateWeekList(index)} />}
             initialLayout={{ width: width }}
             initialRouteName={String(getISOWeek(new Date()))}
             tabBarOptions={{style: {height: 0}}}
             >
             {this.weeks.map((week, i) => {
               return <weekTab.Screen key={String(getISOWeek(week))} name={String(getISOWeek(week))} children={() => <WeeklySkemaPaging pageIndex={this.pageIndex} week={getISOWeek(week)} year={week.getFullYear()} />} />
             })}
           </weekTab.Navigator>


        }
      </>
    )
  }

}

export default SkemaScreen;