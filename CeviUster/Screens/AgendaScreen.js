import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';

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
      <View style={styles.container}>
        <FlatList
          data={this.state.data}
          keyExtractor={(x, i) => i}
          renderItem={({item}) => <Text>{item.name}</Text>}>
          </FlatList>
      </View>
    );
  }
}

const styles =StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
