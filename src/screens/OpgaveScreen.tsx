import React, { Component } from "react";
import { Button, ScrollView, StyleSheet, Text, View, TouchableHighlight, FlatListProps, Platform } from "react-native";

import { NavigationScreenProp } from 'react-navigation';
import { createStackNavigator } from '@react-navigation/stack';

import { CollapsibleHeaderFlatList } from 'react-native-collapsible-header-views';
import { ListItem, ThemeProvider } from 'react-native-elements'


import { computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';

import SchoolSearchBar from '../components/Login/SchoolSearchBar';
import ThemeStore, { ThemeProps } from '../stores/ThemeStore';
import LectioStore from '../stores/LectioStore';
import { Opgave } from "liblectio/lib/Opaver/opgaver";
import { FlatList } from "react-native-gesture-handler";

const keyExtractor = (item: number, _index: number) => `${item}`

@inject('lectio')
@inject('theme')
@observer
class Item extends Component<{ onPress: (school: number) => void, item: number, theme?: ThemeStore, lectio?: LectioStore }, {}> {
  render() {
    return (
      // Theme the theme provider and the underlay color. Next thing to implement is a better mobx based theming that is independent from lectio store
      <ThemeProvider useDark={this.props.theme!.colorscheme === 'dark' ? true : false}>
        <TouchableHighlight onPress={() => this.props.onPress(this.props.item)} underlayColor="#FFFFFF" style={{ paddingBottom: 0.0 }}>
          <ListItem key={this.props.item} topDivider>
            <ListItem.Content>
              <ListItem.Title>{this.props.lectio!.opgaveList.filter(school => { return school.id === String(this.props.item) })[0].opgavetitel}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron type='ionicon' name='chevron-forward-outline' />

          </ListItem>
        </TouchableHighlight>
      </ThemeProvider>
    );
  }
}





const Stack = createStackNavigator();


interface OpgaveListProps {
  lectio: LectioStore;
  theme: ThemeStore;
  navigation: NavigationScreenProp<any, any>;
}

class OpgaveList extends Component<OpgaveListProps> {
  render() {
    return (
      <View>
        <Button title="Detail" onPress={()=> {
          this.props.navigation.navigate('Opgavedetalje');
        }}>

        </Button>
        <Text>
          Liste
        </Text>
      </View>
    )
  }
}


interface OpgaveDetailProps {
  lectio: LectioStore;
  theme: ThemeStore;
  navigation: NavigationScreenProp<any, any>;
}
class OpgaveDetail extends Component<OpgaveDetailProps> {
  render() {
    return (
      <View>
          <Button title="List" onPress={()=> {
          this.props.navigation.goBack();
        }}></Button>
        <Text>
          Detalje
        </Text>
      </View>
    )
  }
}

interface OpgaveScreenProps {
  lectio: LectioStore;
  theme: ThemeStore;
  navigation: NavigationScreenProp<any, any>;
}

@inject('theme')
@inject('lectio')
@observer
export class OpgaveScreen extends Component<OpgaveScreenProps> {
  @observable search = '';

  async componentDidMount() {
    await this.props.lectio.GetOpgaver();
  }


  // This function filters the schools based on the search
  getData(searchTerm: string): number[] {
    return this.props.lectio.opgaveList
      .filter((item) => item.opgavetitel!.toLowerCase().includes(searchTerm.toLowerCase()))
      .map((opgave: Opgave) => Number(opgave.id))
  }

  renderItem = ({ item }: { item: number }) => {
    return (
      <Item item={item} onPress={(item) => {
        this.props.lectio.school = item;
        this.props.navigation.goBack()
      }} />
    )
  };


  render() {
    return (
      <Stack.Navigator initialRouteName="Opgaveliste" >
        <Stack.Screen name="Opgaveliste" component={OpgaveList} />
        <Stack.Screen name="Opgavedetalje" component={OpgaveDetail} />
      </Stack.Navigator>

      // <CollapsibleHeaderFlatList
      //   CollapsibleHeaderComponent={<SchoolSearchBar onChangeText={(text) => { this.search = text }} />}
      //   headerHeight={55}
      //   data={this.getData(this.search)}
      //   renderItem={this.renderItem}
      //   keyExtractor={keyExtractor}>
      // </CollapsibleHeaderFlatList>

      // <ScrollView>
      //   <Text>
      //     {JSON.stringify(this.props.lectio.opgaveList, null, 4)}
      //   </Text>
      // </ScrollView>
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

export default OpgaveScreen;