import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component, createRef, RefObject, useRef } from "react";
import { Button, ScrollView, StyleSheet, View, Text, Dimensions, Route, Alert, ViewToken } from "react-native";
import { FlatList, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import DailySkema from "../components/skema/DailySkema"
import LectioStore from "../stores/LectioStore";
import ThemeStore from "../stores/ThemeStore";
import WeeklySkemaPaging from "../components/skema/WeeklySkemaPaging"
import SkemaTimeStamps from "../components/skema/SkemaTimeStamps"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { addWeeks, getISOWeek, startOfISOWeek, addDays, getISODay } from 'date-fns'
import ViewPagerAdapter from 'react-native-tab-view-viewpager-adapter';
import ViewPager from "@react-native-community/viewpager";
import moment from 'moment'
import { HentSkemaUge, Lesson, TimetableWeek } from 'liblectio/lib/Skema/Timetable';
import { v4 as uuidv4 } from 'uuid';

const { width } = Dimensions.get('window');

interface SkemaScreenProps {
  lectio: LectioStore;
  theme: ThemeStore
}

interface DATA {
  lessons: Lesson[];
  id: string;
}


@inject('theme')
@inject('lectio')
@observer
export class SkemaScreen extends Component<SkemaScreenProps> {

  skemaUger: TimetableWeek[] = [];
  @observable Data: DATA[] = [];

  renderItem = ({ item }: { item: DATA }) => (
    <View style={{ flexDirection: "row" }} key={item.id} >
      <SkemaTimeStamps start={8} end={17} />
      <DailySkema lessons={item.lessons} width={width} />
    </View>
  )

  scrollRef: RefObject<FlatList<DATA>> = createRef();

  handleViewableItemsChanged(info: { viewableItems: Array<ViewToken>; changed: Array<ViewToken> }) {
    if (info.changed?.length < 5) {
      
    }
  }

  async componentDidMount() {
    let now = new Date();
    let ugeDatoer = [addWeeks(startOfISOWeek(now), -1), startOfISOWeek(now), addWeeks(startOfISOWeek(now), 1)]


    for (let week of ugeDatoer)
      this.skemaUger.push(await HentSkemaUge(this.props.lectio.user, this.props.lectio.requestHelper, week.getFullYear(), getISOWeek(week)));

    let temp: DATA[] = [];
    for (let skemaUge of this.skemaUger) {
      temp.push({ id: String(skemaUge.year) + String(skemaUge.week) + "mon", lessons: skemaUge.mon })
      temp.push({ id: String(skemaUge.year) + String(skemaUge.week) + "tue", lessons: skemaUge.tue })
      temp.push({ id: String(skemaUge.year) + String(skemaUge.week) + "wed", lessons: skemaUge.wed })
      temp.push({ id: String(skemaUge.year) + String(skemaUge.week) + "thu", lessons: skemaUge.thu })
      temp.push({ id: String(skemaUge.year) + String(skemaUge.week) + "fri", lessons: skemaUge.fri })
      temp.push({ id: String(skemaUge.year) + String(skemaUge.week) + "sat", lessons: skemaUge.sat })
      temp.push({ id: String(skemaUge.year) + String(skemaUge.week) + "sun", lessons: skemaUge.sun })
    }

    this.Data = temp;

    

  }


  render() {

    return (
      <>
        <FlatList
          ref={this.scrollRef}
          showsHorizontalScrollIndicator={false}
          horizontal
          pagingEnabled
          getItemLayout={(data, index) => (
            {length: width, offset: width * index, index}
          )}
          onViewableItemsChanged={this.handleViewableItemsChanged}
          initialScrollIndex={7 + getISODay(new Date()) - 1}
          data={this.Data} keyExtractor={(item) => item.id} renderItem={this.renderItem} />
      </>
    )
  }

}

export default SkemaScreen;