import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import SearchBar from "react-native-search-bar";
import ThemeStore from "../../stores/ThemeStore";
import { Lesson } from "liblectio/lib/Skema/Timetable"
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";

interface SkemaBrikProps {
  lesson: Lesson;
  theme?: ThemeStore;
}

@inject('theme')
@observer
export default class SkemaBrik extends Component<SkemaBrikProps> {
  duration = (this.props.lesson.stop.getTime() - this.props.lesson.start.getTime()) / (3600 * 1000);
  colors = this.props.theme!.colors;
  styles = StyleSheet.create({
    SkemaBrikContainer: {
      borderRadius: 7,
      height: this.duration * 80,
      padding: 7,
      backgroundColor: this.props.theme!.colors.skemaRubrik,
    },
    SkemaBrikTekst: {
      color: "white",

    },
    SkemaBrikIcon: {},
  });

  render() {
    return (
      <View style={[this.styles.SkemaBrikContainer, this.props.lesson.state == "Cancelled" ? {backgroundColor: "red"} : {}]}>
        <TouchableOpacity style={{}}>
          <Text style={[this.styles.SkemaBrikTekst, this.props.lesson.state == "Cancelled" ? {textDecorationLine: 'line-through'}: {}]}>
            {this.props.lesson.teams!.map((team, i) => {
              if (i + 1 < this.props.lesson.teams!.length)
                return team.team + ", ";
              else
                return team.team;
            })}
            {/* {JSON.stringify(this.props.lesson)} */}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Icon name="pin" size={20} style={{ color: "white" }} />
            <Text style={[this.styles.SkemaBrikTekst, this.props.lesson.state == "Cancelled" ? {textDecorationLine: 'line-through'}: {}]}>
              {this.props.lesson.rooms!.map((room, i) => {
                if (i + 1 < this.props.lesson.rooms!.length)
                  return room + ", ";
                else
                  return room;
              })}
            </Text>
          </View>
          <View style={{ alignSelf: "flex-end" }}>
            {this.props.lesson.homeworkBrief != undefined || this.props.lesson.noteBrief != undefined || this.props.lesson.otherBrief != undefined?
              <Icon name="document-text-outline" size={25} style={{ color: "white" }} />
              : <></>}
          </View>


        </TouchableOpacity>
      </View>
    )
  }
}