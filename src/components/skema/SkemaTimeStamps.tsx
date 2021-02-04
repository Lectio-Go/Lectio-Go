import { observable } from "mobx";
import { componentByNodeRegistry, inject, observer } from "mobx-react";
import React, { Component, ReactElement, RefObject, useRef } from "react";
import { Button, ScrollView, StyleSheet, View, Text, Dimensions } from "react-native";
import { PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import DailySkema from "../skema/DailySkema"
import Lesson from "liblectio/lib/Skema/Timetable"
import LectioStore from "../../stores/LectioStore";
import ThemeStore from "../../stores/ThemeStore";
import { interceptChange } from "mobx/lib/internal";
import { color } from "react-native-reanimated";
import { SlideFromRightIOS } from "@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionPresets";

const { width } = Dimensions.get('window');

interface SkemaTimeStampsProps {
    theme?: ThemeStore;
    start: number;
    end: number;
}

@inject('theme')
export default class SkemaTimeStamps extends Component<SkemaTimeStampsProps> {

    items: JSX.Element[] = [];
    lines: JSX.Element[] = [];
    async componentDidMount() {

    }

    render() {
        this.items = [];
        this.lines = [];
        for (let i = this.props.start; i <= this.props.end; i++) {
            this.items.push(<View key={"time" + i } style={{ position: "absolute", top: 3 + (i - this.props.start) * 60, left: 4 }} ><Text style={{ color: this.props.theme?.colors.text }} >{(i < 10 ? "0" + String(i) : String(i)) + ":00"}</Text></View>)
            this.lines.push(<View key={"line" + i } style={{ position: "absolute", top: 13 + (i - this.props.start) * 60, left: 45, width: width - 45, borderTopColor: this.props.theme?.colors.border, borderTopWidth: 1 }} />)
        }

        return (
            <>
                <View style={{ backgroundColor: this.props.theme?.colors.background, height: "100%", width: 45 }}>
                    {this.items}
                </View>
                {this.lines}
            </>
        )
    }
}