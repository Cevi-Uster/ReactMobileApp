import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { List, ListItem } from 'react-native-elements';

export default class AgendaScreen extends React.Component {

  state = {
    data: [],
    currentParentId: 0,
  };

  componentWillMount(){
    this.fetchData();
  }

  fetchData = async () => {
    const response = await fetch("https://new.cevi-uster.ch/wp-json/tribe/events/v1/categories/?hide_empty=false&orderby=parent");
    const json = await response.json();
    const filteredCategories = json.categories.filter(categorie => categorie.parent == this.state.currentParentId);
    this.setState({data: filteredCategories});
  }

  render() {
    return (
      <View>
        <List  containerStyle={{ marginTop: 0, borderTopWidth: 0, borderBottomWidth: 0 }}>
          <FlatList
            data={this.state.data}
            keyExtractor={(x, i) => i}
            renderItem={({item}) =>
              <ListItem
                title={`${item.name}`}
                leftIcon={{name: 'folder'}}
              />
            }>
          </FlatList>
        </List>
      </View>
    );
  }
}
