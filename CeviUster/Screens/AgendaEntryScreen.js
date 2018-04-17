import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
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
    return (
      <View>

      </View>
    );
  }
}
