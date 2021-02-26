import { observable, action } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component, ReactElement, RefObject, useRef } from "react";
import { Button, ScrollView, StyleSheet, View, Text, Dimensions } from "react-native";
import { PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import DailySkema from "./DailySkema"
import Lesson from "liblectio/lib/Skema/Timetable"
import LectioStore from "../../stores/LectioStore";
import ThemeStore from "../../stores/ThemeStore";
import SkemaTimeStamps from "./SkemaTimeStamps"
import { Tabs, Tab } from "native-base"
import { TabView, SceneMap } from "react-native-tab-view"
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import {addDays} from 'date-fns'



const { width } = Dimensions.get('window');

const topTab = createMaterialTopTabNavigator();

interface WeeklySkemaPagingProps {
    lectio?: LectioStore;

    theme?: ThemeStore;

    pageIndex: number;

    week: number;

    year: number
}

@inject('lectio')
@inject('theme')
@observer
export default class WeeklySkemaPaging extends Component<WeeklySkemaPagingProps> {
    @observable lessons: Lesson.Lesson[][] = [[], [], [], [], [], [], []];
    mondayDate = this.getDateOfISOWeek(this.props.week, this.props.year);


    getDateOfISOWeek(w: number, y: number) {
        var simple = new Date(y, 0, 1 + (w - 1) * 7);
        var dow = simple.getDay();
        var ISOweekStart = simple;
        if (dow <= 4)
            ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
        else
            ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
        return ISOweekStart;
    }

    async componentDidMount() {
        try {
            await this.props.lectio!.GetBriefLessonList(this.props.year, this.props.week);
        } catch (error) {
            alert("ERROR: " + error)
        }

        // Here we split the timetable into the 7 days of the week
        for (let lesson of this.props.lectio!.lessonList) {
            switch (lesson.start.getDay()) {
                case 1:
                    this.lessons[0].push(lesson);
                    break;
                case 2:
                    this.lessons[1].push(lesson);
                    break;
                case 3:
                    this.lessons[2].push(lesson);
                    break;
                case 4:
                    this.lessons[3].push(lesson);
                    break;
                case 5:
                    this.lessons[4].push(lesson);
                    break;
                case 6:
                    this.lessons[5].push(lesson);
                    break;
                case 0:
                    this.lessons[6].push(lesson);
                    break;
            }
        }

    }

    render() {

        return (
            <>

                <topTab.Navigator 
                initialRouteName={String(this.mondayDate.getDate()) + this.props.pageIndex}
                initialLayout={{ width: Dimensions.get('window').width }}
                    tabBarOptions={{
                        indicatorStyle: {
                            backgroundColor: this.props.theme?.colors.primary
                        }
                    }}
                >
                    {this.lessons.map((lesson, i) => {
                        return <topTab.Screen key={i} name={String(addDays(this.mondayDate, i).getDate())} children={() =>
                            <View style={{ flexDirection: "row" }} >
                                <SkemaTimeStamps start={8} end={17} day={addDays(this.mondayDate, i).getDate()} />
                                <DailySkema lessons={this.lessons[i]} width={width} />
                            </View>
                        } />
                    })}
                </topTab.Navigator>

            </>
        )
    }
}