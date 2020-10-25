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

  async componentDidMount() {
    // Here we should fetch the timetable
    // try {
    //   await this.props.lectio.GetBriefLessonList(2020, 43);
    // } catch (error) {
    //   alert("ERROR: " + error)
    // }
  }

  render() {
    return (
      <View
          style={{ flex: 1, alignItems: 'flex-start', backgroundColor: 'yellow' }}>
          <View style={{flex: 1, backgroundColor: '#bbb', flexDirection: 'row' }}>
              <ScrollView style={{flex: 1, height: 500 }}>
                <View style={{height: 5000 }}>
                <Text>Loren12</Text>
              <Text style={{position: 'absolute', top: 100}}>Lorem</Text>
              <Text style={{position: 'absolute', top: 105}}>Lorem</Text>
              <Text>Loren12</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
              <Text style={{position: 'absolute', }}>Lorem</Text>
                
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