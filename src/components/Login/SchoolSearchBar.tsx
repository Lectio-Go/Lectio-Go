import React, { Component } from "react";
import SearchBar from "react-native-search-bar";


export default class SchoolSearchBar extends Component<{ onChangeText: (text: string) => void }, {}> {
    render() {
      return (
        <SearchBar
          searchBarStyle="default"
          ref="searchBar"
          placeholder="Search"
          onChangeText={this.props.onChangeText}
        />
      )
    }
  }
  