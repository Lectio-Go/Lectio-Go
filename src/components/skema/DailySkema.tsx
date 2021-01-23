import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
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
    @observable schoolStart: Date = new Date(
        this.props.lessons[0].start.getFullYear(),
        this.props.lessons[0].start.getMonth(),
        this.props.lessons[0].start.getDate(),
        8,
        0,
        0,
        0
    );

    async componentDidMount() {

    }
    render() {
        //console.log(this.schoolStart);
        return (
            <View   style={{ flex: 1, flexDirection: "column", alignItems: "stretch", padding: 10, width: this.props.width }}>
                <View>

                { this.props.lessons.map((lesson, i) => {
                    let yPos: number = (lesson.start.getTime() - this.schoolStart.getTime()) / (3600 * 1000) * 80;
                    //console.log(yPos);
                    return (
                        <View style={{position: "absolute", top: yPos, width: this.props.width - 20} } >
                            <SkemaBrik lesson={lesson} />
                        </View>
                    )
                })
                }

            </View>
            </View>
        )
    }
}