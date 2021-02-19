import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component, createRef, ForwardRefExoticComponent, RefObject, useRef } from "react";
import { FlatList, Button, StyleSheet, View, Text, Dimensions, Route, Alert, ViewToken, FlatListProps, NativeModules, Platform, findNodeHandle } from "react-native";
import { PanGestureHandlerGestureEvent, ScrollView } from "react-native-gesture-handler";
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
import { template } from "@babel/core";


const { width } = Dimensions.get('window');

interface SkemaScreenProps {
  lectio: LectioStore;
  theme: ThemeStore
}

interface DATA {
  lessons: Lesson[];
  id: string;
}

const nativeModule: {
  enableMaintainVisibleContentPosition(viewTag: number): Promise<number>;
  disableMaintainVisibleContentPosition(handle: number): Promise<void>;
} = NativeModules.ScrollViewMagic;


@inject('theme')
@inject('lectio')
@observer
export class SkemaScreen extends Component<SkemaScreenProps> {
  constructor(props: SkemaScreenProps) {
    super(props);
    this.unhsiftWeek = this.unhsiftWeek.bind(this)
  }


  skemaUger: TimetableWeek[] = [];
  @observable Data: DATA[] = [];
  addingItems: boolean = false;

  renderItem = ({ item }: { item: DATA }) => (
    <View style={{ flexDirection: "row" }} key={item.id} >
      <SkemaTimeStamps start={8} end={17} />
      <DailySkema lessons={item.lessons} width={width} />
    </View>
  )

  scrollRef: RefObject<ScrollView> = createRef();

  async unhsiftWeek() {
    let weekDate = addWeeks(moment(String(this.skemaUger[0].year)).toDate(), this.skemaUger[0].week - 1);
    console.log(weekDate);
    this.skemaUger.unshift(await HentSkemaUge(this.props.lectio.user, this.props.lectio.requestHelper, weekDate.getFullYear(), getISOWeek(weekDate)));
    let temp: DATA[] = [];
    temp.push({ id: String(this.skemaUger[0].year) + String(this.skemaUger[0].week) + "mon", lessons: this.skemaUger[0].mon });
    temp.push({ id: String(this.skemaUger[0].year) + String(this.skemaUger[0].week) + "tue", lessons: this.skemaUger[0].tue });
    temp.push({ id: String(this.skemaUger[0].year) + String(this.skemaUger[0].week) + "wed", lessons: this.skemaUger[0].wed });
    temp.push({ id: String(this.skemaUger[0].year) + String(this.skemaUger[0].week) + "thu", lessons: this.skemaUger[0].thu });
    temp.push({ id: String(this.skemaUger[0].year) + String(this.skemaUger[0].week) + "fri", lessons: this.skemaUger[0].fri });
    temp.push({ id: String(this.skemaUger[0].year) + String(this.skemaUger[0].week) + "sat", lessons: this.skemaUger[0].sat });
    temp.push({ id: String(this.skemaUger[0].year) + String(this.skemaUger[0].week) + "sun", lessons: this.skemaUger[0].sun });

    this.Data = [...temp, ...this.Data];
  }

  async componentDidMount() {

    let ugeDatoer: Date[] = [addWeeks(startOfISOWeek(new Date), -1), startOfISOWeek(new Date()), addWeeks(startOfISOWeek(new Date), 1)]

    for (let week of ugeDatoer)
      this.skemaUger.push(await HentSkemaUge(this.props.lectio.user, this.props.lectio.requestHelper, week.getFullYear(), getISOWeek(week)));


    let temp: DATA[] = [];
    for (let skemaUge of this.skemaUger) {
      temp.push({ id: String(skemaUge.year) + String(skemaUge.week) + "mon", lessons: skemaUge.mon });
      temp.push({ id: String(skemaUge.year) + String(skemaUge.week) + "tue", lessons: skemaUge.tue });
      temp.push({ id: String(skemaUge.year) + String(skemaUge.week) + "wed", lessons: skemaUge.wed });
      temp.push({ id: String(skemaUge.year) + String(skemaUge.week) + "thu", lessons: skemaUge.thu });
      temp.push({ id: String(skemaUge.year) + String(skemaUge.week) + "fri", lessons: skemaUge.fri });
      temp.push({ id: String(skemaUge.year) + String(skemaUge.week) + "sat", lessons: skemaUge.sat });
      temp.push({ id: String(skemaUge.year) + String(skemaUge.week) + "sun", lessons: skemaUge.sun });
    }



    this.Data = temp;

    setTimeout(()=> this.scrollRef.current?.scrollTo({x: 7 + new Date().getDay() - 1, animated: false}), 1);


    // taken from user stackit's github PR for react to add maintainVisibleContentPosition for android
    let cleanupPromise: Promise<number> | undefined;
    if (Platform.OS == "android") {
      const viewTag = findNodeHandle(this.scrollRef.current);
      cleanupPromise = nativeModule.enableMaintainVisibleContentPosition(
        viewTag!
      );
    }
    return () => {
      void cleanupPromise?.then((handle) => {
        void nativeModule.disableMaintainVisibleContentPosition(handle);
      });
    };

  }


  render() {

    return (
      <>
        {this.Data.length == 0 ? <></> :
          <>
            {/* <FlatList
              //maintainVisibleContentPosition
              ref={this.scrollRef}
              horizontal
              pagingEnabled
              getItemLayout={(data: any, index: number) => (
                { length: width, offset: width * index, index }
              )}
              onViewableItemsChanged={this.handleViewableItemsChanged}
              viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}

              initialScrollIndex={7 + getISODay(new Date()) - 1}
              data={this.Data} keyExtractor={(item: DATA) => item.id} renderItem={this.renderItem} /> */}

            <ScrollView
            ref={this.scrollRef}
            horizontal
            pagingEnabled
            maintainVisibleContentPosition
            onScroll={({
              nativeEvent: {
                  contentInset: { bottom, left, right, top },
                  contentOffset: { x, y },
                  contentSize: { height: contentHeight, width: contentWidth },
                  layoutMeasurement: { height, width },
                  zoomScale,
              },
          }) => {
              if ( x <= 5 * width && !this.addingItems) {
                   this.addingItems = true;
                   this.unhsiftWeek();
                   this.addingItems = false;
                   console.log("Added week");
              }
          }}
            >
              {this.Data.map((item, i) => (
                <View style={{ flexDirection: "row" }} key={item.id} >
                  <SkemaTimeStamps start={8} end={17} />
                  <DailySkema lessons={item.lessons} width={width} />
                </View>
              ))}
            </ScrollView>

          </>}
      </>
    )
  }

}

export default SkemaScreen;