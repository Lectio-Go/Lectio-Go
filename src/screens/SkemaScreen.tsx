import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import { Button, ScrollView, StyleSheet, View, Text } from "react-native";
import { PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import DailySkema from "../components/skema/DailySkema"
import Lesson from "liblectio/lib/Skema/Timetable"
import LectioStore from "../stores/LectioStore";
import ThemeStore from "../stores/ThemeStore";

interface SkemaScreenProps {
  lectio: LectioStore;
  theme: ThemeStore
}

@inject('theme')
@inject('lectio')
@observer
export class SkemaScreen extends Component<SkemaScreenProps> {
  @observable items: JSX.Element[] = [];
  @observable weekSkema: Lesson.Lesson[][] = new Array<Array<Lesson.Lesson>>();

  async componentDidMount() {
    //console.log(this.props.lectio.password)
    // Here we should fetch the timetable
    let now = new Date();
    let onejan = new Date(now.getFullYear(), 0, 1);
    let week = 3;//Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7) - 1;
    try {
      await this.props.lectio.GetBriefLessonList(2021, week);

  } catch (error) {
      alert("ERROR: " + error)
    }
    
    // Here we split the timetable into the 7 days of the week
    let currentDay = this.props.lectio.lessonList[0].start.getDate();
    let currentDaySkema: Lesson.Lesson[] = [];
    
    for (let lesson of this.props.lectio.lessonList) {

    if (lesson.start.getDate() == currentDay) {
        currentDaySkema.push(lesson)
      }
      else {
        this.weekSkema.push([...currentDaySkema]);
        currentDaySkema = [lesson];
        currentDay = lesson.start.getDate();
      }
    }

    //console.log(JSON.stringify(this.weekSkema[2], null, 4));

  }



  render() {

    return (

      //<ScrollView horizontal={true} pagingEnabled={true} showsVerticalScrollIndicator={false}
      //  showsHorizontalScrollIndicator={false} style={{flex: 1}}>
      <>
        {this.weekSkema.length < 4 ? <></> :
          <DailySkema lessons={this.weekSkema[2]}>

          </DailySkema>
        }



      </>
      //</ScrollView>
    )
  }

}

export default SkemaScreen;