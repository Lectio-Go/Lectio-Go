import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CollapsibleHeaderFlatList } from 'react-native-collapsible-header-views';
import SearchBar from 'react-native-search-bar';
import { NavigationScreenProp } from 'react-navigation';
import LectioStore from '../stores/LectioStore';
import SchoolSearchBar from './SchoolSearchBar';
import { ListItem, ThemeProvider } from 'react-native-elements'


const keyExtractor = (item: number, _index: number) => `${item}`

const data = Array(50).fill(0).map((_, i) => i)

const Item = ({ item }: { item: number }) => (
  <ThemeProvider useDark={true}>
  <ListItem key={item} bottomDivider>
  <ListItem.Content>
    <ListItem.Title>{item+1}</ListItem.Title>
    <ListItem.Subtitle>{item}</ListItem.Subtitle>
  </ListItem.Content>
  <ListItem.Chevron color="white" />
</ListItem>
  </ThemeProvider>

)

const Separator = () => (
  <View style={styles.separator} />
)


interface LoginScreenProps {
  lectio: LectioStore;
  navigation: NavigationScreenProp<any, any>;
}

@inject('lectio')
@observer
export class SchoolPicker extends Component<LoginScreenProps, {}> {
  @observable search = '';

  renderItem({ item }: { item: string }) {
    return (
      <Text>Hello</Text>
    );
  }
  render() {
    return (
      <CollapsibleHeaderFlatList
        CollapsibleHeaderComponent={<SchoolSearchBar onChangeText={(text) => { this.search = text }} />}
        headerHeight={55}
        data={data}
        renderItem={Item}
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

