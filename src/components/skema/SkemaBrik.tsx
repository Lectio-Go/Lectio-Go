import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import SearchBar from "react-native-search-bar";
import ThemeStore from "../../stores/ThemeStore";
import { Lesson } from "liblectio/lib/Skema/Timetable"
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import { TabView, SceneMap } from 'react-native-tab-view';

interface SkemaBrikProps {
  lesson: Lesson;
  theme?: ThemeStore;
}

@inject('theme')
@observer
export default class SkemaBrik extends Component<SkemaBrikProps> {
  duration = (this.props.lesson.stop.getTime() - this.props.lesson.start.getTime()) / (3600 * 1000);
  colors = this.props.theme!.colors;

  render() {
    return (
      <TouchableOpacity style={[this.props.theme?.styles.SkemaBrik, {
        height: this.duration * 60, elevation: 2, // android
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
      },
      this.props.lesson.state == "Cancelled" ? this.props.theme?.styles.SkemaBrikAflyst : {}]}>
        <Text style={[{ color: "white" }, this.props.lesson.state == "Cancelled" ? { textDecorationLine: 'line-through' } : {}]}>
          {this.props.lesson.teams == undefined ? <></> :
            <>
              {this.props.lesson.teams!.map((team, i) => {
                if (i + 1 < this.props.lesson.teams!.length)
                  return team.team + ", ";
                else
                  return team.team;
              })}
            </>
          }
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Icon name="pin" size={20} style={{ color: "white" }} />
          <Text style={[{ color: "white" }, this.props.lesson.state == "Cancelled" ? { textDecorationLine: 'line-through' } : {}]}>
            {this.props.lesson.rooms == undefined ? <></> :
              <>
                {this.props.lesson.rooms!.map((room, i) => {
                  if (i + 1 < this.props.lesson.rooms!.length)
                    return room + ", ";
                  else
                    return room;
                })}
              </>
            }
          </Text>
          {this.props.lesson.homeworkBrief != undefined || this.props.lesson.noteBrief != undefined || this.props.lesson.otherBrief != undefined ?
            <Icon name="document-text-outline" size={25} style={{ color: "white", marginLeft: "auto" }} />
            : <></>}
        </View>
      </TouchableOpacity>
    )
  }
}