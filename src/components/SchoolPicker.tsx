import {observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component} from 'react';
import {Text, View} from 'react-native';
import SearchBar from 'react-native-search-bar';

@observer
export class SchoolPicker extends Component {
  @observable search = '';
  render() {
    return (
      <View>
        {/* <SearchBar
          searchBarStyle="minimal"
          ref="searchBar"
          placeholder="Search"
          onChangeText={(text) => {
            console.log(text);
          }}
          onSearchButtonPress={() => {
            console.log('Search');
          }}
          onCancelButtonPress={() => {
            console.log('Cancel');
          }}
        /> */}
      </View>
    );
  }
}

export default SchoolPicker;
