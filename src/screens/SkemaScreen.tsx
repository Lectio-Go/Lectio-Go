import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import SkemaBrik from "../components/skema/SkemaBrik"
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
  @observable text = "";
  @observable items: JSX.Element[] = [];

  async componentDidMount() {
    console.log(this.props.lectio.password)
    // Here we should fetch the timetable
    let now = new Date();
    let onejan = new Date(now.getFullYear(), 0, 1);
    let week = 3;//Math.ceil( (((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7 );
    try {
      await this.props.lectio.GetBriefLessonList(2021, week);
    } catch (error) {
      alert("ERROR: " + error)
    }

    for (let lesson of this.props.lectio.lessonList) {
      this.items.push(<Text>
        {lesson.teachers![0].teacherInitials} : {lesson.teams![0].team} : {lesson.start.getHours()}
      </Text>)
    }
  }

  render() {
    return (

      //<ScrollView horizontal={true} pagingEnabled={true} showsVerticalScrollIndicator={false}
      //  showsHorizontalScrollIndicator={false} style={{flex: 1}}>
      <View style={{ flex: 1, flexDirection: "column", alignItems: "stretch" }}>
        { this.props.lectio.lessonList.map((lesson, i) => {
          let pauseDuration = 0;
          if (i + 1 < this.props.lectio.lessonList.length)
          {
            pauseDuration = (this.props.lectio.lessonList![i + 1].start.getTime() - lesson.stop.getTime()) / (3600 * 1000);
          }
          
          
          return (
            <>
              <SkemaBrik lesson={lesson} />
              <View style={{height: pauseDuration * 80}}/>
            </>
          )
        })

        }
      </View>


      //</ScrollView>
    )
  }

  colors = this.props.theme.colors;
  styles = StyleSheet.create({
    scrollView: {
      backgroundColor: 'pink',
    },
    text: {
      fontSize: 42,
    },
  });
}

export default SkemaScreen;