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
    return (
      <View style={styles.container}>
        <Image
          style={styles.icon}
          source={require('../Ressources/CeviLogoTransparent.png')}
        />
        <View style={styles.content}>
          <Text
            style={styles.title}>
            {this.state.event.title}
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
    fontSize: 19,
    fontWeight: 'bold',
  },

});
