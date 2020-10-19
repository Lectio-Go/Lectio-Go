import React, { Component } from 'react';
import {StyleSheet, Text, TouchableHighlight} from 'react-native';

import { NavigationScreenProp } from 'react-navigation';
import { CollapsibleHeaderFlatList } from 'react-native-collapsible-header-views';
import { ListItem, ThemeProvider } from 'react-native-elements'

import { computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';

import SchoolSearchBar from './SchoolSearchBar';
import ThemeStore, { ThemeProps } from '../../stores/ThemeStore';
import LectioStore from '../../stores/LectioStore';
import { ISchool } from 'liblectio';

const keyExtractor = (item: number, _index: number) => `${item}`

@inject('lectio')
@inject('theme')
@observer
class Item extends Component<{ onPress: (school: number) => void,item: number, theme?: ThemeStore, lectio?: LectioStore }, {}> {
  render() {
    return (
      // Theme the theme provider and the underlay color. Next thing to implement is a better mobx based theming that is independent from lectio store
      <ThemeProvider useDark={this.props.theme!.colorscheme === 'dark'? true : false}>
      <TouchableHighlight onPress={()=>this.props.onPress(this.props.item)} underlayColor="#FFFFFF">
          <ListItem key={this.props.item} bottomDivider >
            <ListItem.Content>
              <ListItem.Title>{this.props.lectio!.schoolList.filter(school => {return school.id === String(this.props.item)})[0].name}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron name='chevron-forward-outline' />
          </ListItem>
      </TouchableHighlight>
    </ThemeProvider>
    );
  }
}

@inject('lectio')
@inject('theme')
@observer
export default class SchoolPicker extends Component<{lectio: LectioStore, theme: ThemeStore, navigation: NavigationScreenProp<any, any>}, {}> {
  @observable search = '';

  // This function filters the schools based on the search
  getData(searchTerm: string): number[] {
    return this.props.lectio.schoolList
    .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((school: ISchool)=> Number(school.id))
  }

  renderItem = ({ item }: { item: number }) => {
    return (
    <Item item={item} onPress={(item) => {
      this.props.lectio.school = item; 
      this.props.navigation.goBack()
    }}/>
    )
  };

  render() {
    return (
      <CollapsibleHeaderFlatList
        CollapsibleHeaderComponent={<SchoolSearchBar onChangeText={(text) => { this.search = text }} />}
        headerHeight={55}
        data={this.getData(this.search)}
        renderItem={this.renderItem}
        keyExtractor={keyExtractor}>
      </CollapsibleHeaderFlatList>
    );
  }
}


const styles = StyleSheet.create({
  item: {
    paddingLeft: 20,
    paddingVertical: 20,
    backgroundColor: 'wheat'
  },
  separator: {
    height: 1,
    backgroundColor: 'gray'
  },
  header: {
    flex: 1,
    backgroundColor: 'green',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row'
  },
  backButton: {
    height: 94,
    width: 94,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white'
  }
})

