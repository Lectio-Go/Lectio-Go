import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import { Button, ScrollView, StyleSheet, View, Text, Dimensions } from "react-native";
import { PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import DailySkema from "../components/skema/DailySkema"
import Lesson from "liblectio/lib/Skema/Timetable"
import LectioStore from "../stores/LectioStore";
import ThemeStore from "../stores/ThemeStore";
import WeeklySkemaPaging from "../components/skema/WeeklySkemaPaging"

const { width } = Dimensions.get('window');

interface SkemaScreenProps {
  lectio: LectioStore;
  theme: ThemeStore
}

@inject('theme')
@inject('lectio')
@observer
export class SkemaScreen extends Component<SkemaScreenProps> {
  @observable items: JSX.Element[] = [];
  @observable weekSkema: Lesson.Lesson[][] = [[], [], [], [], [], [], []];


  async componentDidMount() {
    //console.log(this.props.lectio.password)
    // Here we should fetch the timetable
    let now = new Date();
    let onejan = new Date(now.getFullYear(), 0, 1);
    let week = Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7) - 1;

    try {
      await this.props.lectio.GetBriefLessonList(now.getFullYear(), week);
    } catch (error) {
      alert("ERROR: " + error)
    }

    //console.log(JSON.stringify(this.props.lectio.lessonList, null, 4));

    // Here we split the timetable into the 7 days of the week
    for (let lesson of this.props.lectio.lessonList) {
      switch (lesson.start.getDay()) {
        case 1:
          this.weekSkema[0].push(lesson);
          break;
        case 2:
          this.weekSkema[1].push(lesson);
          break;
        case 3:
          this.weekSkema[2].push(lesson);
          break;
        case 4:
          this.weekSkema[3].push(lesson);
          break;
        case 5:
          this.weekSkema[4].push(lesson);
          break;
        case 6:
          this.weekSkema[5].push(lesson);
          break;
        case 0:
          this.weekSkema[6].push(lesson);
          break;
      }
    }
    //console.log(JSON.stringify(this.weekSkema[2], null, 4));

  }
  render() {
    //console.log(this.weekSkema.length);
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
        {this.props.lectio.lessonList.length < 1 ? <></> :
          <>
            <WeeklySkemaPaging lessons={{
              mon: this.weekSkema[0], 
              tue: this.weekSkema[1], 
              wed: this.weekSkema[2],
              thu: this.weekSkema[3],
              fri: this.weekSkema[4],
              sat: this.weekSkema[5],
              sun: this.weekSkema[6],
              }} />

          </>
        }

      </ScrollView>
    )
  }

}

export default SkemaScreen;