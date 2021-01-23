import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import ThemeStore from "../../stores/ThemeStore";
import { Lesson } from "liblectio/lib/Skema/Timetable"
import SkemaBrik from "../skema/SkemaBrik"

const { width } = Dimensions.get('window');

interface DailySkemaProps {
    lessons: Lesson[];
    theme?: ThemeStore;
}

@inject('theme')
@observer
export default class DailySkema extends Component<DailySkemaProps>{
    render() {
        console.log(JSON.stringify(this.props.lessons, null, 4));
        return (
            <View
                style={{ flex: 1, flexDirection: "column", alignItems: "stretch", padding: 10, width: width }}>
                { this.props.lessons.map((lesson, i) => {
                    let pauseDuration = 0;
                    if (i + 1 < this.props.lessons.length) {
                        pauseDuration = (this.props.lessons[i + 1].start.getTime() - lesson.stop.getTime()) / (3600 * 1000);
                    }
                    
                    return (
                        <>
                            <SkemaBrik lesson={lesson} />
                            <View style={{ height: pauseDuration * 80 }} />
                        </>
                    )
                })

                }
            </View>
        )
    }
}