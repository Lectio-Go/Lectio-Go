import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import LectioStore from "../stores/LectioStore";
import ThemeStore from "../stores/ThemeStore";


interface SkemaScreenProps{
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
let week = Math.ceil( (((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7 );
    try {
      await this.props.lectio.GetBriefLessonList(2020, week);
    } catch (error) {
      alert("ERROR: " + error)
    }

    for(let lesson of this.props.lectio.lessonList){
      this.items.push(<Text>
        {lesson.teachers![0].teacherInitials} : {lesson.teams![0].team} : {lesson.start.getHours()} 
      </Text>)
    }
  }

  render() {
    return (
      <View
          style={{ flex: 1, alignItems: 'flex-start', backgroundColor: 'yellow' }}>
          <View style={{flex: 1, backgroundColor: '#bbb', flexDirection: 'row' }}>
              <ScrollView style={{flex: 1, height: 500 }}>
                <View style={{height: 5000 }}>
                {this.items}
                </View>

              </ScrollView>
          </View>
      </View>
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