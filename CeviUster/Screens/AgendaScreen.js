import React from 'react';
import { SectionList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import moment from 'moment';
import Config from 'react-native-config';

export default class AgendaScreen extends React.Component {

  state = {
    categories: [],
    events:[],
    currentParentId: 0,
  };

  static navigationOptions = ({ navigation }) => ({
    title: typeof(navigation.state.params)==='undefined' || typeof(navigation.state.params.title) === 'undefined' ? 'find': navigation.state.params.title,
  });


  constructor(props){
     super(props);
     //console.log(props);
     if (this.props.navigation.state.params && this.props.navigation.state.params.parentCategory){
       this.state.currentParentId = this.props.navigation.state.params.parentCategory.id;
       this.props.navigation.setParams({ title: this.props.navigation.state.params.parentCategory.name });
     } else {
       this.props.navigation.setParams({ title: "Agenda" });
     }
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
    const categoryResponse = await fetch(`${Config.AGENDA_BASE_URL}categories/?hide_empty=false&orderby=parent&per_page=10000`, {
      headers: {
        Accept: "application/json"
      }
    });
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
    const eventsResponse = await fetch(`${Config.AGENDA_BASE_URL}events?start_date=${startDate}&categories=${this.state.currentParentId}&per_page=10000`, {
      headers: {
        Accept: "application/json"
      }
    });
    const json = await eventsResponse.json();
    if (json !== undefined && json !== null && json.events !== undefined && json.events !== null){

      let filteredEvents = new Array(0);
      for (event of json.events){
        for (category of event.categories){
          if (category.id == this.state.currentParentId){
            filteredEvents.push(event);
          }
        }
      }
      console.log(filteredEvents);
      this.setState({events: filteredEvents});
    } else {
      this.setState({events: new Array(0)});
    }

  }

  onCategoryPressed(item){
     console.log(item);
     this.props.navigation.navigate('Agenda', {parentCategory: item, title: item.name});
  }

  onEventPressed(item){
     console.log(item);
     this.props.navigation.navigate('AgendaEntry', {selectedEvent: item});
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
                renderItem: ({item}) => {
                  let dateText = `${item.start_date_details.day}.${item.start_date_details.month}.${item.start_date_details.year}`;
                  let timeText = ``;
                  if (!item.all_day){
                    timeText +=  `${item.start_date_details.hour}:${item.start_date_details.minutes}`;
                    if (item.end_date_details.hour !== undefined){
                      timeText += ` - ${item.end_date_details.hour}:${item.end_date_details.minutes}`;
                    }
                  }  else {
                    timeText += `Ganzer Tag`;
                  }
                  return <ListItem
                    title={`${dateText} ${item.title}`}
                    subtitle={`${timeText}`}
                    onPress={() => this.onEventPressed(item)}
                  />
                }
              }
            ]}
          />
        </List>
      </View>
    );
  }
}
