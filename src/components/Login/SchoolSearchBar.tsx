import { inject } from "mobx-react";
import React, { Component } from "react";
import { View } from "react-native";
import SearchBar from "react-native-search-bar";
import ThemeStore from "../../stores/ThemeStore";


@inject('theme')
export default class SchoolSearchBar extends Component<{ theme: ThemeStore, onChangeText: (text: string) => void }, {}> {
    render() {
      return (
        <SearchBar
          searchBarStyle="default"
          placeholder="Search"
          textColor={this.props.theme.colors.text}
          onChangeText={this.props.onChangeText}
        />
      )
    }
  }
  