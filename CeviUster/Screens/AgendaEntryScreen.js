import React from 'react';
import { StyleSheet, ScrollView, View, Text, Image, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import { Icon } from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

export default class AgendaEntryScreen extends React.Component {

  containerMargin = 10;
  contentMarginLeft = 38;

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

    if (event.description == ''){
      styles.description.display = 'none';
    }

    const dimensions = Dimensions.get('window');
    let imageScaledWidth = dimensions.width - (2 * this.containerMargin) - this.contentMarginLeft;
    let imageScaledHeight = 0;
    if (event.image == 'false'){
      styles.image.display = 'none';
    } else {
      imageScaledHeight = Math.round(event.image.height * (imageScaledWidth  / event.image.width));
    }
    console.log(`containerMargin ${this.containerMargin}`);
    console.log(`contentMarginLeft ${this.contentMarginLeft}`);
    console.log(`event.image.height ${event.image.height}`);
    console.log(`imageScaledWidth ${imageScaledWidth}`);
    console.log(`event.image.width ${event.image.width}`);
    console.log(`ìmageScaledHeight ${imageScaledHeight}`);
    return (
      <ScrollView>
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
            <Text
              style={styles.venue}>
              {event.venue.venue}
            </Text>
          <Text
            style={styles.description}>
            {event.description}
          </Text>
          <Image
            style={styles.image}
            source={{uri: event.image.url}}
            resizeMode='contain'
            width={imageScaledWidth}
            height={imageScaledHeight}
            >
          </Image>
          </View>
          <View style={styles.buttonview}>
            <Button
              style={styles.savebutton}
              icon={{
                name: 'save',
                size: 20,
                color: 'white'
              }}
              buttonStyle={{
                backgroundColor: "rgba(92, 99, 216, 1)",
                width: 140,
                height: 40,
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 20
              }}
              title='Speichern'
            />
          </View>
        </View>
      </ScrollView>
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
    marginTop: 5,
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
  venue: {
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 14,
  },
  description: {
    marginTop: 5,
    fontSize: 14,
  },
  image: {
    marginTop:5,
  },
  buttonview: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  savebutton: {
    marginTop:10,
  }
});