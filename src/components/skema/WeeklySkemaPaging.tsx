import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import { Button, ScrollView, StyleSheet, View, Text, Dimensions } from "react-native";
import { PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import DailySkema from "../skema/DailySkema"
import Lesson from "liblectio/lib/Skema/Timetable"
import LectioStore from "../../stores/LectioStore";
import ThemeStore from "../../stores/ThemeStore";

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
}

@inject('theme')
@observer
export default class WeeklySkemaPaging extends Component<WeeklySkemaPagingProps> {
    render() {
        return (

            <ScrollView
                style={{}}
                //pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                decelerationRate={0}
                snapToInterval={width}
                snapToAlignment={"center"}
                contentInset={{
                    top: 0,
                    left: 30,
                    bottom: 0,
                    right: 30,
                }}>
                {this.props.lessons.mon.length < 1 ? <View style={{width: width}} /> : 
                <DailySkema lessons={this.props.lessons.mon} width={width} />}
                {this.props.lessons.tue.length < 1 ? <View style={{width: width}} /> : 
                <DailySkema lessons={this.props.lessons.tue} width={width} />}
                {this.props.lessons.wed.length < 1 ? <View style={{width: width}} /> : 
                <DailySkema lessons={this.props.lessons.wed} width={width} />}
                {this.props.lessons.thu.length < 1 ? <View style={{width: width}} /> : 
                <DailySkema lessons={this.props.lessons.thu} width={width} />}
                {this.props.lessons.fri.length < 1 ? <View style={{width: width}} /> : 
                <DailySkema lessons={this.props.lessons.fri} width={width} />}
                {this.props.lessons.sat.length < 1 ? <View style={{width: width}} /> : 
                <DailySkema lessons={this.props.lessons.sat} width={width} />}
                {this.props.lessons.sun.length < 1 ? <View style={{width: width}} /> : 
                <DailySkema lessons={this.props.lessons.sun} width={width} />}

            </ScrollView>
        )
    }
}