import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import ThemeStore from "../../stores/ThemeStore";
import { Lesson } from "liblectio/lib/Skema/Timetable"
import SkemaBrik from "../skema/SkemaBrik"
import { observable } from "mobx";

interface DailySkemaProps {
    lessons: Lesson[];
    theme?: ThemeStore;
    width: number;
}

@inject('theme')
@observer
export default class DailySkema extends Component<DailySkemaProps>{

    async componentDidMount() {

    }
    render() {

        return (
            <View style={{ flex: 1, flexDirection: "column", padding: 0, alignItems: "stretch", width: this.props.width - 45 }}>
                {this.props.lessons.map((lesson, i) => {
                    let schoolStart = new Date(
                        lesson.start.getFullYear(),
                        lesson.start.getMonth(),
                        lesson.start.getDate(),
                        8,
                        0,
                        0,
                        0
                    );

                    let yPos: number = (lesson.start.getTime() - schoolStart.getTime()) / (3600 * 1000) * 60;
                    return (
                        <View key={lesson.lessonId} style={{ position: "absolute", top: yPos, width: this.props.width - 45, paddingLeft: 10, paddingRight: 10, paddingTop: 10 }} >
                            <SkemaBrik lesson={lesson} />
                        </View>
                    )
                })
                }
            </View>
        )
    }
}