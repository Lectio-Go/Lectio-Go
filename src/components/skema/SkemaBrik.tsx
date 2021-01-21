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
      backgroundColor: this.props.theme!.colors.skemaRubrik,
      height: this.duration * 80,
      padding: 7,
    },
    SkemaBrikTekst: {
      color: "white",

    },
    SkemaBrikIcon: {},
  });

  render() {
    return (
      <View style={this.styles.SkemaBrikContainer}>
        <TouchableOpacity style={{}}>
          <Text style={this.styles.SkemaBrikTekst}>
            {this.props.lesson.teams![0].team}
          </Text>
          <View style={{flexDirection: "row"}}>
            <Icon name="pin" size={20} style={{ color: "white" }} />
            <Text style={this.styles.SkemaBrikTekst}>
              {this.props.lesson.rooms![0]}
            </Text>
          </View>


          <Icon name="document-text-outline" size={25} style={{ color: "white", alignSelf: "flex-end" }} />
        </TouchableOpacity>
      </View>
    )
  }
}