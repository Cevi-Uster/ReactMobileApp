import React from 'react';
import { SectionList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import moment from 'moment';

export default class AgendaScreen extends React.Component {

  state = {
    categories: [],
    events:[],
    currentParentId: 0,
  };

  constructor(props){
     super(props);
     this.onCategoryPressed = this.onCategoryPressed.bind(this);
     this.onEventPressed = this.onEventPressed.bind(this);
  }

  componentWillMount(){
    this.fetchData();
  }

  fetchData = () => {
    this.fetchCategories();
    this.fetchEvents();
  }

  fetchCategories = async () => {
    const categoryResponse = await fetch("https://new.cevi-uster.ch/wp-json/tribe/events/v1/categories/?hide_empty=false&orderby=parent");
    const json = await categoryResponse.json();
    if (json !== undefined && json !== null && json.categories !== undefined && json.categories !== null){
    const filteredCategories = json.categories.filter(categorie => categorie.parent == this.state.currentParentId);
    this.setState({categories: filteredCategories});
    } else {
      this.setState({categories: new Array(0)});
    }
  }

  fetchEvents = async () => {
    const startDate = moment().format("YYYY-MM-DD 00:00:00");
    const eventsResponse = await fetch(`https://new.cevi-uster.ch/wp-json/tribe/events/v1/events?start_date=${startDate}`);
    const json = await eventsResponse.json();
    if (json !== undefined && json !== null && json.events !== undefined && json.events !== null){
      const filteredEvents = json.events.filter(event => event.categories.includes(this.state.currentParentId));
      this.setState({events: filteredEvents});
    } else {
      this.setState({events: new Array(0)});
    }

  }

  onCategoryPressed(item){
     console.log(item);
     //this.props.navigation.navigate("some_route");
  }

  onEventPressed(item){
     console.log(item);
     //this.props.navigation.navigate("some_route");
  }
  render() {
    return (
      <View>
        <List  containerStyle={{ marginTop: 0, borderTopWidth: 0, borderBottomWidth: 0 }}>
          <SectionList
            sections={[
              {
                title: "Kategorien",
                data: this.state.categories,
                keyExtractor: (x, i) => i,
                renderItem: ({item}) =>
                  <TouchableOpacity>
                    <ListItem
                      title={`${item.name}`}
                      onPress={() => this.onCategoryPressed(item)}
                      leftIcon={{name: 'folder'}}
                    />
                  </TouchableOpacity>,
              },
              {
                title: "Termine",
                data: this.state.events,
                keyExtractor: (x, i) => i,
                renderItem: ({item}) =>
                  <ListItem
                    title={`${item.start_date} ${item.name}`}
                    onPress={() => this.onEventPressed(item)}
                    //leftIcon={{name: 'folder'}}
                  />
              }
            ]}
          />
        </List>
      </View>
    );
  }
}
