import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import moment from 'moment';

export default class AgendaEntryScreen extends React.Component {

  state = {
    event: null,
  };

  static navigationOptions = ({ navigation }) => ({
    title: typeof(navigation.state.params)==='undefined' || typeof(navigation.state.params.title) === 'undefined' ? 'find': navigation.state.params.title,
  });


  constructor(props){
     super(props);
     //console.log(props);
     if (this.props.navigation.state.params && this.props.navigation.state.params.selectedEvent){
       this.state.event = this.props.navigation.state.params.selectedEvent;
       this.props.navigation.setParams({ title: this.props.navigation.state.params.selectedEvent.title });
     } else {
       this.props.navigation.setParams({ title: "Agenda" });
     }

  }

  componentWillMount(){
  }

  render() {
    const event = this.state.event;
    let dateTime = '';
    dateTime = `${event.start_date_details.day}.${event.start_date_details.month}.${event.start_date_details.year}`;
    if (!event.all_day){
      dateTime = `${dateTime} ${event.start_date_details.hour}:${event.start_date_details.minutes}`;
    }
    if (event.end_date_details !== undefined) {
      dateTime= `${dateTime} - ${event.end_date_details.day}.${event.end_date_details.month}.${event.end_date_details.year}`
    }
    if (!event.all_day){
      dateTime = `${dateTime} ${event.end_date_details.hour}:${event.end_date_details.minutes}`;
    }

    return (

      <View style={styles.container}>
        <Image
          style={styles.icon}
          source={require('../Ressources/CeviLogoTransparent.png')}
        />
        <View style={styles.content}>
          <Text
            style={styles.title}>
            {event.title}
          </Text>
          <Text
            style={styles.date}>
            {dateTime}
          </Text>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  icon: {
    width: 60,
    height: 60
  },
  content: {
    marginTop: 20,
    marginLeft: 38,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  date: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: 0x023EFF,
  },

});
