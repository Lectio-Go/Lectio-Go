import { observable } from "mobx";
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

const { width } = Dimensions.get('window');

interface WeeklySkemaPagingProps {
    theme?: ThemeStore;

    lessons: {
        mon: Lesson.Lesson[],
        tue: Lesson.Lesson[],
        wed: Lesson.Lesson[],
        thu: Lesson.Lesson[],
        fri: Lesson.Lesson[],
        sat: Lesson.Lesson[],
        sun: Lesson.Lesson[],
    }

    pageIndex: number;
}

@inject('theme')
@observer
export default class WeeklySkemaPaging extends Component<WeeklySkemaPagingProps> {

    myRef: RefObject<ScrollView> = React.createRef();

    async componentDidMount() {

    }

    render() {
        return (
            <Tabs initialPage={this.props.pageIndex} locked={false} >

                <Tab
                    key={0}
                    tabStyle={{
                        backgroundColor: this.props.theme?.colors.card,
                        borderBottomWidth: 0,
                        borderBottomColor: this.props.theme?.colors.border,
                        
                    }}
                    textStyle={{color: this.props.theme?.colors.text}}
                    activeTabStyle={{backgroundColor: this.props.theme?.colors.card}}
                    activeTextStyle={{color: this.props.theme?.colors.primary}} 
                    heading={String(this.props.lessons.mon[0].start.getDate())} >
                    <View style={{ flexDirection: "row" }} >
                        <SkemaTimeStamps start={8} end={17} />
                        {this.props.lessons.mon.length < 1 ? <View style={{ width: width - 45 }} /> :
                            <DailySkema lessons={this.props.lessons.mon} width={width} />}
                    </View>
                </Tab>

                <Tab
                    key={1}
                    tabStyle={{
                        backgroundColor: this.props.theme?.colors.card,
                        borderBottomWidth: 0,
                        borderBottomColor: this.props.theme?.colors.border
                    }}
                    textStyle={{color: this.props.theme?.colors.text}}
                    activeTabStyle={{backgroundColor: this.props.theme?.colors.card}}
                    activeTextStyle={{color: this.props.theme?.colors.primary}} 
                    heading={String(this.props.lessons.tue[0].start.getDate())} >
                <View style={{ flexDirection: "row" }} >
                    <SkemaTimeStamps start={8} end={17} />
                    {this.props.lessons.tue.length < 1 ? <View style={{ width: width - 45 }} /> :
                        <DailySkema lessons={this.props.lessons.tue} width={width} />}
                </View>
                </Tab>

                <Tab
                    key={2}
                    tabStyle={{
                        backgroundColor: this.props.theme?.colors.card,
                        borderBottomWidth: 0,
                        borderBottomColor: this.props.theme?.colors.border
                    }}
                    textStyle={{color: this.props.theme?.colors.text}}
                    activeTabStyle={{backgroundColor: this.props.theme?.colors.card}}
                    activeTextStyle={{color: this.props.theme?.colors.primary}} 
                    heading={String(this.props.lessons.wed[0].start.getDate())} >
                <View style={{ flexDirection: "row" }} >
                    <SkemaTimeStamps start={8} end={17} />
                    {this.props.lessons.wed.length < 1 ? <View style={{ width: width - 45 }} /> :
                        <DailySkema lessons={this.props.lessons.wed} width={width} />}
                </View>
                </Tab>
                <Tab
                    key={3}
                    tabStyle={{
                        backgroundColor: this.props.theme?.colors.card,
                        borderBottomWidth: 0,
                        borderBottomColor: this.props.theme?.colors.border
                    }}
                    textStyle={{color: this.props.theme?.colors.text}}
                    activeTabStyle={{backgroundColor: this.props.theme?.colors.card}}
                    activeTextStyle={{color: this.props.theme?.colors.primary}} 
                    heading={String(this.props.lessons.thu[0].start.getDate())} >
                <View style={{ flexDirection: "row" }} >
                    <SkemaTimeStamps start={8} end={17} />
                    {this.props.lessons.thu.length < 1 ? <View style={{ width: width - 45 }} /> :
                        <DailySkema lessons={this.props.lessons.thu} width={width} />}
                </View>
                </Tab>

                <Tab
                    key={4}
                    tabStyle={{
                        backgroundColor: this.props.theme?.colors.card,
                        borderBottomWidth: 0,
                        borderBottomColor: this.props.theme?.colors.border
                    }}
                    textStyle={{color: this.props.theme?.colors.text}}
                    activeTabStyle={{backgroundColor: this.props.theme?.colors.card}}
                    activeTextStyle={{color: this.props.theme?.colors.primary}} 
                    heading={String(this.props.lessons.fri[0].start.getDate())} >
                <View style={{ flexDirection: "row" }} >
                    <SkemaTimeStamps start={8} end={17} />
                    {this.props.lessons.fri.length < 1 ? <View style={{ width: width - 45 }} /> :
                        <DailySkema lessons={this.props.lessons.fri} width={width} />}
                </View>
                </Tab>
                <Tab
                    key={5}
                    tabStyle={{
                        backgroundColor: this.props.theme?.colors.card,
                        borderBottomWidth: 0,
                        borderBottomColor: this.props.theme?.colors.border
                    }}
                    textStyle={{color: this.props.theme?.colors.text}}
                    activeTabStyle={{backgroundColor: this.props.theme?.colors.card}}
                    activeTextStyle={{color: this.props.theme?.colors.primary}} 
                    heading={String(this.props.lessons.fri[0].start.getDate() + 1)} >
                <View style={{ flexDirection: "row" }} >
                    <SkemaTimeStamps start={8} end={17} />
                    {this.props.lessons.sat.length < 1 ? <View style={{ width: width - 45 }} /> :
                        <DailySkema lessons={this.props.lessons.sat} width={width} />}
                </View>
                </Tab>

                <Tab
                    key={6}
                    tabStyle={{
                        backgroundColor: this.props.theme?.colors.card,
                        borderBottomWidth: 0,
                        borderBottomColor: this.props.theme?.colors.border
                    }}
                    textStyle={{color: this.props.theme?.colors.text}}
                    activeTabStyle={{backgroundColor: this.props.theme?.colors.card}}
                    activeTextStyle={{color: this.props.theme?.colors.primary}} 
                    heading={String(this.props.lessons.fri[0].start.getDate() + 2)} >
                <View style={{ flexDirection: "row" }} >
                    <SkemaTimeStamps start={8} end={17} />
                    {this.props.lessons.sun.length < 1 ? <View style={{ width: width - 45 }} /> :
                        <DailySkema lessons={this.props.lessons.sun} width={width} />}
                </View>
                </Tab>

            </Tabs>
        )
    }
}