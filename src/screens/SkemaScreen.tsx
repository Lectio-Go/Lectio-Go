import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import { Button, ScrollView, StyleSheet, View, Text, Dimensions } from "react-native";
import { PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import DailySkema from "../components/skema/DailySkema"
import Lesson from "liblectio/lib/Skema/Timetable"
import LectioStore from "../stores/LectioStore";
import ThemeStore from "../stores/ThemeStore";

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
  @observable weekSkema: Lesson.Lesson[][] = new Array<Array<Lesson.Lesson>>();


  async componentDidMount() {
    //console.log(this.props.lectio.password)
    // Here we should fetch the timetable
    let now = new Date();
    let onejan = new Date(now.getFullYear(), 0, 1);
    let week = 4; //Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7) - 1;

    try {
      await this.props.lectio.GetBriefLessonList(now.getFullYear(), week);
    } catch (error) {
      alert("ERROR: " + error)
    }

    console.log(JSON.stringify(this.props.lectio.lessonList, null, 4));

    // Here we split the timetable into the 7 days of the week
    let currentDay = this.props.lectio.lessonList[0].start.getDate();
    let currentDaySkema: Lesson.Lesson[] = [];

    this.props.lectio.lessonList.map((lesson, i) => {
      if (i == this.props.lectio.lessonList.length - 1) {
        this.weekSkema.push([...currentDaySkema]);
      }

      if (lesson.start.getDate() == currentDay) {
        currentDaySkema.push(lesson)
      }
      else {
        this.weekSkema.push([...currentDaySkema]);
        currentDaySkema = [lesson];
        currentDay = lesson.start.getDate();
      }
    })


    //console.log(JSON.stringify(this.weekSkema[2], null, 4));

  }
  render() {
    return (

      <ScrollView
        style={{}}
        //pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        decelerationRate={'fast'}
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
            {this.weekSkema.length < /*tal som er antal dage i skemaugen*/ this.props.lectio.lessonList[this.props.lectio.lessonList.length - 1].stop.getDate() - this.props.lectio.lessonList[0].start.getDate() + 1
              ? <></> :
              <>
                {this.weekSkema.map((lessons, i) => {
                  return <DailySkema lessons={lessons} />
                })}
              </>
            }
          </>
        }

      </ScrollView>
    )
  }

}

export default SkemaScreen;